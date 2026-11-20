// =====================================================================
// NEYIMA ATHLETIC - RUTAS DE COACH / PREPARADOR FÍSICO
// Seguridad: Aislamiento por id_coach y protección de datos privados
// =====================================================================

import { Hono } from 'hono';
import { Env, Variables } from '../types';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

export const coachRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Exigir autenticación y rol de COACH para todas las rutas
coachRoutes.use('*', authMiddleware, requireRole('COACH'));

/**
 * GET /api/coach/dashboard
 * Resumen de KPIs de la plantilla, mesociclo activo M04 y alertas pendientes
 */
coachRoutes.get('/dashboard', async (c) => {
  const coach = c.get('user');
  const db = c.env.DB;

  // 1. Atletas a cargo
  const atletas = await db
    .prepare(
      `SELECT u.id, u.nombre, u.avatar_url, a.deporte, a.peso_kg, a.altura_cm
       FROM usuarios u
       JOIN atletas a ON u.id = a.id_usuario
       WHERE a.id_coach = ?`
    )
    .bind(coach.id)
    .all<any>();

  const listaAtletas = atletas.results || [];

  // 2. Alertas pendientes
  const alertas = await db
    .prepare(
      `SELECT COUNT(*) as total 
       FROM alertas_sistema 
       WHERE id_coach = ? AND resuelta = 0`
    )
    .bind(coach.id)
    .first<{ total: number }>();

  // 3. Sesiones de hoy completadas por sus atletas
  const hoyStr = new Date().toISOString().split('T')[0];
  const sesionesHoy = await db
    .prepare(
      `SELECT COUNT(*) as total 
       FROM historial_sesiones h
       JOIN atletas a ON h.id_atleta = a.id_usuario
       WHERE a.id_coach = ? AND date(h.fecha_finalizacion) = date(?)`
    )
    .bind(coach.id, hoyStr)
    .first<{ total: number }>();

  return c.json({
    kpis: {
      atletasActivos: listaAtletas.length,
      sesionesHoy: sesionesHoy?.total || 0,
      alertasPendientes: alertas?.total || 0,
      adherenciaSemanalPorcentaje: 94,
    },
    mesocicloActivo: {
      numero: 4,
      nombre: 'Fuerza Máxima e Hipertrofia Funcional',
      fase: 'Meso 4 de 13',
      destacadoEnRojo: true, // Regla NEYIMA: M04 en #F92424
    },
    atletas: listaAtletas,
  });
});

/**
 * GET /api/coach/athletes
 * Listado completo de atletas con estado de carga
 */
coachRoutes.get('/athletes', async (c) => {
  const coach = c.get('user');
  const db = c.env.DB;

  const atletas = await db
    .prepare(
      `SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        u.avatar_url, 
        a.deporte, 
        a.posicion, 
        a.peso_kg, 
        a.altura_cm,
        a.genero,
        (SELECT ratio_acwr FROM control_carga_acwr WHERE id_atleta = u.id ORDER BY fecha_calculo DESC LIMIT 1) as ultimo_acwr,
        (SELECT zona_fisiologica FROM control_carga_acwr WHERE id_atleta = u.id ORDER BY fecha_calculo DESC LIMIT 1) as zona_acwr
       FROM usuarios u
       JOIN atletas a ON u.id = a.id_usuario
       WHERE a.id_coach = ?
       ORDER BY u.nombre ASC`
    )
    .bind(coach.id)
    .all<any>();

  return c.json({
    atletas: atletas.results || [],
  });
});

/**
 * GET /api/coach/athletes/:id
 * Ficha técnica del atleta. Aplica redacción de ciclo si el atleta lo configuró como privado.
 */
coachRoutes.get('/athletes/:id', async (c) => {
  const coach = c.get('user');
  const atletaId = c.req.param('id');
  const db = c.env.DB;

  // 1. Verificar que el atleta pertenezca a este coach
  const atleta = await db
    .prepare(
      `SELECT u.id, u.nombre, u.email, u.avatar_url, a.*
       FROM usuarios u
       JOIN atletas a ON u.id = a.id_usuario
       WHERE a.id_usuario = ? AND a.id_coach = ?`
    )
    .bind(atletaId, coach.id)
    .first<any>();

  if (!atleta) {
    return c.json({ error: 'Atleta no encontrado o no asignado a su plantilla' }, 404);
  }

  // 2. Protección de Privacidad Biomédica Femenina
  // Si la atleta desactivó compartir_ciclo_coach, redactar FUM y datos íntimos
  let datosCiclo = null;
  if (atleta.genero === 'F' && atleta.monitoreo_ciclo_activo === 1) {
    if (atleta.compartir_ciclo_coach === 1) {
      datosCiclo = {
        fum: atleta.fum,
        duracionCicloDias: atleta.duracion_ciclo_dias,
        compartido: true,
      };
    } else {
      datosCiclo = {
        compartido: false,
        mensaje: 'La atleta ha configurado sus datos de ciclo como privados.',
      };
    }
  }

  // 3. Tests de fuerza del atleta
  const testsFuerza = await db
    .prepare(
      `SELECT t.*, e.nombre as nombre_ejercicio
       FROM tests_fuerza t
       JOIN ejercicios e ON t.id_ejercicio_base = e.id
       WHERE t.id_atleta = ?
       ORDER BY t.fecha_evaluacion DESC`
    )
    .bind(atletaId)
    .all<any>();

  // 4. Evaluaciones de movilidad
  const movilidad = await db
    .prepare('SELECT * FROM evaluaciones_movilidad WHERE id_atleta = ? ORDER BY fecha_evaluacion DESC')
    .bind(atletaId)
    .all<any>();

  return c.json({
    atleta: {
      id: atleta.id,
      nombre: atleta.nombre,
      email: atleta.email,
      avatarUrl: atleta.avatar_url,
      deporte: atleta.deporte,
      posicion: atleta.posicion,
      pesoKg: atleta.peso_kg,
      alturaCm: atleta.altura_cm,
      genero: atleta.genero,
      ciclo: datosCiclo,
    },
    testsFuerza: testsFuerza.results || [],
    evaluacionesMovilidad: movilidad.results || [],
  });
});

/**
 * POST /api/coach/athletes
 * Da de alta un nuevo atleta asignado a este coach
 */
coachRoutes.post('/athletes', async (c) => {
  const coach = c.get('user');
  const body = await c.req.json().catch(() => ({}));
  const db = c.env.DB;

  const { nombre, email, deporte = 'fuerza', genero = 'M', pesoKg = 70, alturaCm = 175 } = body;

  if (!nombre || !email) {
    return c.json({ error: 'Nombre y correo electrónico son requeridos' }, 400);
  }

  const nuevoId = `usr_atl_${crypto.randomUUID().substring(0, 8)}`;

  // Crear usuario y perfil atleta
  await db
    .prepare('INSERT INTO usuarios (id, email, nombre, rol, perfil_completado) VALUES (?, ?, ?, ?, 1)')
    .bind(nuevoId, email.toLowerCase().trim(), nombre.trim(), 'ALUMNO')
    .run();

  await db
    .prepare(
      'INSERT INTO atletas (id_usuario, id_coach, genero, deporte, peso_kg, altura_cm) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(nuevoId, coach.id, genero, deporte, parseFloat(pesoKg), parseFloat(alturaCm))
    .run();

  return c.json({
    success: true,
    atleta: {
      id: nuevoId,
      nombre,
      email,
      deporte,
    },
    mensaje: 'Atleta registrado exitosamente en su plantilla',
  });
});

/**
 * GET /api/coach/alerts
 * Bandeja de alertas operativas del coach
 */
coachRoutes.get('/alerts', async (c) => {
  const coach = c.get('user');
  const db = c.env.DB;

  const alertas = await db
    .prepare(
      `SELECT a.*, u.nombre as atleta_nombre
       FROM alertas_sistema a
       JOIN usuarios u ON a.id_atleta = u.id
       WHERE a.id_coach = ? AND a.resuelta = 0
       ORDER BY 
         CASE a.severidad WHEN 'ROJA' THEN 1 WHEN 'AMBAR' THEN 2 ELSE 3 END,
         a.creado_en DESC`
    )
    .bind(coach.id)
    .all<any>();

  return c.json({
    alertas: alertas.results || [],
  });
});

/**
 * PUT /api/coach/alerts/:id/resolve
 * Resuelve y archiva una alerta operativa
 */
coachRoutes.put('/alerts/:id/resolve', async (c) => {
  const coach = c.get('user');
  const alertaId = c.req.param('id');
  const db = c.env.DB;

  const res = await db
    .prepare(
      'UPDATE alertas_sistema SET resuelta = 1, fecha_resolucion = CURRENT_TIMESTAMP WHERE id = ? AND id_coach = ?'
    )
    .bind(alertaId, coach.id)
    .run();

  if (res.meta.changes === 0) {
    return c.json({ error: 'Alerta no encontrada o no pertenece a este coach' }, 404);
  }

  return c.json({ success: true, mensaje: 'Alerta marcada como resuelta' });
});

/**
 * POST /api/coach/evaluations/1rm
 * Registra evaluación de fuerza máxima 1RM con cálculo Epley y Brzycki
 */
coachRoutes.post('/evaluations/1rm', async (c) => {
  const coach = c.get('user');
  const body = await c.req.json().catch(() => ({}));
  const db = c.env.DB;

  const {
    idAtleta,
    idEjercicioBase,
    pesoLevantadoKg,
    repeticionesRealizadas,
    rpeReal = 10,
    formulaPreferida = 'EPLEY',
    notas,
  } = body;

  if (!idAtleta || !idEjercicioBase || !pesoLevantadoKg || !repeticionesRealizadas) {
    return c.json({ error: 'Parámetros incompletos para evaluación 1RM' }, 400);
  }

  // Verificar que el atleta pertenezca al coach
  const atleta = await db
    .prepare('SELECT id_usuario FROM atletas WHERE id_usuario = ? AND id_coach = ?')
    .bind(idAtleta, coach.id)
    .first();

  if (!atleta) {
    return c.json({ error: 'Atleta no autorizado' }, 403);
  }

  const peso = parseFloat(pesoLevantadoKg);
  const reps = parseInt(repeticionesRealizadas, 10);

  // Fórmulas fisiológicas de dominio
  const epley = Math.round(peso * (1 + reps / 30) * 10) / 10;
  const brzycki = reps < 37 ? Math.round(peso * (36 / (37 - reps)) * 10) / 10 : peso;
  const unaRmEfectiva = formulaPreferida === 'BRZYCKI' ? brzycki : epley;

  const id = `test_${crypto.randomUUID().substring(0, 10)}`;
  const fechaHoy = new Date().toISOString().split('T')[0];

  await db
    .prepare(
      `INSERT INTO tests_fuerza 
        (id, id_atleta, id_ejercicio_base, peso_levantado_kg, repeticiones_realizadas, rpe_real, una_rm_efectiva, formula_utilizada, fecha_evaluacion, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, idAtleta, idEjercicioBase, peso, reps, parseFloat(rpeReal), unaRmEfectiva, formulaPreferida, fechaHoy, notas || null)
    .run();

  return c.json({
    success: true,
    test: {
      id,
      unaRmEfectiva,
      epley,
      brzycki,
      formulaUtilizada: formulaPreferida,
    },
    mensaje: 'Test 1RM registrado exitosamente',
  });
});
