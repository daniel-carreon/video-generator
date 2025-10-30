'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore, VideoModel } from '../stores/chatStore';
import { MODEL_CONFIG } from '@/features/video-generation/config/modelConfig';

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || '';

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
    setLoading,
    setError,
    setSelectedModel,
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
      const response = await fetch(`${API_BASE}/api/chat`, {
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

      // Agregar respuesta del asistente
      const assistantMessage = createAssistantMessage(
        data.message,
        data.toolCalled,
        data.toolResult
      );
      addMessage(assistantMessage);

      // Si se generó un video, podríamos disparar un evento para actualizar la galería
      if (data.toolResult?.videoUrl) {
        window.dispatchEvent(new CustomEvent('video-generated', {
          detail: data.toolResult
        }));
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');

      // Agregar mensaje de error
      const errorMessage = createAssistantMessage(
        `Lo siento, ocurrió un error: ${err.message}. Por favor intenta de nuevo.`
      );
      addMessage(errorMessage);
    } finally {
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
    <div className="flex flex-col h-full max-h-[600px] bg-tertiary rounded-lg border border-default">
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
            <p className="text-sm">Prueba escribiendo algo como:</p>
            <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
              <div className="bg-secondary p-2 rounded text-sm text-primary">
                "Genera un video de un carro deportivo corriendo por una carretera"
              </div>
              <div className="bg-secondary p-2 rounded text-sm text-primary">
                "¿Qué modelo me recomiendas para un video cinematográfico?"
              </div>
              <div className="bg-secondary p-2 rounded text-sm text-primary">
                "Crea un video de 8 segundos con el modelo Veo 3"
              </div>
            </div>
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
