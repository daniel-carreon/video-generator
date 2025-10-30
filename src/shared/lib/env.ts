/**
 * Environment configuration helper
 * Detects the correct base URL for the application
 */

export function getBaseUrl(): string {
  // Browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Vercel production environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Explicit NEXT_PUBLIC_SITE_URL (fallback)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Local development
  return 'http://localhost:3000';
}

export function getApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}
