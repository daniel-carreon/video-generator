'use client';

import React, { useState } from 'react';
import { GeneratedVideo } from '@/features/video-generation/types';
import { VideoService } from '@/features/video-generation/services/videoService';

interface VideoCardProps {
  video: GeneratedVideo;
  onVideoClick?: (video: GeneratedVideo) => void;
  onFavoriteToggle?: (video: GeneratedVideo) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function VideoCard({
  video,
  onVideoClick,
  onFavoriteToggle,
  onDelete,
  isSelected,
  onSelect
}: VideoCardProps) {
  const [isFavorite, setIsFavorite] = useState(video.is_favorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const updated = await VideoService.toggleFavorite(video);
      setIsFavorite(updated.is_favorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(updated);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('¿Estás seguro de eliminar este video?')) {
      return;
    }

    setIsLoading(true);

    try {
      await VideoService.deleteVideo(video.id);
      if (onDelete) {
        onDelete(video.id);
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Error al eliminar el video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(video.id);
    } else if (onVideoClick) {
      onVideoClick(video);
    }
  };

  const thumbnailUrl = video.metadata?.thumbnailUrl || video.fal_url;

  // Calculate cost based on model and duration
  const calculateCost = () => {
    const modelRates: Record<string, number> = {
      'hailuo-standard': 0.045,  // $0.045 per second
      'hailuo-pro': 0.08,        // $0.08 per second
      'kling': 0.28,             // $0.28 per second
      'veo-3': 0.25,             // $0.25 per second (base)
    };

    const model = video.model_used.toLowerCase();
    const rate = modelRates[model] || 0.045; // default to hailuo-standard
    return (video.duration * rate).toFixed(3);
  };

  const estimatedCost = calculateCost();

  return (
    <div
      onClick={handleCardClick}
      className={`
        relative group rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'ring-4 ring-blue-500 scale-95'
          : 'hover:scale-105 hover:shadow-xl'
        }
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {/* Video Thumbnail/Preview */}
      <div className="relative aspect-video bg-gray-900">
        <video
          src={video.fal_url}
          poster={thumbnailUrl}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />

        {/* Overlay con información */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm font-medium line-clamp-2">
              {video.prompt}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
              <span>⏱️ {video.duration}s</span>
              <span>•</span>
              <span>📐 {video.aspect_ratio}</span>
              <span>•</span>
              <span className="font-mono">{video.model_used}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          {isSelected && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
              ✓ Selected
            </div>
          )}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>

          <span className="text-xs font-mono text-green-600 dark:text-green-400 font-semibold">
            ${estimatedCost}
          </span>
        </div>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors text-red-600"
          title="Delete video"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
