import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabase';

/**
 * GET /api/analytics/costs
 *
 * Get paginated list of video costs with filtering
 * Query params:
 *   - page: number (default: 1)
 *   - limit: number (default: 50, max: 100)
 *   - model: string (optional filter by model)
 *   - startDate: ISO date (optional)
 *   - endDate: ISO date (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    // Filter params
    const model = searchParams.get('model');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    let query = supabase
      .from('video_costs')
      .select(`
        id,
        video_id,
        model,
        duration,
        cost_per_second,
        total_cost,
        include_audio,
        resolution,
        aspect_ratio,
        created_at,
        generated_videos (
          prompt,
          fal_url
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (model) {
      query = query.eq('model', model);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching costs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch costs' },
        { status: 500 }
      );
    }

    // Format response
    const formattedData = (data || []).map(row => ({
      id: row.id,
      videoId: row.video_id,
      model: row.model,
      duration: row.duration,
      costPerSecond: parseFloat(row.cost_per_second || '0'),
      totalCost: parseFloat(row.total_cost || '0'),
      includeAudio: row.include_audio,
      resolution: row.resolution,
      aspectRatio: row.aspect_ratio,
      createdAt: row.created_at,
      // @ts-ignore - Join data
      prompt: row.generated_videos?.prompt || null,
      // @ts-ignore - Join data
      videoUrl: row.generated_videos?.fal_url || null,
    }));

    return NextResponse.json({
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Unexpected error in /api/analytics/costs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
