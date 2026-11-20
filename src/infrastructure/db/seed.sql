-- =====================================================================
-- NEYIMA ATHLETIC PERFORMANCE OS - DATOS INICIALES (SEED DATA)
-- Categorías, Equipamientos y Banco Oficial de Ejercicios
-- =====================================================================

-- Categorías
INSERT OR IGNORE INTO categorias_ejercicio (id, nombre, descripcion, orden) VALUES
('cat_fuerza_inf', 'Tren Inferior (Dominante Rodilla)', 'Sentadillas, zancadas y extensiones', 1),
('cat_cadera', 'Tren Inferior (Dominante Cadera)', 'Pesos muertos, empujes de cadera y bisagras', 2),
('cat_empuje_sup', 'Tren Superior (Empuje)', 'Press banca, militar y fondos', 3),
('cat_traccion_sup', 'Tren Superior (Tracción)', 'Dominadas, remos y jalones', 4),
('cat_core_prev', 'Core y Preventivo', 'Planchas, anti-rotaciones y movilidad', 5);

-- Equipamiento
INSERT OR IGNORE INTO equipamientos (id, nombre, icono) VALUES
('eq_barra', 'Barra Olímpica', 'dumbbell'),
('eq_mancuernas', 'Mancuernas', 'dumbbell'),
('eq_polea', 'Polea / Cable', 'activity'),
('eq_corporal', 'Peso Corporal', 'users'),
('eq_kettlebell', 'Kettlebell', 'dumbbell'),
('eq_maquina', 'Máquina Guiada', 'activity');

-- Ejercicios Base y Derivados con Ratios de Conversión para 1RM
INSERT OR IGNORE INTO ejercicios (id, nombre, descripcion, id_categoria, id_equipamiento, id_ejercicio_base_test, ratio_conversion_carga) VALUES
-- Ejercicios Base de Test
('ej_sentadilla_trasera', 'Sentadilla Trasera Barra', 'Patrón dominante rodilla con barra alta', 'cat_fuerza_inf', 'eq_barra', 'ej_sentadilla_trasera', 1.0),
('ej_peso_muerto', 'Peso Muerto Convencional', 'Patrón bisagra de cadera barra', 'cat_cadera', 'eq_barra', 'ej_peso_muerto', 1.0),
('ej_press_banca', 'Press de Banca Plano', 'Empuje horizontal con barra olímpica', 'cat_empuje_sup', 'eq_barra', 'ej_press_banca', 1.0),
('ej_dominada_lastrada', 'Dominadas Pronas Lastradas', 'Tracción vertical con lastre', 'cat_traccion_sup', 'eq_corporal', 'ej_dominada_lastrada', 1.0),

-- Ejercicios Derivados (con ratios matemáticos de conversión)
('ej_sentadilla_frontal', 'Sentadilla Frontal', 'Énfasis en cuádriceps y estabilidad de tronco', 'cat_fuerza_inf', 'eq_barra', 'ej_sentadilla_trasera', 0.82),
('ej_prensa_45', 'Prensa de Piernas 45°', 'Sobrecarga de tren inferior sin compresión axial', 'cat_fuerza_inf', 'eq_maquina', 'ej_sentadilla_trasera', 1.45),
('ej_hip_thrust', 'Hip Thrust con Barra', 'Aislamiento de glúteos y extensión de cadera', 'cat_cadera', 'eq_barra', 'ej_peso_muerto', 1.15),
('ej_peso_muerto_rumano', 'Peso Muerto Rumano', 'Énfasis en isquiosurales y glúteos excéntrico', 'cat_cadera', 'eq_barra', 'ej_peso_muerto', 0.78),
('ej_press_militar', 'Press Militar de Pie Barra', 'Empuje vertical estricto', 'cat_empuje_sup', 'eq_barra', 'ej_press_banca', 0.65),
('ej_press_mancuerna_inc', 'Press Inclinado con Mancuernas', 'Énfasis haz clavicular pectoral', 'cat_empuje_sup', 'eq_mancuernas', 'ej_press_banca', 0.72),
('ej_remo_barra', 'Remo con Barra 45°', 'Tracción horizontal y densidad de espalda', 'cat_traccion_sup', 'eq_barra', 'ej_press_banca', 0.85),
('ej_jalon_pecho', 'Jalón al Pecho Polea', 'Tracción vertical guiada', 'cat_traccion_sup', 'eq_polea', 'ej_dominada_lastrada', 0.90);

-- Usuario Demo Coach
INSERT OR IGNORE INTO usuarios (id, email, nombre, rol, perfil_completado) VALUES
('usr_coach_demo', 'coach@neyima.com', 'Facundo E. Rodríguez', 'COACH', 1);

INSERT OR IGNORE INTO coaches (id_usuario, institucion, especialidad, biografia, codigo_invitacion) VALUES
('usr_coach_demo', 'Club Atlético Alto Rendimiento', 'Preparación Física & Readaptación Deportiva', 'Especialista en biomecánica deportiva y control de carga ACWR.', 'COACH-NEYIMA-77');

-- Usuario Demo Atleta
INSERT OR IGNORE INTO usuarios (id, email, nombre, rol, perfil_completado) VALUES
('usr_atleta_demo', 'atleta@neyima.com', 'Lucía Menéndez', 'ALUMNO', 1);

INSERT OR IGNORE INTO atletas (id_usuario, id_coach, genero, fecha_nacimiento, deporte, posicion, peso_kg, altura_cm, monitoreo_ciclo_activo, fum, duracion_ciclo_dias, compartir_ciclo_coach) VALUES
('usr_atleta_demo', 'usr_coach_demo', 'F', '1998-05-14', 'running', 'Medio fondo (1500m / 5000m)', 58.5, 168.0, 1, '2026-10-28', 28, 1);

-- Tests de Fuerza Iniciales de Atleta Demo
INSERT OR IGNORE INTO tests_fuerza (id, id_atleta, id_ejercicio_base, peso_levantado_kg, repeticiones_realizadas, rpe_real, una_rm_efectiva, formula_utilizada, fecha_evaluacion) VALUES
('test_sq_demo', 'usr_atleta_demo', 'ej_sentadilla_trasera', 75.0, 5, 9.0, 87.5, 'EPLEY', '2026-10-15'),
('test_dl_demo', 'usr_atleta_demo', 'ej_peso_muerto', 95.0, 3, 9.5, 104.5, 'EPLEY', '2026-10-15'),
('test_bp_demo', 'usr_atleta_demo', 'ej_press_banca', 45.0, 6, 9.0, 54.0, 'EPLEY', '2026-10-15');
