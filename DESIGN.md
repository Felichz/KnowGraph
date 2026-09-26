---
system:
  name: "Learning Workspace — Design System v3"
  version: "3.1.3"
  creative_north_star: "Estudio nocturno"
  aesthetic: "Oscuro refinado: grafito cálido, papel, un solo acento"
  platform: "Web + Electron (desktop 1440×900 de referencia) · Mobile web (390×844)"
  governing_master_skill: "ui-design-foundations"
  governing_specification: "specs/002-workspace-ui-v3/spec.md"
  quality_standard: "docs/DESIGN_CRITERIA.md"
  supersedes: "DESIGN.md v2.0.0 (slate + sky, 'cockpit')"
---

# Learning Workspace — Design System v3

## 0. Norte creativo: *Estudio nocturno*

Una mesa de estudio de noche: la habitación es grafito cálido y silencioso, el material de estudio es **papel** (texto claro y cálido, nunca blanco puro) y hay **una sola luz de trabajo** —el acento *iris*— que marca dónde está tu atención: foco de teclado, selección, la acción recomendada. El **oro** se reserva para una sola cosa: la excelencia (101–120). El **salvia** para una sola cosa: dominio (≥100).

Tres ideas gobiernan todo:

1. **El mapa es una herramienta, la card es un libro.** Lo operativo (mapa, filtros, métricas, formularios) usa sans técnica y mono tabular. El contenido de estudio usa una serif editorial en sus momentos de lectura (título de la card, *En una frase*, pregunta de flashcard). Esa dualidad es la firma del producto.
2. **Jerarquía por tipografía y espacio, no por cajas.** Un plano por superficie. Los grupos se forman por proximidad, títulos y hairlines (1px). Nunca bordes de color alrededor de bloques de texto.
3. **El color significa algo o no aparece.** Neutros para la estructura; iris para interacción; salvia para dominio; oro para excelencia; coral para error; naranja para advertencia. Los colores de categoría existen **solo como puntos y trazos finos** de identidad (ver §1.5, separación por forma).

### Qué cambia respecto de v2
| v2 (legacy) | v3 |
|:--|:--|
| Slate azulado + cian neón, glows | Grafito cálido (OKLCH hue 67–92°, C≈0.005), sin glows |
| Categorías neón como bordes laterales de cards | Categorías en OKLCH armonizado, solo punto 8px o trazo 2px |
| Emoji como iconografía (🧠 ⚖️ ✨ 🔥) | Iconos lineales 1.5px (lucide), cero emoji |
| Una sola fuente sans | Geist (UI) + Geist Mono (métricas/código) + Newsreader (lectura) |
| Header + filtros + banner apilados (layer cake) | Sidebar persistente + canvas; barra superior única de 52px |
| Lección como modal flotante con bordes | Sesión de estudio a pantalla completa: columna de lectura + riel de contexto |
| Barras de progreso en cian (acento) | Riel neutro papel → salvia al dominar → oro en el extra |

### Unidades
- Tamaños de fuente, line-heights, alturas de control y espaciados se implementan en **rem** (raíz 16px). Las tablas muestran px por legibilidad; `rem = px / 16`.
- Bordes, hairlines, trazos y radios en **px**.
- Media queries en **em** (`48em` = 768px, `68.75em` = 1100px, `90em` = 1440px).

---

## 1. Color

Todos los ratios están verificados con WCAG 2.2 (culori) contra el fondo indicado.

### 1.1 Neutros (grafito cálido, OKLCH C ≈ 0.005, hue 70–90°)

| Token | Hex | OKLCH L | Uso |
|:--|:--|:--:|:--|
| `--bg-sidebar` | `#090806` | .135 | Barra lateral, dock móvil |
| `--bg-app` | `#100E0C` | .165 | Lienzo principal, fondo de la sesión de estudio |
| `--surface-1` | `#161512` | .195 | Cards del mapa, filas, nodos del grafo, drawer, diálogos |
| `--surface-2` | `#1D1B19` | .225 | Paleta de comandos, segmento activo de los segmented controls (los hovers usan `--hover-overlay`, §1.4) |
| `--surface-3` | `#242220` | .255 | Popovers, menús, tooltips, deep dive |
| `--surface-inset` | `#070604` | .120 | Código, textarea, inputs, pistas de riel, pozos |
| `--line-subtle` | `rgba(255,248,230,.06)` | — | Divisores internos, hairlines de tabla |
| `--line` | `rgba(255,248,230,.09)` | — | Borde de cards, sidebar, paneles |
| `--line-strong` | `rgba(255,248,230,.16)` (≈ `#474440` sobre s3) | — | Hover de borde, borde de overlays |
| `--line-control` | `#6B6861` (opaco) | — | **Borde de campos de formulario** (input, textarea, select, checkbox): 3.64 vs inset / 3.28 vs s1 / 3.09 vs s2 (WCAG 1.4.11) |
| `--scrim` | `rgba(4,3,2,.72)` | — | Fondo detrás de diálogos/drawers/paleta |
| `--bar-glass` | `rgba(16,14,12,.88)` + `backdrop-filter: blur(8px)` | — | Barra superior al hacer scroll |
| `--selection` | `#2A2E56` | — | `::selection` (texto `--text-1`, 10.9:1) |

### 1.2 Texto ("papel")

| Token | Hex | Contraste app / s1 / s2 / s3 | Uso |
|:--|:--|:--|:--|
| `--text-1` | `#EEECE7` | 16.3 / 15.5 / 14.5 / 13.4 | Títulos, contenido, valores |
| `--text-2` | `#B7B3AB` | 9.2 / 8.7 / 8.2 / 7.6 | Cuerpo secundario, labels, metadatos |
| `--text-3` | `#938F87` | 6.0 / 5.7 / 5.3 / 4.9 | Hints, placeholders, eyebrows, denominadores. **Peso ≥ 500.** |
| `--text-4` | `#5F5C56` | 2.4–2.9 (exento 1.4.3) | Solo controles deshabilitados |
| `--text-on-paper` | `#100E0C` | 16.3 sobre `--paper` | Texto del botón primario |

**Reglas de texto**
- Nunca `#FFFFFF` ni `#000000`.
- **Sobre fondos teñidos (`--*-soft`) está prohibido `--text-3`** (cae a 4.1–4.9). Sobre tintes se usa `--text-1` o `--text-2` (≥ 6.36:1 en el peor caso, gold-soft sobre s2) o el color semántico propio (≥ 4.66:1, danger sobre danger-soft en s3).
- El cuerpo de lectura usa `--text-1` a 16px; información necesaria nunca en `--text-3` a menos de 12px.

### 1.3 Acento, papel y semántica

| Token | Hex | Contraste app / s1 / s3 | Rol exclusivo |
|:--|:--|:--|:--|
| `--paper` | `#EEECE7` | — | Relleno del botón primario (1 por región de acción) |
| `--paper-hover` | `#DAD7D0` | — | Hover del primario |
| `--paper-active` | `#C7C4BD` | — | Active del primario |
| `--accent` | `#909CF5` (iris) | 7.6 / 7.2 / 6.2 | Foco de teclado, selección, tab activa, links, badge "Mejor siguiente", cursor de gráfico |
| `--accent-strong` | `#A5B1FD` | 9.4 / 8.9 / 7.6 | Hover de links, texto sobre `--accent-soft` |
| `--accent-soft` | `rgba(144,156,245,.14)` | — | Fondo de ítem seleccionado / fila activa |
| `--mastery` | `#74C692` (salvia) | 9.4 / 8.9 / 7.6 | Card dominada (≥100), icono `Check` de cobertura "cubierto" |
| `--mastery-soft` | `rgba(116,198,146,.12)` | — | Fondo de pill de dominio |
| `--gold` | `#E8BE62` | 11.0 / 10.4 / 8.9 | **Solo** excelencia 101–120 (segmento extra, ★) |
| `--gold-soft` | `rgba(232,190,98,.12)` | — | Fondo de pill/banda de excelencia |
| `--warn` | `#F0995B` | 8.6 / 8.2 / 7.0 | Prerrequisitos pendientes, "un poco corta", evaluación desactualizada, severidad media |
| `--warn-soft` | `rgba(240,153,91,.12)` | — | Fondo de aviso |
| `--danger` | `#E97871` (coral) | 6.8 / 6.4 / 5.6 | Errores, eliminar, severidad alta |
| `--danger-soft` | `rgba(233,120,113,.12)` | — | Fondo de error inline |
| `--rail-base` | `#B7B3AB` (= text-2) | 9.7 sobre inset | Segmento 0–100 del riel de puntaje **mientras no hay dominio** |

**Estado seleccionado** (fila, card, nodo, chip): fondo `--accent-soft` + borde 1px `--accent` (6.2–7.6:1, cumple 1.4.11) + `aria-selected`/`aria-pressed`/`aria-current`.

**Presupuesto del acento.** `--accent` es exclusivamente interacción: foco, selección, tab activa, link, "Mejor siguiente" y cursor de gráfico. **No es un color de datos**: ninguna barra, puntaje o métrica se rellena con iris. Con eso, `--accent` + `--paper` ocupan < 5% del área de cualquier vista (verificable: a lo sumo 1 botón paper + 1 selección + 1 tab activa por pantalla).

**Sin color como único portador**: todo estado semántico lleva icono + texto (p. ej. `✓ Dominada`, `★ 112`, `! Prerrequisitos`).

### 1.4 Mapeo de estados a tokens (lista cerrada)

**Estado de evaluación (`evaluation.status` / `STATUS_LABEL`)**

| Estado | Pill: fondo / texto | Icono lucide | Copy |
|:--|:--|:--|:--|
| `exceptional` (101–120) | `--gold-soft` / `--gold` | `Star` | "Profundización extra" |
| `strong` (100) | `--mastery-soft` / `--mastery` | `Check` | "Base cubierta" |
| `developing` (60–99) | `--pill-neutral` / `--text-2` | `CircleDashed` | "En progreso" |
| `review` (<60) | `--warn-soft` / `--warn` | `AlertTriangle` | "Conviene revisar" |
| sin intento | transparente, borde `--line` / `--text-3` | `Circle` | "Sin evaluar" |

**Severidad de gaps**

| Severidad | Marcador | Texto |
|:--|:--|:--|
| alto | icono `ChevronsUp` 16px `--danger` | "Alto" en `--danger` |
| medio | icono `ChevronUp` 16px `--warn` | "Medio" en `--warn` |
| bajo | icono `Minus` 16px `--text-3` | "Bajo" en `--text-2` |

**Cobertura de la superficie (coaching)**

| Estado | Icono | Color | aria-label |
|:--|:--|:--|:--|
| covered | `Check` | `--mastery` | "Cubierto" |
| partial | `CircleDashed` | `--warn` | "Parcial" |
| missing | `X` | `--danger` | "Falta" |
| pending | `Circle` | `--text-3` | "Sin revisar" |

**Avisos inline (una fila, sin caja con borde de color)**

| Tipo | Fondo | Icono (color) | Texto |
|:--|:--|:--|:--|
| Error | `--danger-soft` | `AlertCircle` (`--danger`) | `--text-1`, acción de recuperación como botón ghost |
| Advertencia / evaluación desactualizada | `--warn-soft` | `History` o `AlertTriangle` (`--warn`) | `--text-1` |
| Información | transparente + hairline superior `--line-subtle` | `Info` (`--text-2`) | `--text-2` |
| Éxito | `--mastery-soft` | `CheckCircle2` (`--mastery`) | `--text-1` |

Todos con `--r-md` 8, padding 8×12, sin borde.

**Variantes de botón (color; mecánica de estados en design-spec §D)**

| Variante | Fondo | Borde | Texto | Hover | Active |
|:--|:--|:--|:--|:--|:--|
| Primario | `--paper` | — | `--text-on-paper` | `--paper-hover` | `--paper-active` |
| Secundario | `rgba(255,248,230,.05)` sobre su anfitrión | `--line` | `--text-1` | + `--hover-overlay` y `--line-strong` | + `--press-overlay` |
| Ghost | transparente | — | `--text-2` | `--hover-overlay` + `--text-1` | `--press-overlay` |
| Destructivo | transparente | — | `--danger` | `--danger-soft` | `--danger-soft` + `--line-strong` |
| Deshabilitado (todas) | transparente (primario: `rgba(255,248,230,.08)`) | `--line-subtle` | `--text-4` | sin cambio | sin cambio |

Overlays relativos (funcionan sobre cualquier superficie, siempre aclaran): `--hover-overlay: rgba(255,248,230,.06)`, `--press-overlay: rgba(255,248,230,.10)`. **Regla única: todo hover y press del sistema** (botones, items de menú, filas, cards del mapa, nodos del grafo, chips) se expresa con estos overlays sobre su propia superficie base (no la de su anfitrión); los bordes solo cambian si el elemento ya tenía uno (`--line` → `--line-strong`), y un elemento seleccionado conserva su borde `--accent` en hover; ninguna regla de hover cambia a otra superficie sólida. Única excepción: el botón destructivo usa `--danger-soft` como hover (y suma `--line-strong` en press) para anticipar la consecuencia.

Relleno neutro relativo para pills y chips sin semántica: `--pill-neutral: rgba(255,248,230,.06)` (text-2 encima: 8.1 / 7.5 / 7.0 / 6.4 sobre app / s1 / s2 / s3).

### 1.5 Paletas de categoría (identidad, no estado)

Hues optimizados para maximizar la distancia perceptual mínima entre sí y contra los 5 colores de estado (ΔE2000 mínimo ≈ 6.6 con 11 categorías: es el techo físico a esta luminosidad). Por eso la separación se garantiza **por forma**, no solo por color:

**Regla de separación por forma**
- **Categoría = punto (círculo 8px) o trazo recto de 2px.** Nunca barra de progreso, nunca pill, nunca icono.
- **Estado = icono + texto (+ pill o riel).** Nunca un punto suelto (tampoco severidad, cobertura ni "IA trabajando").
- Las barras de progreso por categoría (sidebar, bandas) se rellenan con `--rail-base`; la categoría la identifica solo el punto junto al nombre.

OKLCH L = 0.74, C = 0.09. Contraste ≥ 7.0:1 sobre `--surface-1`. Sustituyen en la presentación a los hex de los datos (`graph.categories[cat].color`) mediante `src/ui/theme/categoryPalette.js`; categoría desconocida → `color-mix(in oklch, <dato> 60%, var(--text-2))`.

**React**

| Categoría | Hue | Hex |
|:--|:--:|:--|
| fundamentals · Modelo mental & componentes | 205 | `#5DBBC6` |
| state · Estado & datos | 70 | `#D0A16B` |
| effects · Efectos & asincronía | 290 | `#AAA1E0` |
| rendering · Render & performance | 120 | `#A3B472` |
| architecture · Arquitectura web | 170 | `#6CBDA2` |
| quality · Testing & calidad | 335 | `#CF95C1` |
| platform · Web, seguridad & deploy | 230 | `#6BB6D9` |
| designSystem · Design systems & contratos | 0 | `#DA93A8` |
| runtime · Browser & runtime | 90 | `#C1A966` |
| operations · Producción & reliability | 45 | `#DB997B` |
| leadership · Producto & liderazgo | 310 | `#BC9BD6` |

**Rails**

| Categoría | Hex |
|:--|:--|
| fundamentals · Rails core & request | `#D0A16B` |
| activerecord · Active Record & DB | `#DA93A8` |
| patterns · Diseño aplicado | `#6BB6D9` |
| sti · STI & polimorfismo | `#AAA1E0` |
| infra · API, seguridad & runtime | `#5DBBC6` |
| assets · Asset pipeline | `#6CBDA2` |
| testing · Testing (RSpec) | `#A3B472` |

**Usos permitidos (lista cerrada)**: punto 8px junto al nombre; trazo superior de 2px en el nodo del grafo; `--lesson-color` (se declara en el contenedor de la sesión de estudio con el hex de la categoría de la card) usado solo en el punto del encabezado de la card. **Prohibido**: fondos, bordes completos, texto, barras, estados.

**Colores de milestones y bandas de seniority** (`milestone.color`, `band.color` en los datos): **no se usan**. Milestones y bandas se muestran en neutro; su estado se comunica con icono + texto (§1.4).

### 1.6 Código

| Token | Valor | Uso |
|:--|:--|:--|
| `--code-bg` | `--surface-inset` | Bloque de código, comparación |
| `--code-fs` | `--fs-sm` 14px, line-height 24px | Código en bloque |
| `--code-inline-bg` | `rgba(255,248,230,.07)` | `code` inline en prosa |
| `--code-inline-fs` | `--fs-sm` 14px mono (dentro de prosa de 16px), padding 0×4px, `--r-xs` | — |
| `--syn-comment` | `--text-3`, itálica | Comentarios |
| `--syn-keyword` | `#BAA4E2` (9.2:1 sobre inset) | `const`, `return`, `def`, `class` |
| `--syn-string` | `#A4C386` (10.4:1) | Strings |
| `--syn-number` | `#E5A880` (9.9:1) | Números, booleanos, símbolos Ruby |
| `--syn-function` | `#80C1E1` (10.3:1) | Funciones, métodos |
| `--syn-tag` | `#E199AF` (9.0:1) | Tags JSX/HTML |
| `--syn-attr` | `#D5BA82` (10.8:1) | Atributos, props, keys |
| `--syn-type` | `#81C6C1` (10.4:1) | Clases, constantes, tipos |
| `--syn-punct` | `--text-2` | Puntuación, operadores |
| `--syn-plain` | `--text-1` | Identificadores |

**Bloque de código**: fondo `--code-bg`, borde `--line`, `--r-lg` 12, cabecera 36px con label de lenguaje (`--fs-xs`, `--text-3`) y acciones ghost (Copiar, Explicar), cuerpo padding 16, scroll horizontal propio.

**Comparación ingenuo vs. producción**: dos bloques de código lado a lado (desktop ≥ 1100) o apilados. Cada uno lleva, en su cabecera, un marcador de forma + texto: `✕ Enfoque ingenuo` (icono `X` en `--danger`) y `✓ Patrón de producción` (icono `Check` en `--mastery`). Debajo de cada bloque, una línea de texto `--text-2`: "Por qué falla: …" / "Trade-off asumido: …". Sin bordes de color.

**Mermaid** (`mermaid.initialize` → `themeVariables`): `darkMode: true`, `background: #070604`, `primaryColor: #1D1B19`, `primaryTextColor: #EEECE7`, `primaryBorderColor: #474440`, `lineColor: #938F87`, `secondaryColor: #161512`, `tertiaryColor: #100E0C`, `fontFamily: "Geist Variable"`, `fontSize: "14px"`. Contenedor igual al bloque de código sin cabecera.

### 1.7 Gráficos

| Token | Valor | Uso |
|:--|:--|:--|
| `--chart-eval` | `--text-1`; círculo relleno r=4 | Evaluación completa (serie principal) |
| `--chart-eval-line` | `--text-2`, 1.5px | Línea que une evaluaciones |
| `--chart-coach` | `--text-3`; rombo hueco 8px, trazo 1.5 | Checkpoint de coaching |
| `--chart-band-extra` | `--gold-soft` | Banda 100–120 |
| `--chart-guide` | `--line`, 1px, discontinua 2/4 | Guías 60 y 120 |
| `--chart-threshold` | `--text-3`, 1px continua | Guía 100 ("100 · base suficiente") |
| `--chart-cursor` | `--accent`, 1px + anillo 2px r=7 | Punto seleccionado |
| `--chart-axis` | `--fs-xs` 12 mono 500, `--text-3` | Etiquetas de eje y leyenda |
| `--chart-judge` | igual que `--chart-eval`, umbral en 95 | Historial del juez pedagógico (0–100) |

La serie se distingue por **forma** (círculo lleno vs. rombo hueco) y por leyenda con texto. El único color no neutro es el cursor (iris) y la banda dorada.

### 1.8 Streaming, carga y provisionalidad

| Token | Valor | Uso |
|:--|:--|:--|
| `--skeleton` | `rgba(255,248,230,.07)` (relativo, visible sobre cualquier superficie); animación opacidad .55 ↔ 1, 1.4s ease-in-out | Bloques esqueleto con la geometría exacta del contenido resuelto |
| `--caret` | barra 2px × 1em, `--text-2`, parpadeo 1s `steps(2)` | Final de texto que se está recibiendo |
| `--provisional` | cifras en `--text-2` (no `--text-1`) + pill "Provisional" (`--pill-neutral`/`--text-2`) + segmentos del riel al 50% de opacidad | Puntaje y rúbrica mientras la evaluación está en curso |
| `--expected-marker` | tick 1px `--text-3` + label `--fs-xs` 12 mono 500 "esperado 90 s" | Barra de tiempo del loader |
| `--timebar-fill` | `--text-3` hasta el esperado; `--warn` pasado 1.5× | Barra de tiempo del loader |
| `--pulse-ai` | opacidad .45 ↔ 1, 1.6s | Icono `Sparkles` 12–16px `--text-1` de "IA trabajando" + texto o `aria-label` "IA trabajando en esta card" (nunca escala, nunca punto) |

---

## 2. Tipografía

### 2.1 Familias (empaquetadas localmente vía `@fontsource-variable/*`, sin CDN — requisito local-first/Electron)

| Token | Familia | Rol |
|:--|:--|:--|
| `--font-ui` | `"Geist Variable", ui-sans-serif, system-ui, sans-serif` | Toda la UI y el cuerpo de lectura |
| `--font-mono` | `"Geist Mono Variable", ui-monospace, "SF Mono", Menlo, monospace` | Métricas, puntajes, contadores, código, atajos |
| `--font-read` | `"Newsreader Variable", ui-serif, Georgia, serif` | Display editorial: título de la card, *En una frase*, pregunta de flashcard, titulares de estados vacíos |

`font-variant-numeric: tabular-nums` es obligatorio en `--font-mono` y en toda cifra que cambie en vivo.

### 2.2 Escala modular — ratio 1.125 (segunda mayor), base 14px

`size(n) = 14 × 1.125ⁿ`, redondeado al entero.

| Token | n | Exacto | px / rem | Line-height | Uso |
|:--|:--:|:--|:--|:--|:--|
| `--fs-2xs` | −2 | 11.06 | 11 / .6875 | 16 | Solo eyebrows y kbd (excepción §2.4) |
| `--fs-xs` | −1 | 12.44 | 12 / .75 | 16 | Metadatos, pills, captions, leyendas (excepción §2.4) |
| `--fs-sm` | 0 | 14.00 | 14 / .875 | 20 | **Base UI**: controles, filas, labels |
| `--fs-md` | 1 | 15.75 | 16 / 1 | 26 | **Cuerpo de lectura**, textarea |
| `--fs-lg` | 2 | 17.72 | 18 / 1.125 | 26 | Títulos de sección de card, títulos de panel |
| `--fs-xl` | 3 | 19.93 | 20 / 1.25 | 28 | Títulos de vista (Progreso, Flashcards) |
| `--fs-2xl` | 4 | 22.43 | 22 / 1.375 | 30 | *En una frase* (serif) |
| `--fs-3xl` | 5 | 25.23 | 25 / 1.5625 | 32 | Puntaje del scorecard (mono) |
| `--fs-4xl` | 6 | 28.38 | 28 / 1.75 | 36 | Título de la card (serif) |
| `--fs-5xl` | 7 | 31.93 | 32 / 2 | 40 | Pregunta de flashcard (serif) |

### 2.3 Tamaños en móvil (< 768px)

| Token | Desktop | Móvil |
|:--|:--:|:--:|
| `--fs-5xl` (pregunta flashcard) | 32 | 25 (`--fs-3xl`) |
| `--fs-4xl` (título card) | 28 | 22 (`--fs-2xl`) |
| `--fs-2xl` (*En una frase*) | 22 | 20 (`--fs-xl`) |
| `--fs-3xl` (puntaje) | 25 | 25 |
| `--fs-2xs` | 11 | 12 (sube a `--fs-xs`; nada < 12 en móvil) |
| Resto | igual | igual |

### 2.4 Excepción documentada de tamaño mínimo
El piso de texto informativo es 14px. Se permiten 12px (`--fs-xs`) **solo** en: pills/badges, metadatos secundarios (fechas, modelo, conteos), ejes y leyendas de gráficos. 11px (`--fs-2xs`) **solo** en eyebrows (MAYÚSCULAS, peso 600) y kbd. Nunca en cuerpo, labels de formulario ni botones. En móvil nada baja de 12px.

### 2.5 Pesos y tracking

| Estilo | Familia | Peso | Tracking |
|:--|:--|:--|:--|
| Display serif (`--fs-2xl`…`--fs-5xl`) | read | 460 | −0.015em |
| Títulos UI (`--fs-lg`, `--fs-xl`) | ui | 600 | −0.015em |
| Labels / botones | ui | 500 | −0.005em |
| Cuerpo | ui | 400 | 0 |
| Texto en `--text-3` | ui | ≥ 500 | 0 |
| Eyebrow (`--fs-2xs`, MAYÚSCULAS) | ui | 600 | +0.04em, `--text-3` |
| Métricas | mono | 500 | 0 (tabular) |

### 2.6 Pares numerador / denominador (`112/120`)

Regla: **denominador = paso n − 2 del numerador, con piso en `--fs-xs`**; mono 500, `--text-3`.

| Numerador | Denominador |
|:--|:--|
| `--fs-3xl` 25 (n=5, scorecard) | `--fs-xl` 20 (n=3) |
| `--fs-lg` 18 (n=2, encabezado de card, flashcard) | `--fs-sm` 14 (n=0) |
| `--fs-sm` 14 (n=0, filas, nodos, HUD) | `--fs-xs` 12 (piso) |
| `--fs-xs` 12 (pills) | `--fs-xs` 12 (piso; solo cambia el color) |

Ambos en mono tabular, alineados por baseline.

Medida de lectura: `max-width: 68ch` (≈ 680px a 16px) en la columna de estudio.

---

## 3. Espaciado y dimensiones (grid de 4px)

| Token | px | Uso típico |
|:--|:--:|:--|
| `--sp-1` | 4 | Icono ↔ texto en pills, padding de contenedores de segmentos |
| `--sp-2` | 8 | Gap entre controles de una barra, padding de paleta |
| `--sp-3` | 12 | Padding horizontal de filas/avisos, gap de grilla densa |
| `--sp-4` | 16 | Padding de card/panel, gutter móvil |
| `--sp-5` | 20 | Separación entre grupos dentro de una sección |
| `--sp-6` | 24 | Padding de columna de estudio, gutter desktop |
| `--sp-8` | 32 | Separación entre secciones de la card |
| `--sp-10` | 40 | Separación entre bloques mayores (máximo vacío permitido) |
| `--sp-12` | 48 | Solo márgenes de estados vacíos |

Única excepción al grid: hairlines de 1px, trazos de 2px y el offset de foco de 2px.

### 3.1 Alturas de control (explícitas, anti-CLS)

| Token | Desktop | Móvil (<768) | Uso |
|:--|:--:|:--:|:--|
| `--ctl-xs` | 24 | 32 | Pills interactivas compactas, kbd |
| `--ctl-sm` | 28 | 40 | Botones de toolbar, icon buttons secundarios |
| `--ctl-md` | 32 | 44 | Botón estándar, input, select, tab |
| `--ctl-lg` | 40 | 48 | Primario de sección, input de la paleta |
| `--bar-h` | 52 | 56 | Barra superior del canvas y de la sesión |
| `--dock-h` | — | 64 + `env(safe-area-inset-bottom)` | Dock de navegación móvil |
| `--sidebar-w` | 248 (colapsada 56) | — | Sidebar |
| `--rail-w` | 320 | — | Riel de contexto de la card |
| `--rail-track` | 4 (8 en el scorecard) | 4 | Grosor del riel de puntaje |

Todo target táctil en móvil ≥ 44×44 (los de 32/40 amplían su área con un pseudo-elemento hasta 44).

### 3.2 Breakpoints

| Nombre | Rango | Cambio estructural |
|:--|:--|:--|
| `mobile` | < 48em (768) | Sin sidebar; dock inferior; sesión sin riel |
| `tablet` | 48em–68.74em | Sidebar colapsada a 56 (iconos + tooltip); riel de la card como sección final |
| `desktop` | 68.75em–89.99em | Sidebar 248; riel 320 |
| `wide` | ≥ 90em (1440) | Igual; el mapa centra a `max-width: 1320px` |

---

## 4. Radios concéntricos

Regla: **`radio_exterior = radio_interior + padding`** cuando el padding es menor que el radio exterior. Si el padding ≥ radio exterior, el hijo no toca la curva y usa su propio token (exento).

| Token | px | Elemento |
|:--|:--:|:--|
| `--r-xs` | 4 | kbd, code inline, pills internas |
| `--r-sm` | 6 | Botones, inputs, tabs, items de menú, segmentos |
| `--r-md` | 8 | Avisos inline, tooltips, filas de la paleta |
| `--r-group` | 10 | Segmented controls, menús, popovers con lista (6 + 4) |
| `--r-lg` | 12 | Cards del mapa, nodos del grafo, bloques de código, HUD colapsado |
| `--r-xl` | 16 | Diálogos, paleta, drawer, HUD expandido |
| `--r-full` | 999 | Pills de estado, puntos, pistas del riel |

**Pares verificados (todos los paddings en el grid de 4px)**

| Contenedor → hijo | Exterior | Interior | Padding |
|:--|:--:|:--:|:--:|
| Segmented control → segmento | 10 | 6 | 4 |
| Menú / popover con lista → item | 10 | 6 | 4 |
| Paleta de comandos → fila de resultado | 16 | 8 | 8 |
| HUD expandido → fila de tarea | 16 | 12 | 4 |
| Card del mapa (padding 16) → botón | 12 | 6 | exento (16 ≥ 12) |
| Diálogo (padding 20/24) → botones | 16 | 6 | exento |

---

## 5. Elevación y profundidad (modo oscuro)

La profundidad se comunica con **luminosidad de superficie**. Solo los overlays proyectan sombra. Todo overlay es **más claro que su anfitrión**.

| Nivel | Elementos | Superficie | Borde | Sombra |
|:--|:--|:--|:--|:--|
| 0 — lienzo | App, sesión de estudio | `--bg-app` | — | — |
| 1 — contenido | Cards, nodos, filas, paneles | `--surface-1` | `--line` | `inset 0 1px 0 rgba(255,248,230,.04)` |
| 2 — hover/activo | Hover y press de cualquier nivel | superficie base **propia** del elemento + `--hover-overlay` / `--press-overlay` | solo si el elemento ya tenía borde: `--line` → `--line-strong`; un elemento seleccionado conserva su borde `--accent` | sin cambio |
| 3 — modal | Drawer de ajustes, diálogo de flashcard, confirmaciones | `--surface-1` sobre `--scrim` | `--line-strong` | `--shadow-modal` |
| 4 — paleta | Paleta de comandos | `--surface-2` sobre `--scrim` | `--line-strong` | `--shadow-modal` |
| 5 — flotante | Popovers, menús, tooltips, deep dive, HUD expandido | `--surface-3` | `--line-strong` | `--shadow-pop` |

`--shadow-pop: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px -6px rgba(0,0,0,.55)`
`--shadow-modal: 0 2px 4px rgba(0,0,0,.35), 0 12px 32px -8px rgba(0,0,0,.6), 0 32px 80px -24px rgba(0,0,0,.7)`

Así, un menú dentro del drawer (s3 sobre s1) o dentro de la paleta (s3 sobre s2) siempre queda por encima visualmente. Sin glows, gradientes de fondo ni glassmorphism (única excepción: `--bar-glass` y el blur del `--scrim`, 8px).

---

### 5.1 Toasts
Superficie `--surface-3`, borde `--line-strong`, `--r-lg` 12, `--shadow-pop`, padding 12×16, ancho 360–400px. Contenido: icono semántico 16px (§1.4 avisos) + texto `--fs-sm` `--text-1` + acción opcional (botón ghost, p. ej. "Deshacer") + cerrar. Posición: abajo a la derecha a 16px (desktop); en móvil centrado, 12px por encima del dock. Duración 5s (pausa en hover/foco); `role="status"` (éxito/info) o `role="alert"` (error). Máximo 3 apilados (gap 8).

## 6. Iconografía
- Set: **lucide** (`lucide-react`), trazo 1.5px, tamaños 16 (inline/controles) y 20 (navegación). Color `currentColor`.
- Cero emoji en la UI. Reemplazos: 🧠 → `BrainCircuit`, ⚖️ → `Scale`, ✨ → `Sparkles`, 🔥 → `Flame`, ⚡ → `Zap`, 🏆 → `Trophy`, ✓ → `Check`, 🗺 → `Map`, 📊 → `BarChart3`, ⚙ → `Settings2`.
- Icon buttons siempre con `aria-label` + tooltip.

## 7. Movimiento

| Token | Valor | Uso |
|:--|:--|:--|
| `--dur-1` | 120ms | Hover, color, opacidad |
| `--dur-2` | 180ms | Popovers, tooltips, tabs |
| `--dur-3` | 240ms | Drawers, diálogos, capa de estudio |
| `--dur-flip` | 420ms | Volteo de flashcard |
| `--ease-out` | `cubic-bezier(.2,0,0,1)` | Entradas |
| `--ease-in-out` | `cubic-bezier(.4,0,.2,1)` | Transformaciones |
| `--move-1` / `--move-2` / `--move-3` / `--move-4` | 4 / 8 / 16 / 24px | Distancias de entrada: popover / capa de estudio / drawer / hoja inferior |

Entradas: opacidad 0→1 + `translateY(4px)` o `scale(.98)`. Salidas al 70% de la duración. `prefers-reduced-motion: reduce` → solo opacidad; el volteo 3D se reemplaza por fundido de `--dur-2`; skeleton y pulso quedan estáticos.

## 8. Elementos firma

### 8.1 Riel de puntaje (Score rail)
La pieza de datos central. Pista de 120 unidades:
- Pista `--surface-inset`, alto `--rail-track` (4px; 8px en el scorecard), `--r-full`.
- Segmento base 0–100: `--rail-base` (papel apagado) si < 100; `--mastery` si ≥ 100.
- Marca en 100: 1px `--text-3`, alto pista + 4px, centrada.
- Segmento extra 100–120: `--gold`, separado 1px del base.
- Lectura: mono 500 "`112`" + "`/120`" (§2.6); si > 100, prefijo `★` en `--gold`; si ≥ 100 sin extra, `✓` en `--mastery`.
- Sin evaluación: pista vacía + texto "Sin evaluar" `--text-3`.
- Variante juez pedagógico (0–100, meta 95): misma pista de 100 unidades, marca en 95.

### 8.2 Punto de categoría
Círculo 8px con el color de categoría + label `--text-2`. Única representación de categoría.

### 8.3 Eyebrow
`--fs-2xs`, 600, MAYÚSCULAS, +0.04em, `--text-3`. Máximo uno por sección. Nunca en color.

### 8.4 Superficie de lectura
Columna de 68ch sobre `--bg-app` sin card; títulos de sección `--fs-lg`, separación `--sp-8`. Solo las piezas estructuradas (código, tabla, diagrama, comparación) usan `--surface-inset`/`--surface-1`.

## 9. Voz y copy
- Español rioplatense (vos), directo y técnico. *Sentence case*; MAYÚSCULAS solo en eyebrows.
- Números con formato es-AR; puntajes siempre `n/120`; porcentajes sin decimales.
- Estados de IA dicen qué pasa y qué hacer: "No se pudo conectar con el servicio de IA. Revisá que el gateway esté iniciado y reintentá."
- Respaldo: "El archivo incluye tus API keys. Guardalo en un lugar seguro."
- Sin exclamaciones ni emoji. La excelencia se celebra con ★ y oro.

## 10. Capas (z-index)

Orden por flujo real: los popovers siempre se abren desde la capa superior activa, por eso van por encima de todas las capas de contenido.

| Token | Valor | Capa |
|:--|:--:|:--|
| `--z-base` | 0 | Contenido |
| `--z-sticky` | 10 | Barras sticky internas (tabs de la card, cabeceras de grupo) |
| `--z-chrome` | 20 | Barra superior, sidebar, dock móvil |
| `--z-study` | 30 | Sesión de estudio (capa completa sobre el shell) |
| `--z-hud` | 40 | HUD de tareas (visible también durante el estudio) |
| `--z-drawer` | 50 | Drawer de ajustes (scrim en 49) |
| `--z-modal` | 60 | Diálogos: flashcard, confirmación (scrim en 59) |
| `--z-palette` | 70 | Paleta de comandos (scrim en 69) |
| `--z-popover` | 80 | Popovers, menús, deep dive |
| `--z-toast` | 90 | Toasts (ver §5.1) |
| `--z-tooltip` | 100 | Tooltips |

## 11. Base de accesibilidad
- Foco visible: `outline: 2px solid var(--accent); outline-offset: 2px;` solo `:focus-visible` (iris 6.2–7.6:1 contra cualquier superficie).
- Scrollbars: `scrollbar-width: thin; scrollbar-color: rgba(255,248,230,.14) transparent;` (WebKit 8px, thumb `--r-full`).
- `::selection { background: var(--selection); color: var(--text-1); }`
- `color-scheme: dark` en `:root`.

## 12. Representación auténtica
Maquetas, fixtures y estados usan contenido real. Set canónico de ejemplos (nodos reales de `src/`):

| Caso | Grafo | Nodo real | Estado de ejemplo |
|:--|:--|:--|:--|
| Excelencia | React | "Estado, snapshots y batching" | 112/120, ★ Profundización extra |
| Dominio exacto | React | "Hooks y reglas de uso" | 100/120, ✓ Base cubierta |
| En progreso | React | "useState vs useReducer" | 74/120, En progreso |
| Revisar | Rails | "Routing RESTful" | 41/120, Conviene revisar |
| Sin evaluar | Rails | "Request lifecycle & Rack" | Sin evaluar, prerrequisitos pendientes |
| Label más largo | React | "Layout resiliente, contenido e internacionalización" | Prueba de truncado a 2 líneas |
| Punto de partida | React | "JavaScript moderno para leer React" | Mejor siguiente |

Prohibido lorem ipsum, "Card title", "User 1".

## Changelog
- **3.1.3** (Fase 2): `--surface-2` pasa a usarse para el segmento activo de segmented controls (antes "tab activa de la card"; las pestañas de etapa usan indicador, sin fondo). Se agregan los tokens de distancia `--move-1…4` (§7).
- **3.1.2** — sello de Fase 0.
