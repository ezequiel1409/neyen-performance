-- =====================================================================
-- NEYEN ATHLETIC PERFORMANCE OS - ESQUEMA SQL (CLOUDFLARE D1 / SQLITE)
-- =====================================================================

-- 1. Categorías de Ejercicios
CREATE TABLE IF NOT EXISTS categorias_ejercicio (
    identificador_categoria TEXT PRIMARY KEY,
    nombre_categoria TEXT NOT NULL,
    descripcion_categoria TEXT,
    color_distintivo_hex TEXT NOT NULL,
    orden_visualizacion INTEGER DEFAULT 0
);

-- 2. Equipamientos
CREATE TABLE IF NOT EXISTS equipamientos (
    identificador_equipamiento TEXT PRIMARY KEY,
    nombre_equipamiento TEXT NOT NULL,
    descripcion_equipamiento TEXT
);

-- 3. Banco de Ejercicios
CREATE TABLE IF NOT EXISTS ejercicios (
    identificador_ejercicio TEXT PRIMARY KEY,
    nombre_ejercicio TEXT NOT NULL,
    identificador_categoria TEXT NOT NULL,
    patron_movimiento TEXT NOT NULL,
    grupo_muscular_principal TEXT NOT NULL,
    identificador_equipamiento TEXT NOT NULL,
    nivel_dificultad_estrellas INTEGER CHECK (nivel_dificultad_estrellas BETWEEN 1 AND 5),
    etiquetas_deportivas_json TEXT DEFAULT '[]',
    enlace_video_url TEXT,
    observaciones_tecnicas TEXT,
    identificador_ejercicio_base_test TEXT,
    ratio_conversion_porcentual REAL,
    FOREIGN KEY (identificador_categoria) REFERENCES categorias_ejercicio (identificador_categoria),
    FOREIGN KEY (identificador_equipamiento) REFERENCES equipamientos (identificador_equipamiento)
);

-- 4. Atletas
CREATE TABLE IF NOT EXISTS atletas (
    identificador_atleta TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    genero TEXT CHECK (genero IN ('F', 'M', 'OTRO')) NOT NULL,
    fecha_nacimiento TEXT NOT NULL,
    deporte_disciplina TEXT NOT NULL,
    posicion_o_categoria TEXT,
    peso_corporal_kg REAL NOT NULL,
    estatura_cm REAL NOT NULL,
    nivel_competitivo TEXT,
    fecha_ingreso TEXT NOT NULL,
    datos_ciclo_menstrual_json TEXT,
    lesiones_json TEXT DEFAULT '[]'
);

-- 5. Tests de Fuerza Máxima (1RM)
CREATE TABLE IF NOT EXISTS tests_fuerza (
    identificador_test TEXT PRIMARY KEY,
    identificador_atleta TEXT NOT NULL,
    identificador_ejercicio_base TEXT NOT NULL,
    nombre_ejercicio_evaluado TEXT NOT NULL,
    peso_levantado_kg REAL NOT NULL,
    repeticiones_realizadas INTEGER NOT NULL,
    rm_estimada_epley REAL NOT NULL,
    rm_estimada_brzycki REAL NOT NULL,
    rm_efectiva REAL NOT NULL,
    fecha_evaluacion TEXT NOT NULL,
    fase_ciclo_menstrual TEXT,
    FOREIGN KEY (identificador_atleta) REFERENCES atletas (identificador_atleta),
    FOREIGN KEY (identificador_ejercicio_base) REFERENCES ejercicios (identificador_ejercicio)
);

-- 6. Planes Macrociclo y Periodización
CREATE TABLE IF NOT EXISTS macrociclos (
    identificador_plan TEXT PRIMARY KEY,
    identificador_atleta TEXT NOT NULL,
    nombre_plan TEXT NOT NULL,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT NOT NULL,
    objetivo_primario TEXT NOT NULL,
    mesociclos_json TEXT NOT NULL,
    FOREIGN KEY (identificador_atleta) REFERENCES atletas (identificador_atleta)
);

-- 7. Historial de Sesiones Completadas (Feedback, RPE Foster)
CREATE TABLE IF NOT EXISTS historial_sesiones (
    identificador_registro TEXT PRIMARY KEY,
    identificador_sesion_original TEXT NOT NULL,
    identificador_atleta TEXT NOT NULL,
    fecha_completada TEXT NOT NULL,
    duracion_real_minutos INTEGER NOT NULL,
    rpe_esfuerzo_sesion INTEGER CHECK (rpe_esfuerzo_sesion BETWEEN 1 AND 10),
    carga_interna_foster REAL NOT NULL,
    calidad_sueno INTEGER CHECK (calidad_sueno BETWEEN 1 AND 5),
    nivel_dolor_muscular_doms INTEGER CHECK (nivel_dolor_muscular_doms BETWEEN 1 AND 5),
    comentarios_atleta TEXT,
    series_ejecutadas_json TEXT NOT NULL,
    FOREIGN KEY (identificador_atleta) REFERENCES atletas (identificador_atleta)
);

-- 8. Fotos de Progreso Corporal (MLP)
CREATE TABLE IF NOT EXISTS fotos_progreso (
    identificador_foto TEXT PRIMARY KEY,
    identificador_atleta TEXT NOT NULL,
    fecha_registro TEXT NOT NULL,
    url_foto TEXT NOT NULL,
    tipo_vista TEXT CHECK (tipo_vista IN ('FRENTE', 'PERFIL', 'ESPALDA')) NOT NULL,
    peso_registrado_kg REAL,
    observaciones TEXT,
    FOREIGN KEY (identificador_atleta) REFERENCES atletas (identificador_atleta)
);
