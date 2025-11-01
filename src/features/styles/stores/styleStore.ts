import { create } from 'zustand';
import { Style } from '../types';

interface StyleStore {
  styles: Style[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setStyles: (styles: Style[]) => void;
  addStyle: (style: Style) => void;
  updateStyle: (id: string, updates: Partial<Style>) => void;
  removeStyle: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useStyleStore = create<StyleStore>((set) => ({
  styles: [],
  isLoading: false,
  error: null,

  setStyles: (styles) => set({ styles, error: null }),

  addStyle: (style) =>
    set((state) => ({
      styles: [style, ...state.styles],
      error: null,
    })),

  updateStyle: (id, updates) =>
    set((state) => ({
      styles: state.styles.map((s) =>
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
      ),
    })),

  removeStyle: (id) =>
    set((state) => ({
      styles: state.styles.filter((s) => s.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clear: () =>
    set({
      styles: [],
      isLoading: false,
      error: null,
    }),
}));
