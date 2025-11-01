'use client';

import React, { useState } from 'react';
import { VideoModel, MODEL_CATALOG, calculateEstimatedCost } from '../types';
import { useVideoStore } from '../stores/videoStore';
import { MODEL_CONFIG, VideoModel as ConfigVideoModel } from '../config/modelConfig';
import { VideoService } from '../services/videoService';

export function ModelSelector() {
  const { config, setConfig } = useVideoStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleModelChange = (model: VideoModel) => {
    setConfig({ model });
  };

  const handleDirectGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt para generar el video');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationResult(null);

    try {
      const result = await VideoService.generateVideo({
        prompt: prompt.trim(),
        model: config.model,
        duration: config.duration,
        aspectRatio: config.aspectRatio,
        includeAudio: config.includeAudio
      });

      setGenerationResult(result);

      // Disparar evento para actualizar galería
      window.dispatchEvent(new CustomEvent('video-generated', {
        detail: result
      }));

      console.log('✅ Video generado exitosamente:', result);
    } catch (err: any) {
      console.error('❌ Error generando video:', err);
      setError(err.message || 'Error al generar video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Model Comparison Table */}
      <div className="bg-secondary border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900">📊 Model Comparison</h3>
          <p className="text-sm text-gray-600 mt-1">Compare features and pricing across all models</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-tertiary text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Model</th>
                <th className="px-4 py-3 text-center">Cost/sec</th>
                <th className="px-4 py-3 text-center">Duration</th>
                <th className="px-4 py-3 text-center">Resolution</th>
                <th className="px-4 py-3 text-center">Audio</th>
                <th className="px-4 py-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {Object.values(MODEL_CATALOG).map((model) => (
                <tr key={model.id} className="hover:bg-tertiary/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900">{model.name}</span>
                    {model.recommended && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Recommended</span>}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-accent">${model.costPerSecond}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{model.maxDuration}s</td>
                  <td className="px-4 py-3 text-center text-gray-700">{model.resolutions.join(', ')}</td>
                  <td className="px-4 py-3 text-center">{model.features.includes('audio') ? '✅' : '❌'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{model.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Calculator */}
      <div className="bg-secondary border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">💰 Budget Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Budget (USD)</label>
            <input
              type="number"
              step="1"
              min="1"
              defaultValue="10"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-tertiary text-gray-900"
              onChange={(e) => {
                const budget = parseFloat(e.target.value) || 0;
                const cost = calculateEstimatedCost(config.model, config.duration, config.includeAudio);
                const videos = Math.floor(budget / cost);
                const seconds = Math.floor(budget / MODEL_CATALOG[config.model].costPerSecond);
                const el = e.target.parentElement?.parentElement?.querySelector('.budget-result');
                if (el) el.textContent = `≈ ${videos} videos (${seconds}s total)`;
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Using Model</label>
            <div className="px-3 py-2 border border-gray-600 rounded-lg bg-tertiary text-gray-900">
              {MODEL_CATALOG[config.model].name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">You can generate</label>
            <div className="px-3 py-2 border border-gray-600 rounded-lg bg-accent/20 text-accent font-semibold budget-result">
              ≈ {Math.floor(10 / calculateEstimatedCost(config.model, config.duration, config.includeAudio))} videos ({Math.floor(10 / MODEL_CATALOG[config.model].costPerSecond)}s total)
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Select a Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(MODEL_CATALOG).map((model) => {
            const isSelected = config.model === model.id;
            const estimatedCost = calculateEstimatedCost(
              model.id,
              config.duration,
              config.includeAudio
            );

            return (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className={`
                  relative p-4 rounded-lg border-2 transition-smooth text-left
                  ${isSelected
                    ? 'border-accent bg-accent-subtle'
                    : 'border-default hover:border-accent'
                  }
                `}
              >
                {model.recommended && (
                  <div className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-1 rounded font-semibold">
                    Recomendado
                  </div>
                )}

                <div className="mb-2">
                  <h4 className="font-semibold text-sm text-primary">{model.name}</h4>
                  <p className="text-xs text-secondary mt-1">
                    {model.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-secondary font-medium">
                    💰 ${model.costPerSecond}/seg
                    {config.duration > 0 && (
                      <span className="ml-1">
                        (≈${estimatedCost.toFixed(3)} por {config.duration}s)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-secondary font-medium">
                    ⏱️ Hasta {model.maxDuration}s
                  </div>
                  <div className="text-xs text-secondary font-medium">
                    📺 {model.resolutions.join(', ')}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {model.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-secondary text-primary px-2 py-0.5 rounded font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opciones adicionales según el modelo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-primary">Duración (segundos)</label>
          <select
            value={config.duration}
            onChange={(e) => setConfig({ duration: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-default rounded-lg bg-tertiary text-primary transition-smooth hover:border-accent"
          >
            {MODEL_CONFIG[config.model as ConfigVideoModel]?.allowedDurations.map((dur) => (
              <option key={dur} value={dur}>{dur} segundos</option>
            ))}
          </select>
          <p className="text-xs text-tertiary mt-1">
            Duraciones válidas para {config.model}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-primary">Aspecto</label>
          <select
            value={config.aspectRatio}
            onChange={(e) => setConfig({ aspectRatio: e.target.value as any })}
            className="w-full px-3 py-2 border border-default rounded-lg bg-tertiary text-primary transition-smooth hover:border-accent"
          >
            <option value="16:9">16:9 (Horizontal)</option>
            <option value="9:16">9:16 (Vertical)</option>
            <option value="1:1">1:1 (Cuadrado)</option>
          </select>
        </div>

        {(config.model === 'veo3' || config.model === 'veo3-fast') && (
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Audio</label>
            <div className="flex items-center h-full">
              <input
                type="checkbox"
                checked={config.includeAudio}
                onChange={(e) => setConfig({ includeAudio: e.target.checked })}
                className="mr-2 accent-accent"
              />
              <span className="text-sm text-primary">Incluir música/audio</span>
            </div>
          </div>
        )}
      </div>

      {/* Estimación de costo total */}
      <div className="p-4 bg-secondary border border-default rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-primary">Costo Estimado:</span>
          <span className="text-lg font-bold text-accent">
            ${calculateEstimatedCost(config.model, config.duration, config.includeAudio).toFixed(4)} USD
          </span>
        </div>
      </div>

      {/* Generación directa de video */}
      <div className="mt-8 p-6 bg-tertiary border-2 border-accent rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-primary">🎬 Generación Directa</h3>
        <p className="text-sm text-secondary mb-4">
          Genera un video directamente con el modelo seleccionado sin usar el chat agent.
        </p>

        <div className="space-y-4">
          {/* Input de prompt */}
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">
              Prompt del Video
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el video que deseas generar... Ejemplo: 'Un gato jugando con una pelota en un jardín soleado, cámara cinematográfica con movimiento suave'"
              className="w-full px-4 py-3 border border-default rounded-lg bg-tertiary text-primary resize-none transition-smooth hover:border-accent focus:border-accent focus:outline-none"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          {/* Mostrar restricciones del modelo seleccionado */}
          <div className="p-3 bg-secondary border border-subtle rounded text-sm">
            <p className="font-semibold text-primary mb-2">ℹ️ Restricciones del modelo {config.model}:</p>
            <ul className="space-y-1 text-secondary text-xs">
              <li>• Duraciones permitidas: {MODEL_CONFIG[config.model as ConfigVideoModel]?.allowedDurations.join(', ')}s</li>
              <li>• Aspect ratios: {MODEL_CONFIG[config.model as ConfigVideoModel]?.allowedAspectRatios.join(', ')}</li>
              <li>• Resoluciones: {MODEL_CONFIG[config.model as ConfigVideoModel]?.allowedResolutions.join(', ')}</li>
              {MODEL_CONFIG[config.model as ConfigVideoModel]?.supportsAudio && (
                <li>• ✅ Soporta audio/música</li>
              )}
            </ul>
          </div>

          {/* Botón de generar */}
          <button
            onClick={handleDirectGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full px-6 py-3 bg-accent text-white rounded-lg font-semibold transition-smooth hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Generando video...</span>
              </>
            ) : (
              <>
                <span>🎥</span>
                <span>Generar Video</span>
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-200">
              ❌ {error}
            </div>
          )}

          {/* Resultado exitoso */}
          {generationResult && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded">
              <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ ¡Video generado exitosamente!
              </p>
              <video
                src={generationResult.videoUrl}
                controls
                className="w-full rounded-lg mb-3"
              />
              <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                <p>• Duración: {generationResult.duration}s</p>
                <p>• Resolución: {generationResult.resolution}</p>
                <p>• Costo estimado: ${generationResult.cost?.toFixed(4)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
