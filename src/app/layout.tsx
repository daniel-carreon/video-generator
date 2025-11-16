import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import '../shared/styles/globals.css';
import PasswordGate from './password-gate';
import PWAInstallPrompt from '@/shared/components/PWAInstallPrompt';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Video Generator AI',
  description: 'Plataforma de generación de videos con Inteligencia Artificial - Crea videos profesionales desde texto o imágenes',
  applicationName: 'Video Generator AI',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Video Gen',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Video Generator AI',
    title: 'Video Generator AI',
    description: 'Crea videos profesionales con IA',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Video Generator AI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Video Generator AI',
    description: 'Crea videos profesionales con IA',
    images: ['/logo.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#8b5cf6',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono antialiased" suppressHydrationWarning>
        <PasswordGate>
          <main>{children}</main>
        </PasswordGate>
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
