import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabase';

/**
 * GET /api/analytics/charts
 *
 * Get chart data for analytics dashboard
 * Query params:
 *   - type: 'timeline' | 'distribution' (required)
 *   - daysBack: number (default: 30)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    if (!type || !['timeline', 'distribution'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "timeline" or "distribution"' },
        { status: 400 }
      );
    }

    if (daysBack < 1 || daysBack > 365) {
      return NextResponse.json(
        { error: 'Invalid daysBack parameter. Must be between 1 and 365' },
        { status: 400 }
      );
    }

    if (type === 'timeline') {
      // Get cost timeline
      const { data, error } = await supabase
        .rpc('get_cost_timeline', { days_back: daysBack });

      if (error) {
        console.error('Error fetching timeline:', error);
        return NextResponse.json(
          { error: 'Failed to fetch timeline data' },
          { status: 500 }
        );
      }

      const formattedData = (data || []).map((row: any) => ({
        date: row.date,
        dailyCost: parseFloat(row.daily_cost || '0'),
        videoCount: parseInt(row.video_count || '0')
      }));

      return NextResponse.json({
        type: 'timeline',
        daysBack,
        data: formattedData
      });

    } else if (type === 'distribution') {
      // Get model distribution
      const { data, error } = await supabase
        .rpc('get_model_distribution', { days_back: daysBack });

      if (error) {
        console.error('Error fetching distribution:', error);
        return NextResponse.json(
          { error: 'Failed to fetch distribution data' },
          { status: 500 }
        );
      }

      const formattedData = (data || []).map((row: any) => ({
        model: row.model,
        videoCount: parseInt(row.video_count || '0'),
        totalCost: parseFloat(row.total_cost || '0'),
        averageCost: parseFloat(row.average_cost || '0'),
        percentage: parseFloat(row.percentage || '0')
      }));

      return NextResponse.json({
        type: 'distribution',
        daysBack,
        data: formattedData
      });
    }

  } catch (error) {
    console.error('Unexpected error in /api/analytics/charts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
