'use client';

import React, { useState } from 'react';
import { Copy, Edit, Trash2 } from 'lucide-react';
import { Style } from '../types';

interface StyleCardProps {
  style: Style;
  onEdit?: (style: Style) => void;
  onDelete?: (id: string) => void;
  onCopyPrompt?: (prompt: string) => void;
}

export function StyleCard({
  style,
  onEdit,
  onDelete,
  onCopyPrompt,
}: StyleCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPrompt?.(style.prompt);
    setIsCopied(true);

    // Reset after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(style);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm(`Delete style "${style.name}"?`)) {
      onDelete?.(style.id);
    }
  };

  return (
    <div className="group relative rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-750 transition-all hover:shadow-lg hover:scale-105">
      {/* Image Preview */}
      {style.image_url ? (
        <div className="relative aspect-video bg-gray-900">
          <img
            src={style.image_url}
            alt={style.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
          <p className="text-gray-500 text-sm">No image</p>
        </div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        {/* Title + Description */}
        <div>
          <h3 className="text-white font-semibold text-sm line-clamp-1">
            {style.name}
          </h3>
          {style.description && (
            <p className="text-gray-300 text-xs line-clamp-2 mt-1">
              {style.description}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs transition-colors"
            title="Copy prompt"
          >
            <Copy className="w-3 h-3" />
            {isCopied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={handleEdit}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
            title="Edit style"
          >
            <Edit className="w-3 h-3" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 bg-red-700 hover:bg-red-600 rounded text-white transition-colors"
            title="Delete style"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tags (if any) */}
      {style.tags && style.tags.length > 0 && (
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {style.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
