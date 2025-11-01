import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import '../shared/styles/globals.css';
import PasswordGate from './password-gate';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Video Generator AI',
  description: 'Generate cinematic videos with AI - Powered by fal.ai',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono antialiased">
        <PasswordGate>
          <main>{children}</main>
        </PasswordGate>
      </body>
    </html>
  );
}
