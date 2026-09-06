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

**Todas las vistas mapeadas de las Specs** deben auditarse y obtener **una calificación individual $\ge 9.0$** bajo este criterio estricto. Si una sola vista tiene $< 9.0$, debe refactorizarse inmediatamente hasta alcanzar el estándar antes de finalizar.

---

## 4. Los 5 Invariantes Negativos Eliminatorios (Reglas Anti-AI-Slop)

Siguiendo el estándar oficial de *Frontend Design (Anthropic)*, se establecen 5 fallos que **descalifican automáticamente cualquier vista a menos de 8.0**:

1. **Invariante 1: Truncamiento Duro / Amputación de Texto**  
   Cero chips o textos cortados por `overflow: hidden` o solapamientos duros. Si una lista horizontal desborda, debe usar una máscara de degradado suave (`mask-image: linear-gradient(to right, black calc(100% - 28px), transparent 100%)`) y permitir desplazamiento horizontal. *(Violación: Cap máximo 7.0 / 10)*.
2. **Invariante 2: Colapso Estructural por Flexbox**  
   Cero barras de navegación, encabezados o botones comprimidos o mutilados por falta de `flex-shrink: 0`. Toda barra de tabs debe mantener su altura íntegra y sus indicadores activos en cualquier resolución. *(Violación: Cap máximo 5.0 / 10)*.
3. **Invariante 3: Carditis / Cajas Flotantes Redundantes**  
   Cero cajas decorativas con borde flotante encerrando textos dentro de contenedores que ya tienen borde propio. Los textos se estructuran con jerarquía editorial y líneas divisorias sutiles (`border-bottom: 1px solid var(--border-line)`). *(Violación: Cap máximo 6.5 / 10)*.
4. **Invariante 4: Cajas Huecas y Aire Muerto (> 40px)**  
   Prohibido tener tarjetas o banners con más de $40\,\text{px}$ de vacío negro injustificado. Las interfaces para ingenieros senior exigen **densidad controlada** (*Controlled Density*): cada tarjeta debe contener sustancia conceptual (título, micro-resumen de 2 líneas, badges y prioridad) eliminando el aspecto de wireframe vacío. *(Violación: Cap máximo 7.0 / 10)*.
5. **Invariante 5: Pérdida de Identidad Semántica del Color**  
   El color de la categoría curricular (cian, ámbar, violeta, esmeralda) es un ancla visual inmutable. Está prohibido que un estado de maestría (ej: puntaje > 100) sobreescriba toda la tarjeta en amarillo y borre el color de la categoría. Los acentos de excelencia deben ser afilados (ej: badge `★ 120/120`), manteniendo el indicador de categoría intacto. *(Violación: Cap máximo 7.5 / 10)*.

---

## 5. Pulido Invisible de "Design Engineering" (Emil Kowalski)

1. **Interacción de Rueda en Filtros**: Todo carrusel o barra de chips horizontal debe responder al evento de rueda de ratón (`onWheel`) desplazando el contenedor lateralmente.
2. **Scrollbars Ultrafinas**: En todos los navegadores, las barras de desplazamiento deben ser sutiles (`scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.14) transparent;`), evitando las barras grises toscas del sistema operativo.
3. **Números Tabulares en Métricas**: Uso obligatorio de `font-variant-numeric: tabular-nums` o tipografía monoespaciada para todos los puntajes, conteos y ratios.

