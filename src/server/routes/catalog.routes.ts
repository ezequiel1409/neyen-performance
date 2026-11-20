// =====================================================================
// NEYIMA ATHLETIC - RUTAS DE CATÁLOGO Y BANCO DE EJERCICIOS
// =====================================================================

import { Hono } from 'hono';
import { Env, Variables } from '../types';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

export const catalogRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Rutas de lectura públicas para usuarios autenticados
catalogRoutes.use('*', authMiddleware);

/**
 * GET /api/catalog/exercises
 * Retorna todos los ejercicios con sus categorías y equipamiento
 */
catalogRoutes.get('/exercises', async (c) => {
  const db = c.env.DB;
  const ejercicios = await db
    .prepare(
      `SELECT 
        e.*, 
        c.nombre as categoria_nombre, 
        eq.nombre as equipamiento_nombre
       FROM ejercicios e
       JOIN categorias_ejercicio c ON e.id_categoria = c.id
       JOIN equipamientos eq ON e.id_equipamiento = eq.id
       ORDER BY c.orden ASC, e.nombre ASC`
    )
    .all<any>();

  return c.json({
    ejercicios: ejercicios.results || [],
  });
});

/**
 * GET /api/catalog/categories
 */
catalogRoutes.get('/categories', async (c) => {
  const db = c.env.DB;
  const cats = await db.prepare('SELECT * FROM categorias_ejercicio ORDER BY orden ASC').all<any>();
  return c.json({ categorias: cats.results || [] });
});

/**
 * GET /api/catalog/equipment
 */
catalogRoutes.get('/equipment', async (c) => {
  const db = c.env.DB;
  const eq = await db.prepare('SELECT * FROM equipamientos ORDER BY nombre ASC').all<any>();
  return c.json({ equipamientos: eq.results || [] });
});

/**
 * POST /api/catalog/exercises
 * Crear nuevo ejercicio en el catálogo (solo para COACH)
 */
catalogRoutes.post('/exercises', requireRole('COACH'), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const db = c.env.DB;

  const {
    nombre,
    descripcion,
    idCategoria,
    idEquipamiento,
    idEjercicioBaseTest = null,
    ratioConversionCarga = 1.0,
  } = body;

  if (!nombre || !idCategoria || !idEquipamiento) {
    return c.json({ error: 'Faltan parámetros obligatorios para crear ejercicio' }, 400);
  }

  const id = `ej_${crypto.randomUUID().substring(0, 8)}`;

  await db
    .prepare(
      `INSERT INTO ejercicios (id, nombre, descripcion, id_categoria, id_equipamiento, id_ejercicio_base_test, ratio_conversion_carga)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      nombre.trim(),
      descripcion || null,
      idCategoria,
      idEquipamiento,
      idEjercicioBaseTest,
      parseFloat(ratioConversionCarga) || 1.0
    )
    .run();

  return c.json({
    success: true,
    ejercicio: { id, nombre },
    mensaje: 'Ejercicio incorporado al banco oficial',
  });
});
