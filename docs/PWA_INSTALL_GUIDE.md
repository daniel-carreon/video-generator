# 📱 Guía de Instalación - PWA en iOS

## ¿Qué es una PWA?

Una **Progressive Web App (PWA)** es una aplicación web que se puede instalar en tu dispositivo y usar como si fuera una app nativa. No necesitas descargarla de la App Store - se instala directamente desde el navegador Safari.

## 🎯 Ventajas de Usar la PWA

✅ **Pantalla completa** - Sin barras del navegador
✅ **Acceso rápido** - Icono en tu pantalla de inicio
✅ **Funciona offline** - Usa caché para contenido básico
✅ **Notificaciones** - Recibe alertas cuando tus videos estén listos
✅ **Más rápida** - Carga instantánea con caché
✅ **Sin App Store** - Instalación directa desde Safari

---

## 📲 Cómo Instalar en iPhone/iPad

### Paso 1: Abrir en Safari

**⚠️ IMPORTANTE:** Solo funciona en Safari. Chrome o Firefox en iOS **NO** soportan instalación de PWAs.

1. Abre **Safari** en tu iPhone/iPad
2. Ve a la URL de la aplicación: `https://tu-dominio.com`
3. Espera a que la página cargue completamente

---

### Paso 2: Compartir la Página

1. Toca el ícono de **Compartir** en la barra inferior
   (Es un cuadrado con una flecha hacia arriba ⬆️)

![Safari Share Button](https://developer.apple.com/design/human-interface-guidelines/images/app-icons/app-icon-specifications/share-button_2x.png)

---

### Paso 3: Agregar a Pantalla de Inicio

1. En el menú que aparece, **desliza hacia abajo**
2. Busca la opción **"Agregar a pantalla de inicio"** o **"Add to Home Screen"**
3. Tócala

![Add to Home Screen](https://developer.apple.com/design/human-interface-guidelines/images/app-icons/app-icon-specifications/add-to-home-screen_2x.png)

---

### Paso 4: Personalizar y Confirmar

1. Verás una vista previa del ícono (tu logo morado con la "V")
2. El nombre sugerido será **"Video Gen"** - puedes cambiarlo si quieres
3. Toca **"Agregar"** en la esquina superior derecha

---

### Paso 5: ¡Listo!

La app ahora aparecerá en tu pantalla de inicio con el logo morado.

**Para abrirla:**
- Toca el ícono como cualquier otra app
- Se abrirá en pantalla completa sin las barras de Safari
- Funciona exactamente igual que la versión web, pero más rápida

---

## 🔧 Características de la PWA

### Funcionalidad Offline

La app guardará en caché:
- ✅ Interfaz principal
- ✅ Estilos CSS y fuentes
- ✅ Imágenes y logos
- ✅ JavaScript necesario para funcionar
- ✅ Tus últimas conversaciones y videos (si ya los viste)

**⚠️ Nota:** La generación de videos **SÍ requiere internet**, pero podrás ver el chat y videos previamente cargados.

---

### Actualizaciones Automáticas

Cuando actualizamos la app:
1. La PWA detectará automáticamente que hay una nueva versión
2. Descargará los cambios en segundo plano
3. Te pedirá recargar la próxima vez que la abras
4. ¡Todo sin descargar nada de la App Store!

---

## ❓ Preguntas Frecuentes

### ¿Por qué no veo la opción "Agregar a pantalla de inicio"?

**Causas posibles:**
1. **No estás usando Safari** - Chrome/Firefox en iOS no soportan PWAs
2. **Estás en modo privado** - Sal del modo privado de Safari
3. **iOS muy antiguo** - Necesitas iOS 11.3 o superior

---

### ¿Cuánto espacio ocupa la PWA?

**Muy poco:**
- Instalación inicial: ~5-10 MB (interfaz, caché básico)
- Caché de videos: Depende de cuántos veas (se limpia automáticamente)
- Total estimado: 10-50 MB máximo

**Comparado con apps nativas que ocupan 100-500 MB, es muy ligera.**

---

### ¿La PWA consume mis datos móviles?

**Solo cuando generas videos nuevos:**
- La interfaz se carga desde caché (0 datos)
- Los videos ya vistos se cargan desde caché (0 datos)
- Solo consume datos al:
  - Generar videos nuevos
  - Ver videos que no has visto antes
  - Actualizar la lista de conversaciones

**Tip:** Conéctate a WiFi antes de generar muchos videos para ahorrar datos.

---

### ¿Puedo desinstalar la PWA?

**Sí, es fácil:**
1. Mantén presionado el ícono en tu pantalla de inicio
2. Toca "Eliminar app" o "Remove App"
3. Confirma

**Nota:** Esto solo elimina el acceso rápido. Puedes reinstalarla cuando quieras siguiendo los pasos de arriba.

---

### ¿Funciona en Android?

**Sí, pero el proceso es diferente:**

1. Abre Chrome en Android
2. Ve a la URL de la app
3. Verás un banner en la parte inferior: **"Agregar Video Gen a la pantalla de inicio"**
4. Toca "Agregar"
5. ¡Listo!

En Android también aparecerá una notificación diciendo "Video Gen se ha instalado".

---

## 🔒 Privacidad y Seguridad

### ¿La PWA tiene acceso a mis datos?

**Solo a lo que tú permitas:**
- ❌ No tiene acceso a tu cámara (a menos que lo permitas explícitamente)
- ❌ No tiene acceso a tus contactos
- ❌ No tiene acceso a tus fotos (salvo las que subas voluntariamente)
- ✅ Sí almacena tu sesión y preferencias localmente
- ✅ Sí guarda caché de videos para funcionalidad offline

---

### ¿Es seguro?

**Totalmente:**
- Usa HTTPS (conexión cifrada)
- Mismo nivel de seguridad que la versión web
- No recopila más datos que la web normal
- Cumple con estándares de PWA de Apple

---

## 🎨 Personalización

### Cambiar el Nombre del Ícono

Durante la instalación (Paso 4), puedes cambiar el nombre que aparece debajo del ícono:
- Por defecto: "Video Gen"
- Límite: 12-14 caracteres (iOS lo trunca si es muy largo)

**Ejemplos:**
- "Video AI"
- "GenVideos"
- "AI Creator"

---

### Ícono Personalizado

El ícono que verás es nuestro logo oficial:
- Fondo: Cuadrado redondeado negro
- Letra "V" estilizada en gradiente morado
- Optimizado para pantallas Retina

**No puedes cambiar el ícono**, pero si tienes sugerencias, contáctanos.

---

## 📞 Soporte

### Si tienes problemas con la instalación:

1. **Verifica tu versión de iOS:**
   - Ve a Ajustes → General → Información
   - Busca "Versión"
   - Necesitas iOS 11.3 o superior (recomendado: iOS 15+)

2. **Reinicia Safari:**
   - Cierra Safari completamente (desliza hacia arriba en el selector de apps)
   - Vuelve a abrirlo
   - Intenta de nuevo

3. **Limpia caché de Safari:**
   - Ajustes → Safari → "Borrar historial y datos de sitios web"
   - ⚠️ Esto cerrará todas tus sesiones en Safari

4. **Reinstala la PWA:**
   - Elimina el ícono de la pantalla de inicio
   - Sigue los pasos de instalación de nuevo

---

## 🚀 Próximas Funcionalidades

Estamos trabajando en:
- 🔔 **Notificaciones push** cuando tus videos estén listos
- 📥 **Descarga de videos** para verlos completamente offline
- 🎨 **Edición offline** de prompts y estilos
- 🌙 **Tema oscuro/claro** automático según tu preferencia de iOS

---

**¿Listo para instalar?**
¡Sigue los pasos de arriba y disfruta de Video Generator AI como una app nativa!

---

*Última actualización: Noviembre 2025*
