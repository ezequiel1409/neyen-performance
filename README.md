# NEYEN Performance OS ⚡🏋️‍♂️

> Plataforma de Preparación Física Periodizada, Autocálculo de Cargas (%1RM) y Monitoreo Biológico del Atleta (Temporada 2025-2026).

---

## 🌟 Características Principales

### 1. Jerarquía de Periodización Deportiva Completa
* **Macrociclo (Anual / 52 Semanas / 13 Mesociclos)** con Objetivo General como en la planilla oficial de NEYEN 2025-2026.
* **Mesociclos y Microciclos** con segmentación de objetivos específicos de fase.
* **Flexibilidad Arquitectónica**: Soporte para saltarse el mesociclo cuando el coach necesita microciclos directos de transición.
* **Bloques y Supersets**: Series simples, biseries/supersets, triseries y circuitos con RPE asignado.

### 2. Motor de Autocálculo de Cargas (%1RM)
* Fórmulas automáticas de **Epley** ($1RM = Peso \times (1 + Reps/30)$) y **Brzycki** ($1RM = Peso \times \frac{36}{37 - Reps}$).
* **Ratios de conversión** para ejercicios derivados sin test propio (ej. *Press inclinado* al 83% del *Press plano*).
* **Autorregulación Hormonal Automática**: Reducción del -7.5% de carga para atletas femeninas en Fase Lútea Tardía o primeros días de menstruación.

### 3. Fisiología Femenina & Prevención de RED-S
* Monitoreo de fases: Menstrual, Folicular, Ovulatoria y Lútea.
* **Botón «Reportar Retraso»**: Pausa la predicción automática y activa una alerta preventiva en el panel del coach para vigilar el déficit energético relativo al deporte (**RED-S**).

### 4. Experiencia Móvil del Alumno (Sin Fricción)
* Visualización directa de series y kilos calculados.
* Temporizador de descanso flotante.
* **Cierre en 1-Tap**: Botón destacado **«Finalizar Entrenamiento»** (sin requerir tildar serie por serie).
* **Respuesta al Entrenamiento (sRPE de Foster)**: Cuantificación científica de la carga interna ($UA = sRPE \times Minutos$).

### 5. Novedades MLP
* **Galería de Fotos de Progreso**: Registro visual cronológico con comparador «Antes vs Después».
* **Monitoreo de Descanso & Smartwatch**: Fases de Sueño REM, Profundo, HRV y simulación de sincronización con wearables (Whoop / Apple Watch / Garmin).

---

## 🚀 Instalación y Ejecución Local

```bash
# Clonar el repositorio
git clone https://github.com/ezequiel1409/neyen-performance.git
cd neyen-performance

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🛠️ Stack Tecnológico
* **Frontend**: React 19, TypeScript, Vite
* **Estilos**: Tailwind CSS v4 (Dark Mode deportivo de alto contraste)
* **Iconografía**: Lucide React
* **Arquitectura de Estado**: React Context API con persistencia local en `localStorage`
