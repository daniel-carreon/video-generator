import { NextRequest, NextResponse } from 'next/server';
import { StyleService } from '@/features/styles/services/styleService';

export async function GET(request: NextRequest) {
  try {
    const styles = await StyleService.getStyles();
    return NextResponse.json(styles);
  } catch (error) {
    console.error('GET /api/styles error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch styles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const prompt = formData.get('prompt') as string;
    const description = formData.get('description') as string | undefined;
    const tagsStr = formData.get('tags') as string | undefined;
    const image = formData.get('image') as File | null;

    if (!name || !prompt) {
      return NextResponse.json(
        { error: 'Name and prompt are required' },
        { status: 400 }
      );
    }

    const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : undefined;

    const style = await StyleService.createStyle({
      name,
      prompt,
      description,
      tags,
      image: image || undefined,
    });

    return NextResponse.json(style, { status: 201 });
  } catch (error) {
    console.error('POST /api/styles error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create style' },
      { status: 500 }
    );
  }
}
