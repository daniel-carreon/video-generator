import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RouteParams {
  params: Promise<{
    requestId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { requestId } = await params;
    const falApiKey = process.env.FAL_KEY as string;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking status for request: ${requestId}`);

    // Check status from fal.ai
    const statusUrl = `https://queue.fal.run/fal-ai/minimax/requests/${requestId}/status`;
    const statusResponse = await fetch(statusUrl, {
      headers: {
        'Authorization': `Key ${falApiKey}`
      }
    });

    if (!statusResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to check status', details: await statusResponse.text() },
        { status: statusResponse.status }
      );
    }

    const statusData = await statusResponse.json();
    console.log(`📊 Status: ${statusData.status}`);

    // If completed, fetch the final result and save to Supabase
    if (statusData.status === 'COMPLETED') {
      const responseUrl = statusData.response_url;
      const resultResponse = await fetch(responseUrl, {
        headers: {
          'Authorization': `Key ${falApiKey}`
        }
      });

      if (!resultResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch result', details: await resultResponse.text() },
          { status: resultResponse.status }
        );
      }

      const result = await resultResponse.json();

      // Extract video URL from result
      let videoUrl = result.video?.url || result.data?.video?.url || result.url;

      if (!videoUrl && result.outputs) {
        videoUrl = result.outputs[0]?.url || result.outputs.video?.url;
      }

      if (!videoUrl) {
        console.error(`❌ No video URL found in result:`, result);
        return NextResponse.json({
          status: 'COMPLETED',
          error: 'Video URL not found in result',
          data: result
        });
      }

      console.log(`✅ Video URL found: ${videoUrl}`);

      // Get metadata from query params (passed from frontend)
      const { searchParams } = new URL(req.url);
      const prompt = searchParams.get('prompt') || 'Video generated';
      const model = searchParams.get('model') || 'unknown';
      const duration = parseInt(searchParams.get('duration') || '6');

      // Save to Supabase
      try {
        const videoId = `vid_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const { data: savedVideo, error: dbError } = await supabase
          .from('generated_videos')
          .insert({
            video_id: videoId,
            fal_url: videoUrl,
            supabase_url: null,
            prompt: prompt,
            duration: duration,
            resolution: result.resolution || '768p',
            aspect_ratio: result.aspect_ratio || '16:9',
            model_used: model,
            seed: result.seed || Math.floor(Math.random() * 1000000),
            generation_session: null,
            tags: [],
            metadata: {
              requestId: requestId,
              thumbnailUrl: result.thumbnail?.url || result.data?.thumbnail?.url || result.image?.url,
              falResponse: result
            }
          })
          .select()
          .single();

        if (dbError) {
          console.error('⚠️ Failed to save video to database:', dbError);
        } else {
          console.log(`💾 Video saved to database: ${videoId}`);
        }
      } catch (dbError) {
        console.error('⚠️ Error saving to database:', dbError);
      }

      return NextResponse.json({
        status: 'COMPLETED',
        videoUrl: videoUrl,
        thumbnailUrl: result.thumbnail?.url || result.data?.thumbnail?.url || result.image?.url,
        data: result
      });
    }

    // If failed
    if (statusData.status === 'FAILED') {
      return NextResponse.json({
        status: 'FAILED',
        error: statusData.error?.message || statusData.error || 'Unknown error'
      });
    }

    // Return current status (IN_PROGRESS, IN_QUEUE)
    return NextResponse.json({
      status: statusData.status,
      request_id: requestId
    });
  } catch (error: any) {
    console.error('❌ Error checking video status:', error);
    return NextResponse.json(
      {
        error: 'Failed to check video status',
        details: error.message
      },
      { status: 500 }
    );
  }
}
