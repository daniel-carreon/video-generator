'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Style, StyleFormData } from '../types';
import { usePasteImage } from '../hooks/usePasteImage';
import { convertToWebP } from '@/shared/utils/imageUtils';

interface StyleFormProps {
  style?: Style;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function StyleForm({
  style,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: StyleFormProps) {
  const [formData, setFormData] = useState<StyleFormData>({
    name: '',
    prompt: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Handle Cmd+V image paste
  usePasteImage({
    onImagePaste: (file) => {
      setImageFile(file);
    },
    onImageData: (dataUrl) => {
      setImagePreview(dataUrl);
    },
  });

  // Initialize form with existing style
  useEffect(() => {
    if (style && isOpen) {
      setFormData({
        name: style.name,
        prompt: style.prompt,
        description: style.description || '',
        imagePreview: style.image_url,
      });
      setImageFile(null);
      setImagePreview('');
    } else if (!style && isOpen) {
      setFormData({
        name: '',
        prompt: '',
        description: '',
      });
      setImageFile(null);
      setImagePreview('');
    }
  }, [style, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.prompt.trim()) {
      alert('Name and prompt are required');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('prompt', formData.prompt);
    form.append('description', formData.description);

    if (imageFile) {
      try {
        // Convert image to WebP on client-side before uploading
        const webpBlob = await convertToWebP(imageFile, 0.9);
        const webpFile = new File([webpBlob], 'image.webp', { type: 'image/webp' });
        form.append('image', webpFile);
      } catch (error) {
        console.error('Image conversion error:', error);
        alert('Error converting image. Please try again.');
        return;
      }
    }

    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error saving style');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">
            {style ? 'Edit Style' : 'New Style'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Style Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Cinematic Dark"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prompt
            </label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              placeholder="Describe the visual style..."
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes about this style..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reference Image
            </label>

            {imagePreview || formData.imagePreview ? (
              <div className="relative rounded overflow-hidden bg-gray-900 aspect-video mb-2">
                <img
                  src={imagePreview || formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    setFormData((prev) => ({ ...prev, imagePreview: undefined }));
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs"
                >
                  Remove
                </button>
              </div>
            ) : null}

            <div className="flex gap-2">
              <label className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 cursor-pointer text-center text-sm transition-colors">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isLoading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 py-2">
                or press <kbd className="bg-gray-700 px-2 py-1 rounded">Cmd+V</kbd>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
            >
              {isLoading
                ? 'Saving...'
                : style
                  ? 'Update Style'
                  : 'Create Style'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
