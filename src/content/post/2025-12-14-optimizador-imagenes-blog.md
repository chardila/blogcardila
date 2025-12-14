---
title: "Script para Optimizar Imágenes del Blog"
description: "Un script en bash para optimizar automáticamente imágenes JPG y PNG, reduciendo su tamaño a menos de 500KB mientras mantiene buena calidad. Perfecto para preparar imágenes de blog."
publishDate: "2025-12-14T07:30:00Z"
tags:
  - scripts
  - herramientas
  - desarrollo
draft: false
---

Hace un tiempo me di cuenta de que necesitaba una forma más eficiente de preparar las imágenes que uso en este blog. Ya sea que tome fotos con mi cámara o genere imágenes con IA para ilustrar los posts, siempre termino con archivos que son demasiado grandes para publicar directamente.

## El Problema

Las imágenes que hosteo directamente en el repositorio del blog pueden volverse problemáticas si son muy pesadas. Afectan el tiempo de carga de la página, consumen más ancho de banda, y en general hacen que la experiencia del usuario sea menos fluida. Pero tampoco quiero sacrificar demasiado la calidad visual.

Necesitaba encontrar un balance: imágenes que se vean bien pero que no sean excesivamente grandes.

## La Solución

Creé un script en bash que automatiza todo el proceso de optimización. Lo llamé simplemente `optimize-image.sh` y hace exactamente lo que necesito:

- **Redimensiona** las imágenes a un máximo de 1200px de ancho (manteniendo la proporción)
- **Comprime** los archivos para que no superen los 500KB
- **Convierte** PNGs a JPG para mejor compresión
- **Crea backups** automáticamente antes de modificar cualquier archivo
- **Elimina metadatos** innecesarios que aumentan el tamaño del archivo

## Características Principales

### Para Imágenes JPG
1. Si la imagen ya es menor a 500KB, no hace nada
2. Crea una copia de respaldo con extensión `.backup`
3. Redimensiona a máximo 1200px de ancho si es necesario
4. Optimiza la calidad comenzando en 85% y reduciéndola gradualmente si es necesario
5. Usa `jpegoptim` para comprimir hasta alcanzar el tamaño objetivo
6. Elimina metadatos EXIF y otros datos innecesarios

### Para Imágenes PNG
1. Verifica el tamaño actual
2. Crea backup del archivo original
3. Convierte el PNG a JPG (mejor compresión)
4. Aplica el mismo proceso de optimización que para JPGs
5. Reemplaza el archivo PNG original con el JPG optimizado

## Instalación

El script no está atado a nada específico de este blog ni del framework Astro. Puedes usarlo para cualquier proyecto. Solo necesitas:

1. **Clonar el repositorio:**
```bash
git clone https://github.com/chardila/OptimizeImages.git
cd OptimizeImages
```

2. **Instalar las dependencias:**

En Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install imagemagick jpegoptim
```

En macOS:
```bash
brew install imagemagick jpegoptim
```

En Fedora/RHEL/CentOS:
```bash
sudo dnf install ImageMagick jpegoptim
```

3. **Dar permisos de ejecución:**
```bash
chmod +x optimize-image.sh
```

## Uso

El uso es muy simple. Solo necesitas pasarle la ruta de la imagen que quieres optimizar:

```bash
./optimize-image.sh /ruta/a/tu/imagen.jpg
```

### Ejemplos

Optimizar una foto JPG:
```bash
./optimize-image.sh foto-vacaciones.jpg
```

Optimizar un PNG (se convertirá a JPG):
```bash
./optimize-image.sh captura-pantalla.png
```

Con ruta absoluta:
```bash
./optimize-image.sh /home/usuario/Imágenes/foto.jpg
```

## Detalles Técnicos

Los parámetros que elegí (1200px de ancho máximo y 500KB de tamaño máximo) funcionan perfectamente para mi caso de uso. Las imágenes se ven excelentes en el blog y cargan rápidamente.

El script es inteligente en su proceso de optimización:
- Comienza con 85% de calidad para JPGs
- Si el archivo sigue siendo muy grande, reduce la calidad en incrementos de 5%
- Se detiene en 60% de calidad mínima para no degradar demasiado la imagen
- Siempre mantiene un backup del archivo original por si algo sale mal

## Repositorio

El código completo está disponible en GitHub:

**[https://github.com/chardila/OptimizeImages](https://github.com/chardila/OptimizeImages)**

## Conclusión

Este es el primero de lo que espero sean muchos posts sobre pequeños scripts y herramientas que voy creando para facilitar tareas cotidianas. A menudo me encuentro escribiendo scripts para automatizar cosas repetitivas, y pensé que podría ser útil compartirlos.

Si trabajas con imágenes para un blog, sitio web, o cualquier proyecto donde el tamaño de archivo importa, este script puede ahorrarte bastante tiempo. Siéntete libre de usarlo, modificarlo, o adaptarlo a tus necesidades.

¿Tienes alguna sugerencia para mejorarlo? ¡Los pull requests son bienvenidos!
