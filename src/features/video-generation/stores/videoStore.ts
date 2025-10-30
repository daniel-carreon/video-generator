import { create } from 'zustand';
import {
  VideoModel,
  VideoConfig,
  GeneratedVideo,
  GenerationStatus,
  MODEL_CATALOG
} from '../types';

interface VideoStore {
  // Estado de configuración
  config: VideoConfig;
  setConfig: (config: Partial<VideoConfig>) => void;
  resetConfig: () => void;

  // Estado de generación
  status: GenerationStatus;
  progress: string;
  error: string | null;

  // Videos generados
  videos: GeneratedVideo[];
  currentVideo: VideoGenerationResult | null;

  // Selección de videos (para combinar, etc.)
  selectedVideos: string[];
  toggleVideoSelection: (id: string) => void;
  clearSelection: () => void;

  // Acciones
  setStatus: (status: GenerationStatus) => void;
  setProgress: (progress: string) => void;
  setError: (error: string | null) => void;
  setCurrentVideo: (video: VideoGenerationResult | null) => void;
  addVideo: (video: GeneratedVideo) => void;
  setVideos: (videos: GeneratedVideo[]) => void;
  updateVideo: (id: string, updates: Partial<GeneratedVideo>) => void;
  deleteVideo: (id: string) => void;

  // Filtros
  filterByFavorites: boolean;
  filterByModel: VideoModel | null;
  setFilterByFavorites: (value: boolean) => void;
  setFilterByModel: (model: VideoModel | null) => void;
}

interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  resolution: string;
  seed: number;
  model: string;
  cost?: number;
}

const DEFAULT_CONFIG: VideoConfig = {
  model: 'hailuo-standard', // Default: más económico
  duration: 5,
  resolution: '768p',
  aspectRatio: '16:9',
  includeAudio: false,
  motionIntensity: 127
};

export const useVideoStore = create<VideoStore>((set) => ({
  // Configuración
  config: DEFAULT_CONFIG,
  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig }
    })),
  resetConfig: () => set({ config: DEFAULT_CONFIG }),

  // Estado de generación
  status: 'idle',
  progress: '',
  error: null,
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),

  // Videos
  videos: [],
  currentVideo: null,
  setCurrentVideo: (video) => set({ currentVideo: video }),
  addVideo: (video) =>
    set((state) => ({
      videos: [video, ...state.videos]
    })),
  setVideos: (videos) => set({ videos }),
  updateVideo: (id, updates) =>
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      )
    })),
  deleteVideo: (id) =>
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id)
    })),

  // Selección
  selectedVideos: [],
  toggleVideoSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedVideos.includes(id);
      return {
        selectedVideos: isSelected
          ? state.selectedVideos.filter((v) => v !== id)
          : [...state.selectedVideos, id]
      };
    }),
  clearSelection: () => set({ selectedVideos: [] }),

  // Filtros
  filterByFavorites: false,
  filterByModel: null,
  setFilterByFavorites: (value) => set({ filterByFavorites: value }),
  setFilterByModel: (model) => set({ filterByModel: model })
}));
