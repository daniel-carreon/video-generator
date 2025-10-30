/**
 * Configuración centralizada para todos los modelos de generación de video
 * Basado en la documentación oficial de fal.ai
 */

export type VideoModel = 'veo3' | 'veo3-fast' | 'hailuo-standard' | 'hailuo-pro' | 'kling';

export interface ModelConstraints {
  // Duraciones permitidas
  allowedDurations: number[];
  defaultDuration: number;

  // Resoluciones permitidas
  allowedResolutions: string[];
  defaultResolution: string;

  // Aspect ratios permitidos
  allowedAspectRatios: ('16:9' | '9:16' | '1:1' | 'auto')[];
  defaultAspectRatio: '16:9' | '9:16' | '1:1' | 'auto';

  // Audio (solo para modelos que lo soporten)
  supportsAudio: boolean;

  // Frame rate
  frameRate: number;

  // Otras características
  features: {
    promptOptimizer?: boolean;
    negativePrompt?: boolean;
    cfgScale?: boolean;
    imageToVideo?: boolean;
  };

  // Pricing (costo por segundo)
  costPerSecond: number;
  costPerSecondWithAudio?: number;

  // Endpoint de fal.ai
  endpoint: string;

  // Descripción del modelo
  description: string;
}

export const MODEL_CONFIG: Record<VideoModel, ModelConstraints> = {
  'veo3': {
    allowedDurations: [4, 6, 8],
    defaultDuration: 8,
    allowedResolutions: ['720p', '1080p'],
    defaultResolution: '720p',
    allowedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    supportsAudio: true,
    frameRate: 24,
    features: {
      promptOptimizer: true,
      imageToVideo: true,
    },
    costPerSecond: 0.50,
    costPerSecondWithAudio: 0.75,
    endpoint: 'fal-ai/veo3',
    description: 'High-quality video generation with optional audio/music integration'
  },

  'veo3-fast': {
    allowedDurations: [4, 6, 8],
    defaultDuration: 6,
    allowedResolutions: ['720p', '1080p'],
    defaultResolution: '720p',
    allowedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    supportsAudio: true,
    frameRate: 24,
    features: {
      promptOptimizer: true,
      imageToVideo: true,
    },
    costPerSecond: 0.25,
    costPerSecondWithAudio: 0.40,
    endpoint: 'fal-ai/veo3/fast',
    description: 'Fast video generation with optional audio'
  },

  'hailuo-standard': {
    allowedDurations: [6, 10],
    defaultDuration: 6,
    allowedResolutions: ['768p'],
    defaultResolution: '768p',
    allowedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    supportsAudio: false,
    frameRate: 24,
    features: {
      promptOptimizer: true,
      imageToVideo: true,
    },
    costPerSecond: 0.045,
    endpoint: 'fal-ai/minimax/hailuo-02/standard/text-to-video',
    description: 'Budget-friendly cinematic video generation (768p)'
  },

  'hailuo-pro': {
    allowedDurations: [6, 10],
    defaultDuration: 6,
    allowedResolutions: ['1080p'],
    defaultResolution: '1080p',
    allowedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    supportsAudio: false,
    frameRate: 24,
    features: {
      promptOptimizer: true,
      imageToVideo: true,
    },
    costPerSecond: 0.08,
    endpoint: 'fal-ai/minimax/hailuo-02/pro/text-to-video',
    description: 'Premium cinematic video generation (1080p)'
  },

  'kling': {
    allowedDurations: [5, 10],
    defaultDuration: 5,
    allowedResolutions: ['720p', '1080p'],
    defaultResolution: '1080p',
    allowedAspectRatios: ['16:9', '9:16', '1:1'],
    defaultAspectRatio: '16:9',
    supportsAudio: false,
    frameRate: 30,
    features: {
      negativePrompt: true,
      cfgScale: true,
      imageToVideo: true,
    },
    costPerSecond: 0.28,
    endpoint: 'fal-ai/kling-video/v2/master/text-to-video',
    description: 'Hyper-realistic video generation with advanced controls'
  }
};

/**
 * Valida y ajusta la duración según las restricciones del modelo
 */
export function validateDuration(model: VideoModel, requestedDuration: number): number {
  const config = MODEL_CONFIG[model];

  // Si la duración solicitada es permitida, retornarla
  if (config.allowedDurations.includes(requestedDuration)) {
    return requestedDuration;
  }

  // Si no, encontrar la duración más cercana permitida
  const closest = config.allowedDurations.reduce((prev, curr) => {
    return Math.abs(curr - requestedDuration) < Math.abs(prev - requestedDuration) ? curr : prev;
  });

  console.log(`⚠️ ${model}: Duration ${requestedDuration}s no permitida. Ajustando a ${closest}s`);
  console.log(`   Duraciones permitidas: ${config.allowedDurations.join(', ')}s`);

  return closest;
}

/**
 * Valida y ajusta la resolución según las restricciones del modelo
 */
export function validateResolution(model: VideoModel, requestedResolution: string): string {
  const config = MODEL_CONFIG[model];

  if (config.allowedResolutions.includes(requestedResolution)) {
    return requestedResolution;
  }

  console.log(`⚠️ ${model}: Resolution ${requestedResolution} no permitida. Usando default: ${config.defaultResolution}`);
  return config.defaultResolution;
}

/**
 * Valida y ajusta el aspect ratio según las restricciones del modelo
 */
export function validateAspectRatio(
  model: VideoModel,
  requestedRatio: '16:9' | '9:16' | '1:1' | 'auto'
): '16:9' | '9:16' | '1:1' | 'auto' {
  const config = MODEL_CONFIG[model];

  if (config.allowedAspectRatios.includes(requestedRatio)) {
    return requestedRatio;
  }

  console.log(`⚠️ ${model}: Aspect ratio ${requestedRatio} no permitido. Usando default: ${config.defaultAspectRatio}`);
  return config.defaultAspectRatio;
}

/**
 * Calcula el costo estimado de generación
 */
export function calculateCost(
  model: VideoModel,
  duration: number,
  includeAudio: boolean = false
): number {
  const config = MODEL_CONFIG[model];

  if (includeAudio && config.costPerSecondWithAudio) {
    return duration * config.costPerSecondWithAudio;
  }

  return duration * config.costPerSecond;
}

/**
 * Obtiene información completa del modelo
 */
export function getModelInfo(model: VideoModel): ModelConstraints {
  return MODEL_CONFIG[model];
}
