import { supabase } from '@/shared/lib/supabase';
import { Style, CreateStyleInput, UpdateStyleInput } from '../types';

const BUCKET_NAME = 'style-images';

/**
 * StyleService - Handles style operations (CRUD + image uploads)
 */
export class StyleService {
  /**
   * Get all styles for current user
   */
  static async getStyles(): Promise<Style[]> {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch styles: ${error.message}`);
    }

    return data as Style[];
  }

  /**
   * Get single style by ID
   */
  static async getStyle(id: string): Promise<Style> {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch style: ${error.message}`);
    }

    return data as Style;
  }

  /**
   * Create new style with optional image
   * Auth is optional - allows null user_id for personal use
   */
  static async createStyle(input: CreateStyleInput): Promise<Style> {
    console.log('🎨 StyleService.createStyle starting...', {
      hasImage: !!input.image,
      name: input.name
    });

    let imageUrl: string | undefined;

    // Upload image if provided
    if (input.image) {
      console.log('📤 Uploading image...');
      try {
        imageUrl = await this.uploadImage(input.image);
        console.log('✅ Image uploaded:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        throw uploadError;
      }
    }

    // Try to get user, but don't require it
    console.log('👤 Checking for user authentication...');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log('User status:', user ? `Authenticated: ${user.id}` : 'Not authenticated (using NULL)');

    console.log('💾 Inserting into database...');
    const { data, error } = await supabase
      .from('styles')
      .insert({
        user_id: user?.id || null,
        name: input.name,
        prompt: input.prompt,
        image_url: imageUrl,
        description: input.description,
        tags: input.tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database insert error:', error);
      throw new Error(`Failed to create style: ${error.message}`);
    }

    console.log('✅ Style created in database:', data.id);
    return data as Style;
  }

  /**
   * Update existing style
   */
  static async updateStyle(id: string, input: UpdateStyleInput): Promise<Style> {
    let imageUrl: string | undefined;

    // Upload new image if provided
    if (input.image) {
      // Delete old image if exists
      const style = await this.getStyle(id);
      if (style.image_url) {
        await this.deleteImage(style.image_url);
      }

      imageUrl = await this.uploadImage(input.image);
    }

    const updates: any = {
      name: input.name,
      prompt: input.prompt,
      description: input.description,
      tags: input.tags,
      updated_at: new Date().toISOString(),
    };

    if (imageUrl) {
      updates.image_url = imageUrl;
    }

    // Remove undefined values
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const { data, error } = await supabase
      .from('styles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update style: ${error.message}`);
    }

    return data as Style;
  }

  /**
   * Delete style
   */
  static async deleteStyle(id: string): Promise<void> {
    // Get style to find image URL
    const style = await this.getStyle(id);

    // Delete image from storage
    if (style.image_url) {
      await this.deleteImage(style.image_url);
    }

    const { error } = await supabase.from('styles').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete style: ${error.message}`);
    }
  }

  /**
   * Upload image to Supabase Storage
   * Image should already be converted to WebP on client-side
   */
  private static async uploadImage(file: File | Blob): Promise<string> {
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileExtension = file.type === 'image/webp' ? 'webp' : file.type.split('/')[1] || 'webp';

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${fileName}.${fileExtension}`, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return publicUrl;
  }

  /**
   * Delete image from storage
   */
  private static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts[urlParts.length - 1];

      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    } catch (error) {
      console.error('Failed to delete image:', error);
      // Don't throw - continue even if image deletion fails
    }
  }
}
