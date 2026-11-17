---
name: NEYIMA Athletic Performance OS
description: Sistema de diseño para rendimiento atlético, periodización y control epidemiológico de cargas
colors:
  primary: "#3C0016"
  accent-red: "#F92424"
  neutral-sand: "#D1C0A5"
  ink-deep: "#1F0009"
  light-bg: "#F1EADD"
  light-surface: "#FAF6EE"
  light-border: "#D1C0A5"
  light-text: "#3C0016"
  light-muted: "#6A3B49"
  dark-bg: "#3C0016"
  dark-surface: "#4D0E26"
  dark-border: "#7A3A52"
  dark-text: "#F1EADD"
  dark-muted: "#D9CBB5"
  state-ok-bg: "#DCEBDD"
  state-ok-text: "#1B5A37"
  state-warn-bg: "#F6E3B4"
  state-warn-text: "#6B4500"
  state-proc-bg: "#DCE6F2"
  state-proc-text: "#1D3F66"
  state-neu-bg: "#E6D7BE"
  state-neu-text: "#3C0016"
  state-bad-bg: "#F6D5D2"
  state-bad-text: "#9B1111"
typography:
  family: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
  display:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: "1.2"
  heading:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.3"
  subheading:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.4"
  body:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5"
  caption:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.4"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.light-bg}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  card:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: NEYIMA Athletic Performance OS

## Overview
NEYIMA es un sistema de diseño atlético de alta precisión, sobrio y riguroso. Combina una paleta institucional profunda (Burdeos `#3C0016`, Arena `#D1C0A5`, Tinta `#1F0009`) con un acento dinámico de alta visibilidad (Rojo `#F92424`) y un sistema semántico de 5 estados accesibles.

## Colors
- **Burdeos Principal (`#3C0016`):** Tono rector de la identidad. Representa rigor, fuerza y disciplina.
- **Rojo de Acento (`#F92424`):** Energía atlética pura. **Regla de oro:** Se reserva exclusivamente para el isotipo de marca NEYIMA y para destacar el **mesociclo actual activo (M04)**. *Nunca se utiliza como color de botones de acción ni como fondo de alertas comunes.*
- **Arena Neutro (`#D1C0A5`):** Soporte orgánico, bordes contenedores y chips secundarios.
- **Tinta Profunda (`#1F0009`):** Contraste tipográfico máximo.
- **5 Estados Semánticos Deportivos:**
  1. `ok`: Cumplido, Sweet Spot, En plan (`#DCEBDD` / `#1B5A37`).
  2. `warn`: Atención requerida, Check-in pendiente (`#F6E3B4` / `#6B4500`).
  3. `proc`: En proceso, Molestia reportada (`#DCE6F2` / `#1D3F66`).
  4. `neu`: Neutro, Descanso programado (`#E6D7BE` / `#3C0016`).
  5. `bad`: Riesgo alto, ACWR peligroso (>1.5), Alerta médica (`#F6D5D2` / `#9B1111`).

## Typography
- Tipografía oficial: **Plus Jakarta Sans** (pesos 400, 500, 700 y 800) servida localmente en formato woff2 para garantizar velocidad y funcionamiento offline.
- Jerarquía estricta:
  - Display / KPIs: 32px a 36px, peso 800 (ExtraBold).
  - Títulos de sección: 20px a 24px, peso 700 (Bold).
  - Subtítulos y etiquetas de bloque: 14px a 16px, peso 600 (SemiBold).
  - Cuerpo de texto y datos: 14px, peso 400 (Regular).
  - Metadatos y microcopy: mínimo 12px (evitar textos de 10-11px para legibilidad en pista/gimnasio).

## Layout
- **Mobile First para Alumno:** Ancho máximo optimizado para smartphones (390px - 430px), barra de navegación inferior fija (`<BottomNav />`) con 5 pestañas clave y áreas táctiles de al menos 48x48px.
- **Desktop / Tablet First para Coach:** Sidebar lateral colapsable, layouts fluidos con grid de 12 columnas para dashboards de alto rendimiento, tablas con scroll horizontal seguro y tarjetas analíticas modulares.

## Elevation & Depth
- El sistema utiliza **profundidad plana y semántica** en lugar de sombras difusas exageradas.
- Las tarjetas se delimitan mediante bordes continuos de 1px con `var(--bord)` y cambios de superficie entre fondo (`--bg`) y tarjeta (`--surf`).
- Modales y sheets flotantes utilizan un backdrop burdeos semitransparente con desenfoque (`backdrop-blur-sm`).

## Shapes
- Radios consistentes:
  - Primitivas pequeñas (badges, chips, inputs): `rounded-md` (8px).
  - Tarjetas y contenedores de sesión: `rounded-xl` (12px - 14px).
  - Píldoras de estado y switches: `rounded-full` (9999px).

## Components
- `<Button />`: Variante primaria (fondo Burdeos en modo claro, fondo Crema en modo oscuro; texto invertido de alto contraste), variante secundaria (borde `var(--bord)`), y variante ghost. Foco visible obligatorio con anillo de 2px.
- `<IndicatorStatus />`: Indicador accesible que combina cápsula de color semántico, ícono SVG explícito y texto unívoco (`ok`, `warn`, `proc`, `neu`, `bad`).
- `<WorkoutBlockItem />`: Bloque de ejercicio con orden secuencial (A1, A2, B1), inputs numéricos de kg y reps con botones +/- de 48px para facilitar el ajuste con dedos húmedos.
- `<NeyimaLogo />`: Renderiza el isotipo y el lockup oficial con respeto a los fondos claro y oscuro.

## Do's and Don'ts
- **DO:** Acompañar siempre los colores de estado con un ícono y texto explícito.
- **DO:** Mantener áreas de toque mínimas de 48px para todos los botones en la vista del atleta.
- **DO:** Usar las variables semánticas CSS (`var(--bg)`, `var(--surf)`, `var(--txt)`, etc.) en lugar de clases Tailwind arbitrarias como `bg-[#15332B]`.
- **DON'T:** Usar el rojo `#F92424` en botones de acción, bordes genéricos o badges que no sean el logo o el mesociclo M04 activo.
- **DON'T:** Usar textos de tamaño menor a 12px en el cuerpo de la aplicación.
- **DON'T:** Utilizar gradientes violetas o púrpuras genéricos de IA.
