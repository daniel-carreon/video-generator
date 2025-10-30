import { useState } from 'react';
import { useVideoStore } from '../stores/videoStore';
import { VideoService } from '../services/videoService';
import { GenerateVideoRequest } from '../types';

export function useVideoGeneration() {
  const {
    config,
    setStatus,
    setProgress,
    setError,
    setCurrentVideo,
    addVideo
  } = useVideoStore();

  const [isGenerating, setIsGenerating] = useState(false);

  const generateVideo = async (prompt: string, customConfig?: Partial<GenerateVideoRequest>) => {
    setIsGenerating(true);
    setStatus('generating');
    setError(null);
    setProgress('Initializing video generation...');

    try {
      const request: GenerateVideoRequest = {
        prompt,
        model: customConfig?.model || config.model,
        duration: customConfig?.duration || config.duration,
        resolution: customConfig?.resolution || config.resolution,
        aspectRatio: customConfig?.aspectRatio || config.aspectRatio,
        includeAudio: customConfig?.includeAudio !== undefined
          ? customConfig.includeAudio
          : config.includeAudio,
        imageUrl: customConfig?.imageUrl,
        motionIntensity: customConfig?.motionIntensity || config.motionIntensity
      };

      setProgress(`Generating with ${request.model}...`);
      console.log('🎬 Starting video generation:', request);

      // Generar video
      const result = await VideoService.generateVideo(request);

      setProgress('Video generated! Saving to database...');
      console.log('✅ Video generated:', result);

      // Guardar en base de datos
      const savedVideo = await VideoService.saveVideo({
        video_id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fal_url: result.videoUrl,
        prompt: prompt,
        duration: result.duration,
        resolution: result.resolution,
        aspect_ratio: request.aspectRatio || '16:9',
        model_used: result.model,
        seed: result.seed,
        generation_session: `session_${Date.now()}`,
        metadata: {
          cost: result.cost,
          thumbnailUrl: result.thumbnailUrl
        }
      });

      setProgress('Complete!');
      setStatus('success');
      setCurrentVideo(result);
      addVideo(savedVideo);

      console.log('💾 Video saved to database:', savedVideo);

      return result;
    } catch (error: any) {
      console.error('❌ Video generation failed:', error);
      setStatus('error');
      setError(error.message || 'Failed to generate video');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const animateImage = async (
    imageUrl: string,
    prompt: string,
    customConfig?: Partial<GenerateVideoRequest>
  ) => {
    return await generateVideo(prompt, {
      ...customConfig,
      imageUrl,
      model: 'kling' // Solo Kling soporta image-to-video por ahora
    });
  };

  return {
    generateVideo,
    animateImage,
    isGenerating,
    config
  };
}
