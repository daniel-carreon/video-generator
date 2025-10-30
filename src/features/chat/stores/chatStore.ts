import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '../types';

export type VideoModel = 'veo3' | 'veo3-fast' | 'hailuo-standard' | 'hailuo-pro' | 'kling';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentConversationId: string | null;
  selectedModel: VideoModel;

  // Actions
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  setCurrentConversationId: (id: string | null) => void;
  loadMessages: (messages: ChatMessage[]) => void;
  setSelectedModel: (model: VideoModel) => void;

  // Helper para crear mensaje
  createUserMessage: (content: string) => ChatMessage;
  createAssistantMessage: (content: string, toolCalled?: string, toolResult?: any) => ChatMessage;
}

export const useChatStore = create<ChatStore>(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      currentConversationId: null,
      selectedModel: 'hailuo-standard', // Default: modelo más económico

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message]
        })),

      updateLastMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          if (messages.length > 0) {
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              content
            };
          }
          return { messages };
        }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearMessages: () => set({ messages: [] }),
      setCurrentConversationId: (id) => set({ currentConversationId: id }),
      loadMessages: (messages) => set({ messages }),
      setSelectedModel: (model) => set({ selectedModel: model }),

      createUserMessage: (content) => ({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date()
      }),

      createAssistantMessage: (content, toolCalled?, toolResult?) => ({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content,
        toolCalled,
        toolResult,
        timestamp: new Date()
      })
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ selectedModel: state.selectedModel })
    }
  )
);
