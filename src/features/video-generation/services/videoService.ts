import {
  GenerateVideoRequest,
  VideoGenerationResult,
  GeneratedVideo
} from '../types';
import { getApiUrl } from '@/shared/lib/env';

export class VideoService {
  /**
   * Generar video usando fal.ai
   */
  static async generateVideo(
    request: GenerateVideoRequest
  ): Promise<VideoGenerationResult> {
    const response = await fetch(getApiUrl('/api/videos/generate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate video');
    }

    return await response.json();
  }

  /**
   * Guardar video en Supabase
   */
  static async saveVideo(video: Partial<GeneratedVideo>): Promise<GeneratedVideo> {
    const response = await fetch(getApiUrl('/api/videos'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId: video.video_id,
        falUrl: video.fal_url,
        supabaseUrl: video.supabase_url,
        prompt: video.prompt,
        duration: video.duration,
        resolution: video.resolution,
        aspectRatio: video.aspect_ratio,
        modelUsed: video.model_used,
        seed: video.seed,
        generationSession: video.generation_session,
        tags: video.tags || [],
        metadata: video.metadata || {}
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save video');
    }

    const data = await response.json();
    return data.video;
  }

  /**
   * Obtener todos los videos
   */
  static async getVideos(filters?: {
    session?: string;
    favorite?: boolean;
    model?: string;
    limit?: number;
  }): Promise<GeneratedVideo[]> {
    const params = new URLSearchParams();
    if (filters?.session) params.append('session', filters.session);
    if (filters?.favorite !== undefined) params.append('favorite', String(filters.favorite));
    if (filters?.model) params.append('model', filters.model);
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await fetch(getApiUrl(`/api/videos?${params.toString()}`));

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch videos');
    }

    const data = await response.json();
    return data.videos;
  }

  /**
   * Actualizar video (marcar como favorito, agregar tags, etc.)
   */
  static async updateVideo(
    id: string,
    updates: Partial<GeneratedVideo>
  ): Promise<GeneratedVideo> {
    const response = await fetch(getApiUrl('/api/videos'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        isFavorite: updates.is_favorite,
        tags: updates.tags,
        metadata: updates.metadata
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update video');
    }

    const data = await response.json();
    return data.video;
  }

  /**
   * Eliminar video
   */
  static async deleteVideo(id: string): Promise<void> {
    const response = await fetch(getApiUrl(`/api/videos?id=${id}`), {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete video');
    }
  }

  /**
   * Marcar/desmarcar como favorito
   */
  static async toggleFavorite(video: GeneratedVideo): Promise<GeneratedVideo> {
    return await this.updateVideo(video.id, {
      is_favorite: !video.is_favorite
    });
  }

  /**
   * Agregar tags a un video
   */
  static async addTags(id: string, newTags: string[]): Promise<GeneratedVideo> {
    // Primero obtener el video para tener los tags actuales
    const videos = await this.getVideos();
    const video = videos.find(v => v.id === id);

    if (!video) {
      throw new Error('Video not found');
    }

    const updatedTags = [...new Set([...video.tags, ...newTags])];
    return await this.updateVideo(id, { tags: updatedTags });
  }
}
