// =====================================================================
// NEYIMA ATHLETIC PERFORMANCE OS - CLOUDFLARE WORKERS SERVER
// Arquitectura Serverless en Capas con Hono & Cloudflare D1
// =====================================================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env, Variables } from './types';
import { authRoutes } from './routes/auth.routes';
import { athleteRoutes } from './routes/athlete.routes';
import { coachRoutes } from './routes/coach.routes';
import { catalogRoutes } from './routes/catalog.routes';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// 1. Headers de Seguridad Estricta (Defense in Depth)
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// 2. CORS seguro para desarrollo y producción
app.use(
  '/api/*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 3. Manejador Global de Errores (sin filtrar información sensible)
app.onError((err, c) => {
  console.error('[SERVER ERROR]:', err);
  const isDev = c.env.ENVIRONMENT === 'development';
  return c.json(
    {
      error: 'Error interno del servidor',
      mensaje: isDev ? err.message : 'Ocurrió un error inesperado al procesar la solicitud.',
    },
    500
  );
});

// 4. Montaje de Rutas API
app.route('/api/auth', authRoutes);
app.route('/api/athlete', athleteRoutes);
app.route('/api/coach', coachRoutes);
app.route('/api/catalog', catalogRoutes);

// 5. Endpoint de Verificación de Salud del Backend
app.get('/api/health', async (c) => {
  const db = c.env.DB;
  let dbStatus = 'DISCONNECTED';
  try {
    const res = await db.prepare('SELECT 1 as alive').first();
    if (res?.alive === 1) dbStatus = 'CONNECTED';
  } catch {
    dbStatus = 'ERROR';
  }

  return c.json({
    status: 'ONLINE',
    service: 'NEYIMA Athletic Performance OS API',
    version: '2.0.0',
    dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// 6. Servir Assets Estáticos del Frontend (Fallback a Single-Page App)
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
