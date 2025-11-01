import { useEffect, useCallback } from 'react';

interface UsePasteImageOptions {
  onImagePaste?: (file: File) => void;
  onImageData?: (dataUrl: string) => void;
}

/**
 * Custom hook to handle Cmd+V image paste
 * Listens for paste events and extracts image files or data
 */
export function usePasteImage({ onImagePaste, onImageData }: UsePasteImageOptions = {}) {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;

      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          event.preventDefault();

          const file = items[i].getAsFile();
          if (file) {
            // Callback with File object
            onImagePaste?.(file);

            // Also create data URL for preview
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              onImageData?.(dataUrl);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    },
    [onImagePaste, onImageData]
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return { handlePaste };
}
