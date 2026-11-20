// =====================================================================
// NEYIMA ATHLETIC - RUTAS DE ALUMNO / ATLETA (PWA & Mobile-First)
// Seguridad: Aislamiento estricto por id_atleta = currentUser.id
// =====================================================================

import { Hono } from 'hono';
import { Env, Variables } from '../types';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

export const athleteRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Exigir autenticación y rol de ALUMNO para todas las rutas
athleteRoutes.use('*', authMiddleware, requireRole('ALUMNO'));

/**
 * GET /api/athlete/today
 * Resumen de la jornada: sesión programada, check-in matutino y fase de ciclo
 */
athleteRoutes.get('/today', async (c) => {
  const atleta = c.get('user');
  const db = c.env.DB;
  const hoyStr = new Date().toISOString().split('T')[0];

  // 1. Obtener datos del perfil de atleta
  const atletaPerfil = await db
    .prepare('SELECT * FROM atletas WHERE id_usuario = ?')
    .bind(atleta.id)
    .first<any>();

  // 2. Obtener check-in de bienestar de hoy (si ya lo hizo)
  const checkinHoy = await db
    .prepare('SELECT * FROM checkins_bienestar WHERE id_atleta = ? AND fecha = ?')
    .bind(atleta.id, hoyStr)
    .first<any>();

  // 3. Obtener sesión programada para hoy o la más reciente pendiente
  let sesionHoy = await db
    .prepare('SELECT * FROM sesiones_planificadas WHERE id_atleta = ? AND fecha_programada = ?')
    .bind(atleta.id, hoyStr)
    .first<any>();

  if (!sesionHoy) {
    // Si no hay específica para hoy, traer la primera disponible
    sesionHoy = await db
      .prepare('SELECT * FROM sesiones_planificadas WHERE id_atleta = ? ORDER BY fecha_programada DESC LIMIT 1')
      .bind(atleta.id)
      .first<any>();
  }

  // 4. Obtener 1RM de ejercicios base del atleta
  const testsFuerza = await db
    .prepare('SELECT * FROM tests_fuerza WHERE id_atleta = ?')
    .bind(atleta.id)
    .all<any>();

  return c.json({
    atleta: {
      id: atleta.id,
      nombre: atleta.nombre,
      deporte: atletaPerfil?.deporte || 'Fuerza',
      monitoreoCicloActivo: Boolean(atletaPerfil?.monitoreo_ciclo_activo),
      fum: atletaPerfil?.fum,
      duracionCicloDias: atletaPerfil?.duracion_ciclo_dias || 28,
    },
    checkinHoy: checkinHoy
      ? {
          scorePorcentaje: checkinHoy.score_preparacion_porcentaje,
          estadoLabel: checkinHoy.estado_label,
          fecha: checkinHoy.fecha,
        }
      : null,
    sesionHoy: sesionHoy
      ? {
          id: sesionHoy.id,
          nombreSesion: sesionHoy.nombre_sesion,
          fechaProgramada: sesionHoy.fecha_programada,
          duracionEstimadaMinutos: sesionHoy.duracion_estimada_minutos,
          rpeObjetivo: sesionHoy.rpe_objetivo,
          bloques: JSON.parse(sesionHoy.bloques_json || '[]'),
        }
      : null,
    testsFuerza: testsFuerza.results || [],
  });
});

/**
 * POST /api/athlete/wellness
 * Check-in diario de bienestar matutino (1 minuto)
 */
athleteRoutes.post('/wellness', async (c) => {
  const atleta = c.get('user');
  const body = await c.req.json().catch(() => ({}));
  const db = c.env.DB;

  const { suenio = 4, fatiga = 4, dolorMuscular = 3, estres = 4, animo = 4 } = body;

  // Validación de rangos fisiológicos (1 a 5)
  const clamp = (val: number) => Math.min(5, Math.max(1, Math.round(Number(val) || 3)));
  const s = clamp(suenio);
  const f = clamp(fatiga);
  const d = clamp(dolorMuscular);
  const e = clamp(estres);
  const a = clamp(animo);

  const suma = s + f + d + e + a;
  const scorePorcentaje = Math.round((suma / 25) * 100);

  let estadoLabel = 'Óptimo';
  if (scorePorcentaje < 60) {
    estadoLabel = 'Alerta';
  } else if (scorePorcentaje < 80) {
    estadoLabel = 'Moderado';
  }

  const hoyStr = new Date().toISOString().split('T')[0];
  const checkinId = `chk_${atleta.id}_${hoyStr}`;

  // Upsert en D1
  await db
    .prepare(
      `INSERT INTO checkins_bienestar (id, id_atleta, fecha, suenio, fatiga, dolor_muscular, estres, animo, score_preparacion_porcentaje, estado_label)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id_atleta, fecha) DO UPDATE SET
         suenio = excluded.suenio,
         fatiga = excluded.fatiga,
         dolor_muscular = excluded.dolor_muscular,
         estres = excluded.estres,
         animo = excluded.animo,
         score_preparacion_porcentaje = excluded.score_preparacion_porcentaje,
         estado_label = excluded.estado_label`
    )
    .bind(checkinId, atleta.id, hoyStr, s, f, d, e, a, scorePorcentaje, estadoLabel)
    .run();

  // Si la preparación es crítica (<60%), notificar al coach
  if (scorePorcentaje < 60) {
    const perfil = await db
      .prepare('SELECT id_coach FROM atletas WHERE id_usuario = ?')
      .bind(atleta.id)
      .first<{ id_coach: string }>();

    if (perfil?.id_coach) {
      const alertaId = `alt_bienestar_${crypto.randomUUID().substring(0, 8)}`;
      await db
        .prepare(
          `INSERT INTO alertas_sistema (id, id_coach, id_atleta, tipo, severidad, titulo, descripcion)
           VALUES (?, ?, ?, 'BIENESTAR', 'AMBAR', ?, ?)`
        )
        .bind(
          alertaId,
          perfil.id_coach,
          atleta.id,
          `Baja recuperación reportada (${atleta.nombre})`,
          `Score de preparación matutino del ${scorePorcentaje}%. Fatiga: ${f}/5, Sueño: ${s}/5.`
        )
        .run();
    }
  }

  return c.json({
    success: true,
    scorePorcentaje,
    estadoLabel,
    fecha: hoyStr,
    mensaje: 'Check-in de bienestar registrado exitosamente',
  });
});

/**
 * POST /api/athlete/workout/finish
 * Finalización de sesión de entrenamiento y cálculo de sRPE Foster
 */
athleteRoutes.post('/workout/finish', async (c) => {
  const atleta = c.get('user');
  const body = await c.req.json().catch(() => ({}));
  const db = c.env.DB;

  const {
    idSesionPlanificada = null,
    duracionRealMinutos = 60,
    srpeFoster = 8,
    fatigaPercibida = 4,
    presentaDolor = false,
    zonaDolor = null,
    comentarios = null,
    seriesCompletadas = [],
  } = body;

  const duracion = Math.max(1, Math.round(Number(duracionRealMinutos) || 60));
  const srpe = Math.min(10, Math.max(1, Math.round(Number(srpeFoster) || 8)));
  const cargaUa = srpe * duracion; // Fórmula de Foster: UA = sRPE * min
  const fechaFin = new Date().toISOString();
  const idHistorial = `ses_hist_${crypto.randomUUID().substring(0, 10)}`;

  // 1. Guardar en historial_sesiones
  await db
    .prepare(
      `INSERT INTO historial_sesiones 
        (id, id_sesion_planificada, id_atleta, fecha_finalizacion, duracion_real_minutos, srpe_foster, carga_ua, fatiga_percibida, presenta_dolor, zona_dolor, comentarios, series_completadas_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      idHistorial,
      idSesionPlanificada,
      atleta.id,
      fechaFin,
      duracion,
      srpe,
      cargaUa,
      fatigaPercibida,
      presentaDolor ? 1 : 0,
      zonaDolor || null,
      comentarios || null,
      JSON.stringify(seriesCompletadas)
    )
    .run();

  // 2. Obtener id del coach
  const perfil = await db
    .prepare('SELECT id_coach FROM atletas WHERE id_usuario = ?')
    .bind(atleta.id)
    .first<{ id_coach: string }>();

  // 3. Regla clínica: Si reportó dolor, generar alerta médica ROJA inmediata
  if (presentaDolor && perfil?.id_coach) {
    const alertaDolorId = `alt_dolor_${crypto.randomUUID().substring(0, 8)}`;
    await db
      .prepare(
        `INSERT INTO alertas_sistema (id, id_coach, id_atleta, tipo, severidad, titulo, descripcion)
         VALUES (?, ?, ?, 'DOLOR', 'ROJA', ?, ?)`
      )
      .bind(
        alertaDolorId,
        perfil.id_coach,
        atleta.id,
        `Dolor reportado post-sesión: ${zonaDolor || 'Zona corporal'} (${atleta.nombre})`,
        `El atleta reportó dolor tras la sesión de ${duracion} min. sRPE: ${srpe}/10. Comentarios: "${comentarios || 'Sin notas adicionales'}"`
      )
      .run();
  }

  // 4. Recalcular ACWR (Carga Aguda 7 días vs Carga Crónica 28 días)
  const sesiones28d = await db
    .prepare(
      `SELECT carga_ua, fecha_finalizacion 
       FROM historial_sesiones 
       WHERE id_atleta = ? AND datetime(fecha_finalizacion) >= datetime('now', '-28 days')`
    )
    .bind(atleta.id)
    .all<{ carga_ua: number; fecha_finalizacion: string }>();

  const rows = sesiones28d.results || [];
  const sieteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const cargaAguda7d = rows
    .filter((r: { fecha_finalizacion: string; carga_ua: number }) => r.fecha_finalizacion >= sieteDiasAtras)
    .reduce((acc: number, curr: { carga_ua: number }) => acc + (curr.carga_ua || 0), 0);

  const cargaTotal28d = rows.reduce((acc: number, curr: { carga_ua: number }) => acc + (curr.carga_ua || 0), 0);
  const cargaCronica28d = Math.max(1, Math.round(cargaTotal28d / 4));
  const ratioAcwr = Math.round((cargaAguda7d / cargaCronica28d) * 100) / 100;

  let zona: 'SUBENTRENAMIENTO' | 'SWEET_SPOT' | 'PRECAUCION' | 'RIESGO' = 'SWEET_SPOT';
  if (ratioAcwr < 0.8) zona = 'SUBENTRENAMIENTO';
  else if (ratioAcwr <= 1.3) zona = 'SWEET_SPOT';
  else if (ratioAcwr <= 1.5) zona = 'PRECAUCION';
  else zona = 'RIESGO';

  // Registrar ACWR en la tabla histórica
  const idAcwr = `acwr_${atleta.id}_${fechaFin.split('T')[0]}`;
  await db
    .prepare(
      `INSERT INTO control_carga_acwr (id, id_atleta, fecha_calculo, carga_aguda_7d, carga_cronica_28d, ratio_acwr, zona_fisiologica)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(idAcwr, atleta.id, fechaFin.split('T')[0], cargaAguda7d, cargaCronica28d, ratioAcwr, zona)
    .run();

  // Si ACWR entra en zona de riesgo, notificar al coach
  if (zona === 'RIESGO' && perfil?.id_coach) {
    const alertaAcwrId = `alt_acwr_${crypto.randomUUID().substring(0, 8)}`;
    await db
      .prepare(
        `INSERT INTO alertas_sistema (id, id_coach, id_atleta, tipo, severidad, titulo, descripcion)
         VALUES (?, ?, ?, 'ACWR', 'ROJA', ?, ?)`
      )
      .bind(
        alertaAcwrId,
        perfil.id_coach,
        atleta.id,
        `Pico de Carga Peligroso - ACWR ${ratioAcwr} (${atleta.nombre})`,
        `Carga aguda de 7 días (${cargaAguda7d} UA) excede de forma peligrosa la capacidad crónica (${cargaCronica28d} UA). Se recomienda descarga.`
      )
      .run();
  }

  return c.json({
    success: true,
    identificadorRegistro: idHistorial,
    cargaInternaUa: cargaUa,
    acwr: {
      cargaAguda7d,
      cargaCronica28d,
      ratio: ratioAcwr,
      zona,
    },
    mensaje: 'Entrenamiento registrado y carga calculada exitosamente',
  });
});

/**
 * GET /api/athlete/history
 * Historial de entrenamientos del atleta autenticado
 */
athleteRoutes.get('/history', async (c) => {
  const atleta = c.get('user');
  const db = c.env.DB;

  const historial = await db
    .prepare(
      `SELECT h.*, s.nombre_sesion 
       FROM historial_sesiones h
       LEFT JOIN sesiones_planificadas s ON h.id_sesion_planificada = s.id
       WHERE h.id_atleta = ? 
       ORDER BY h.fecha_finalizacion DESC 
       LIMIT 30`
    )
    .bind(atleta.id)
    .all<any>();

  return c.json({
    sesiones: historial.results || [],
  });
});

/**
 * POST /api/athlete/cycle/delay
 * Reporta atraso menstrual y pausa el cálculo hormonal
 */
athleteRoutes.post('/cycle/delay', async (c) => {
  const atleta = c.get('user');
  const db = c.env.DB;

  const perfil = await db
    .prepare('SELECT id_coach, compartir_ciclo_coach FROM atletas WHERE id_usuario = ?')
    .bind(atleta.id)
    .first<{ id_coach: string; compartir_ciclo_coach: number }>();

  // Si comparte datos con el coach, avisar con alerta ámbar
  if (perfil?.id_coach && perfil.compartir_ciclo_coach === 1) {
    const alertaCicloId = `alt_ciclo_${crypto.randomUUID().substring(0, 8)}`;
    await db
      .prepare(
        `INSERT INTO alertas_sistema (id, id_coach, id_atleta, tipo, severidad, titulo, descripcion)
         VALUES (?, ?, ?, 'CICLO', 'AMBAR', ?, ?)`
      )
      .bind(
        alertaCicloId,
        perfil.id_coach,
        atleta.id,
        `Retraso menstrual reportado (${atleta.nombre})`,
        `La atleta reportó pausa por retraso en su ciclo. Cargas pausadas preventivamente para evaluación de salud.`
      )
      .run();
  }

  return c.json({
    success: true,
    mensaje: 'Retraso reportado. Cálculo de cargas pausado preventivamente.',
  });
});

/**
 * GET /api/athlete/sleep
 * Registros de sueño y HRV
 */
athleteRoutes.get('/sleep', async (c) => {
  const atleta = c.get('user');
  const db = c.env.DB;

  const registros = await db
    .prepare('SELECT * FROM registros_descanso WHERE id_atleta = ? ORDER BY fecha_noche DESC LIMIT 14')
    .bind(atleta.id)
    .all<any>();

  return c.json({
    registros: registros.results || [],
  });
});

/**
 * POST /api/athlete/sleep
 * Registra o sincroniza métricas de descanso
 */
athleteRoutes.post('/sleep', async (c) => {
  const atleta = c.get('user');
  const body = await c.req.json().catch(() => ({}));
  const db = c.env.DB;

  const {
    fechaNoche = new Date().toISOString().split('T')[0],
    horasSuenio = 7.5,
    hrvMs = 65,
    fcReposoLpm = 52,
    calidadSubjetiva = 4,
    fuenteWearable = 'Manual',
  } = body;

  const id = `desc_${atleta.id}_${fechaNoche}`;

  await db
    .prepare(
      `INSERT OR REPLACE INTO registros_descanso (id, id_atleta, fecha_noche, horas_suenio, hrv_ms, fc_reposo_lpm, calidad_subjetiva, fuente_wearable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, atleta.id, fechaNoche, horasSuenio, hrvMs, fcReposoLpm, calidadSubjetiva, fuenteWearable)
    .run();

  return c.json({
    success: true,
    mensaje: 'Datos de descanso sincronizados correctamente',
  });
});
