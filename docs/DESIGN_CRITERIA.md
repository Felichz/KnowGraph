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

## 4. Protocolo de las 4 Pasadas Independientes de Revisión

Para erradicar la ceguera por sobrecarga y evitar que los micro-detalles oculten fallos macro-estructurales, **toda captura debe auditarse secuencialmente a través de 4 pasadas independientes**. Si una captura falla en cualquier pasada, se descalifica de inmediato según su tope máximo (Cap):

### Pasada 1: Macro-Arquitectura de Pantalla y Viewport (La mirada del Telescopio)
*Se evalúa la imagen alejada al 100% del viewport completo, ignorando temporalmente los micro-textos o fuentes.*
1. **Invariante 1.1: Anti-Layer-Cake (Prohibición de Bloques Apilados)**  
   Terminantemente prohibido el apilamiento vertical de múltiples franjas o cajas horizontales rectangulares independientes con fondo y borde en el canvas principal (`header` + `banner` + `control deck`). La navegación y controles deben ser una superficie continua integrada o estructurarse en un eje vertical (sidebar) + canvas principal.
2. **Invariante 1.2: Regla del 70% del Viewport (Fold & Density Ratio)**  
   En resoluciones de escritorio (1440×900), la suma de barras fijas, cabeceras y filtros no puede superar **130px de altura vertical total**. Al menos el 70% del viewport debe estar dedicado directamente al lienzo de contenido (nodos/grafo), garantizando ver al menos **2 filas completas de tarjetas sin hacer scroll**.
3. **Invariante 1.3: Prohibición de Cañones Horizontales por `space-between` (Ley de Fitts)**  
   Prohibido el uso de `justify-content: space-between` en contenedores de ancho completo (>800px) que arroje la acción a más de 350px del texto sin contenido central que justifique el espacio. Si una acción pertenece a un contexto, debe estar visualmente acoplada a él.
- **Penalización**: Violación de cualquier invariante de la Pasada 1 $\implies$ **Cap máximo automático $\le 6.5 / 10$**.

### Pasada 2: Micro-Densidad y Anti-Carditis de Componentes (La mirada del Microscopio)
*Se auditan los componentes individuales (tarjetas, modales, formularios).*
1. **Invariante 2.1: Controlled Density (Cero Cajas Huecas > 40px)**  
   Prohibido tener tarjetas o banners con más de $40\,\text{px}$ de vacío negro injustificado. Cada elemento debe aportar sustancia cognitiva (título, micro-resumen de 2 líneas con clamp, badges y prioridad), eliminando el aspecto de wireframe vacío.
2. **Invariante 2.2: Anti-Carditis Interna (Cero Cajas Decorativas en Modales)**  
   Cero cajas flotantes con borde decorativo encerrando textos dentro de contenedores que ya tienen borde (modales, paneles). Los textos se estructuran con escala tipográfica y líneas divisorias sutiles (`border-bottom: 1px solid var(--border-line)`).
3. **Invariante 2.3: Protección Estructural Flexbox**  
   Encabezados, barras de pestañas y rieles de navegación protegidos mandatoriamente con `flexShrink: 0`. Cero colapsos o squish al crecer el contenido.
- **Penalización**: Violación de cualquier invariante de la Pasada 2 $\implies$ **Cap máximo automático $\le 7.0 / 10$**.

### Pasada 3: Semántica Cromática y Jerarquía de Iluminación (La mirada del Colorista)
*Se audita exclusivamente el uso del color, contrastes y acentos.*
1. **Invariante 3.1: Ancla Inmutable de Color de Categoría**  
   El color de la categoría curricular (cian, ámbar, violeta, esmeralda) es intocable y nunca debe reemplazarse por estados de progreso o maestría.
2. **Invariante 3.2: Acentos Afilados vs. Árbol de Navidad**  
   Prohibido pintar bordes completos de tarjetas en colores estridentes (amarillo/ámbar, verde, azul neón) por tener un puntaje alto. Los acentos de excelencia deben ser badges discretos y afilados (`★ 113/120`), manteniendo el contenedor en un borde neutro (`rgba(255, 255, 255, 0.08)`).
- **Penalización**: Violación de cualquier invariante de la Pasada 3 $\implies$ **Cap máximo automático $\le 8.0 / 10$**.

### Pasada 4: Ergonomía de Interacción, Móvil y Estados Extremos (La mirada Táctil)
*Se auditan viewports móviles (390px), transiciones, estados extremos y desbordes.*
1. **Invariante 4.1: Ergonomía Táctil y Safe Areas en Móvil**  
   En viewport móvil (390×844), los objetivos táctiles deben ser $\ge 44\times 44\,\text{px}$ y debe existir un padding de seguridad inferior de al menos 70px para evitar solapamientos con la barra de navegación fija.
2. **Invariante 4.2: Cero Truncamientos Duros y Soporte de Rueda**  
   Toda lista horizontal que desborde debe contar con una máscara degradada (`mask-image`) calibrada que no corte números a la mitad, y soporte fluido para desplazamiento con rueda de ratón o trackpad (`onWheel`).
3. **Invariante 4.3: Modos Inmersivos y Contención de Lectura**  
   El Modo Zen debe ocupar 100vw × 100vh eliminando el fondo sin romper la legibilidad, manteniendo un ancho de línea calibrado (`max-w-4xl`) para evitar líneas excesivamente largas.
- **Penalización**: Violación de cualquier invariante de la Pasada 4 $\implies$ **Cap máximo automático $\le 8.0 / 10$**.

---

## 5. Pulido Invisible de "Design Engineering" (Emil Kowalski)

1. **Interacción de Rueda en Filtros**: Desplazamiento horizontal fluido (`onWheel`) en todas las listas laterales.
2. **Scrollbars Ultrafinas**: `scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.14) transparent;`, erradicando scrollbars nativos grises.
3. **Números Tabulares en Métricas**: Uso obligatorio de `font-variant-numeric: tabular-nums` o tipografía monoespaciada para todos los puntajes, conteos y ratios.


