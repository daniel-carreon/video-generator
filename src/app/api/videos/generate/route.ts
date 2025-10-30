import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  VideoModel,
  MODEL_CONFIG,
  validateDuration,
  validateResolution,
  validateAspectRatio,
  calculateCost
} from '@/features/video-generation/config/modelConfig';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GenerateVideoRequest {
  prompt: string;
  model: VideoModel;
  duration?: number;
  resolution?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  includeAudio?: boolean;
  motionIntensity?: number; // Para image-to-video
  imageUrl?: string; // Para image-to-video
}

interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  resolution: string;
  seed: number;
  model: string;
  cost?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateVideoRequest = await req.json();
    const {
      prompt,
      model,
      duration: requestedDuration,
      resolution: requestedResolution,
      aspectRatio: requestedAspectRatio,
      includeAudio = false,
      motionIntensity,
      imageUrl
    } = body;

    // Validación básica
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!MODEL_CONFIG[model]) {
      return NextResponse.json(
        { error: `Invalid model: ${model}` },
        { status: 400 }
      );
    }

    // Obtener configuración del modelo
    const modelConfig = MODEL_CONFIG[model];
    const falApiKey = process.env.FAL_KEY as string;

    // Validar y ajustar parámetros según las restricciones del modelo
    const validatedDuration = validateDuration(
      model,
      requestedDuration || modelConfig.defaultDuration
    );
    const validatedResolution = validateResolution(
      model,
      requestedResolution || modelConfig.defaultResolution
    );
    const validatedAspectRatio = validateAspectRatio(
      model,
      requestedAspectRatio || modelConfig.defaultAspectRatio
    );

    console.log(`🎬 Generating video with ${model}...`);
    console.log(`📝 Prompt: ${prompt}`);
    console.log(`⚙️ Validated params: ${validatedDuration}s, ${validatedResolution}, ${validatedAspectRatio}`);

    // Construir payload base
    const payload: any = {
      prompt,
      aspect_ratio: validatedAspectRatio
    };

    // Ajustar payload según modelo específico
    if (model === 'veo3' || model === 'veo3-fast') {
      // Veo 3 usa strings para duration: "4s", "6s", "8s"
      payload.duration = `${validatedDuration}s`;
      payload.resolution = validatedResolution;
      if (modelConfig.supportsAudio) {
        payload.include_audio = includeAudio;
      }
    } else if (model === 'hailuo-standard' || model === 'hailuo-pro') {
      // Hailuo usa num_frames en vez de duration
      payload.num_frames = validatedDuration * modelConfig.frameRate;
      // Hailuo puede usar prompt_optimizer
      if (modelConfig.features.promptOptimizer) {
        payload.prompt_optimizer = true;
      }
    } else if (model === 'kling') {
      // Kling usa duration como número
      payload.duration = validatedDuration;
      // Kling tiene CFG scale y negative prompt
      if (modelConfig.features.cfgScale) {
        payload.cfg_scale = 0.5; // default
      }
      if (imageUrl) {
        payload.image_url = imageUrl;
      }
    }

    let result: any;
    const endpoint = modelConfig.endpoint;

    // Llamar a fal.ai API directamente
    console.log(`🔌 Calling fal.ai endpoint: ${endpoint}`);
    console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));

    // 1. Enviar request inicial a la cola
    const queueResponse = await fetch(`https://queue.fal.run/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!queueResponse.ok) {
      const errorText = await queueResponse.text();
      console.error(`❌ fal.ai queue error:`, errorText);
      throw new Error(`fal.ai queue error (${queueResponse.status}): ${errorText}`);
    }

    const queueData = await queueResponse.json();
    console.log(`📥 Queue response:`, queueData);

    const requestId = queueData.request_id;
    const statusUrl = queueData.status_url;

    if (!requestId || !statusUrl) {
      throw new Error('No se recibió request_id o status_url de fal.ai');
    }

    // 2. Hacer polling hasta que el video esté listo
    console.log(`⏳ Waiting for video generation (request_id: ${requestId})...`);

    let attempts = 0;
    const maxAttempts = 60; // 60 intentos = 5 minutos máximo
    const pollInterval = 5000; // 5 segundos entre intentos

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;

      console.log(`🔍 Polling attempt ${attempts}/${maxAttempts}...`);

      const statusResponse = await fetch(statusUrl, {
        headers: {
          'Authorization': `Key ${falApiKey}`
        }
      });

      if (!statusResponse.ok) {
        console.error(`❌ Status check failed: ${statusResponse.status}`);
        continue;
      }

      const statusData = await statusResponse.json();
      console.log(`📊 Status: ${statusData.status}`);
      console.log(`📦 Full status data:`, JSON.stringify(statusData, null, 2));

      if (statusData.status === 'COMPLETED') {
        // Cuando está COMPLETED, necesitamos obtener el resultado del response_url
        console.log(`✅ Status COMPLETED, fetching final result from response_url...`);

        const responseUrl = statusData.response_url;

        // Intentar sin Authorization primero (podría ser un endpoint temporal público)
        let resultResponse = await fetch(responseUrl, {
          method: 'GET'
        });

        // Si falla, intentar con Authorization
        if (!resultResponse.ok) {
          console.log(`⚠️ First attempt failed (${resultResponse.status}), trying with Authorization...`);
          resultResponse = await fetch(responseUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Key ${falApiKey}`
            }
          });
        }

        if (!resultResponse.ok) {
          const errorText = await resultResponse.text();
          console.error(`❌ Failed to fetch result (${resultResponse.status}):`, errorText);
          console.error(`❌ Attempted URL:`, responseUrl);
          throw new Error(`Failed to get final result: ${resultResponse.status} - ${errorText}`);
        }

        result = await resultResponse.json();
        console.log(`🎉 Final result obtained:`, JSON.stringify(result, null, 2));
        break;
      } else if (statusData.status === 'FAILED') {
        const errorMsg = statusData.error?.message || statusData.error || 'Unknown error';
        console.error(`❌ Generation failed:`, errorMsg);
        throw new Error(`Video generation failed: ${errorMsg}`);
      }

      // Status es IN_PROGRESS o IN_QUEUE, seguir esperando
    }

    if (attempts >= maxAttempts) {
      throw new Error('Timeout: Video generation took too long (>5 minutes)');
    }

    // Procesar resultado (diferentes formatos según el modelo)
    let videoUrl = result.video?.url || result.data?.video?.url || result.url;

    // Para algunos modelos, el video puede estar en diferentes ubicaciones
    if (!videoUrl && result.outputs) {
      videoUrl = result.outputs[0]?.url || result.outputs.video?.url;
    }

    if (!videoUrl) {
      console.error(`❌ No video URL found in response:`, result);
      throw new Error('No se pudo obtener la URL del video generado. Revisa los logs del servidor.');
    }

    const estimatedCost = calculateCost(model, validatedDuration, includeAudio);

    const videoResult: VideoGenerationResult = {
      videoUrl: videoUrl,
      thumbnailUrl: result.thumbnail?.url || result.data?.thumbnail?.url || result.image?.url,
      duration: validatedDuration,
      resolution: validatedResolution,
      seed: result.seed || result.data?.seed || Math.floor(Math.random() * 1000000),
      model: model,
      cost: estimatedCost
    };

    console.log(`✅ Video generated successfully!`);
    console.log(`🎥 URL: ${videoResult.videoUrl}`);
    console.log(`💰 Estimated cost: $${videoResult.cost?.toFixed(4)}`);

    // 🔥 GUARDAR EN SUPABASE AUTOMÁTICAMENTE
    try {
      const videoId = `vid_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { data: savedVideo, error: dbError } = await supabase
        .from('generated_videos')
        .insert({
          video_id: videoId,
          fal_url: videoResult.videoUrl,
          supabase_url: null, // No estamos subiendo a Supabase storage por ahora
          prompt: prompt,
          duration: validatedDuration,
          resolution: validatedResolution,
          aspect_ratio: validatedAspectRatio,
          model_used: model,
          seed: videoResult.seed,
          generation_session: null,
          tags: [],
          metadata: {
            includeAudio: includeAudio,
            cost: estimatedCost,
            thumbnailUrl: videoResult.thumbnailUrl
          }
        })
        .select()
        .single();

      if (dbError) {
        console.error('⚠️ Failed to save video to database:', dbError);
        // No bloquear la respuesta si falla el guardado
      } else {
        console.log(`💾 Video saved to database: ${videoId}`);
      }
    } catch (dbError) {
      console.error('⚠️ Error saving to database:', dbError);
      // No bloquear la respuesta
    }

    return NextResponse.json(videoResult);
  } catch (error: any) {
    console.error('❌ Error generating video:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate video',
        details: error.message,
        stack: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    models: Object.keys(MODEL_CONFIG),
    modelConfigs: MODEL_CONFIG,
    timestamp: new Date().toISOString()
  });
}
