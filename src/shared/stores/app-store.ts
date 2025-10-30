/**
 * App Global Store
 * Manages global application state
 */

import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  isDarkMode: boolean;
  setIsLoading: (value: boolean) => void;
  setIsDarkMode: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  isDarkMode: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
}));
