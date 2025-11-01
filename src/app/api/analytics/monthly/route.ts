import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabase';

/**
 * GET /api/analytics/monthly
 *
 * Get monthly summary of video costs
 * Query params:
 *   - year: number (optional, defaults to current year)
 *   - month: number (optional, defaults to current month)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const now = new Date();
    const year = parseInt(searchParams.get('year') || String(now.getFullYear()));
    const month = parseInt(searchParams.get('month') || String(now.getMonth() + 1));

    // Validate inputs
    if (year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: 'Invalid year parameter' },
        { status: 400 }
      );
    }

    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Invalid month parameter' },
        { status: 400 }
      );
    }

    // Call Supabase function
    const { data, error } = await supabase
      .rpc('get_monthly_summary', {
        target_year: year,
        target_month: month
      });

    if (error) {
      console.error('Error fetching monthly summary:', error);
      return NextResponse.json(
        { error: 'Failed to fetch monthly summary' },
        { status: 500 }
      );
    }

    // Format response
    const summary = data && data.length > 0 ? data[0] : {
      total_cost: '0',
      video_count: 0,
      average_cost: '0',
      total_duration: 0,
      most_used_model: null
    };

    return NextResponse.json({
      year,
      month,
      totalCost: parseFloat(summary.total_cost || '0'),
      videoCount: parseInt(summary.video_count || '0'),
      averageCost: parseFloat(summary.average_cost || '0'),
      totalDuration: parseInt(summary.total_duration || '0'),
      mostUsedModel: summary.most_used_model,
    });

  } catch (error) {
    console.error('Unexpected error in /api/analytics/monthly:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
