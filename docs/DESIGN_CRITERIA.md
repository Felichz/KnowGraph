# Estándar Riguroso de Evaluación y Diseño UI/UX
*Criterio de Ingeniería de Producto de Alta Gama (Nivel Linear / Raycast / Vercel)*

Este documento define la rúbrica estricta y cuantitativa para auditar y certificar cada vista, pantalla y componente interactivo del sistema. Establece las directrices para no volver a calificar con benevolencia interfaces con problemas estructurales de "carditis", desproporción o densidad deficiente.

---

## 1. Los 5 Pilares de Evaluación (Rúbrica 0 a 10)

Cada vista se califica de 0 a 10 evaluando la suma ponderada de 5 dimensiones críticas:

### Dimensión 1: Jerarquía Estructural e Integridad de Superficie (Peso: 25%)
- **Cero "Carditis" / Cero Div Soup**: Está terminantemente prohibido encerrar cada párrafo, métrica o sentencia en su propia caja flotante con borde y fondo oscuro (*cajas dentro de cajas dentro de un modal*).
- **Superficie Compartida**: La superficie del modal o canvas es el plano unificado. Las subdivisiones se generan mediante escala tipográfica, espaciado proporcional o líneas divisorias sutiles (`1px solid rgba(255, 255, 255, 0.06)`).
- **Penalizaciones Severas**:
  - `(-3.0 pts)` Si hay más de 2 cajas flotantes con bordes de color apiladas verticalmente en la misma sección.
  - `(-2.0 pts)` Si hay un bloque contenedor que añade un borde llamativo sin agrupar más de un elemento conceptual.

### Dimensión 2: Densidad de Información y Ergonomía de Viewport (Peso: 25%)
- **Ratio Datos/Tinta (Tufte Principle)**: Los datos cruciales deben ser visibles de inmediato sin obligar al usuario a hacer scroll por culpa de paddings inflados o espacios vacíos innecesarios.
- **Viewport Fit en Modales**: En resoluciones de escritorio habituales (1440x900 o similar), el resumen ejecutivo y las métricas de rúbrica deben entrar simultáneamente en el primer viewport del modal sin scrollbar vertical forzado.
- **Penalizaciones Severas**:
  - `(-2.5 pts)` Si una métrica clave (ej. criterios de rúbrica) queda mutilada o requiere scroll inmediato por culpa de un bloque superior sobredimensionado.
  - `(-1.5 pts)` Scrollbars nativos toscos en gris visible por desbordes innecesarios.

### Dimensión 3: Tipografía, Alineación Óptica y Tabulares (Peso: 20%)
- **Métricas Numéricas Tabulares**: Todos los puntajes, conteos, tiempos y códigos deben usar fuentes monoespaciadas tabulares alineadas con precisión óptica.
- **Ajuste de Tracking y Peso**: Títulos y display text deben tener `letter-spacing: -0.015em` a `-0.025em`, evitando fuentes genéricas sin calibrar.
- **Penalizaciones**:
  - `(-1.5 pts)` Números grandes que no usan números mono/tabulares o desalineados respecto a su denominador (`/ 120`).
  - `(-1.0 pts)` Etiquetas secundarias con pesos o contrastes idénticos al contenido principal.

### Dimensión 4: Economía del Color y Atmósfera (Peso: 15%)
- **Restricción de Acentos**: Un solo color primario funcional por vista + un indicador de estado. Nunca transformar la pantalla en un árbol de navidad con bordes multicolores compitiendo entre sí.
- **Micro-relieves y Sombras**: Resaltes internos sutiles (`inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`), sin sombras difusas exageradas ni brillos fluorescentes agresivos.
- **Penalizaciones**:
  - `(-2.0 pts)` Bordes gruesos de colores saturados (naranja fuerte, azul brillante, rojo neón) rodeando cajas completas de texto.

### Dimensión 5: Ergonomía Móvil y Resiliencia Responsiva (Peso: 15%)
- **Adaptación a Pulgar**: En móvil (390x844), botones y chips deben respetar un área de toque mínima de 40-44px.
- **Cero Desbordes Horizontales Accidentales**: Ningún texto o chip debe cortarse en el borde de pantalla en desktop, ni desbordar la ventana horizontalmente en móvil.
- **Penalizaciones**:
  - `(-2.0 pts)` Chips o pastillas que se cortan con puntos suspensivos o caen fuera de pantalla cuando hay espacio de sobra.
  - `(-2.0 pts)` Elementos que quedan ocultos o tapados por barras fijas (ej. barra de navegación inferior móvil).

---

## 2. Escala de Calificación Absoluta

| Rango | Nivel de Calidad | Descripción Operativa |
| :---: | :---: | :--- |
| **0.0 – 4.9** | **Inaceptable / Roto** | Desbordes, errores de alineación, ilegibilidad, botones superpuestos. |
| **5.0 – 6.9** | **Prototipo Básico / Div Soup** | Funciona, pero sufre de carditis severa: múltiples divs enormes apilados, scroll prematuro, bordes estridentes, scrollbars nativos grises. *(Aquí caía la versión previa de temp.png)* |
| **7.0 – 8.4** | **Aceptable / Promedio** | Dark mode prolijo pero con vestigios de cajas flotantes innecesarias, densidad media, falta de integración de datos en un solo plano. |
| **8.5 – 8.9** | **Bueno / Cercano a Pro** | Muy limpio y sin errores evidentes, pero aún tiene márgenes mejorables en densidad, tipografía o micro-detalles. |
| **9.0 – 9.4** | **Excelente / Calidad Linear** | Estructura unificada, cero cajas parásitas, datos visibles en un solo vistazo, tipografía tabular impecable, scrollbars estilizados invisibles, perfecta ergonomía desktop y mobile. |
| **9.5 – 10.0** | **Clase Mundial / Referencia** | Perfección en micro-interacciones, equilibrio estético absoluto, cero fricción cognitiva.

---

## 3. Meta Obligatoria del Goal

**Todas las 26 vistas** de la suite de captura deben auditarse y obtener **una calificación individual $\ge 9.0$** bajo este criterio estricto. Si una vista tiene $< 9.0$, debe refactorizarse inmediatamente hasta alcanzar el estándar antes de finalizar.
