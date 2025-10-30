import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Listar todas las conversaciones
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversations', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversations: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Crear nueva conversación
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, metadata } = body;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        title: title || 'Nueva Conversación',
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return NextResponse.json(
        { error: 'Failed to create conversation', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Conversation created: ${data.id}`);
    return NextResponse.json({ conversation: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar conversación
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, isFavorite, metadata } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (isFavorite !== undefined) updates.is_favorite = isFavorite;
    if (metadata !== undefined) updates.metadata = metadata;

    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating conversation:', error);
      return NextResponse.json(
        { error: 'Failed to update conversation', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: data });
  } catch (error: any) {
    console.error('Error in PATCH /api/conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar conversación
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting conversation:', error);
      return NextResponse.json(
        { error: 'Failed to delete conversation', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
