'use client';

import { useEffect, useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si es iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Detectar si ya está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Handler para el evento beforeinstallprompt (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostrar prompt solo si no ha sido rechazado antes
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Para iOS, mostrar instrucciones si no está instalado
    if (ios && !isInWebAppiOS && !localStorage.getItem('pwa-install-dismissed-ios')) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalada exitosamente');
      } else {
        console.log('Instalación de PWA rechazada');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error al instalar PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa-install-dismissed-ios', 'true');
    } else {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  // No mostrar si ya está instalado
  if (isInstalled) return null;

  // No mostrar si el usuario cerró el prompt
  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl shadow-2xl border border-purple-500/30 p-6">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-2">
              {isIOS ? '¡Instala la App!' : 'Instalar Video Generator AI'}
            </h3>

            {isIOS ? (
              <>
                <p className="text-purple-100 text-sm mb-4">
                  Instala esta app en tu iPhone para acceso rápido y funcionalidad offline.
                </p>
                <div className="bg-white/10 rounded-lg p-3 space-y-2">
                  <p className="text-white text-xs font-medium flex items-center gap-2">
                    <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px]">1</span>
                    Toca el botón de compartir <span className="inline-block">⬆️</span>
                  </p>
                  <p className="text-white text-xs font-medium flex items-center gap-2">
                    <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px]">2</span>
                    Selecciona "Agregar a pantalla de inicio"
                  </p>
                  <p className="text-white text-xs font-medium flex items-center gap-2">
                    <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px]">3</span>
                    Confirma tocando "Agregar"
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-purple-100 text-sm mb-4">
                  Accede más rápido y usa la app sin conexión.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-white hover:bg-purple-50 text-purple-600 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Instalar Ahora
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-purple-200 text-xs mt-4 text-center">
          Gratis • Sin descargas de App Store • Funciona offline
        </p>
      </div>
    </div>
  );
}
