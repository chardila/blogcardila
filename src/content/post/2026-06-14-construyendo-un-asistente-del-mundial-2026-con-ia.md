---
title: "Construyendo un asistente del Mundial 2026 con IA"
description: "Cómo construí un asistente para responder preguntas sobre el Mundial 2026 usando DeepSeek y Text-to-SQL, y lo que aprendí sobre ingeniería de contexto en el proceso."
publishDate: "2026-06-14"
tags: [ia, deepseek, text-to-sql, prompt-engineering, llm]
draft: false
coverImage:
  src: "../../assets/images/2026-06-14-construyendo-un-asistente-del-mundial-2026-con-ia.png"
  alt: "Construyendo un asistente del Mundial 2026 con IA"
---

Comencé con una idea sencilla: crear un asistente capaz de responder preguntas sobre el Mundial de Fútbol 2026. Lo que no esperaba era que el proyecto terminaría enseñándome más sobre cómo ha cambiado el desarrollo de software en la era de la IA que sobre el fútbol en sí. Aquí cuento cómo evolucionó el sistema, por qué decidí no usar RAG y qué aprendí en el proceso.

La primera aproximación fue igualmente simple: incluir toda la información necesaria directamente en el prompt del agente. Para mantener los costos bajos —y porque se trataba principalmente de un ejercicio didáctico— elegí DeepSeek, un modelo económico que, dado el volumen esperado de consultas, costaría apenas unos centavos de dólar.

Desde el principio me impuse una restricción: no quería implementar RAG (Retrieval-Augmented Generation). Mi objetivo era experimentar con ingeniería de contexto —darle al modelo exactamente la información que necesita, en el formato correcto y en el momento preciso— y aprender a controlar sus respuestas usando únicamente lo que yo le proporcionara.

El contexto inicial incluía información de mundiales anteriores, datos del Mundial 2026 y los detalles de una polla mundialista que armé con mi familia: predicciones de los participantes, clasificación, resultados partido a partido. El volumen no era grande y no vi ningún problema en incluir todo directamente en el prompt.

Después de algunos días experimentando, decidí ampliar las capacidades del asistente. Comencé a consumir APIs públicas y a recopilar datos de distintas fuentes gratuitas. La restricción seguía siendo la misma: aprender y construir algo útil sin gastar dinero. Pero a medida que agregaba más datos, el contexto comenzó a crecer. Aunque el costo seguía siendo bajo, empecé a preguntarme si existía una forma más elegante y escalable de resolver el problema.

En lugar de saltar directamente a RAG, exploré otra alternativa: combinar prompt engineering con schema linking.

Como ya estaba usando PostgreSQL a través de Supabase, centralicé toda la información en una base de datos. Integré datos de APIs públicas, estadísticas históricas y bases de datos abiertas que encontré en GitHub sobre mundiales anteriores. Una vez construido el esquema, el siguiente paso fue enseñarle al modelo cómo utilizarlo.

Mediante prompt engineering le proporcioné a DeepSeek una descripción detallada de las tablas, relaciones y columnas disponibles. El objetivo era que el modelo identificara qué información necesitaba para responder una pregunta y generara automáticamente el SQL correspondiente. El flujo terminó siendo relativamente sencillo:

1. El usuario hace una pregunta en lenguaje natural.
2. El modelo identifica qué tablas contienen la información relevante.
3. Genera la consulta SQL necesaria.
4. La aplicación ejecuta la consulta.
5. Los resultados se envían nuevamente al modelo para construir la respuesta final.

En esencia, terminé implementando un sistema Text-to-SQL apoyado por schema linking —una técnica que permite relacionar una consulta en lenguaje natural con las tablas y columnas relevantes de la base de datos.

Para mi sorpresa, la solución funcionó bastante bien desde el principio. Además, fue extremadamente rápida de construir: unas cuantas sesiones con Claude Code y algo de tiempo depurando detalles fueron suficientes para tener un prototipo completamente funcional.

## ¿Por qué no RAG?

Una pregunta natural es por qué no recurrí a RAG desde el principio. La respuesta es simple: para este problema no era necesario.

La información era relativamente estructurada y encajaba bien dentro de una base de datos relacional. Muchas de las preguntas que quería responder podían expresarse naturalmente como consultas SQL. [RAG](https://blog.cardila.com/posts/2026-06-10-llm-wiki-patron-karpathy-notas) sigue siendo una excelente opción cuando trabajamos con grandes volúmenes de documentos, texto no estructurado o información que cambia constantemente. Pero en este caso me pareció más interesante explorar una alternativa más simple y aprender algo nuevo en el proceso.

Una de las lecciones más valiosas fue entender que no siempre necesitamos aplicar la solución más sofisticada disponible. Muchas veces una arquitectura sencilla, bien diseñada y apoyada por un buen manejo del contexto puede resolver el problema de forma eficiente.

## Lo que aprendí

Lo más interesante de este ejercicio no fue construir una aplicación para una polla mundialista. Lo realmente valioso fue entender cómo han cambiado las habilidades necesarias para desarrollar software en la era de la IA.

Al comenzar, pensé que bastaría con proporcionar contexto al modelo. Después descubrí las limitaciones de esa estrategia cuando la cantidad de información comenzó a crecer. Eso me llevó a explorar conceptos como ingeniería de contexto, prompt engineering y schema linking: técnicas que hace apenas unos años no formaban parte del vocabulario habitual de un desarrollador.

La solución final no fue especialmente sofisticada: una base de datos PostgreSQL, un modelo económico de DeepSeek y un flujo Text-to-SQL guiado mediante prompts. Sin embargo, me permitió comprobar algo importante: antes de llegar a soluciones más complejas como RAG o fine-tuning, existen alternativas simples que vale la pena considerar.

También me recordó algo que he aprendido varias veces a lo largo de mi carrera: la mejor forma de entender una tecnología es construir algo con ella. Leer sobre IA generativa ayuda, pero enfrentarse a problemas reales de contexto, calidad de datos, costos y precisión enseña mucho más.

Al final, el proyecto terminó siendo menos sobre fútbol y más sobre aprendizaje. Me permitió experimentar con técnicas modernas de desarrollo asistido por IA, validar ideas rápidamente y comprobar que hoy es posible construir prototipos útiles en cuestión de horas, algo que hace pocos años habría tomado días o semanas. Hace algunos años probablemente no me habría animado a construir algo así — no porque fuera especialmente complejo, sino porque reunir todas las piezas e integrarlas requería una inversión considerable de tiempo. Hoy los LLMs no solo ayudan a escribir código; también reducen significativamente el costo de explorar ideas. Es algo que he seguido explorando con [Engram](https://blog.cardila.com/posts/2026-06-12-engram-memoria-compartida), un sistema donde Claude actúa como participante activo del flujo de trabajo, no solo como asistente de código.

## Conceptos

### Ingeniería de Contexto

Es darle a la IA toda la información que necesita, en el formato correcto y en el momento preciso, para que pueda realizar una tarea específica sin necesidad de múltiples aclaraciones o preguntas adicionales.

### Fine-tuning

El fine-tuning (o ajuste fino) consiste en reentrenar parcialmente un modelo previamente entrenado utilizando datos específicos de un dominio o tarea. Durante este proceso se modifican los pesos del modelo, alterando permanentemente su comportamiento para adaptarlo mejor al problema que queremos resolver.

### RAG (Retrieval-Augmented Generation)

RAG significa "Retrieval-Augmented Generation" o "Generación Aumentada por Recuperación".

Consiste en proporcionar al modelo información específica y actualizada en tiempo de ejecución para que genere respuestas basadas en esos datos, además del conocimiento adquirido durante su entrenamiento original.

### Prompt Engineering

El prompt engineering es la práctica de diseñar, refinar y optimizar las instrucciones proporcionadas a un modelo de IA con el objetivo de obtener respuestas más precisas, útiles y consistentes.

### Schema Linking

El schema linking es una técnica utilizada en sistemas Text-to-SQL que permite relacionar una consulta en lenguaje natural con las tablas y columnas relevantes de una base de datos.

Gracias a este proceso, el modelo puede identificar qué información necesita consultar y generar consultas SQL correctas para responder la pregunta del usuario.
