// Modelos disponibles para generación de videos
export type VideoModel = 'veo3' | 'veo3-fast' | 'hailuo-standard' | 'hailuo-pro' | 'kling';

// Información de modelos
export interface ModelInfo {
  id: VideoModel;
  name: string;
  description: string;
  costPerSecond: number;
  maxDuration: number;
  resolutions: string[];
  features: string[];
  recommended?: boolean;
}

// Configuración de video
export interface VideoConfig {
  model: VideoModel;
  duration: number;
  resolution: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  includeAudio?: boolean;
  motionIntensity?: number;
}

// Request para generación
export interface GenerateVideoRequest {
  prompt: string;
  model: VideoModel;
  duration?: number;
  resolution?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  includeAudio?: boolean;
  imageUrl?: string;
  motionIntensity?: number;
}

// Resultado de generación
export interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  resolution: string;
  seed: number;
  model: string;
  cost?: number;
}

// Video guardado en la base de datos
export interface GeneratedVideo {
  id: string;
  video_id: string;
  fal_url: string;
  supabase_url?: string;
  prompt: string;
  duration: number;
  resolution: string;
  aspect_ratio: string;
  model_used: string;
  seed?: number;
  generation_session?: string;
  generated_at: string;
  tags: string[];
  is_favorite: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Estado de generación
export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

// Catálogo de modelos
export const MODEL_CATALOG: Record<VideoModel, ModelInfo> = {
  'veo3': {
    id: 'veo3',
    name: 'Veo 3 (Google)',
    description: 'Alta calidad con audio/música integrado',
    costPerSecond: 0.50,
    maxDuration: 8,
    resolutions: ['720p', '1080p'],
    features: ['Audio integrado', 'Alta calidad', 'Hasta 8 segundos']
  },
  'veo3-fast': {
    id: 'veo3-fast',
    name: 'Veo 3 Fast',
    description: 'Versión rápida de Veo 3',
    costPerSecond: 0.25,
    maxDuration: 8,
    resolutions: ['720p', '1080p'],
    features: ['Rápido', 'Audio opcional', 'Buena calidad']
  },
  'hailuo-standard': {
    id: 'hailuo-standard',
    name: 'Hailuo 02 Standard',
    description: 'Cinematográfico, más económico',
    costPerSecond: 0.045,
    maxDuration: 10,
    resolutions: ['768p'],
    features: ['MÁS ECONÓMICO', 'Cinematográfico', 'Control de cámara'],
    recommended: true
  },
  'hailuo-pro': {
    id: 'hailuo-pro',
    name: 'Hailuo 02 Pro',
    description: 'Cinematográfico de alta calidad',
    costPerSecond: 0.08,
    maxDuration: 10,
    resolutions: ['1080p'],
    features: ['Alta calidad', 'Cinematográfico', 'Control de cámara']
  },
  'kling': {
    id: 'kling',
    name: 'Kling Video',
    description: 'Hiperrealista, estilo grabado con cámara',
    costPerSecond: 0.28,
    maxDuration: 10,
    resolutions: ['720p', '1080p'],
    features: ['Hiperrealista', 'Image-to-video', 'POV humano']
  }
};

// Función helper para calcular costo
export function calculateEstimatedCost(model: VideoModel, duration: number, includeAudio: boolean = false): number {
  const modelInfo = MODEL_CATALOG[model];
  let costPerSecond = modelInfo.costPerSecond;

  // Veo con audio cuesta más
  if ((model === 'veo3' || model === 'veo3-fast') && includeAudio) {
    costPerSecond = model === 'veo3' ? 0.75 : 0.40;
  }

  return costPerSecond * duration;
}
