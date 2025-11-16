# 📱 PWA - Progressive Web App

## ✅ Configuración Completa

Este proyecto está completamente configurado como una Progressive Web App (PWA) compatible con iOS, Android y Desktop.

---

## 🎯 Características Implementadas

### ✅ Manifest.json
- [public/manifest.json](public/manifest.json)
- Configuración completa con:
  - Nombre: "Video Generator AI"
  - Nombre corto: "Video Gen"
  - Iconos en múltiples tamaños (192x192, 512x512, apple-touch-icon)
  - Tema: Morado (#8b5cf6)
  - Modo display: standalone
  - Shortcuts para acceso rápido
  - Soporte para screenshots

### ✅ Service Worker
- Implementado vía [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa)
- Configuración en [next.config.js](next.config.js:1)
- Estrategias de caché:
  - **CacheFirst**: Videos, imágenes, fuentes de Google
  - **StaleWhileRevalidate**: CSS, JS, imágenes locales
  - **NetworkFirst**: APIs, contenido dinámico

### ✅ Meta Tags iOS
- [src/app/layout.tsx](src/app/layout.tsx:13-64)
- Configuración completa de:
  - `apple-mobile-web-app-capable`
  - `apple-mobile-web-app-status-bar-style`
  - `apple-mobile-web-app-title`
  - `apple-touch-icon`
  - Viewport optimizado para móviles

### ✅ Iconos y Assets
Todos ubicados en `public/`:
- `logo.png` - Logo principal (512x512)
- `icon-192.png` - Ícono para Android (192x192)
- `icon-512.png` - Ícono para Android (512x512)
- `apple-touch-icon.png` - Ícono para iOS (180x180)
- `favicon.ico` - Favicon del navegador

### ✅ Componente de Instalación
- [src/shared/components/PWAInstallPrompt.tsx](src/shared/components/PWAInstallPrompt.tsx)
- Detecta automáticamente:
  - ✅ iOS vs Android
  - ✅ Si ya está instalado
  - ✅ Si el usuario rechazó la instalación antes
- Muestra instrucciones específicas para iOS
- Trigger automático para Android/Desktop

---

## 🚀 Cómo Usar

### Desarrollo Local

```bash
# El service worker está DESHABILITADO en desarrollo
npm run dev
```

**⚠️ Importante:** El service worker **NO** se activa en `development` para evitar problemas de caché durante el desarrollo.

---

### Build de Producción

```bash
# 1. Hacer build
npm run build

# 2. Preview local (con PWA habilitado)
npm run preview
```

Después del build, verás estos archivos generados en `public/`:
- `sw.js` - Service Worker principal
- `workbox-*.js` - Librerías de Workbox
- `sw.js.map` - Source maps

---

### Deploy a Producción

#### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git add .
git commit -m "feat(pwa): add PWA support"
git push origin main

# 2. Deploy automático en Vercel
# - Detecta automáticamente Next.js
# - Habilita HTTPS por defecto (requerido para PWA)
# - Service Worker funciona automáticamente
```

#### Netlify

```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Otros Hosts

Requisitos mínimos:
- ✅ HTTPS habilitado (obligatorio para PWA)
- ✅ Headers CORS correctos
- ✅ Servir archivos estáticos desde `public/`

---

## 📋 Checklist de Verificación

Usa esta checklist para verificar que tu PWA funciona correctamente:

### En Chrome Desktop (Lighthouse)

1. Abre DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Click en "Analyze page load"
5. **Target:** Mínimo 90/100

**Posibles issues:**
- ❌ "Does not register a service worker" → Verifica que esté en producción
- ❌ "Manifest doesn't have a maskable icon" → Opcional, no crítico
- ❌ "Page does not work offline" → Verifica estrategias de caché

---

### En iOS Safari

1. Abre Safari en iPhone/iPad
2. Ve a la URL de tu app
3. Toca el botón **Compartir** (⬆️)
4. Busca **"Agregar a pantalla de inicio"**
5. Si aparece → ✅ PWA configurado correctamente

**Verificaciones adicionales:**
- ✅ El ícono se ve correctamente
- ✅ El nombre es "Video Gen"
- ✅ Al abrir, aparece en pantalla completa (sin barra de Safari)

---

### En Android Chrome

1. Abre Chrome en Android
2. Ve a la URL de tu app
3. Debería aparecer un **banner automático**: "Agregar Video Gen a la pantalla de inicio"
4. Si aparece → ✅ PWA configurado correctamente

**Alternativa manual:**
- Menú (⋮) → "Agregar a la pantalla de inicio"

---

## 🔧 Personalización

### Cambiar Nombre de la App

**En manifest.json:**
```json
{
  "name": "Tu Nombre Largo",
  "short_name": "Nombre Corto"
}
```

**En layout.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Tu Nombre',
  appleWebApp: {
    title: 'Nombre Corto iOS',
  },
};
```

---

### Cambiar Color de Tema

**En manifest.json:**
```json
{
  "theme_color": "#8b5cf6",
  "background_color": "#0a0a0a"
}
```

**En layout.tsx:**
```typescript
export const viewport: Viewport = {
  themeColor: '#8b5cf6',
};
```

---

### Añadir Screenshots

1. Toma screenshots de tu app:
   - **Desktop:** 1920x1080 (landscape)
   - **Mobile:** 390x844 (portrait)

2. Guárdalos en `public/screenshots/`

3. Actualiza manifest.json:
```json
{
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

**Beneficio:** Mejora el preview en Android Play Store PWA y App Gallery.

---

### Modificar Estrategias de Caché

Edita [next.config.js](next.config.js:6-99):

```javascript
runtimeCaching: [
  {
    urlPattern: /^https:\/\/tu-api\.com\/api\/.*/i,
    handler: "NetworkFirst", // o "CacheFirst", "StaleWhileRevalidate"
    options: {
      cacheName: "mi-api-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hora
      },
    },
  },
]
```

**Handlers disponibles:**
- **NetworkFirst**: Intenta red primero, luego caché
- **CacheFirst**: Intenta caché primero, luego red
- **StaleWhileRevalidate**: Devuelve caché inmediatamente, actualiza en segundo plano
- **NetworkOnly**: Solo red, no caché
- **CacheOnly**: Solo caché, no red

---

## 🐛 Debugging

### Ver Service Worker Activo

**Chrome/Edge:**
1. DevTools → Application → Service Workers
2. Verifica estado: "activated and is running"

**Safari:**
1. Develop → Service Workers
2. Busca tu dominio

---

### Limpiar Caché

**Chrome/Edge:**
```
DevTools → Application → Storage → Clear site data
```

**Safari iOS:**
```
Ajustes → Safari → Borrar historial y datos de sitios web
```

**Programáticamente:**
```javascript
// En consola del navegador
await caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

---

### Logs del Service Worker

En production, añade a `next.config.js`:

```javascript
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: false, // Habilitar incluso en dev para testing
  // ... resto de config
});
```

Luego ve a:
```
DevTools → Console → Filter: "service worker"
```

---

## 📊 Optimizaciones Avanzadas

### 1. Precaching de Assets Críticos

Añade a `next.config.js`:

```javascript
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  // ... config existente
  buildExcludes: [/middleware-manifest.json$/],
  publicExcludes: ['!robots.txt', '!sitemap.xml'],
});
```

---

### 2. Background Sync

Para sincronizar datos cuando vuelva la conexión:

```typescript
// src/shared/utils/backgroundSync.ts
export async function registerBackgroundSync(tag: string) {
  if ('serviceWorker' in navigator && 'sync' in registration) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
  }
}
```

---

### 3. Push Notifications

Requiere configuración adicional en:
1. Service Worker
2. Backend (para enviar notificaciones)
3. Permisos del usuario

**Próximamente:** Guía completa de notificaciones push.

---

## 📚 Recursos Adicionales

### Documentación

- [Next.js PWA Guide](https://ducanh-next-pwa.vercel.app/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)

### Testing Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoría PWA
- [PWA Builder](https://www.pwabuilder.com/) - Validador y generador
- [Manifest Validator](https://manifest-validator.appspot.com/) - Validar manifest.json

### Guías de Instalación

- [iOS Installation Guide](docs/PWA_INSTALL_GUIDE.md)
- Android: Automático via Chrome
- Desktop: Automático via Chrome/Edge

---

## 🎯 Próximos Pasos

- [ ] Añadir screenshots a `public/screenshots/`
- [ ] Configurar notificaciones push
- [ ] Implementar background sync para uploads
- [ ] Añadir offline fallback page personalizado
- [ ] Optimizar tamaño de caché (actualmente ilimitado)

---

## ⚠️ Limitaciones Conocidas

### iOS Safari

- ❌ No soporta notificaciones push (limitación de Apple)
- ❌ No soporta background sync
- ❌ Límite de caché: ~50 MB (limpiado automáticamente si se llena)
- ⚠️ El ícono debe ser cuadrado sin transparencia

### Android Chrome

- ✅ Soporte completo de PWA
- ✅ Notificaciones push
- ✅ Background sync
- ⚠️ Algunos fabricantes (Xiaomi, Huawei) pueden matar el service worker agresivamente

### Desktop

- ✅ Soporte completo en Chrome/Edge
- ⚠️ Firefox no soporta instalación de PWA (solo bookmarks)
- ⚠️ Safari macOS soporta PWA desde macOS 11.3+ (limitado)

---

**¿Preguntas o problemas?**
- Revisa la [Guía de Instalación](docs/PWA_INSTALL_GUIDE.md)
- Verifica el [Checklist de Verificación](#-checklist-de-verificaci%C3%B3n)
- Consulta [Debugging](#-debugging)

---

*Configurado con ❤️ usando @ducanh2912/next-pwa*
