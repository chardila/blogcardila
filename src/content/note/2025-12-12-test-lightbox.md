---
title: "Prueba de Lightbox"
description: "Nota de prueba para verificar la funcionalidad del lightbox en imágenes"
publishDate: "2025-12-12T17:30:00Z"
draft: false
---

# Probando el Lightbox

Esta es una nota de prueba para verificar la funcionalidad del lightbox personalizado.

## Imagen única con lightbox

![Santander](/images/posts/2007/asi-hablamos-los-santandereanos-colombia/santander-2d200x268.jpg){.lightbox}

## Galería de múltiples imágenes

Estas tres imágenes se pueden navegar con las flechas del teclado:

![Maia](/images/posts/2007/algo-mas-de-maia/maia.jpg){.lightbox}

![Felicidad](/images/posts/2007/felicidad/516049734_181c2feabb.jpg){.lightbox}

![Rosa Roja](/images/posts/2007/origen-del-dia-del-amor-y-la-amistad/rosa-20roja-2d200x129.jpg){.lightbox}

## Imagen normal (sin lightbox)

Esta imagen NO tiene lightbox, es una imagen normal:

![Reloj Praga](/images/posts/2008/reloj-astronomico-de-la-plaza-staromestske-praga/relojpraga-2d200x300.jpg)

## Funcionalidades a probar

- ✅ Click en imagen con `.lightbox` abre el dialog
- ✅ Botón cerrar (X) cierra el lightbox
- ✅ Click en backdrop cierra el lightbox
- ✅ Tecla ESC cierra el lightbox
- ✅ Flechas ← / → navegan entre imágenes
- ✅ Contador muestra posición actual (ej: "2 / 3")
- ✅ Caption se muestra debajo de la imagen
- ✅ Spinner aparece mientras carga la imagen
- ✅ Botones prev/next se deshabilitan en primera/última imagen
- ✅ En imagen única, los botones de navegación están ocultos

## Navegación por teclado

- **Arrow Left** - Imagen anterior
- **Arrow Right** - Imagen siguiente
- **Home** - Primera imagen
- **End** - Última imagen
- **Escape** - Cerrar lightbox
- **Enter/Space** en thumbnail - Abrir lightbox

## Dark Mode

El lightbox debe adaptarse automáticamente al tema oscuro/claro del sitio.

## Prueba de Optimización con src/assets

Esta imagen está en `src/assets/` y debería ser optimizada por Astro automáticamente:

![Test High Resolution](../../assets/testHighRes.jpg){.lightbox}
