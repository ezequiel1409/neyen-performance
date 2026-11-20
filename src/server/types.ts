// =====================================================================
// NEYIMA ATHLETIC - SERVER BINDINGS & CONTEXT TYPES
// =====================================================================

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  JWT_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  ENVIRONMENT?: string;
}

export type RolUsuario = 'COACH' | 'ALUMNO';

export interface UsuarioAutenticado {
  id: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  avatarUrl?: string | null;
  perfilCompletado: boolean;
}

export interface Variables {
  user: UsuarioAutenticado;
}
