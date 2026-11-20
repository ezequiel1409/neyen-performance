-- =====================================================================
-- NEYIMA ATHLETIC PERFORMANCE OS - ESQUEMA DE BASE DE DATOS D1 / SQLITE
-- Cumple estrictamente con Clean Architecture y principios de mínima exposición
-- =====================================================================

PRAGMA foreign_keys = ON;

-- 1. TABLA MAESTRA DE USUARIOS (RBAC)
CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    avatar_url TEXT,
    rol TEXT NOT NULL CHECK(rol IN ('COACH', 'ALUMNO')),
    google_sub TEXT UNIQUE,
    perfil_completado INTEGER NOT NULL DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_google_sub ON usuarios(google_sub);

-- 2. TABLA DE PERFILES DE COACH
CREATE TABLE IF NOT EXISTS coaches (
    id_usuario TEXT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    institucion TEXT,
    especialidad TEXT,
    biografia TEXT,
    codigo_invitacion TEXT UNIQUE NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coaches_codigo_invitacion ON coaches(codigo_invitacion);

-- 3. TABLA DE PERFILES DE ATLETAS (ALUMNOS)
CREATE TABLE IF NOT EXISTS atletas (
    id_usuario TEXT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    id_coach TEXT REFERENCES coaches(id_usuario) ON DELETE SET NULL,
    genero TEXT NOT NULL CHECK(genero IN ('M', 'F', 'OTRO')),
    fecha_nacimiento TEXT,
    deporte TEXT NOT NULL,
    posicion TEXT,
    peso_kg REAL,
    altura_cm REAL,
    monitoreo_ciclo_activo INTEGER NOT NULL DEFAULT 0,
    fum TEXT, -- Fecha de Última Menstruación (Privado)
    duracion_ciclo_dias INTEGER DEFAULT 28,
    compartir_ciclo_coach INTEGER NOT NULL DEFAULT 1, -- Control de Privacidad Femenina
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_atletas_id_coach ON atletas(id_coach);

-- 4. CATÁLOGO: CATEGORÍAS DE EJERCICIO
CREATE TABLE IF NOT EXISTS categorias_ejercicio (
    id TEXT PRIMARY KEY,
    nombre TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CATÁLOGO: EQUIPAMIENTOS
CREATE TABLE IF NOT EXISTS equipamientos (
    id TEXT PRIMARY KEY,
    nombre TEXT UNIQUE NOT NULL,
    icono TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. BANCO DE EJERCICIOS CON RATIOS DE CONVERSIÓN DE 1RM
CREATE TABLE IF NOT EXISTS ejercicios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    id_categoria TEXT NOT NULL REFERENCES categorias_ejercicio(id),
    id_equipamiento TEXT NOT NULL REFERENCES equipamientos(id),
    id_ejercicio_base_test TEXT, -- ID del ejercicio para el 1RM de referencia
    ratio_conversion_carga REAL NOT NULL DEFAULT 1.0, -- Factor de conversión respecto al 1RM base
    video_url TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ejercicios_categoria ON ejercicios(id_categoria);

-- 7. TESTS DE FUERZA MÁXIMA (1RM)
CREATE TABLE IF NOT EXISTS tests_fuerza (
    id TEXT PRIMARY KEY,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    id_ejercicio_base TEXT NOT NULL REFERENCES ejercicios(id),
    peso_levantado_kg REAL NOT NULL,
    repeticiones_realizadas INTEGER NOT NULL,
    rpe_real REAL NOT NULL DEFAULT 10.0,
    una_rm_efectiva REAL NOT NULL,
    formula_utilizada TEXT NOT NULL DEFAULT 'EPLEY' CHECK(formula_utilizada IN ('EPLEY', 'BRZYCKI')),
    fase_ciclo TEXT,
    fecha_evaluacion TEXT NOT NULL,
    notas TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tests_fuerza_atleta ON tests_fuerza(id_atleta);

-- 8. SCREENING DE MOVILIDAD ARTICULAR
CREATE TABLE IF NOT EXISTS evaluaciones_movilidad (
    id TEXT PRIMARY KEY,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    articulacion TEXT NOT NULL, -- Tobillo, Cadera, Hombro, Columna, etc.
    movilidad_derecha_grados REAL,
    movilidad_izquierda_grados REAL,
    clasificacion TEXT NOT NULL CHECK(clasificacion IN ('OPTIMO', 'REGULAR', 'LIMITADO')),
    presenta_dolor INTEGER NOT NULL DEFAULT 0,
    fecha_evaluacion TEXT NOT NULL,
    observaciones TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eval_movilidad_atleta ON evaluaciones_movilidad(id_atleta);

-- 9. MACROCICLOS (PLANIFICACIÓN DE TEMPORADA)
CREATE TABLE IF NOT EXISTS macrociclos (
    id TEXT PRIMARY KEY,
    id_coach TEXT NOT NULL REFERENCES coaches(id_usuario) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    anio INTEGER NOT NULL,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT NOT NULL,
    mesociclo_activo_numero INTEGER NOT NULL DEFAULT 4,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_macrociclos_coach ON macrociclos(id_coach);

-- 10. MESOCICLOS (ESTRUCTURA DE LOS 13 MESOCICLOS)
CREATE TABLE IF NOT EXISTS mesociclos (
    id TEXT PRIMARY KEY,
    id_macrociclo TEXT NOT NULL REFERENCES macrociclos(id) ON DELETE CASCADE,
    numero_mesociclo INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    objetivo_fisiologico TEXT NOT NULL,
    rango_rm_porcentaje TEXT,
    semanas_json TEXT NOT NULL, -- Configuración de microciclos y descargas
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mesociclos_macro ON mesociclos(id_macrociclo);

-- 11. SESIONES PLANIFICADAS (PRESCRIPCIÓN GRANULAR)
CREATE TABLE IF NOT EXISTS sesiones_planificadas (
    id TEXT PRIMARY KEY,
    id_macrociclo TEXT REFERENCES macrociclos(id) ON DELETE SET NULL,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    nombre_sesion TEXT NOT NULL,
    fecha_programada TEXT NOT NULL,
    duracion_estimada_minutos INTEGER NOT NULL DEFAULT 60,
    rpe_objetivo REAL NOT NULL DEFAULT 8.0,
    notas_coach TEXT,
    bloques_json TEXT NOT NULL, -- Bloques A, B, C con series, reps, %1RM, RIR, micropausas
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sesiones_plan_atleta ON sesiones_planificadas(id_atleta, fecha_programada);

-- 12. HISTORIAL DE SESIONES COMPLETADAS (FOSTER sRPE Y CARGA UA)
CREATE TABLE IF NOT EXISTS historial_sesiones (
    id TEXT PRIMARY KEY,
    id_sesion_planificada TEXT REFERENCES sesiones_planificadas(id) ON DELETE SET NULL,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    fecha_finalizacion TEXT NOT NULL,
    duracion_real_minutos INTEGER NOT NULL,
    srpe_foster INTEGER NOT NULL CHECK(srpe_foster BETWEEN 1 AND 10),
    carga_ua INTEGER NOT NULL, -- sRPE * duracion_real_minutos
    fatiga_percibida INTEGER NOT NULL CHECK(fatiga_percibida BETWEEN 1 AND 5),
    presenta_dolor INTEGER NOT NULL DEFAULT 0,
    zona_dolor TEXT,
    comentarios TEXT,
    series_completadas_json TEXT NOT NULL, -- Series, kg reales y reps reales ejecutadas
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_historial_atleta ON historial_sesiones(id_atleta);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_sesiones(fecha_finalizacion);

-- 13. CHECK-INS DIARIOS DE BIENESTAR (1 MINUTO)
CREATE TABLE IF NOT EXISTS checkins_bienestar (
    id TEXT PRIMARY KEY,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    fecha TEXT NOT NULL,
    suenio INTEGER NOT NULL CHECK(suenio BETWEEN 1 AND 5),
    fatiga INTEGER NOT NULL CHECK(fatiga BETWEEN 1 AND 5),
    dolor_muscular INTEGER NOT NULL CHECK(dolor_muscular BETWEEN 1 AND 5),
    estres INTEGER NOT NULL CHECK(estres BETWEEN 1 AND 5),
    animo INTEGER NOT NULL CHECK(animo BETWEEN 1 AND 5),
    score_preparacion_porcentaje INTEGER NOT NULL, -- (suma / 25) * 100
    estado_label TEXT NOT NULL, -- Optimo, Moderado, Alerta
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_atleta, fecha)
);

CREATE INDEX IF NOT EXISTS idx_bienestar_atleta_fecha ON checkins_bienestar(id_atleta, fecha);

-- 14. CONTROL EPIDEMIOLÓGICO DE CARGA ACWR
CREATE TABLE IF NOT EXISTS control_carga_acwr (
    id TEXT PRIMARY KEY,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    fecha_calculo TEXT NOT NULL,
    carga_aguda_7d INTEGER NOT NULL,
    carga_cronica_28d INTEGER NOT NULL,
    ratio_acwr REAL NOT NULL,
    zona_fisiologica TEXT NOT NULL CHECK(zona_fisiologica IN ('SUBENTRENAMIENTO', 'SWEET_SPOT', 'PRECAUCION', 'RIESGO')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_acwr_atleta_fecha ON control_carga_acwr(id_atleta, fecha_calculo);

-- 15. CENTRO OPERATIVO DE ALERTAS
CREATE TABLE IF NOT EXISTS alertas_sistema (
    id TEXT PRIMARY KEY,
    id_coach TEXT NOT NULL REFERENCES coaches(id_usuario) ON DELETE CASCADE,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK(tipo IN ('DOLOR', 'CICLO', 'ACWR', 'BIENESTAR', 'SESION_PENDIENTE')),
    severidad TEXT NOT NULL CHECK(severidad IN ('ROJA', 'AMBAR', 'NEUTRA')),
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    resuelta INTEGER NOT NULL DEFAULT 0,
    fecha_resolucion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alertas_coach ON alertas_sistema(id_coach, resuelta);

-- 16. REGISTROS PRIVADOS DE COMPOSICIÓN CORPORAL Y FOTOS DE PROGRESO
CREATE TABLE IF NOT EXISTS fotos_progreso (
    id TEXT PRIMARY KEY,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    fecha TEXT NOT NULL,
    url_foto TEXT NOT NULL,
    tipo_vista TEXT NOT NULL CHECK(tipo_vista IN ('FRENTE', 'PERFIL', 'ESPALDA')),
    peso_kg REAL NOT NULL,
    notas TEXT,
    privado INTEGER NOT NULL DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fotos_atleta ON fotos_progreso(id_atleta);

-- 17. WEARABLES Y MONITOR DE SUEÑO
CREATE TABLE IF NOT EXISTS registros_descanso (
    id TEXT PRIMARY KEY,
    id_atleta TEXT NOT NULL REFERENCES atletas(id_usuario) ON DELETE CASCADE,
    fecha_noche TEXT NOT NULL,
    horas_suenio REAL NOT NULL,
    hrv_ms INTEGER NOT NULL,
    fc_reposo_lpm INTEGER NOT NULL,
    calidad_subjetiva INTEGER NOT NULL CHECK(calidad_subjetiva BETWEEN 1 AND 5),
    fuente_wearable TEXT NOT NULL DEFAULT 'Manual',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_descanso_atleta ON registros_descanso(id_atleta);
