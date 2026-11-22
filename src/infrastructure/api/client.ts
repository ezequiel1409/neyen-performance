// =====================================================================
// NEYIMA ATHLETIC - CLIENTE HTTP DE API (INFRAESTRUCTURA)
// Comunicación segura con Cloudflare Workers & D1 (Web + Android APK/Capacitor)
// =====================================================================

const PROD_API_URL = 'https://neyen-performance.facuezedrive.workers.dev/api';

/**
 * Detecta si la app corre dentro de un contenedor nativo Android (Capacitor / WebView)
 * para dirigir las llamadas al backend de Cloudflare Workers en lugar de localhost.
 */
export function isNativeAndroidOrCapacitor(): boolean {
  if (typeof window === 'undefined') return false;
  const { protocol, hostname, port } = window.location;
  const isCapacitorProtocol = protocol === 'capacitor:' || protocol === 'file:';
  const isLocalWebView = hostname === 'localhost' && (!port || port === '80' || port === '443');
  const hasCapacitorGlobal = 'Capacitor' in window;
  return isCapacitorProtocol || isLocalWebView || hasCapacitorGlobal;
}

function getApiBase(): string {
  const envUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  if (envUrl) return envUrl;
  if (isNativeAndroidOrCapacitor()) return PROD_API_URL;
  return '/api';
}

export interface ApiUserDTO {
  id: string;
  email: string;
  nombre: string;
  rol: 'COACH' | 'ALUMNO';
  avatarUrl?: string | null;
  perfilCompletado: boolean;
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem('neyima_auth_token');
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem('neyima_auth_token', token);
    } else {
      localStorage.removeItem('neyima_auth_token');
    }
  } catch {}
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${getApiBase()}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Para enviar cookies HttpOnly en web
    });

    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

    if (!res.ok) {
      const errorMsg =
        (typeof json.mensaje === 'string' && json.mensaje) ||
        (typeof json.error === 'string' && json.error) ||
        `Error HTTP ${res.status}`;
      return { error: errorMsg };
    }

    return { data: json as T };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error de conexión de red';
    return { error: message };
  }
}

export const api = {
  // Auth
  async loginWithGoogle(idToken: string, rolDeseado?: 'COACH' | 'ALUMNO', codigoInvitacion?: string) {
    const res = await request<{ token: string; user: ApiUserDTO }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken, rolDeseado, codigoInvitacion }),
    });
    if (res.data?.token) {
      setStoredToken(res.data.token);
    }
    return res;
  },

  async demoLogin(rol: 'COACH' | 'ALUMNO') {
    const res = await request<{ token: string; user: ApiUserDTO }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ rol }),
    });
    if (res.data?.token) {
      setStoredToken(res.data.token);
    }
    return res;
  },

  async getMe() {
    return request<{
      user: ApiUserDTO;
      coach?: Record<string, unknown>;
      atleta?: Record<string, unknown>;
    }>('/auth/me');
  },

  async submitOnboarding(datos: Record<string, unknown>) {
    const res = await request<{ token: string; user: ApiUserDTO }>('/auth/onboarding', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    if (res.data?.token) {
      setStoredToken(res.data.token);
    }
    return res;
  },

  async logout() {
    setStoredToken(null);
    return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
  },

  // Alumno
  async getAthleteToday() {
    return request<Record<string, unknown>>('/athlete/today');
  },

  async submitWellness(datos: {
    suenio: number;
    fatiga: number;
    dolorMuscular: number;
    estres: number;
    animo: number;
  }) {
    return request<{
      success: boolean;
      scorePorcentaje: number;
      estadoLabel: string;
      fecha: string;
    }>('/athlete/wellness', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  async finishWorkout(datos: {
    idSesionPlanificada?: string;
    duracionRealMinutos: number;
    srpeFoster: number;
    fatigaPercibida: number;
    presentaDolor: boolean;
    zonaDolor?: string | null;
    comentarios?: string | null;
    seriesCompletadas?: unknown[];
  }) {
    return request<Record<string, unknown>>('/athlete/workout/finish', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  async reportCycleDelay() {
    return request<{ success: boolean; mensaje: string }>('/athlete/cycle/delay', {
      method: 'POST',
    });
  },

  async getAthleteHistory() {
    return request<{ sesiones: Record<string, unknown>[] }>('/athlete/history');
  },

  async getAthleteSleep() {
    return request<{ registros: Record<string, unknown>[] }>('/athlete/sleep');
  },

  async submitSleep(datos: Record<string, unknown>) {
    return request<{ success: boolean }>('/athlete/sleep', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  // Coach
  async getCoachDashboard() {
    return request<Record<string, unknown>>('/coach/dashboard');
  },

  async getCoachAthletes() {
    return request<{ atletas: Record<string, unknown>[] }>('/coach/athletes');
  },

  async getCoachAthleteProfile(id: string) {
    return request<Record<string, unknown>>(`/coach/athletes/${id}`);
  },

  async createAthlete(datos: Record<string, unknown>) {
    return request<Record<string, unknown>>('/coach/athletes', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  async getCoachAlerts() {
    return request<{ alertas: Record<string, unknown>[] }>('/coach/alerts');
  },

  async resolveAlert(id: string) {
    return request<{ success: boolean }>(`/coach/alerts/${id}/resolve`, { method: 'PUT' });
  },

  async submit1rmEvaluation(datos: Record<string, unknown>) {
    return request<Record<string, unknown>>('/coach/evaluations/1rm', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  // Catálogo
  async getExercises() {
    return request<{ ejercicios: Record<string, unknown>[] }>('/catalog/exercises');
  },

  async getCategories() {
    return request<{ categorias: Record<string, unknown>[] }>('/catalog/categories');
  },

  async getEquipment() {
    return request<{ equipamientos: Record<string, unknown>[] }>('/catalog/equipment');
  },
};
