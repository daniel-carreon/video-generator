/**
 * Application Constants
 */

export const APP_NAME = 'Video Generator';
export const APP_DESCRIPTION = 'AI-powered video generation platform';

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  MAIN: {
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    SETTINGS: '/settings',
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
