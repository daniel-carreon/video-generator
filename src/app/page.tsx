'use client';

import React, { useEffect, useState } from 'react';
import { ChatAgent } from '@/features/chat/components/ChatAgent';
import { ModelSelector } from '@/features/video-generation/components/ModelSelector';
import { VideoCard } from '@/shared/components/VideoCard';
import { useVideoStore } from '@/features/video-generation/stores/videoStore';
import { VideoService } from '@/features/video-generation/services/videoService';
import { GeneratedVideo } from '@/features/video-generation/types';
import { StyleCard } from '@/features/styles/components/StyleCard';
import { StyleForm } from '@/features/styles/components/StyleForm';
import { useStyleStore } from '@/features/styles/stores/styleStore';
import { Style } from '@/features/styles/types';
import { Plus } from 'lucide-react';

export default function Home() {
  const { videos, setVideos, deleteVideo: removeVideoFromStore } = useVideoStore();
  const { styles, setStyles, addStyle, updateStyle, removeStyle } = useStyleStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'gallery' | 'styles' | 'settings'>('chat');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [isStyleFormOpen, setIsStyleFormOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);

  // Cargar videos y estilos al montar
  useEffect(() => {
    loadVideos();
    loadStyles();

    // Escuchar eventos de videos generados
    const handleVideoGenerated = () => {
      loadVideos();
    };

    window.addEventListener('video-generated', handleVideoGenerated);

    return () => {
      window.removeEventListener('video-generated', handleVideoGenerated);
    };
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const fetchedVideos = await VideoService.getVideos({ limit: 50 });
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    removeVideoFromStore(id);
    await loadVideos(); // Reload para asegurar consistencia
  };

  const loadStyles = async () => {
    try {
      const response = await fetch('/api/styles');
      if (response.ok) {
        const data = await response.json();
        setStyles(data);
      }
    } catch (error) {
      console.error('Failed to load styles:', error);
    }
  };

  const handleCreateStyle = async (formData: FormData) => {
    try {
      const response = await fetch('/api/styles', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create style');
      }

      const newStyle = await response.json();
      addStyle(newStyle);
    } catch (error) {
      console.error('Failed to create style:', error);
      throw error;
    }
  };

  const handleEditStyle = async (formData: FormData) => {
    if (!editingStyle) return;

    try {
      const response = await fetch(`/api/styles/${editingStyle.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update style');
      }

      const updatedStyle = await response.json();
      updateStyle(editingStyle.id, updatedStyle);
      setEditingStyle(null);
    } catch (error) {
      console.error('Failed to update style:', error);
      throw error;
    }
  };

  const handleDeleteStyle = async (id: string) => {
    try {
      const response = await fetch(`/api/styles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete style');
      }

      removeStyle(id);
    } catch (error) {
      console.error('Failed to delete style:', error);
      alert('Error deleting style');
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-tertiary border-b border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary tracking-tight">
                🎬 Video Generator AI
              </h1>
              <p className="text-secondary mt-1 text-sm">
                Genera videos increíbles con IA · Powered by fal.ai
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-secondary">
                <span className="font-semibold text-accent">{videos.length}</span> videos generados
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 flex gap-1 border-b border-subtle">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
              activeTab === 'chat'
                ? 'border-accent text-accent'
                : 'border-transparent text-tertiary hover:text-primary'
            }`}
          >
            💬 Chat Agent
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
              activeTab === 'gallery'
                ? 'border-accent text-accent'
                : 'border-transparent text-tertiary hover:text-primary'
            }`}
          >
            🎥 Galería ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
              activeTab === 'styles'
                ? 'border-accent text-accent'
                : 'border-transparent text-tertiary hover:text-primary'
            }`}
          >
            🎨 Styles ({styles.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
              activeTab === 'settings'
                ? 'border-accent text-accent'
                : 'border-transparent text-tertiary hover:text-primary'
            }`}
          >
            ⚙️ Modelos
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChatAgent />
              </div>
              <div className="space-y-6">
                <div className="bg-tertiary rounded-lg border border-default p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">💡 Tips</h3>
                  <ul className="space-y-3 text-sm text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">→</span>
                      <span>Sé específico con tus prompts para mejores resultados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">→</span>
                      <span>Menciona el estilo: &quot;cinematográfico&quot;, &quot;realista&quot;, etc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">→</span>
                      <span>El modelo Hailuo Standard es el más económico ($0.045/s)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">→</span>
                      <span>Veo 3 puede generar audio/música integrado</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-tertiary rounded-lg border border-default p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">📊 Últimos Videos</h3>
                  <div className="space-y-2">
                    {videos.slice(0, 3).map((video) => (
                      <div
                        key={video.id}
                        className="text-sm p-3 bg-secondary border border-subtle rounded cursor-pointer hover:border-default transition-smooth"
                        onClick={() => {
                          setSelectedVideo(video);
                          setActiveTab('gallery');
                        }}
                      >
                        <p className="line-clamp-1 font-medium text-primary">{video.prompt}</p>
                        <p className="text-xs text-tertiary mt-1">
                          {video.model_used} · {video.duration}s
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Galería de Videos</h2>
                <button
                  onClick={loadVideos}
                  className="px-4 py-2 bg-accent text-white rounded-lg bg-accent-hover transition-smooth"
                >
                  🔄 Recargar
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12 bg-tertiary border border-default rounded-lg">
                  <p className="text-secondary">
                    No hay videos aún. ¡Usa el chat agent para generar tu primer video!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onVideoClick={setSelectedVideo}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Styles Tab */}
          {activeTab === 'styles' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Mis Estilos</h2>
                <button
                  onClick={() => {
                    setEditingStyle(null);
                    setIsStyleFormOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-smooth"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Estilo
                </button>
              </div>

              {styles.length === 0 ? (
                <div className="text-center py-12 bg-tertiary border border-default rounded-lg">
                  <p className="text-secondary mb-4">
                    No hay estilos aún. Crea tu primer estilo para reutilizarlo.
                  </p>
                  <button
                    onClick={() => {
                      setEditingStyle(null);
                      setIsStyleFormOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-smooth"
                  >
                    <Plus className="w-5 h-5" />
                    Crear Estilo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {styles.map((style) => (
                    <StyleCard
                      key={style.id}
                      style={style}
                      onEdit={(s) => {
                        setEditingStyle(s);
                        setIsStyleFormOpen(true);
                      }}
                      onDelete={handleDeleteStyle}
                      onCopyPrompt={handleCopyPrompt}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-tertiary rounded-lg border border-default p-6">
              <h2 className="text-2xl font-bold mb-6 text-primary">Configuración de Modelos</h2>
              <ModelSelector />
            </div>
          )}
        </div>
      </main>

      {/* Style Form Modal */}
      <StyleForm
        style={editingStyle || undefined}
        isOpen={isStyleFormOpen}
        onClose={() => {
          setIsStyleFormOpen(false);
          setEditingStyle(null);
        }}
        onSubmit={editingStyle ? handleEditStyle : handleCreateStyle}
      />

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedVideo.prompt}</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <video
                src={selectedVideo.fal_url}
                controls
                autoPlay
                loop
                className="w-full rounded-lg"
              />

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Modelo:</span> {selectedVideo.model_used}
                </div>
                <div>
                  <span className="font-semibold">Duración:</span> {selectedVideo.duration}s
                </div>
                <div>
                  <span className="font-semibold">Resolución:</span> {selectedVideo.resolution}
                </div>
                <div>
                  <span className="font-semibold">Aspecto:</span> {selectedVideo.aspect_ratio}
                </div>
                {selectedVideo.metadata?.cost && (
                  <div>
                    <span className="font-semibold">Costo:</span> $
                    {(selectedVideo.metadata.cost as number).toFixed(4)}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Generado:</span>{' '}
                  {new Date(selectedVideo.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
