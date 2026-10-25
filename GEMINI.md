# NEYEN Athletic Performance OS - Directrices de Arquitectura y Desarrollo

Este documento define los estándares arquitectónicos, convenciones de Clean Code, modelo de datos y reglas de ingeniería obligatorias para el proyecto **NEYEN Performance OS**.

---

## 1. Principio Fundamental de Trabajo (Regla de Oro)

> **"Si algo no está claro, revisá el código y lo que conversamos. Si seguís con dudas, preguntale al usuario. No inventes requisitos ni hagas cambios fuera de lo que se solicitó."**

- **Cero Suposiciones:** Toda lógica deportiva (cálculo de 1RM, ajuste hormonal, RPE Foster, periodización) o de negocio debe estar respaldada por especificaciones verificadas.
- **Alcance Estricto:** No agregar librerías, dependencias o refactorizaciones masivas sin validación previa.
- **Preservación de Lógica Existente:** Mantener comentarios explicativos, fórmulas fisiológicas y compatibilidad con el diseño UI deportivo existente.

---

## 2. Arquitectura de Software: Clean Architecture en Capas

El proyecto debe evolucionar desde el monolito actual en React hacia una separación estricta en capas desacopladas e independientes de frameworks:

```
src/
├── core/                         # Capa de Dominio (Pureza absoluta: TS puro, sin React, sin HTTP)
│   ├── entities/                 # Entidades y tipos de negocio (Atleta, Ejercicio, Test, Sesion, Usuario)
│   ├── math/                     # Algoritmos y fórmulas fisiológicas (Epley, Brzycki, Foster, Ciclo)
│   └── errors/                   # Errores tipados de dominio
│
├── application/                  # Casos de Uso / Lógica de Aplicación
│   ├── auth/                     # IniciarSesion, CerrarSesion, RegistrarConGoogle, CompletarPerfil
│   ├── training/                 # AsignarPlan, CalcularCargas, FinalizarSesion, ReportarRetraso
│   └── ports/                    # Interfaces/Contratos (IAuthRepository, ITrainingRepository, IWearableService)
│
├── infrastructure/               # Adaptadores y Servicios Externos
│   ├── api/                      # Clientes HTTP / Cloudflare Workers / Hono
│   ├── db/                       # Adaptadores SQLite / Cloudflare D1 / Migraciones
│   ├── auth/                     # Proveedores OAuth (Google Identity Services / Supabase / Firebase)
│   └── storage/                  # LocalStorage, IndexedDB / Cache offline
│
└── presentation/                 # Capa de Presentación (React 19 + Tailwind v4)
    ├── components/               # Componentes UI reutilizables y atómicos (< 250 líneas)
    │   ├── ui/                   # Primitivas (Button, Input, Modal, Badge, Card)
    │   └── common/               # Layouts, Topbars, Navigations
    ├── features/                 # Módulos verticales por funcionalidad (Screaming Architecture)
    │   ├── auth/                 # Login, Onboarding, SelectorRol, FormularioPerfil
    │   ├── athlete/              # Dashboard, RutinaActiva, Historial, FotosProgreso, CicloMenstrual
    │   ├── coach/                # Planificador, BancoEjercicios, FichaAtleta, Macrociclo
    │   └── sleep-wearables/      # Métricas de sueño, HRV y descanso
    ├── hooks/                    # Custom hooks de consumo (useAuth, useActiveWorkout, useExercises)
    └── store/                    # Manejo de estado liviano y modular (Zustand / Contexts atómicos)
```

### Reglas de Dependencia:
1. `core` **no importa nada** de ninguna otra capa ni librerías de UI/HTTP.
2. `application` solo depende de `core`.
3. `infrastructure` implementa los `ports` definidos en `application`.
4. `presentation` interactúa con los casos de uso a través de hooks y contratos, nunca manipulando SQL o APIs directamente en componentes.

---

## 3. Estándares de Clean Code

- **Límite de Líneas por Archivo:** Ningún componente o archivo debe exceder las **250-300 líneas**. Los componentes monolíticos actuales (`PeriodizationPlannerView`, `ActiveWorkoutModal`, `ExerciseBankView`, `TrainingContext`) deben dividirse en subcomponentes modulares.
- **Responsabilidad Única (SRP):** Un componente renderiza UI; un hook gestiona estado local; un caso de uso orquesta la lógica; una entidad valida sus invariantes.
- **Eliminación del God Context:** Desmantelar `TrainingContext.tsx` en stores o contextos especializados:
  - `AuthStore`: sesión, token, usuario actual, rol.
  - `WorkoutStore`: estado de la sesión activa, temporizadores, RPE.
  - `CatalogStore`: ejercicios, categorías, equipamiento.
  - `PeriodizationStore`: macrociclo, mesociclos, microciclos.
- **Tipado Estricto y Validación:**
  - Prohibido el uso de `any`.
  - Usar esquemas de validación (ej. Zod) para datos provenientes de formularios, localStorage o endpoints externos.
- **Tokens de Diseño vs Arbitrary Tailwind:**
  - Evitar strings arbitrarios repetitivos como `bg-[#15332B]` o `border-[#244E43]`.
  - Usar variables CSS semánticas definidas en `index.css` (`var(--bg-card)`, `var(--border-subtle)`, `var(--primary-dark)`, etc.).

---

## 4. Estrategia de Autenticación Segura y Google OAuth

### Principios de Seguridad:
1. **Nunca almacenar tokens o credenciales sensibles en `localStorage` en texto plano.** Usar cookies `HttpOnly; Secure; SameSite=Lax` o mecanismos seguros de refresh token.
2. **Control de Acceso Basado en Roles (RBAC):** Separación estricta entre `COACH` y `ALUMNO`.
   - Las rutas, acciones y datos de coaches deben estar restringidos y verificados tanto en cliente como en backend.
   - Un alumno solo puede consultar y modificar sus propios entrenamientos y registros biométricos.

### Flujo de Google OAuth + Perfil Personalizado:
1. **Autenticación Federada:** Inicio con Google mediante OAuth 2.0 / OpenID Connect (ID Token / Authorization Code).
2. **Paso de Onboarding / Asignación de Rol:**
   - Si el usuario es nuevo, el sistema detecta que no tiene perfil configurado y presenta la pantalla de **Personalización de Perfil**:
     - **Si elige COACH:** Especialidad, club/gimnasio, biografía profesional, enlace de invitación para atletas.
     - **Si elige ALUMNO:** Deporte, categoría/posición, fecha de nacimiento, peso, altura, código de vinculación con su coach, y preferencias biológicas (monitoreo de ciclo menstrual opcional y privado).
3. **Persistencia de Perfil:** Los datos del perfil se asocian al identificador único de cuenta (`google_sub` o `usuario_id`).

---

## 5. Arquitectura de Base de Datos (Cloudflare D1 / SQLite)

### Convenciones de Datos:
- **Base de Datos:** Nombres de tablas y columnas en `snake_case` (ej. `identificador_atleta`, `fecha_evaluacion`).
- **Capa DTO / Dominio:** Mapeo explícito a `camelCase` al ingresar al frontend/dominio.
- **Integridad Referencial:** Claves foráneas activas (`PRAGMA foreign_keys = ON;`).
- **Auditoría:** Todas las tablas principales deben contar con `creado_en TIMESTAMP` y `actualizado_en TIMESTAMP`.

### Tablas Fundamentales Requeridas:
- `usuarios` (id, email, nombre, avatar_url, rol, google_sub, creado_en)
- `coaches` (id_usuario, institucion, especialidad, codigo_invitacion)
- `atletas` (id_usuario, id_coach, genero, fecha_nacimiento, deporte, posicion, peso_kg, altura_cm, datos_ciclo_json)
- `categorias_ejercicio` y `equipamientos`
- `ejercicios` (banco con ratios de conversión para 1RM)
- `tests_fuerza` y `tests_fisicos`
- `macrociclos`, `mesociclos`, `sesiones_planificadas`
- `historial_sesiones` (feedback sRPE de Foster)
- `fotos_progreso` y `registros_descanso_suenio`

---

## 6. Verificación y Calidad de Código

Antes de dar por completada cualquier tarea:
- Ejecutar análisis estático: `npm run lint` (oxlint).
- Verificar compilación de TypeScript: `npm run build` o `npx tsc --noEmit`.
- Comprobar que no se rompan las vistas existentes en modo claro y oscuro.

---

## 7. Convenciones de Git y Commits Atómicos por Capa

Seguimos una política estricta de commits atómicos y trazables basada en **Conventional Commits** y trazabilidad hacia **Reglas de Negocio (`BR-xx`)** y **Reglas de Arquitectura (`AR-xx`)**.

### 7.1. Formato de Mensaje de Commit:
```text
<tipo>(<ámbito>): <descripción concisa en español y minúsculas> [(BR-xx | AR-xx)]
```

### 7.2. Regla del Propósito: Qué y Para Qué
Cada mensaje debe responder a:
> **"Se edita [X] para establecer funcionalidad para el objetivo [X]"**

### 7.3. Tipos Permitidos:
- `docs`: Documentación, directrices, roadmap, especificaciones (`GEMINI.md`, `README.md`, `docs/`).
- `feat`: Nuevas capacidades funcionales o ampliación del modelo de datos.
- `fix`: Corrección de errores o comportamientos defectuosos.
- `refactor`: Reestructuración de código sin alterar su comportamiento externo ni añadir tests.
- `test`: Tests unitarios, fixtures, mocks o suites de prueba.
- `chore`: Tooling, scripts, configuración de build, CI/CD o dependencias.

### 7.4. Ámbitos (Scopes):
- `(domain)`: Entidades, fórmulas fisiológicas (1RM, Epley, Brzycki, Foster sRPE, ciclo) en `core/` o `utils/`.
- `(db)`: Esquemas SQL D1/SQLite (`schema.sql`), migraciones, adaptadores de persistencia.
- `(services)`: Casos de uso y lógica de aplicación en `application/`.
- `(athlete)`: Vistas y componentes del alumno (`src/components/athlete/`, `workout/`).
- `(coach)`: Panel del coach, ficha del atleta, macrociclos (`src/components/coach/`).
- `(planner)`: Planificador de periodización, editor de sesión, mesociclos y microciclos (`src/components/coach/planner/`).
- `(catalog)`: Banco de ejercicios, categorías y equipamientos (`src/components/coach/exercise-bank/`).
- `(wearables)`: Métricas de descanso, sueño, HRV y simulación de smartwatch.
- `(auth)`: Login, Google OAuth, control de acceso RBAC y onboarding de perfil.
- `(ui)`: Componentes UI primitivos y atómicos (`src/components/ui/`).

### 7.5. Secuencia Canónica de Commits:
Para features transversales, aplicar commits en este orden estricto:
1. `docs:` Documentación, especificación y reglas.
2. `feat(db):` Esquemas SQL y migraciones D1.
3. `feat(domain):` Entidades, tipos y fórmulas puras.
4. `feat(services):` Casos de uso y adaptadores.
5. `feat(athlete | coach | auth):` Componentes de UI y vistas.
6. `test:` Fixtures, seeds y tests unitarios.

*Nunca mezclar en un mismo commit documentación, esquemas de base de datos y vistas de usuario.*

