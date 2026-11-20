// =====================================================================
// NEYIMA ATHLETIC - RUTAS DE AUTENTICACIÓN SEGURA Y GOOGLE OAUTH
// =====================================================================

import { Hono } from 'hono';
import { Env, Variables, UsuarioAutenticado } from '../types';
import { createSessionToken } from '../security/jwt';
import { verifyGoogleIdToken } from '../security/googleAuth';
import { authMiddleware } from '../middleware/authMiddleware';

export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

/**
 * Helper para configurar la cookie segura HttpOnly
 */
function setSessionCookie(c: any, token: string) {
  const isProd = c.env.ENVIRONMENT === 'production' || !c.req.url.includes('localhost');
  const cookieOptions = [
    `neyima_session=${token}`,
    'HttpOnly',
    'Path=/',
    'Max-Age=604800', // 7 días
    'SameSite=Lax',
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  c.header('Set-Cookie', cookieOptions);
}

/**
 * POST /api/auth/google
 * Autenticación federada con Google OAuth 2.0 (Google ID Token)
 */
authRoutes.post('/google', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { idToken, rolDeseado = 'ALUMNO', codigoInvitacion } = body;

  if (!idToken) {
    return c.json({ error: 'Parámetro idToken requerido' }, 400);
  }

  // 1. Validar el token contra Google
  const googleUser = await verifyGoogleIdToken(idToken, c.env.GOOGLE_CLIENT_ID);
  if (!googleUser) {
    return c.json(
      {
        error: 'Token de Google inválido o expirado',
        mensaje: 'No fue posible verificar su identidad con Google.',
      },
      401
    );
  }

  const db = c.env.DB;

  // 2. Buscar si el usuario ya existe por google_sub o email
  const usuarioExistente = await db
    .prepare('SELECT * FROM usuarios WHERE google_sub = ? OR email = ?')
    .bind(googleUser.googleSub, googleUser.email)
    .first<any>();

  let user: UsuarioAutenticado;

  if (usuarioExistente) {
    // Si no tenía registrado el google_sub, asociarlo
    if (!usuarioExistente.google_sub) {
      await db
        .prepare('UPDATE usuarios SET google_sub = ?, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(googleUser.googleSub, usuarioExistente.id)
        .run();
    }

    user = {
      id: usuarioExistente.id,
      email: usuarioExistente.email,
      nombre: usuarioExistente.nombre,
      rol: usuarioExistente.rol,
      avatarUrl: usuarioExistente.avatar_url || googleUser.picture,
      perfilCompletado: Boolean(usuarioExistente.perfil_completado),
    };
  } else {
    // Nuevo usuario: Alta atómica respetando el rol
    const nuevoId = `usr_${crypto.randomUUID().substring(0, 12)}`;
    const rolFinal = rolDeseado === 'COACH' ? 'COACH' : 'ALUMNO';

    await db
      .prepare(
        'INSERT INTO usuarios (id, email, nombre, avatar_url, rol, google_sub, perfil_completado) VALUES (?, ?, ?, ?, ?, ?, 0)'
      )
      .bind(nuevoId, googleUser.email, googleUser.name, googleUser.picture || null, rolFinal, googleUser.googleSub)
      .run();

    if (rolFinal === 'COACH') {
      const codigoCoach = `COACH-NEYIMA-${Math.floor(1000 + Math.random() * 9000)}`;
      await db
        .prepare('INSERT INTO coaches (id_usuario, codigo_invitacion) VALUES (?, ?)')
        .bind(nuevoId, codigoCoach)
        .run();
    } else {
      let idCoachAsociado: string | null = null;
      if (codigoInvitacion) {
        const coachEncontrado = await db
          .prepare('SELECT id_usuario FROM coaches WHERE codigo_invitacion = ?')
          .bind(codigoInvitacion.trim().toUpperCase())
          .first<{ id_usuario: string }>();

        if (coachEncontrado) {
          idCoachAsociado = coachEncontrado.id_usuario;
        }
      }

      await db
        .prepare('INSERT INTO atletas (id_usuario, id_coach, genero, deporte) VALUES (?, ?, ?, ?)')
        .bind(nuevoId, idCoachAsociado, 'OTRO', 'General')
        .run();
    }

    user = {
      id: nuevoId,
      email: googleUser.email,
      nombre: googleUser.name,
      rol: rolFinal,
      avatarUrl: googleUser.picture || null,
      perfilCompletado: false,
    };
  }

  // 3. Emitir token firmado de sesión
  const token = await createSessionToken(user, c.env.JWT_SECRET);
  setSessionCookie(c, token);

  return c.json({
    token,
    user,
    mensaje: 'Autenticación exitosa',
  });
});

/**
 * POST /api/auth/demo-login
 * Permite conmutar instantáneamente entre el coach demo y la atleta demo
 */
authRoutes.post('/demo-login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const rol = body.rol === 'COACH' ? 'COACH' : 'ALUMNO';
  const targetId = rol === 'COACH' ? 'usr_coach_demo' : 'usr_atleta_demo';

  const db = c.env.DB;
  const dbUser = await db
    .prepare('SELECT * FROM usuarios WHERE id = ?')
    .bind(targetId)
    .first<any>();

  if (!dbUser) {
    return c.json({ error: 'Usuario demo no encontrado en base de datos' }, 404);
  }

  const user: UsuarioAutenticado = {
    id: dbUser.id,
    email: dbUser.email,
    nombre: dbUser.nombre,
    rol: dbUser.rol,
    avatarUrl: dbUser.avatar_url,
    perfilCompletado: Boolean(dbUser.perfil_completado),
  };

  const token = await createSessionToken(user, c.env.JWT_SECRET);
  setSessionCookie(c, token);

  return c.json({
    token,
    user,
    mensaje: `Sesión demo iniciada como ${user.rol}`,
  });
});

/**
 * GET /api/auth/me
 * Retorna la información del usuario autenticado y su perfil extendido
 */
authRoutes.get('/me', authMiddleware, async (c) => {
  const currentUser = c.get('user');
  const db = c.env.DB;

  if (currentUser.rol === 'COACH') {
    const coachData = await db
      .prepare('SELECT institucion, especialidad, biografia, codigo_invitacion FROM coaches WHERE id_usuario = ?')
      .bind(currentUser.id)
      .first<any>();

    return c.json({
      user: currentUser,
      coach: coachData,
    });
  } else {
    const atletaData = await db
      .prepare(
        'SELECT id_coach, genero, fecha_nacimiento, deporte, posicion, peso_kg, altura_cm, monitoreo_ciclo_activo, fum, duracion_ciclo_dias, compartir_ciclo_coach FROM atletas WHERE id_usuario = ?'
      )
      .bind(currentUser.id)
      .first<any>();

    return c.json({
      user: currentUser,
      atleta: atletaData,
    });
  }
});

/**
 * POST /api/auth/onboarding
 * Completa el perfil del usuario tras el registro inicial
 */
authRoutes.post('/onboarding', authMiddleware, async (c) => {
  const currentUser = c.get('user');
  const body = await c.req.json().catch(() => ({}));
  const db = c.env.DB;

  if (currentUser.rol === 'COACH') {
    const { institucion, especialidad, biografia } = body;
    await db
      .prepare(
        'UPDATE coaches SET institucion = ?, especialidad = ?, biografia = ?, actualizado_en = CURRENT_TIMESTAMP WHERE id_usuario = ?'
      )
      .bind(institucion || null, especialidad || null, biografia || null, currentUser.id)
      .run();
  } else {
    const {
      genero = 'OTRO',
      fechaNacimiento,
      deporte = 'fuerza',
      posicion,
      pesoKg,
      alturaCm,
      monitorearCiclo = false,
      fum,
      duracionCiclo = 28,
      compartirCiclo = true,
      codigoCoach,
    } = body;

    let idCoach: string | null = null;
    if (codigoCoach) {
      const coach = await db
        .prepare('SELECT id_usuario FROM coaches WHERE codigo_invitacion = ?')
        .bind(codigoCoach.trim().toUpperCase())
        .first<{ id_usuario: string }>();

      if (coach) {
        idCoach = coach.id_usuario;
      }
    }

    await db
      .prepare(
        `UPDATE atletas SET 
          genero = ?, 
          fecha_nacimiento = ?, 
          deporte = ?, 
          posicion = ?, 
          peso_kg = ?, 
          altura_cm = ?, 
          monitoreo_ciclo_activo = ?, 
          fum = ?, 
          duracion_ciclo_dias = ?, 
          compartir_ciclo_coach = ?, 
          id_coach = COALESCE(?, id_coach),
          actualizado_en = CURRENT_TIMESTAMP 
        WHERE id_usuario = ?`
      )
      .bind(
        genero,
        fechaNacimiento || null,
        deporte,
        posicion || null,
        pesoKg ? parseFloat(pesoKg) : null,
        alturaCm ? parseFloat(alturaCm) : null,
        monitorearCiclo ? 1 : 0,
        fum || null,
        duracionCiclo ? parseInt(duracionCiclo, 10) : 28,
        compartirCiclo ? 1 : 0,
        idCoach,
        currentUser.id
      )
      .run();
  }

  // Marcar perfil completado en la tabla de usuarios
  await db
    .prepare('UPDATE usuarios SET perfil_completado = 1, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(currentUser.id)
    .run();

  const updatedUser: UsuarioAutenticado = {
    ...currentUser,
    perfilCompletado: true,
  };

  const newToken = await createSessionToken(updatedUser, c.env.JWT_SECRET);
  setSessionCookie(c, newToken);

  return c.json({
    token: newToken,
    user: updatedUser,
    mensaje: 'Perfil configurado exitosamente',
  });
});

/**
 * POST /api/auth/logout
 * Cierre seguro de sesión invalidando la cookie
 */
authRoutes.post('/logout', (c) => {
  c.header('Set-Cookie', 'neyima_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  return c.json({ success: true, mensaje: 'Sesión finalizada correctamente' });
});
