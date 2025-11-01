import { NextRequest, NextResponse } from 'next/server';
import { StyleService } from '@/features/styles/services/styleService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const style = await StyleService.getStyle(id);
    return NextResponse.json(style);
  } catch (error) {
    console.error('GET /api/styles/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch style' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const name = formData.get('name') as string | null;
    const prompt = formData.get('prompt') as string | null;
    const description = formData.get('description') as string | null;
    const tagsStr = formData.get('tags') as string | null;
    const image = formData.get('image') as File | null;

    const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : undefined;

    const style = await StyleService.updateStyle(id, {
      name: name || undefined,
      prompt: prompt || undefined,
      description: description || undefined,
      tags,
      image: image || undefined,
    });

    return NextResponse.json(style);
  } catch (error) {
    console.error('PATCH /api/styles/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update style' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await StyleService.deleteStyle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/styles/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete style' },
      { status: 500 }
    );
  }
}
