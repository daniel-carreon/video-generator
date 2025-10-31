import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getBaseUrl } from '@/shared/lib/env';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Configurar OpenRouter (compatible con OpenAI SDK)
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': getBaseUrl(),
    'X-Title': 'Video Generator AI'
  }
});

// System prompt del agente orquestador
const SYSTEM_PROMPT = `Eres un asistente experto en generación de videos con IA.

CAPACIDADES:
- Generar videos a partir de descripciones de texto
- Animar imágenes existentes convirtiéndolas en videos
- Ayudar a los usuarios a mejorar sus prompts para obtener mejores resultados
- Explicar las diferencias entre los modelos disponibles

MODELOS DISPONIBLES:
1. **Veo 3 (Google)**: Alta calidad, puede incluir audio/música, hasta 8s, $0.50/s
2. **Veo 3 Fast**: Más rápido que Veo 3, buena calidad, hasta 8s, $0.25/s
3. **Hailuo 02 Standard**: Cinematográfico, 768p, MÁS ECONÓMICO ($0.045/s), 6-10s
4. **Hailuo 02 Pro**: Cinematográfico, 1080p, alta calidad, $0.08/s, 6-10s
5. **Kling Video**: Hiperrealista, estilo "grabado con cámara", $0.28/s, 5-10s

RECOMENDACIONES:
- Para pruebas iniciales: usa Hailuo 02 Standard (más barato)
- Para calidad premium: usa Veo 3 o Hailuo 02 Pro
- Para videos con audio/música: usa Veo 3
- Para realismo extremo: usa Kling Video

INSTRUCCIONES:
- Sé proactivo: si el usuario pide "genera un video de un carro", pregunta qué modelo prefiere o recomienda uno
- Mejora los prompts automáticamente: agrega detalles cinematográficos relevantes
- Explica los costos estimados antes de generar
- Si el usuario no especifica duración, usa 5 segundos por defecto

EJEMPLO DE PROMPT MEJORADO:
Usuario: "un carro corriendo"
Tú mejoras a: "A sleek sports car racing down a mountain highway at sunset, cinematic camera following from behind, motion blur on wheels, golden hour lighting, professional color grading"

Sé conversacional, útil y entusiasta sobre ayudar a crear videos increíbles.`;

// Definición de herramientas (function calling)
const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'generate_video_text',
      description: 'Generate a video from a text prompt using the specified model',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'Detailed description of the video to generate. Should be cinematically descriptive.'
          },
          model: {
            type: 'string',
            enum: ['veo3', 'veo3-fast', 'hailuo-standard', 'hailuo-pro', 'kling'],
            description: 'The video generation model to use'
          },
          duration: {
            type: 'number',
            enum: [5, 6, 8, 10],
            description: 'Duration of the video in seconds'
          },
          resolution: {
            type: 'string',
            enum: ['720p', '1080p', '768p'],
            description: 'Video resolution'
          },
          aspectRatio: {
            type: 'string',
            enum: ['16:9', '9:16', '1:1'],
            description: 'Aspect ratio of the video'
          },
          includeAudio: {
            type: 'boolean',
            description: 'Whether to include AI-generated audio/music (only for Veo models)'
          }
        },
        required: ['prompt', 'model']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'animate_image',
      description: 'Convert a static image into a video with motion (image-to-video)',
      parameters: {
        type: 'object',
        properties: {
          imageUrl: {
            type: 'string',
            description: 'URL of the image to animate'
          },
          prompt: {
            type: 'string',
            description: 'Description of how the image should be animated'
          },
          model: {
            type: 'string',
            enum: ['kling'],
            description: 'Model to use for image-to-video (currently only Kling supported)'
          },
          motionIntensity: {
            type: 'number',
            minimum: 1,
            maximum: 255,
            description: 'Intensity of motion (1-255, default 127)'
          },
          duration: {
            type: 'number',
            enum: [5, 10],
            description: 'Duration of the video in seconds'
          }
        },
        required: ['imageUrl', 'prompt', 'model']
      }
    }
  }
];

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId, preferredModel } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    console.log(`💬 Chat request with ${messages.length} messages | Conversation: ${conversationId || 'new'} | Preferred model: ${preferredModel || 'auto'}`);

    // Crear o verificar conversación en BD
    let activeConversationId = conversationId;

    if (!activeConversationId) {
      // Nueva conversación - crear registro
      activeConversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const userMessage = messages[messages.length - 1]?.content || '';
      const title = userMessage.length > 50
        ? userMessage.substring(0, 50) + '...'
        : userMessage || 'Nueva conversación';

      await supabase.from('conversations').insert({
        conversation_id: activeConversationId,
        title: title,
        metadata: { preferredModel }
      });

      console.log(`📝 Created new conversation: ${activeConversationId}`);
    }

    // Guardar mensaje del usuario en BD
    const userMessage = messages[messages.length - 1];
    const userMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await supabase.from('messages').insert({
      message_id: userMessageId,
      conversation_id: activeConversationId,
      role: 'user',
      content: userMessage.content,
      metadata: {}
    });

    // Preparar system prompt con modelo preferido
    let systemPrompt = SYSTEM_PROMPT;
    if (preferredModel) {
      const modelNames: Record<string, string> = {
        'veo3': 'Veo 3',
        'veo3-fast': 'Veo 3 Fast',
        'hailuo-standard': 'Hailuo 02 Standard',
        'hailuo-pro': 'Hailuo 02 Pro',
        'kling': 'Kling Video'
      };
      systemPrompt += `\n\n🎯 USER'S PREFERRED MODEL: **${modelNames[preferredModel] || preferredModel}**\n\nIMPORTANT: Unless the user explicitly requests a different model, ALWAYS use "${preferredModel}" when calling the generate_video_text function. The user has pre-selected this model in their interface.`;
    }

    // Preparar mensajes con system prompt
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Llamar a OpenRouter con function calling
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: chatMessages as any,
      tools: TOOLS,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 4096
    });

    const responseMessage = completion.choices[0].message;

    // Si el modelo quiere llamar a una función
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = (toolCall as any).function?.name || toolCall.type;
      const functionArgs = (toolCall as any).function?.arguments
        ? JSON.parse((toolCall as any).function.arguments)
        : {};

      console.log(`🔧 Tool called: ${functionName}`);
      console.log(`📋 Args:`, functionArgs);

      // Ejecutar la función correspondiente
      let toolResult: any;

      if (functionName === 'generate_video_text') {
        // Llamar a la API de generación de videos (ahora asíncrona)
        const generateResponse = await fetch(`${getBaseUrl()}/api/videos/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: functionArgs.prompt,
            model: functionArgs.model,
            duration: functionArgs.duration || 5,
            resolution: functionArgs.resolution || '720p',
            aspectRatio: functionArgs.aspectRatio || '16:9',
            includeAudio: functionArgs.includeAudio || false
          })
        });

        if (!generateResponse.ok) {
          const error = await generateResponse.json();
          toolResult = {
            success: false,
            error: error.error || 'Failed to generate video',
            details: error.details
          };
        } else {
          const result = await generateResponse.json();

          // Now /api/videos/generate returns immediately with requestId and status=PROCESSING
          toolResult = {
            success: true,
            status: result.status, // 'PROCESSING'
            requestId: result.requestId,
            prompt: functionArgs.prompt,
            model: functionArgs.model,
            duration: result.duration,
            estimatedCost: result.estimatedCost,
            estimatedTime: result.estimatedTime,
            message: `Video generation started! This will take ${result.estimatedTime}. Request ID: ${result.requestId}`
          };
        }
      } else if (functionName === 'animate_image') {
        // Llamar a la API de image-to-video
        const generateResponse = await fetch(`${getBaseUrl()}/api/videos/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: functionArgs.prompt,
            model: functionArgs.model,
            imageUrl: functionArgs.imageUrl,
            motionIntensity: functionArgs.motionIntensity || 127,
            duration: functionArgs.duration || 5
          })
        });

        if (!generateResponse.ok) {
          const error = await generateResponse.json();
          toolResult = {
            success: false,
            error: error.error || 'Failed to animate image',
            details: error.details
          };
        } else {
          const result = await generateResponse.json();

          // Guardar en BD
          await fetch(`${getBaseUrl()}/api/videos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoId: `video_${Date.now()}`,
              falUrl: result.videoUrl,
              prompt: functionArgs.prompt,
              duration: result.duration,
              modelUsed: functionArgs.model,
              seed: result.seed,
              generationSession: conversationId,
              metadata: {
                sourceImage: functionArgs.imageUrl,
                cost: result.cost
              }
            })
          });

          toolResult = {
            success: true,
            videoUrl: result.videoUrl,
            duration: result.duration,
            cost: result.cost,
            message: `Image animated successfully! Estimated cost: $${result.cost?.toFixed(4)}`
          };
        }
      }

      // Enviar resultado de la herramienta de vuelta al modelo
      const toolMessages: ChatMessage[] = [
        ...chatMessages,
        responseMessage as any,
        {
          role: 'tool' as any,
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(toolResult)
        }
      ];

      const secondCompletion = await openai.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: toolMessages as any,
        temperature: 0.7,
        max_tokens: 4096
      });

      const finalMessage = secondCompletion.choices[0].message.content;

      // Guardar mensaje del asistente en BD
      const assistantMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await supabase.from('messages').insert({
        message_id: assistantMessageId,
        conversation_id: activeConversationId,
        role: 'assistant',
        content: finalMessage || '',
        tool_called: functionName,
        tool_result: toolResult,
        metadata: {}
      });

      // Actualizar timestamp de conversación
      await supabase.from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('conversation_id', activeConversationId);

      return NextResponse.json({
        message: finalMessage,
        toolCalled: functionName,
        toolResult: toolResult,
        conversationId: activeConversationId
      });
    }

    // Si no hay tool calls, devolver respuesta directa
    const directMessage = responseMessage.content;

    // Guardar mensaje del asistente en BD
    const assistantMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await supabase.from('messages').insert({
      message_id: assistantMessageId,
      conversation_id: activeConversationId,
      role: 'assistant',
      content: directMessage || '',
      metadata: {}
    });

    // Actualizar timestamp de conversación
    await supabase.from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('conversation_id', activeConversationId);

    return NextResponse.json({
      message: directMessage,
      conversationId: activeConversationId
    });
  } catch (error: any) {
    console.error('❌ Error in chat API:', error);
    return NextResponse.json(
      {
        error: 'Chat request failed',
        details: error.message,
        stack: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    model: 'anthropic/claude-3.5-sonnet',
    tools: TOOLS.map(t => (t as any).function?.name || t.type)
  });
}
