import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Obtener mensajes de una conversación
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/conversations/[id]/messages:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Agregar mensaje a conversación
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { messageId, role, content, toolCalled, toolResult, metadata } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: 400 }
      );
    }

    // Generar message_id si no se provee
    const genMessageId = messageId || `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        message_id: genMessageId,
        conversation_id: id,
        role,
        content,
        tool_called: toolCalled,
        tool_result: toolResult,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return NextResponse.json(
        { error: 'Failed to add message', details: error.message },
        { status: 500 }
      );
    }

    // Actualizar timestamp de la conversación
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('conversation_id', id);

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/conversations/[id]/messages:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
