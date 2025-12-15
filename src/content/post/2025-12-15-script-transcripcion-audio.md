---
title: "Automatizando Transcripciones de Audios con un Script Bash"
description: "Cómo uso un script para transcribir grabaciones de reuniones rápidamente usando Whisper (faster-whisper) y generar actas con IA."
publishDate: "2025-12-15"
tags: 
  - "scripts"
  - "desarrollo"
  - "personal"
draft: false
---

## 🤔 Por qué creé este script

Mi esposa asiste a muchas reuniones presenciales donde graban el audio de toda la sesión. Cuando llega el momento de hacer **el acta**, toca volver a escuchar el audio completo y escribir todo **a mano**, lo cual es **lentísimo** y repetitivo.

Así que pensé: *¿y si automatizo la transcripción de esos audios?*  
De ahí nació este proyecto que:

- toma archivos de audio,
- los transcribe automáticamente,
- y deja archivos de texto listos para usar con IA tipo **ChatGPT** y generar actas completas.

Este flujo ahorra horas de trabajo y elimina la necesidad de escuchar repetidas veces cada grabación.

---

## 💡 ¿Qué hace este script?

El repositorio **GetTranscriptionFromAudioFiles** es una herramienta que permite **procesar por lotes archivos de audio** y obtener transcripciones de texto usando el motor de reconocimiento de voz **faster-whisper** (una versión más rápida y optimizada de Whisper). :contentReference[oaicite:1]{index=1}

Características principales:

- Transcripción batch de múltiples audios.
- Uso de diferentes modelos de Whisper (desde `tiny` a `large`).
- Detección automática de lenguaje o selección manual.
- Soporte para GPU si la tienes disponible.
- Guardado de cada transcripción en un archivo `.txt`. :contentReference[oaicite:2]{index=2}

---

## 🚀 Cómo usar el script paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/chardila/GetTranscriptionFromAudioFiles.git
cd GetTranscriptionFromAudioFiles
````

---

### 2. Preparar tu entorno

Asegúrate de tener instalado:

* **Python 3**
* **faster-whisper** (el motor de transcripción)
* **ffmpeg** (para manejar formatos de audio)

Instalación rápida en Linux/Mac:

```bash
pip install faster-whisper
sudo apt install ffmpeg
```

> Si usas Windows, puedes instalar `ffmpeg` desde su sitio oficial y agregarlo a tu PATH.

---

### 3. Preparar los audios

Crea una carpeta llamada `audios` y pon ahí todos tus archivos de grabaciones:

```
📁 audios/
  ├── reunion1.mp3
  ├── reunion2.wav
  └── charla.m4a
```

El script va a procesar todos los audios que encuentre dentro de esta carpeta. ([GitHub][1])

---

### 4. Hacer ejecutable el script

```bash
chmod +x GetTranscriptionFromAudioFiles.sh
```

---

### 5. Ejecutar y obtener transcripciones

Ejecuta el script con la configuración básica:

```bash
./GetTranscriptionFromAudioFiles.sh
```

Esto va a:

* detectar automáticamente el idioma,
* usar el modelo por defecto (`small`),
* y crear una carpeta llamada `transcripts/` con los archivos `.txt`.

---

### 6. Personalizar la transcripción

Puedes ajustar varios parámetros:

| Opción     | Qué hace                                                       |
| ---------- | -------------------------------------------------------------- |
| `-i DIR`   | Carpeta con audios (default: `audios`)                         |
| `-o DIR`   | Carpeta de salida para transcripciones                         |
| `-m MODEL` | Modelo de Whisper (`tiny`, `base`, `small`, `medium`, `large`) |
| `-l LANG`  | Idioma (`es`, `en`, `auto`, etc.)                              |
| `-j N`     | Procesos paralelos para acelerar                               |
| `-v`       | Modo *verbose* (más información en consola)                    |

Ejemplo con opciones:

```bash
./GetTranscriptionFromAudioFiles.sh -i mis_audios -o transcripciones -m medium -l es -j 4 -v
```

---

## 📝 ¿Qué pasa después?

Una vez que tienes tus archivos de texto:

1. Puedes usar **ChatGPT** (o cualquier otra IA) para:

   * resumir el contenido,
   * generar un acta,
   * identificar decisiones importantes,
   * extraer listas de tareas.

2. Simplemente pega el texto o usa la API de OpenAI para alimentar el modelo con instrucciones tipo:

```
Acá está la transcripción completa de la reunión. Genera un acta formal con puntos clave y tareas.
```

---

## 🛠️ Consejos para mejores resultados

* **Modelos más grandes** (`medium`, `large`) dan mejor precisión con audios largos o con ruido, pero requieren más memoria.
* Si las grabaciones tienen **mucho ruido ambiental**, puedes usar herramientas como `ffmpeg` para limpiar el audio antes.
* Si tienes una **GPU NVIDIA con CUDA**, el script la detecta automáticamente y acelera muchísimo la transcripción.

---

## 💬 Cierre

Transformar tu flujo de trabajo de transcripción manual a uno automátizado no solo ahorra tiempo, sino que te permite enfocarte en lo que realmente importa: *interpretar y usar el contenido de las reuniones*.

Si pruebas este script, cuéntame cómo te fue 👇


