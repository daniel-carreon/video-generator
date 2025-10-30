export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalled?: string;
  toolResult?: any;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  metadata: Record<string, any>;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tool_used?: string;
  tool_result?: any;
  created_at: string;
}
