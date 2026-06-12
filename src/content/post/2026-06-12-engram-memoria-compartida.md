---
title: "Engram: memoria compartida entre humanos e IA"
description: "Cómo construí un sistema de memoria personal sobre Obsidian y Claude Code para que cada conversación con la IA no empiece desde cero."
publishDate: "2026-06-12"
tags: [ia, obsidian, productividad, claude-code]
draft: false
coverImage:
  src: "../../assets/images/2026-06-12-engram-memoria-compartida.png"
  alt: "Engram: memoria compartida entre humanos e IA"
---

Llevo semanas preguntándome lo mismo: ¿cómo evitamos que cada conversación con una IA empiece desde cero?

Los modelos de lenguaje son impresionantes, pero tienen un problema evidente: no recuerdan. O mejor dicho, no recuerdan de la forma en que nosotros necesitamos que recuerden. Las decisiones de un proyecto. Las razones detrás de una arquitectura. Los aprendizajes de una investigación. Las prioridades de una semana complicada. Los cambios de opinión.

Todo eso suele desaparecer entre chats, documentos dispersos y notas olvidadas.

En dos artículos recientes escribí sobre algunas ideas que me llevaron a pensar en este problema. Por un lado, la idea de una [wiki personal aumentada por LLMs](https://blog.cardila.com/posts/2026-06-10-llm-wiki-patron-karpathy-notas). Por otro, la idea de usar Obsidian como una especie de [sistema operativo personal](https://blog.cardila.com/posts/2026-06-10-para-obsidian-claude-code-productivity-os) para gestionar conocimiento y trabajo.

Engram nació en la intersección de esas dos ideas.

## ¿Qué es Engram?

Engram es un sistema de memoria personal construido sobre Obsidian y Claude Code.

La idea es sencilla: en lugar de tratar a la IA como una herramienta externa que responde preguntas, tratarla como un participante más dentro de un sistema de conocimiento compartido. El conocimiento vive en un vault de Obsidian. Las interacciones ocurren a través de Claude Code. Y las reglas de trabajo están encapsuladas en un conjunto de skills especializadas.

El resultado es un sistema donde las conversaciones no terminan cuando se cierra una ventana. Dejan huellas.

## ¿Por qué "Engram"?

En neurociencia, un engram es la huella física que un recuerdo deja en el cerebro.

Me gustó la metáfora porque describe exactamente lo que quería construir. Cuando trabajo con Claude no me interesa guardar un historial de chats. Me interesa preservar el contexto: qué decisiones tomamos, por qué las tomamos, qué aprendimos, qué quedó pendiente. No un log de actividad. Una memoria.

## Cómo funciona

Engram combina tres piezas.

La primera es un vault de Obsidian que actúa como fuente de verdad. La segunda es un conjunto de skills para Claude Code que estructuran flujos recurrentes: preparación del día, cierre de jornada, revisiones semanales, procesamiento de inbox, auditorías del sistema y publicación de contenido. La tercera es la integración mediante MCP, que permite que Claude interactúe directamente con el vault.

El corazón del sistema son dos archivos: `CLAUDE.md`, que le enseña a Claude las reglas y estructura del vault, y `STATE.md`, que captura el estado actual de proyectos, prioridades y contexto de vida. Juntos son la memoria que persiste entre sesiones. Cada conversación nueva empieza desde ahí, no desde cero.

A nivel práctico, eso significa que puedo pedirle al sistema cosas como preparar mi día de trabajo, procesar ideas capturadas durante la semana, revisar proyectos activos, generar resúmenes y reflexiones, o publicar artículos desde mis notas. Todo usando el conocimiento acumulado en el sistema.

## Una idea que me parece importante

Mientras construía Engram me di cuenta de algo: la mayoría de conversaciones sobre IA están enfocadas en el modelo. Qué modelo usar. Qué benchmark ganó. Qué tan inteligente es.

Pero cada vez me interesa más otro problema: la memoria.

Porque la utilidad de una IA no depende únicamente de qué tan inteligente sea. También depende de qué tan bien entiende el contexto de la persona que la usa. Y ese contexto necesita vivir en algún lugar.

## Las reglas que no delego

Curiosamente, algunas de las decisiones más importantes del proyecto fueron sobre lo que Claude *no* debe hacer.

Hay tres convenciones no negociables:

- `author:` en el frontmatter de cada nota, desde el primer día. Distingue qué escribió el usuario y qué escribió Claude.
- `## Cierre` de cualquier proyecto lo escribe el usuario antes de archivarlo. No Claude.
- `## Hechos duros` en STATE.md es de edición exclusivamente manual. Ancla la realidad que Claude no puede inferir: compromisos reales, fechas que importan, decisiones definitivas.

Quería evitar la sensación de que la IA está inventando una versión de mi vida o de mi trabajo. La memoria compartida funciona mejor cuando hay límites claros.

## Código abierto

Decidí publicar Engram porque sospecho que muchas personas están experimentando con problemas parecidos. No lo veo como un producto terminado. Lo veo como un experimento.

Un intento de responder una pregunta que creo será cada vez más relevante: si vamos a trabajar todos los días con sistemas de IA, ¿cómo construimos una memoria que sobreviva a cada conversación?

Si te interesa explorar la implementación, el código está en [GitHub](https://github.com/chardila/engram). Hay un script (`setup.sh`) que instala todo desde cero: el plugin en Claude Code, Obsidian, los plugins de comunidad y la integración MCP. Un comando, una máquina nueva.

Y si has estado pensando en problemas parecidos, me encantaría conocer otras aproximaciones.
