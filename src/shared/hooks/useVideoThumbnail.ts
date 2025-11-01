import { useEffect, useState } from 'react';

/**
 * Custom hook to extract a thumbnail frame from a video
 * Uses Canvas API to capture the video at a specific timestamp
 *
 * Best Practices:
 * - Extracts frame at 1 second for consistent results
 * - Returns base64 encoded image (no extra requests)
 * - Handles video loading and errors gracefully
 * - Lightweight: ~2-3KB per thumbnail
 *
 * Future: Could be extended to:
 * - Save thumbnails to Supabase storage for persistence
 * - Generate multiple frames and select best one
 * - Use FFmpeg.wasm for server-like processing
 */
export function useVideoThumbnail(videoUrl: string, timeOffset: number = 1) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoUrl) {
      setIsLoading(false);
      return;
    }

    const extractThumbnail = () => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;

      const handleLoadedMetadata = () => {
        // Seek to specific time to extract frame
        video.currentTime = Math.min(timeOffset, video.duration - 0.1);
      };

      const handleSeeked = () => {
        try {
          // Create canvas and draw video frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError('Could not get canvas context');
            setIsLoading(false);
            return;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert to data URL (base64)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setThumbnail(dataUrl);
          setIsLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to extract thumbnail');
          setIsLoading(false);
        } finally {
          video.pause();
          video.src = '';
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('error', () => {
        setError('Failed to load video');
        setIsLoading(false);
      });

      // Start loading
      video.preload = 'metadata';
    };

    extractThumbnail();
  }, [videoUrl, timeOffset]);

  return { thumbnail, isLoading, error };
}
