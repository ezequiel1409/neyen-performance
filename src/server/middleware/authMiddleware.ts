// =====================================================================
// NEYIMA ATHLETIC - MIDDLEWARE DE AUTENTICACIÓN Y CONTROL DE ACCESO RBAC
// Principio de mínimo privilegio indispensable
// =====================================================================

import { createMiddleware } from 'hono/factory';
import { Env, RolUsuario, Variables } from '../types';
import { verifySessionToken } from '../security/jwt';

/**
 * Middleware que verifica la presencia y autenticidad del JWT de sesión
 */
export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(
  async (c, next) => {
    // 1. Extraer token de encabezado Authorization o de Cookie HttpOnly
    let token: string | null = null;
    const authHeader = c.req.header('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      const cookieHeader = c.req.header('Cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(';').map((c) => {
            const [k, ...v] = c.trim().split('=');
            return [k, decodeURIComponent(v.join('='))];
          })
        );
        token = cookies['neyima_session'] || null;
      }
    }

    if (!token) {
      return c.json(
        {
          error: 'No autenticado',
          mensaje: 'Debe iniciar sesión para acceder a este recurso.',
        },
        401
      );
    }

    // 2. Verificar criptográficamente el token
    const user = await verifySessionToken(token, c.env.JWT_SECRET);
    if (!user) {
      return c.json(
        {
          error: 'Sesión inválida o expirada',
          mensaje: 'Por favor vuelva a iniciar sesión.',
        },
        401
      );
    }

    // 3. Inyectar usuario en el contexto seguro de Hono
    c.set('user', user);
    await next();
  }
);

/**
 * Middleware de Control de Acceso Basado en Roles (RBAC)
 * Deniega el acceso si el rol del usuario no coincide con el requerido
 */
export const requireRole = (rolRequerido: RolUsuario) =>
  createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    if (user.rol !== rolRequerido) {
      return c.json(
        {
          error: 'Acceso denegado',
          mensaje: `Se requiere perfil de ${rolRequerido} para realizar esta acción.`,
        },
        403
      );
    }

    await next();
  });
