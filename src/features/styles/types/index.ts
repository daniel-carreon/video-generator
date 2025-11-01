/**
 * Style Types - Predefined prompts with reference images
 */

export interface Style {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  image_url?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateStyleInput {
  name: string;
  prompt: string;
  image?: File | Blob; // Image to upload
  description?: string;
  tags?: string[];
}

export interface UpdateStyleInput {
  name?: string;
  prompt?: string;
  image?: File | Blob;
  description?: string;
  tags?: string[];
}

export interface StyleFormData {
  name: string;
  prompt: string;
  description: string;
  imagePreview?: string; // Base64 or URL for preview
}
