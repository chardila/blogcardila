---
title: "Cómo calcular la fecha de la Semana Santa"
description: "Guía sencilla para entender cómo se determina la fecha de la Semana Santa"
publishDate: "2007-04-02"
tags: 
  - "personal"
---

Cada año llega la Semana Santa y siempre surge la misma pregunta: **¿cómo se calcula su fecha?** Con el tiempo me di cuenta de que no es una fecha fija, así que decidí investigar un poco. Esto fue lo que encontré.

Muchos sitios en Internet repiten exactamente el mismo texto (por eso no cito la fuente), y explican lo siguiente:

> La Iglesia Católica quiso conmemorar la muerte de Jesús el mismo día mencionado en los evangelios. Los judíos celebraban su Pascua basados en el calendario lunar, y en tiempos de Jesús esta celebración dependía de las fases de la luna.
> La fecha de la Semana Santa se fija a partir del **Domingo de Resurrección**, que es el **domingo siguiente a la luna llena del mes de Nisán**, entre el 22 de marzo y el 25 de abril. Dicho de otra manera, es *el domingo después de la primera luna llena de primavera* (que normalmente comienza el 21 de marzo).

Como en Colombia no tenemos estaciones, entender eso de “primavera” no es tan intuitivo. En Wikipedia lo explican así:

> El Viernes Santo es el viernes inmediatamente posterior a la **primera luna llena de primavera** en el hemisferio norte. Aunque técnicamente se usa la “luna llena eclesiástica”, esta suele coincidir con la astronómica. La fecha puede caer tan temprano como el 21 de marzo o tan tarde como el 23 de abril.

### Resumen sencillo

1. Busca la **primera luna llena después del 21 o 22 de marzo**.
2. El **Viernes Santo** será el viernes inmediatamente posterior.
3. Con eso se determina toda la Semana Santa.

---

# Métodos matemáticos de cálculo

A continuación presento dos métodos clásicos por curiosidad: **Gauss** y **Butcher**, con notación matemática mejor presentada.

---

# Método de Gauss

Gauss propuso que la fecha de Pascua será una de las siguientes:

* **Fecha en marzo:**
  $$
  22 + d + e
  $$
* **Fecha en abril:**
  $$
  d + e - 9
  $$

Los valores se calculan así:

$$
\begin{aligned}
a &= \text{año} \bmod 19 \\
b &= \text{año} \bmod 4 \\
c &= \text{año} \bmod 7 \\
d &= (19a + M) \bmod 30 \\
e &= (2b + 4c + 6d + N) \bmod 7
\end{aligned}
$$

Para el calendario gregoriano hasta el año 2100:
$$
M = 24,\quad N = 5
$$

### Ejemplo para 2007 (Gauss)

$$
\begin{aligned}
a &= 2007 \bmod 19 = 12 \\
b &= 2007 \bmod 4 = 3 \\
c &= 2007 \bmod 7 = 5 \\
d &= (19\cdot12 + 24) \bmod 30 = 12 \\
e &= (2\cdot3 + 4\cdot5 + 6\cdot12 + 5) \bmod 7 = 5
\end{aligned}
$$

* Fecha en marzo:
  $$
  22 + 12 + 5 = 39 \quad \text{(inválida)}
  $$
* Fecha en abril:
  $$
  12 + 5 - 9 = 8
  $$

**Resultado:** Domingo de Pascua en **2007: 8 de abril**.

---

# Método de Butcher

El método de Butcher (1876) usa esta secuencia:

$$
\begin{aligned}
A &= \text{año} \bmod 19\\
B &= \left\lfloor \frac{\text{año}}{100} \right\rfloor\\
C &= \text{año} \bmod 100\\
D &= \left\lfloor \frac{B}{4} \right\rfloor\\
E &= B \bmod 4\\
F &= \left\lfloor \frac{B+8}{25} \right\rfloor\\
G &= \left\lfloor \frac{B - F + 1}{3} \right\rfloor\\
H &= (19A + B - D - G + 15) \bmod 30\\
I &= \left\lfloor \frac{C}{4} \right\rfloor\\
K &= C \bmod 4\\
L &= (32 + 2E + 2I - H - K) \bmod 7\\
M &= \left\lfloor \frac{A + 11H + 22L}{451} \right\rfloor\\
N &= H + L - 7M + 114\\
\text{MES} &= \left\lfloor \frac{N}{31} \right\rfloor\\
\text{DÍA} &= 1 + (N \bmod 31)
\end{aligned}
$$

### Ejemplo para 2007 (Butcher)

(Solo el resultado final)

$$
\text{MES} = 4,\quad \text{DÍA} = 8
$$

**Resultado:** Pascua en **2007: 8 de abril**.

---

# Enlaces

* [Semana Santa en Wikipedia](http://es.wikipedia.org/wiki/Semana_Santa)
* [Cálculo de la fecha de Pascua en Wikipedia](http://es.wikipedia.org/wiki/C%C3%A1lculo_de_la_fecha_de_Pascua)

