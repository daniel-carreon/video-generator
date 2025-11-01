# 🎬 Video Generator AI

**Plataforma de generación de videos con Inteligencia Artificial** - Crea videos profesionales desde texto o imágenes usando los modelos de IA más avanzados del mercado.

## 📖 Tabla de Contenidos

- [¿Qué es Video Generator?](#-qué-es-video-generator)
- [Características Principales](#-características-principales)
- [Modelos de IA Disponibles](#-modelos-de-ia-disponibles)
- [Guía de Configuración Completa](#-guía-de-configuración-completa)
- [Estructura de Base de Datos](#-estructura-de-base-de-datos)
- [Comandos Disponibles](#-comandos-disponibles)
- [Resolución de Problemas](#-resolución-de-problemas)
- [Información de Costos](#-información-de-costos)
- [Seguridad](#-seguridad)
- [Tech Stack](#-tech-stack)

---

## 🎯 ¿Qué es Video Generator?

Video Generator es una aplicación web que te permite crear videos profesionales usando Inteligencia Artificial. Simplemente describe lo que quieres ver en texto, y la IA generará un video de alta calidad en segundos.

**Casos de uso:**
- 🎨 Crear contenido para redes sociales
- 📚 Generar material educativo visual
- 🎬 Prototipar ideas para proyectos audiovisuales
- 🖼️ Convertir imágenes estáticas en videos animados
- 💡 Experimentar con ideas creativas sin necesidad de cámaras o equipo

---

## ✨ Características Principales

- **🤖 Chat con IA**: Habla con un asistente inteligente que te ayuda a generar videos
- **🎨 5 Modelos de IA**: Elige entre diferentes modelos según tus necesidades (calidad, velocidad, precio)
- **📐 Múltiples Formatos**: Vertical (9:16), horizontal (16:9), cuadrado (1:1)
- **🎵 Audio Integrado**: Algunos modelos generan audio automáticamente
- **💾 Guardado Automático**: Todos tus videos se guardan en la nube
- **💰 Seguimiento de Costos**: Ve cuánto gastas en cada generación
- **🎨 Estilos Personalizados**: Guarda tus prompts favoritos como "estilos" reutilizables
- **📊 Analytics**: Dashboard con estadísticas de uso y gastos

---

## 🎥 Modelos de IA Disponibles

### 1. **Hailuo 02 Standard** ⭐ (Recomendado - Más económico)
- **Calidad**: 768p cinematográfica
- **Duración**: 5 segundos
- **Costo**: $0.045 USD/segundo (~$0.23/video)
- **Mejor para**: Contenido general, pruebas, producción en masa

### 2. **Hailuo 02 Pro**
- **Calidad**: 1080p cinematográfica
- **Duración**: 5 segundos
- **Costo**: $0.08 USD/segundo (~$0.40/video)
- **Mejor para**: Contenido premium, proyectos importantes

### 3. **Google Veo 3**
- **Calidad**: 720p con audio
- **Duración**: Hasta 8 segundos
- **Costo**: $0.50 USD/segundo (~$4.00/video de 8s)
- **Mejor para**: Videos con audio integrado, alta fidelidad

### 4. **Google Veo 3 Fast**
- **Calidad**: 720p con audio (generación rápida)
- **Duración**: Hasta 8 segundos
- **Costo**: $0.25 USD/segundo (~$2.00/video de 8s)
- **Mejor para**: Prototipos rápidos con audio

### 5. **Kling Video 1.6**
- **Calidad**: Hiperrealista, image-to-video
- **Duración**: 5-10 segundos
- **Costo**: $0.28 USD/segundo (~$1.40-$2.80/video)
- **Mejor para**: Animar imágenes, resultados ultra realistas

---

## 🚀 Guía de Configuración Completa

Esta guía está diseñada para **usuarios sin conocimientos técnicos**. Sigue cada paso en orden.

### ⏱️ Tiempo estimado: 30 minutos

---

### 📋 Paso 1: Requisitos Previos

Antes de comenzar, necesitas:

- ✅ **Computadora** con macOS, Windows o Linux
- ✅ **Navegador web** (Chrome, Firefox, Safari, Edge)
- ✅ **Conexión a internet** estable
- ✅ **Cuenta de Gmail** (para crear cuentas en los servicios)
- ✅ **Tarjeta de crédito/débito** (solo para servicios de IA - tienen planes gratuitos iniciales)

#### Instalar Node.js (si no lo tienes)

1. Ve a [https://nodejs.org](https://nodejs.org)
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador y sigue los pasos
4. Verifica la instalación abriendo una terminal y ejecutando:
   ```bash
   node --version
   npm --version
   ```
   Deberías ver algo como `v18.17.0` y `9.0.0` o superior.

---

### 📦 Paso 2: Descargar el Proyecto

#### Opción A: Desde GitHub (si tienes git)
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd video-generator
```

#### Opción B: Descarga directa
1. Descarga el archivo ZIP del proyecto
2. Descomprime en una carpeta de tu elección
3. Abre una terminal en esa carpeta

---

### 🔐 Paso 3: Crear Cuentas en Servicios Externos

Este proyecto usa **3 servicios externos**. Necesitas crear cuentas y obtener "API Keys" (llaves de acceso).

#### 3.1. Supabase (Base de Datos) 🗄️

**¿Qué es?** Base de datos en la nube donde se guardan tus videos, conversaciones y costos.

**Costo:** GRATIS hasta 500 MB de almacenamiento y 50,000 usuarios activos/mes.

**Pasos:**
1. Ve a [https://supabase.com](https://supabase.com)
2. Click en "Start your project" → "Sign in with GitHub/Google"
3. Click en "New Project"
4. Rellena:
   - **Name**: `video-generator` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura y guárdala
   - **Region**: Selecciona el más cercano a ti
   - **Pricing Plan**: Free
5. Click en "Create new project" (tarda ~2 minutos)
6. Una vez creado, ve a **Settings** (engranaje) → **API**
7. Copia y guarda estos 2 valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (es un texto largo)

**❗ No compartas estas llaves con nadie.**

---

#### 3.2. FAL AI (Generación de Videos) 🎥

**¿Qué es?** Servicio que genera los videos usando modelos de IA.

**Costo:** Pago por uso. ~$0.045-$0.50 USD por segundo de video (ver tabla de modelos arriba).

**Pasos:**
1. Ve a [https://fal.ai](https://fal.ai)
2. Click en "Sign In" → Usa tu cuenta de Google/GitHub
3. Ve a **Dashboard** → **API Keys**
4. Click en "Create new key"
5. Dale un nombre: `video-generator`
6. Copia la API Key que se genera: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
7. **⚠️ Guárdala inmediatamente** - solo se muestra una vez

**💰 Recarga de Créditos:**
- Ve a "Billing" en el dashboard
- Añade $5-10 USD para empezar (suficiente para ~20-200 videos dependiendo del modelo)

---

#### 3.3. OpenRouter (Chat con IA) 💬

**¿Qué es?** Servicio que permite usar Claude (el modelo de chat que orquesta la generación de videos).

**Costo:** ~$0.003 USD por mensaje (~$0.01-0.05 por conversación típica).

**Pasos:**
1. Ve a [https://openrouter.ai](https://openrouter.ai)
2. Click en "Sign In" → Usa tu cuenta de Google/GitHub
3. Ve a **Keys** en el menú superior
4. Click en "Create Key"
5. Dale un nombre: `video-generator`
6. Copia la API Key: `sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx`
7. **⚠️ Guárdala inmediatamente**

**💰 Recarga de Créditos:**
- Ve a "Credits" en el menú
- Añade $5 USD para empezar (suficiente para cientos de conversaciones)

---

### ⚙️ Paso 4: Configurar Variables de Entorno

Las "variables de entorno" son donde guardas las llaves que acabas de crear.

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Abre `.env.local`** con tu editor de texto favorito (VS Code, Sublime, Notepad++, etc.)

3. **Rellena los valores** que copiaste en el Paso 3:

```bash
# === CONFIGURACIÓN OBLIGATORIA ===

# 1. Supabase (Base de Datos)
# Copia los valores de: Settings → API en Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. FAL AI (Generación de Videos)
# Copia el valor de: Dashboard → API Keys en FAL AI
FAL_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 3. OpenRouter (Chat con IA)
# Copia el valor de: Keys en OpenRouter
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx

# === CONFIGURACIÓN OPCIONAL ===

# Contraseña para acceder a la app (puedes cambiarla)
NEXT_PUBLIC_APP_PASSWORD=123321

# Nombre de tu aplicación
NEXT_PUBLIC_APP_NAME="Video Generator AI"

# Debug mode (true = ver logs detallados en consola)
NEXT_PUBLIC_ENABLE_DEBUG=false

# Habilitar chat agent
NEXT_PUBLIC_ENABLE_CHAT_AGENT=true

# Máximo de videos a mostrar en lista
NEXT_PUBLIC_MAX_VIDEOS=10

# Duración por defecto (segundos)
NEXT_PUBLIC_DEFAULT_DURATION=5

# Resolución por defecto
NEXT_PUBLIC_DEFAULT_RESOLUTION=720p
```

4. **Guarda el archivo** (Ctrl+S / Cmd+S)

**⚠️ IMPORTANTE:**
- **NUNCA** compartas este archivo con nadie
- **NUNCA** lo subas a GitHub o servicios públicos
- Ya está protegido por `.gitignore`, pero revisa siempre antes de hacer `git add`

---

### 📊 Paso 5: Configurar la Base de Datos

Ahora vas a crear las tablas necesarias en Supabase.

#### 5.1. Acceder al SQL Editor de Supabase

1. Abre [https://supabase.com](https://supabase.com) → Tu proyecto
2. En el menú lateral, click en **SQL Editor** (ícono de base de datos)
3. Click en "New query"

#### 5.2. Ejecutar Migración 1 (Tabla de Usuarios)

1. Abre el archivo `supabase/migrations/001_initial_schema.sql` en tu editor
2. **Copia todo el contenido**
3. **Pega** en el SQL Editor de Supabase
4. Click en **"Run"** (botón abajo a la derecha)
5. Deberías ver: `Success. No rows returned`

#### 5.3. Ejecutar Migración 2 (Tablas de Videos, Conversaciones, Costos)

1. Abre el archivo `supabase/migrations/002_complete_schema.sql` en tu editor
2. **Copia todo el contenido**
3. **Pega** en el SQL Editor de Supabase
4. Click en **"Run"**
5. Deberías ver: `Success. No rows returned`

#### 5.4. Verificar que todo funciona

1. En Supabase, ve a **Table Editor** (menú lateral)
2. Deberías ver estas 6 tablas:
   - ✅ `users`
   - ✅ `generated_videos`
   - ✅ `conversations`
   - ✅ `messages`
   - ✅ `video_costs`
   - ✅ `styles`

**Si ves las 6 tablas, ¡felicidades! La base de datos está lista.**

---

### 📦 Paso 6: Instalar Dependencias

Las dependencias son librerías de código que el proyecto necesita para funcionar.

```bash
npm install
```

Este comando descargará ~200-300 MB de archivos. **Tarda ~2-5 minutos** dependiendo de tu internet.

**Posibles errores:**
- ❌ `npm: command not found` → No instalaste Node.js (vuelve al Paso 1)
- ❌ `EACCES: permission denied` → Ejecuta con `sudo npm install` (solo en Mac/Linux)

---

### 🚀 Paso 7: Iniciar la Aplicación

¡Momento de la verdad!

```bash
npm run dev
```

**Lo que verás:**
```
> video-generator@0.1.0 dev
> node scripts/dev-server.js

🔍 Checking available ports...
✅ Starting Next.js on port 3000

▲ Next.js 15.1.4
- Local:        http://localhost:3000
- Network:      http://192.168.1.X:3000

✓ Ready in 3.2s
```

**¿Qué significa?**
- La aplicación está corriendo en `http://localhost:3000`
- Abre ese link en tu navegador

---

### 🎉 Paso 8: Verificación Final

#### Checklist de Verificación

```
✅ Verificaciones Básicas:
[ ] La página carga sin errores
[ ] Aparece un campo de contraseña (escribe: 123321)
[ ] Después de la contraseña, ves la interfaz principal
[ ] En la consola del navegador (F12) no hay errores críticos

✅ Verificaciones de Funcionalidad:
[ ] El chat responde cuando escribes un mensaje
[ ] Puedes generar un video de prueba
[ ] El video se muestra en la lista después de generarse
[ ] El costo se registra en Analytics

✅ Verificaciones de Base de Datos:
[ ] En Supabase → Table Editor → generated_videos aparece tu video
[ ] En Supabase → Table Editor → conversations aparece tu chat
[ ] En Supabase → Table Editor → video_costs aparece el costo
```

**Si todas las verificaciones pasan, ¡la configuración fue exitosa!** 🎊

---

## 🗃️ Estructura de Base de Datos

### Diagrama de Relaciones

```
users (👤 Usuarios)
  ↓
conversations (💬 Conversaciones de chat)
  ↓
messages (📝 Mensajes individuales)
  ↓
generated_videos (🎬 Videos generados)
  ↓
video_costs (💰 Costos asociados)

styles (🎨 Estilos guardados) - Independiente
```

### Tablas Principales

#### 1. `users` (Usuarios)
Almacena información de usuarios registrados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del usuario |
| `email` | TEXT | Email del usuario (único) |
| `name` | TEXT | Nombre del usuario |
| `avatar` | TEXT | URL del avatar (opcional) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

#### 2. `generated_videos` (Videos Generados)
Almacena metadatos de todos los videos creados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del registro |
| `video_id` | TEXT | ID del video (único) |
| `fal_url` | TEXT | URL original de FAL AI |
| `supabase_url` | TEXT | URL en Supabase (si se guarda copia) |
| `prompt` | TEXT | Prompt usado para generar |
| `duration` | INTEGER | Duración en segundos |
| `resolution` | TEXT | Resolución (720p, 1080p, etc.) |
| `aspect_ratio` | TEXT | Ratio (16:9, 9:16, 1:1) |
| `model_used` | TEXT | Modelo de IA usado |
| `seed` | INTEGER | Semilla aleatoria (para reproducir) |
| `generation_session` | UUID | ID de conversación asociada |
| `tags` | TEXT[] | Etiquetas/categorías |
| `metadata` | JSONB | Metadatos adicionales |
| `is_favorite` | BOOLEAN | ¿Es favorito? |
| `created_at` | TIMESTAMP | Fecha de creación |

#### 3. `conversations` (Conversaciones)
Almacena sesiones de chat con el agente de IA.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único de la conversación |
| `conversation_id` | TEXT | ID de conversación (único) |
| `title` | TEXT | Título de la conversación |
| `metadata` | JSONB | Metadatos adicionales |
| `is_favorite` | BOOLEAN | ¿Es favorita? |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

#### 4. `messages` (Mensajes)
Almacena cada mensaje individual en las conversaciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del mensaje |
| `message_id` | TEXT | ID del mensaje (único) |
| `conversation_id` | UUID | Conversación a la que pertenece |
| `role` | TEXT | Rol: `user`, `assistant`, `tool` |
| `content` | TEXT | Contenido del mensaje |
| `tool_called` | TEXT | Nombre de la función llamada (si aplica) |
| `tool_result` | JSONB | Resultado de la función |
| `metadata` | JSONB | Metadatos adicionales |
| `created_at` | TIMESTAMP | Fecha de creación |

#### 5. `video_costs` (Costos de Videos)
Rastrea el costo de cada video generado.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del registro |
| `video_id` | TEXT | ID del video asociado |
| `model` | TEXT | Modelo usado |
| `duration` | INTEGER | Duración en segundos |
| `cost_per_second` | DECIMAL | Costo por segundo (USD) |
| `total_cost` | DECIMAL | Costo total (USD) |
| `include_audio` | BOOLEAN | ¿Incluye audio? |
| `resolution` | TEXT | Resolución |
| `aspect_ratio` | TEXT | Ratio |
| `created_at` | TIMESTAMP | Fecha de creación |

#### 6. `styles` (Estilos Guardados)
Almacena estilos/prompts reutilizables.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del estilo |
| `style_id` | TEXT | ID del estilo (único) |
| `name` | TEXT | Nombre del estilo |
| `description` | TEXT | Descripción |
| `prompt` | TEXT | Prompt base |
| `image_url` | TEXT | URL de imagen de referencia |
| `thumbnail_url` | TEXT | URL del thumbnail |
| `preferred_model` | TEXT | Modelo preferido |
| `preferred_duration` | INTEGER | Duración preferida |
| `preferred_resolution` | TEXT | Resolución preferida |
| `preferred_aspect_ratio` | TEXT | Ratio preferido |
| `tags` | TEXT[] | Etiquetas |
| `metadata` | JSONB | Metadatos |
| `is_favorite` | BOOLEAN | ¿Es favorito? |
| `use_count` | INTEGER | Veces usado |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

---

## 🛠️ Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo (auto-detecta puerto disponible 3000-3006)
npm run dev

# Iniciar en puerto específico 3000 (manual)
npm run dev:manual

# Limpiar caché y reiniciar
npm run dev:clean

# Build para producción
npm run build

# Iniciar servidor de producción
npm run start

# Preview del build
npm run preview
```

### Calidad de Código

```bash
# Ejecutar linter (ESLint)
npm run lint

# Auto-corregir problemas de linting
npm run lint:fix

# Verificar tipos de TypeScript
npm run typecheck

# Formatear código con Prettier
npm run format
```

### Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch (se re-ejecutan al guardar)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

---

## 🔧 Resolución de Problemas

### Error: "EADDRINUSE - Puerto Ocupado"

**Síntoma:** El servidor no inicia y muestra error de puerto ocupado.

**Solución:**
1. El script `npm run dev` debería auto-detectar puertos disponibles (3000-3006)
2. Si sigue fallando, verifica qué proceso está usando el puerto:
   ```bash
   # macOS/Linux
   lsof -i :3000

   # Windows
   netstat -ano | findstr :3000
   ```
3. Mata el proceso:
   ```bash
   # macOS/Linux
   kill -9 <PID>

   # Windows
   taskkill /PID <PID> /F
   ```

---

### Error: "Supabase credentials are missing"

**Síntoma:** En consola del navegador ves advertencia sobre credenciales de Supabase.

**Solución:**
1. Verifica que `.env.local` existe
2. Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están completos
3. Reinicia el servidor: Ctrl+C en terminal, luego `npm run dev`

---

### Error: "Failed to generate video"

**Síntoma:** Al intentar generar un video, sale error.

**Posibles causas:**

#### 1. FAL_KEY inválida o sin créditos
- Ve a [https://fal.ai/dashboard](https://fal.ai/dashboard) → Billing
- Verifica que tienes créditos disponibles
- Verifica que la API Key es correcta en `.env.local`

#### 2. Prompt muy largo
- Los prompts tienen límite de ~2000 caracteres
- Reduce la longitud del prompt

#### 3. Parámetros inválidos
- Algunos modelos tienen restricciones (ej: duración máxima)
- Revisa la tabla de modelos arriba para los límites

---

### Error: "Network request failed" en Chat

**Síntoma:** El chat no responde o sale error de red.

**Solución:**
1. Verifica `OPENROUTER_API_KEY` en `.env.local`
2. Ve a [https://openrouter.ai](https://openrouter.ai) → Credits
3. Verifica que tienes créditos disponibles
4. Revisa la consola del navegador (F12) para más detalles

---

### Error: "Failed to save video to database"

**Síntoma:** El video se genera pero no se guarda en Supabase.

**Solución:**
1. Ve a Supabase → Table Editor
2. Verifica que la tabla `generated_videos` existe
3. Verifica que las RLS policies están habilitadas (deberían estar por defecto)
4. Revisa la consola del navegador (F12) para ver el error exacto
5. Si dice "relation does not exist", ejecuta las migraciones de nuevo (Paso 5)

---

### La aplicación carga pero está "en blanco"

**Posibles causas:**

#### 1. JavaScript deshabilitado
- Habilita JavaScript en tu navegador

#### 2. Error en consola
- Abre las DevTools (F12)
- Ve a la pestaña "Console"
- Busca errores en rojo
- Copia el error y búscalo en Google o repórtalo

#### 3. Puerto incorrecto
- Verifica que estás accediendo a `http://localhost:3000` (o el puerto que muestra la terminal)

---

## 💰 Información de Costos

### Costos Estimados por Uso

#### Escenario 1: Uso Casual (5 videos/semana)
- **Modelo**: Hailuo 02 Standard
- **Videos**: 5 videos de 5s
- **Conversaciones**: ~10 mensajes/semana
- **Costo mensual**: ~$5 USD
  - Videos: 20 videos × $0.23 = $4.60
  - Chat: 40 mensajes × $0.003 = $0.12
  - Supabase: GRATIS

#### Escenario 2: Creador de Contenido (30 videos/semana)
- **Modelo**: Hailuo 02 Standard + Veo 3 ocasional
- **Videos**: 120 videos/mes standard + 10 premium
- **Conversaciones**: ~100 mensajes/semana
- **Costo mensual**: ~$70 USD
  - Videos standard: 120 × $0.23 = $27.60
  - Videos premium: 10 × $4.00 = $40.00
  - Chat: 400 mensajes × $0.003 = $1.20
  - Supabase: GRATIS (si <500MB storage)

#### Escenario 3: Producción Profesional (100+ videos/semana)
- **Modelo**: Mixto (Hailuo Pro + Kling)
- **Videos**: 400 videos/mes
- **Conversaciones**: ~300 mensajes/semana
- **Costo mensual**: ~$200-300 USD
  - Videos: 400 × $0.40-0.70 (promedio) = $160-280
  - Chat: 1200 mensajes × $0.003 = $3.60
  - Supabase: $25/mes (plan Pro recomendado)

### Cómo Reducir Costos

1. **Usa Hailuo 02 Standard** para pruebas y contenido general ($0.045/s)
2. **Reserva modelos premium** (Veo 3, Kling) para proyectos finales
3. **Reutiliza prompts** usando la función de "Estilos"
4. **Ajusta la duración** - videos más cortos cuestan menos
5. **Monitorea en Analytics** - revisa tus gastos regularmente

---

## 🔒 Seguridad

### ⚠️ Reglas Críticas de Seguridad

#### 1. NUNCA Compartas Estos Archivos:
- ❌ `.env.local`
- ❌ `.env.production`
- ❌ `.env.vercel`
- ❌ Cualquier archivo con extensión `.env.*` excepto `.env.example`

#### 2. NUNCA Subas a GitHub:
El archivo `.gitignore` ya está configurado para proteger tus credenciales, pero **siempre verifica** antes de hacer `git add`:

```bash
# Antes de hacer commit, verifica qué archivos se subirán:
git status

# Si ves .env.local o .env.production, ¡DETENTE!
# NO hagas git add ni git commit
```

#### 3. Rotación de Llaves

Si accidentalmente expones una API Key:

**FAL AI:**
1. Ve a [https://fal.ai/dashboard](https://fal.ai/dashboard) → API Keys
2. Click en "Revoke" en la llave expuesta
3. Crea una nueva llave
4. Actualiza `.env.local`

**OpenRouter:**
1. Ve a [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Click en "Delete" en la llave expuesta
3. Crea una nueva llave
4. Actualiza `.env.local`

**Supabase:**
1. Ve a Supabase → Settings → API
2. Click en "Regenerate" en la llave expuesta
3. Actualiza `.env.local`
4. **⚠️ Esto romperá apps en producción** - actualiza primero en producción

#### 4. Contraseña de la App

Por defecto, la app está protegida con password `123321`.

**Cambiar la contraseña:**
1. Abre `.env.local`
2. Modifica `NEXT_PUBLIC_APP_PASSWORD=tu_nueva_contraseña`
3. Reinicia el servidor

**Deshabilitar password gate:**
```typescript
// src/app/password-gate.tsx
// Comenta la línea:
// if (!isAuthenticated) { return <PasswordForm /> }
```

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1.4 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.3
- **State Management**: Zustand 4.4
- **Icons**: Lucide React
- **Utilities**:
  - `clsx` + `tailwind-merge` (class management)
  - `class-variance-authority` (variant styling)

### Backend & APIs
- **Database**: PostgreSQL via Supabase
- **ORM**: Supabase JS Client
- **Video Generation**: FAL AI
- **Chat Agent**: OpenRouter (Claude 3.5 Sonnet)
- **Schema Validation**: Zod 3.22

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 8.52
- **Formatting**: Prettier 3.1
- **Testing**: Jest 29.7 + React Testing Library
- **Type Checking**: TypeScript Compiler

### Infrastructure
- **Deployment**: Vercel (recomendado)
- **File Storage**: Supabase Storage
- **CDN**: Automático via Vercel/Supabase

---

## 📁 Estructura del Proyecto

```
video-generator/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Rutas principales
│   │   ├── api/                      # API Routes
│   │   │   ├── videos/               # Generación y gestión de videos
│   │   │   ├── chat/                 # Chat agent endpoint
│   │   │   ├── conversations/        # CRUD de conversaciones
│   │   │   └── analytics/            # Endpoints de analytics
│   │   ├── layout.tsx                # Layout principal
│   │   ├── page.tsx                  # Página de inicio
│   │   └── password-gate.tsx         # Protección con contraseña
│   │
│   ├── features/                     # Arquitectura Feature-First
│   │   ├── chat/                     # Chat con IA
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   └── types/
│   │   │
│   │   ├── video-generation/         # Generación de videos
│   │   │   ├── config/
│   │   │   │   └── modelConfig.ts    # Configuración de modelos FAL
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   ├── analytics/                # Analytics y costos
│   │   └── styles/                   # Estilos personalizados
│   │
│   └── shared/                       # Código reutilizable
│       ├── components/               # UI components
│       ├── hooks/                    # Hooks genéricos
│       ├── lib/                      # Configuraciones
│       │   ├── supabase.ts
│       │   ├── env.ts
│       │   └── promptCompression.ts
│       ├── stores/                   # Estado global
│       ├── types/                    # Tipos compartidos
│       └── utils/                    # Utilidades
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql    # Tabla users
│       └── 002_complete_schema.sql   # Tablas principales
│
├── scripts/
│   └── dev-server.js                 # Auto-detección de puertos
│
├── public/                           # Archivos estáticos
├── .env.example                      # Plantilla de variables
├── .env.local                        # Variables locales (NO commitar)
├── .gitignore                        # Archivos ignorados por git
├── package.json                      # Dependencias y scripts
├── tsconfig.json                     # Configuración TypeScript
├── next.config.js                    # Configuración Next.js
├── tailwind.config.ts                # Configuración Tailwind
├── jest.config.js                    # Configuración Jest
├── CLAUDE.md                         # Documentación para desarrollo
└── README.md                         # Este archivo
```

---

## 🤝 Contribuir

### Workflow de Git

1. **Fork el proyecto** (si es público) o clona directamente
2. **Crea una branch** para tu feature:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```
3. **Haz tus cambios** siguiendo las convenciones de código
4. **Ejecuta las verificaciones**:
   ```bash
   npm run lint:fix
   npm run typecheck
   npm run test
   ```
5. **Commit con Conventional Commits**:
   ```bash
   git commit -m "feat(scope): descripción breve"
   ```
   Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

6. **Push y crea Pull Request**

### Convenciones de Código

- **Archivos**: `kebab-case.tsx`
- **Componentes**: `PascalCase`
- **Funciones/Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Máximo 500 líneas** por archivo
- **Máximo 50 líneas** por función
- **Siempre definir tipos** en TypeScript

---

## 📞 Soporte

### Documentación Adicional

- 📖 **Arquitectura**: Ver [`.claude/docs/ARCHITECTURE.md`](./.claude/docs/ARCHITECTURE.md)
- 🧑‍💻 **Guía de Desarrollo**: Ver [`CLAUDE.md`](./CLAUDE.md)
- 🔧 **Configuración de Modelos**: Ver [`src/features/video-generation/config/modelConfig.ts`](src/features/video-generation/config/modelConfig.ts)

### Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

1. **Verifica** que no exista ya un issue similar
2. **Crea un issue** con:
   - Descripción del problema
   - Pasos para reproducir
   - Capturas de pantalla (si aplica)
   - Logs de error (de consola del navegador)
   - Tu entorno (OS, navegador, versión de Node)

---

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

---

## 🎉 ¡Listo para Crear Videos!

Si seguiste todos los pasos, tu aplicación debería estar funcionando perfectamente.

**Primeros pasos recomendados:**

1. 🎬 **Genera tu primer video** usando el modelo Hailuo 02 Standard
2. 💬 **Prueba el chat** haciendo preguntas al asistente
3. 🎨 **Crea un estilo** guardando un prompt que te guste
4. 📊 **Revisa Analytics** para ver tus costos
5. ⭐ **Marca favoritos** los videos que más te gusten

**¿Necesitas inspiración para prompts?**

- "A serene sunrise over misty mountains, cinematic camera movement"
- "Underwater scene with colorful fish swimming through coral reefs"
- "Close-up of coffee being poured in slow motion, steam rising"
- "City skyline at night with cars moving on highways, time-lapse style"
- "Waves crashing on a rocky beach at sunset, dramatic lighting"

---

**Hecho con ❤️ usando Claude Code**

*Última actualización: 2025-11-01*
