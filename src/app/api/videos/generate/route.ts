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

    if (!requestId) {
      throw new Error('No se recibió request_id de fal.ai');
    }

    console.log(`✅ Video generation started successfully`);
    console.log(`📝 Request ID: ${requestId}`);
    console.log(`⏳ Video is being generated asynchronously...`);

    // Return immediately with request_id - frontend will poll for status
    const estimatedCost = calculateCost(model, validatedDuration, includeAudio);

    return NextResponse.json({
      status: 'PROCESSING',
      requestId: requestId,
      message: 'Video generation started. Check status using /api/videos/status/{requestId}',
      estimatedCost: estimatedCost,
      estimatedTime: '60-120 seconds',
      prompt: prompt,
      model: model,
      duration: validatedDuration
    });
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
