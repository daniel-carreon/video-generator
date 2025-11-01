import OpenAI from 'openai';
import { getBaseUrl } from '@/shared/lib/env';

// Configure OpenRouter (compatible with OpenAI SDK)
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': getBaseUrl(),
    'X-Title': 'Video Generator AI - Prompt Compression'
  }
});

const COMPRESSION_SYSTEM_PROMPT = `You are an expert at compressing long video generation prompts into ultra-dense, highly descriptive short prompts.

RULES:
1. Maximum output: 2000 characters (STRICT LIMIT)
2. Preserve ALL key visual elements, actions, style, mood, lighting
3. Use cinematographic terminology when appropriate
4. Remove redundancy and filler words
5. Prioritize: Subject → Action → Style → Technical details
6. Use commas to separate elements efficiently

EXAMPLES:

Input (3500 chars): "I want to create a video that shows a beautiful sports car, specifically a red Ferrari, driving down a winding mountain road during sunset. The car should be moving fast, and the camera should follow it from behind. The lighting should be golden hour, with the sun setting in the background creating dramatic shadows. The video should have a cinematic feel, like a professional car commercial. Add motion blur to the wheels to show speed. The road should have curves and the car should be drifting slightly. Include some lens flares from the sun. The color grading should be warm and professional looking. Make it look like it was shot with a high-end cinema camera..."

Output (185 chars): "Red Ferrari racing down winding mountain highway at golden hour sunset, cinematic tracking shot from behind, motion blur on wheels, dramatic shadows, warm color grading, lens flares, professional drift on curves, high-end cinema camera aesthetic"

BE EFFICIENT BUT COMPREHENSIVE.`;

export interface CompressionResult {
  originalLength: number;
  compressedLength: number;
  compressedPrompt: string;
  compressionRatio: number;
  wasCompressed: boolean;
}

/**
 * Compress a long prompt to maximum 2000 characters using Claude AI
 * @param prompt - Original prompt (any length)
 * @param maxLength - Maximum allowed length (default: 2000)
 * @returns Compression result with metrics
 */
export async function compressPrompt(
  prompt: string,
  maxLength: number = 2000
): Promise<CompressionResult> {

  const originalLength = prompt.length;

  // If already under limit, return as-is
  if (originalLength <= maxLength) {
    return {
      originalLength,
      compressedLength: originalLength,
      compressedPrompt: prompt,
      compressionRatio: 1.0,
      wasCompressed: false
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: COMPRESSION_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Compress this video prompt to MAXIMUM ${maxLength} characters:\n\n${prompt}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3, // Low temperature for consistency
    });

    const compressedPrompt = completion.choices[0]?.message?.content?.trim() || prompt;
    const compressedLength = compressedPrompt.length;

    // Safety: If compressed version is still too long, truncate intelligently
    let finalPrompt = compressedPrompt;
    if (compressedLength > maxLength) {
      // Find last complete sentence/phrase before limit
      finalPrompt = compressedPrompt.substring(0, maxLength);
      const lastComma = finalPrompt.lastIndexOf(',');
      const lastPeriod = finalPrompt.lastIndexOf('.');
      const cutPoint = Math.max(lastComma, lastPeriod);

      if (cutPoint > maxLength * 0.8) {
        finalPrompt = finalPrompt.substring(0, cutPoint);
      }
    }

    return {
      originalLength,
      compressedLength: finalPrompt.length,
      compressedPrompt: finalPrompt,
      compressionRatio: finalPrompt.length / originalLength,
      wasCompressed: true
    };

  } catch (error) {
    console.error('Error compressing prompt:', error);

    // Fallback: Simple truncation if AI fails
    const truncated = prompt.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const fallbackPrompt = lastSpace > maxLength * 0.9
      ? truncated.substring(0, lastSpace)
      : truncated;

    return {
      originalLength,
      compressedLength: fallbackPrompt.length,
      compressedPrompt: fallbackPrompt,
      compressionRatio: fallbackPrompt.length / originalLength,
      wasCompressed: true
    };
  }
}

/**
 * Validate if a prompt needs compression
 * @param prompt - Prompt to validate
 * @param maxLength - Maximum allowed length
 * @returns Boolean indicating if compression is needed
 */
export function needsCompression(prompt: string, maxLength: number = 2000): boolean {
  return prompt.length > maxLength;
}
