---
title: "LLM Wiki: el patrón de Karpathy que cambió mis notas"
description: "Cómo el patrón LLM Wiki de Andrej Karpathy —adaptado por Wyndo— me inspiró a construir engram: un sistema donde Claude mantiene mi vault de Obsidian como una wiki viva."
publishDate: "2026-06-10"
tags: [ia, obsidian, productividad, notas]
draft: false
coverImage:
  src: "../../assets/images/2026-06-10-llm-wiki-patron-karpathy-notas.png"
  alt: "LLM Wiki: el patrón de Karpathy que cambió mis notas"
---

Hace un tiempo caí en un artículo de Wyndo en The AI Maker que describe cómo tomó el concepto de "LLM Wiki" de Andrej Karpathy y lo implementó como un segundo cerebro personal en Obsidian. No sería la primera vez que leo sobre sistemas de notas, pero este tenía algo diferente: describía exactamente lo que yo estaba intentando construir, sin saberlo.

El argumento de partida es directo: las herramientas tradicionales de notas fracasan porque el costo de mantenimiento manual crece más rápido que el valor que producen. Cada nota que agregas crea deuda cognitiva. Con el tiempo, el sistema se vuelve tan pesado que prefieres no usarlo.

La diferencia con RAG —la técnica habitual de conectar un LLM con documentos propios— es sutil pero importante. En RAG, el modelo recupera desde documentos brutos cada vez que lo consultas. En el patrón LLM Wiki, el modelo lee las fuentes **una vez** y construye una wiki estructurada que él mismo mantiene. Las conexiones ya están hechas. Las contradicciones ya fueron marcadas. No se re-derivan en cada consulta.

La arquitectura se organiza en tres capas: fuentes inmutables (lo que lees), una wiki generada por IA (lo que extraes y conectas), y un schema que disciplina cómo el modelo trabaja. Cada nueva fuente puede tocar diez o quince páginas de la wiki, creando conexiones no obvias entre temas que parecían separados.

La cita que mejor lo resume:

> "Obsidian is the IDE, the LLM is the programmer, the wiki is the codebase."

Y la que define el principio de inmutabilidad:

> "files in sources/ are immutable. Once you save something here, you don't edit it. This is your source of truth."

Leer este artículo fue el empujón que necesitaba para construir engram: el plugin que convierte mi vault de Obsidian en exactamente ese sistema. Claude mantiene la wiki, yo dirijo. El `/ingest-url` es el mecanismo de ingesta; `Resources/concepts/` es donde vive el conocimiento procesado; este mismo post es un producto de ese flujo.

El patrón funciona porque el valor se acumula. La wiki crece más útil con cada fuente nueva, sin que el costo de mantenimiento crezca proporcionalmente. Es la diferencia entre un archivo de documentos y un codebase vivo.
