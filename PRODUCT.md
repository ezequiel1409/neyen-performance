# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
- **Coach / Preparador Físico:** Responsable de la planificación de temporada (13 mesociclos), monitoreo de cargas agudas/crónicas (ACWR), prevención epidemiológica de lesiones y análisis del rendimiento de la plantilla. Opera principalmente en entornos de escritorio y tablet.
- **Atleta / Alumno:** Deportista que ejecuta entrenamientos en pista, campo o gimnasio; registra sensaciones subjetivas (sRPE Foster), bienestar diario (sueño, estrés, fatiga, DOMS) y monitorea su ciclo menstrual y marcas de fuerza. Opera en dispositivos móviles (PWA/Smartphone) a menudo con una sola mano y en movimiento.

## Product Purpose
NEYEN Performance OS (bajo el sistema de diseño NEYIMA) es un sistema operativo integral de rendimiento atlético y periodización científica. Erradica la intuición empírica en el entrenamiento mediante autorregulación fisiológica, control biométrico de la fatiga acumulada y prescripción deportiva de alta precisión.

## Positioning
Diferencial fisiológico y metodológico único frente a apps convencionales de fitness:
- Control de carga acoplada y desacoplada mediante ratio ACWR (Acute:Chronic Workload Ratio).
- Cuantificación de fatiga acumulada mediante Unidades Arbitrarias de Foster ($UA = sRPE \times \text{minutos}$).
- Autorregulación hormonal del ciclo menstrual femenino (-7.5% de carga prescrita en fase lútea tardía).
- Prescripción matemática por %1RM (Epley/Brzycki) y RIR (Reps in Reserve).

## Operating Context
- **Entorno del Atleta:** Sala de pesas, pista de tartán, cancha, vestuario. Manos húmedas/sudadas, iluminación variable (sol exterior o fluorescentes de gimnasio), ruido ambiental y tiempos muertos breves (descansos de 60-180 segundos).
- **Entorno del Coach:** Oficina técnica, banquillo, sala de kinesiología o análisis en casa. Consulta tablas comparativas, alertas médicas, gráficos de carga y programas de periodización.

## Capabilities and Constraints
- **Control de Acceso por Roles (RBAC):** Vistas y capacidades totalmente diferenciadas entre Coach y Alumno.
- **Regla Estricta de Color NEYIMA:** El rojo de acento `#F92424` está reservado exclusivamente para el isotipo de marca y el mesociclo activo (M04). Está estrictamente prohibido en botones de acción o badges genéricos.
- **Privacidad Biomédica:** Módulo de ciclo ovárico/menstrual con selector de privacidad para resguardar la intimidad de la atleta.
- **Arquitectura Limpia:** Separación estricta en capas (Dominio puro sin dependencias, Aplicación, Infraestructura y Presentación).

## Brand Commitments
- **Nombre de Marca:** NEYIMA Athletic Performance OS.
- **Paleta Oficial:** Burdeos dominante `#3C0016`, Arena de soporte `#D1C0A5`, Tinta profunda `#1F0009`, Acento atlético `#F92424`.
- **Tipografía Institucional:** Plus Jakarta Sans (pesos 400, 500, 700 y 800) servida localmente en formato woff2.
- **Iconografía Unificada:** 24 iconos SVG de interfaz y 4 iconos de disciplinas deportivas (`running`, `fuerza`, `natacion`, `equipo`).

## Evidence on Hand
- Especificación oficial de diseño y 62 maquetas: `c:\Users\Ezequ\Documents\neyen`.
- Código fuente en producción: Desplegado en Cloudflare Workers (`https://neyen-performance.facuezedrive.workers.dev`).
- Reglas y directrices de ingeniería: `GEMINI.md`.

## Product Principles
1. **Rigor Fisiológico:** Cada número y porcentaje en pantalla tiene un fundamento en las ciencias del ejercicio; nada es decorativo o arbitrario.
2. **Fricción Cero en Campo:** El check-in diario toma menos de 60 segundos y el registro de una serie de entrenamiento se completa en dos toques táctiles.
3. **Escaneabilidad Inmediata para el Coach:** Las alertas de riesgo (dolor reportado, desvío ACWR > 1.5) saltan visualmente a la vista sin requerir navegación profunda.
4. **Accesibilidad Deportiva (WCAG 2.2 AA):** Ningún estado descansa solo en el color; siempre se acompaña de texto unívoco e icono reconocible.

## Accessibility & Inclusion
- Estándar WCAG 2.2 AA con ratio de contraste reforzado.
- Zonas táctiles mínimas de 48x48px en componentes interactivos móviles.
- Textos legibles evitando fuentes por debajo de 12px en elementos de lectura crítica.
