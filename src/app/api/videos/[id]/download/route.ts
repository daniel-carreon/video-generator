import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  try {

    // Get video from database
    const { data: video, error: dbError } = await supabase
      .from('generated_videos')
      .select('fal_url, id')
      .eq('id', id)
      .single();

    if (dbError || !video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Fetch video from fal.ai
    const response = await fetch(video.fal_url);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to download video' },
        { status: 500 }
      );
    }

    const blob = await response.blob();

    // Return video with download headers
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="video-${id.slice(0, 8)}.mp4"`,
        'Content-Length': blob.size.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download video' },
      { status: 500 }
    );
  }
}
