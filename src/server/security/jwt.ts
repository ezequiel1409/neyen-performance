// =====================================================================
// NEYIMA ATHLETIC - JWT SECURITY SERVICE (Edge Runtime Compatible)
// Utiliza la Web Crypto API nativa a través de 'jose'
// =====================================================================

import { SignJWT, jwtVerify } from 'jose';
import { UsuarioAutenticado } from '../types';

const DEFAULT_SECRET = 'neyima-performance-os-ultra-secure-jwt-key-2026-edge-runtime-prod';

function getSecretKey(secret?: string): Uint8Array {
  const rawSecret = secret && secret.length >= 32 ? secret : DEFAULT_SECRET;
  return new TextEncoder().encode(rawSecret);
}

/**
 * Genera un token JWT firmado de sesión con validez de 7 días
 */
export async function createSessionToken(
  user: UsuarioAutenticado,
  secret?: string
): Promise<string> {
  const secretKey = getSecretKey(secret);

  return new SignJWT({
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
    avatarUrl: user.avatarUrl,
    perfilCompletado: user.perfilCompletado,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('neyima-athletic-performance-os')
    .setAudience('neyima-app')
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verifica y decodifica un token JWT de sesión
 */
export async function verifySessionToken(
  token: string,
  secret?: string
): Promise<UsuarioAutenticado | null> {
  try {
    const secretKey = getSecretKey(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: 'neyima-athletic-performance-os',
      audience: 'neyima-app',
    });

    if (!payload.id || !payload.email || !payload.rol) {
      return null;
    }

    return {
      id: payload.id as string,
      email: payload.email as string,
      nombre: (payload.nombre as string) || 'Usuario NEYIMA',
      rol: payload.rol as 'COACH' | 'ALUMNO',
      avatarUrl: (payload.avatarUrl as string) || null,
      perfilCompletado: Boolean(payload.perfilCompletado),
    };
  } catch {
    return null;
  }
}
