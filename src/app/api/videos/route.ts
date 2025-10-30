import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Listar videos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');
    const favorite = searchParams.get('favorite');
    const model = searchParams.get('model');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('generated_videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (session) {
      query = query.eq('generation_session', session);
    }

    if (favorite === 'true') {
      query = query.eq('is_favorite', true);
    }

    if (model) {
      query = query.eq('model_used', model);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json(
        { error: 'Failed to fetch videos', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ videos: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/videos:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Guardar nuevo video
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      videoId,
      falUrl,
      supabaseUrl,
      prompt,
      duration,
      resolution,
      aspectRatio,
      modelUsed,
      seed,
      generationSession,
      tags,
      metadata
    } = body;

    // Validación
    if (!videoId || !falUrl || !prompt || !modelUsed) {
      return NextResponse.json(
        { error: 'Missing required fields: videoId, falUrl, prompt, modelUsed' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('generated_videos')
      .insert({
        video_id: videoId,
        fal_url: falUrl,
        supabase_url: supabaseUrl,
        prompt,
        duration,
        resolution,
        aspect_ratio: aspectRatio,
        model_used: modelUsed,
        seed,
        generation_session: generationSession,
        tags: tags || [],
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving video:', error);
      return NextResponse.json(
        { error: 'Failed to save video', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Video saved to database: ${videoId}`);
    return NextResponse.json({ video: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/videos:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar video (marcar favorito, agregar tags, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isFavorite, tags, metadata } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (isFavorite !== undefined) updates.is_favorite = isFavorite;
    if (tags !== undefined) updates.tags = tags;
    if (metadata !== undefined) updates.metadata = metadata;

    const { data, error } = await supabase
      .from('generated_videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating video:', error);
      return NextResponse.json(
        { error: 'Failed to update video', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ video: data });
  } catch (error: any) {
    console.error('Error in PATCH /api/videos:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar video
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('generated_videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting video:', error);
      return NextResponse.json(
        { error: 'Failed to delete video', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/videos:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
