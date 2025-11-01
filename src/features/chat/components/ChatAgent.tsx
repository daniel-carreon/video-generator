'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore, VideoModel } from '../stores/chatStore';
import { MODEL_CONFIG } from '@/features/video-generation/config/modelConfig';
import { getApiUrl } from '@/shared/lib/env';

// Metadata de modelos para el selector
const MODEL_DISPLAY: Record<VideoModel, { name: string; emoji: string; badge: string }> = {
  'hailuo-standard': { name: 'Hailuo Standard', emoji: '💰', badge: 'Económico' },
  'hailuo-pro': { name: 'Hailuo Pro', emoji: '✨', badge: 'Premium' },
  'veo3': { name: 'Veo 3', emoji: '🎵', badge: 'Con Audio' },
  'veo3-fast': { name: 'Veo 3 Fast', emoji: '⚡', badge: 'Rápido' },
  'kling': { name: 'Kling Video', emoji: '🎬', badge: 'Hiperrealista' }
};

export function ChatAgent() {
  const {
    messages,
    isLoading,
    error,
    currentConversationId,
    selectedModel,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    setSelectedModel,
    setCurrentConversationId,
    createUserMessage,
    createAssistantMessage
  } = useChatStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Poll video status when requestId is received
  const pollVideoStatus = async (requestId: string, prompt: string, model: string, duration: number, messageId: string) => {
    const maxAttempts = 60; // 5 minutes max (5s interval)
    let attempts = 0;

    const poll = async () => {
      try {
        const statusResponse = await fetch(
          getApiUrl(`/api/videos/status/${requestId}?prompt=${encodeURIComponent(prompt)}&model=${model}&duration=${duration}`),
          { method: 'GET' }
        );

        if (!statusResponse.ok) {
          throw new Error('Failed to check video status');
        }

        const statusData = await statusResponse.json();

        if (statusData.status === 'COMPLETED' && statusData.videoUrl) {
          // Update message with video URL
          updateMessage(messageId, {
            toolResult: {
              videoUrl: statusData.videoUrl,
              thumbnailUrl: statusData.thumbnailUrl,
              status: 'COMPLETED',
              prompt,
              model,
              duration
            }
          });

          // Dispatch event for gallery update
          window.dispatchEvent(new CustomEvent('video-generated', {
            detail: {
              videoUrl: statusData.videoUrl,
              thumbnailUrl: statusData.thumbnailUrl,
              prompt,
              model,
              duration
            }
          }));

          setLoading(false);
          return; // Stop polling
        } else if (statusData.status === 'FAILED') {
          throw new Error(statusData.error || 'Video generation failed');
        } else {
          // Still processing, continue polling
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000); // Poll every 5 seconds
          } else {
            throw new Error('Video generation timed out');
          }
        }
      } catch (err: any) {
        console.error('Poll error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    poll();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = createUserMessage(input.trim());
    addMessage(userMessage);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Llamar al API de chat con el modelo preferido
      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: userMessage.content }
          ],
          conversationId: currentConversationId,
          preferredModel: selectedModel
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chat request failed');
      }

      const data = await response.json();

      // Actualizar conversationId si se creó una nueva
      if (data.conversationId && data.conversationId !== currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      // Agregar respuesta del asistente
      const assistantMessage = createAssistantMessage(
        data.message,
        data.toolCalled,
        data.toolResult
      );
      addMessage(assistantMessage);

      // Si la respuesta contiene un requestId (video en proceso), empezar polling
      if (data.toolResult?.requestId && data.toolResult?.status === 'PROCESSING') {
        pollVideoStatus(
          data.toolResult.requestId,
          data.toolResult.prompt,
          data.toolResult.model,
          data.toolResult.duration,
          assistantMessage.id
        );
      } else {
        // Si no hay requestId, terminar loading
        setLoading(false);
      }

      // Si se generó un video directamente (animate_image por ejemplo), disparar evento
      if (data.toolResult?.videoUrl) {
        window.dispatchEvent(new CustomEvent('video-generated', {
          detail: data.toolResult
        }));
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');

      // Agregar mensaje de error
      const errorMessage = createAssistantMessage(
        `Lo siento, ocurrió un error: ${err.message}. Por favor intenta de nuevo.`
      );
      addMessage(errorMessage);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-280px)] bg-tertiary rounded-lg border border-default">
      {/* Header */}
      <div className="p-4 border-b border-default">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-primary">🤖 Video AI Assistant</h2>
          {/* Model Selector */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as VideoModel)}
              className="px-3 py-1.5 pr-8 text-xs font-medium bg-secondary border border-default rounded-lg text-primary cursor-pointer hover:border-accent transition-smooth focus:outline-none focus:border-accent appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.25rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {(Object.keys(MODEL_DISPLAY) as VideoModel[]).map((model) => (
                <option key={model} value={model}>
                  {MODEL_DISPLAY[model].emoji} {MODEL_DISPLAY[model].name} • {MODEL_DISPLAY[model].badge}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">
            Pregúntame para generar videos con IA
          </p>
          <p className="text-xs text-tertiary">
            ${MODEL_CONFIG[selectedModel].costPerSecond}/s
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-secondary py-8">
            <p className="mb-4 text-primary">👋 ¡Hola! Soy tu asistente de generación de videos.</p>
            <p className="text-sm text-tertiary">Escribe tu prompt para comenzar...</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-primary'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>

              {/* Mostrar info de tool si fue llamado */}
              {message.toolCalled && message.toolResult && (
                <div className="mt-2 pt-2 border-t border-subtle text-sm">
                  <p className="font-semibold">🔧 {message.toolCalled}</p>
                  {message.toolResult.videoUrl && (
                    <div className="mt-2">
                      <video
                        src={message.toolResult.videoUrl}
                        controls
                        className="w-full rounded"
                      />
                      {message.toolResult.cost && (
                        <p className="text-xs mt-1 opacity-70">
                          Costo: ${message.toolResult.cost.toFixed(4)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full"></div>
                <span className="text-sm text-secondary">
                  Generando respuesta...
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-secondary border-2 border-error text-error p-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-default">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
            className="flex-1 px-4 py-2 border border-default rounded-lg resize-none max-h-32 bg-tertiary text-primary placeholder:text-tertiary transition-smooth focus:border-accent focus:outline-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
}
