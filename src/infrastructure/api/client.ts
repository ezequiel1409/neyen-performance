// =====================================================================
// NEYIMA ATHLETIC - CLIENTE HTTP DE API (INFRAESTRUCTURA)
// Comunicación segura con Cloudflare Workers & D1
// =====================================================================

const API_BASE = '/api';

function getStoredToken(): string | null {
  try {
    return localStorage.getItem('neyima_auth_token');
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
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
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Para enviar cookies HttpOnly
    });

    const json = (await res.json().catch(() => ({}))) as any;

    if (!res.ok) {
      return { error: json?.mensaje || json?.error || `Error HTTP ${res.status}` };
    }

    return { data: json as T };
  } catch (err: any) {
    return { error: err.message || 'Error de conexión de red' };
  }
}

export const api = {
  // Auth
  async loginWithGoogle(idToken: string, rolDeseado?: 'COACH' | 'ALUMNO', codigoInvitacion?: string) {
    const res = await request<{ token: string; user: any }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken, rolDeseado, codigoInvitacion }),
    });
    if (res.data?.token) {
      setStoredToken(res.data.token);
    }
    return res;
  },

  async demoLogin(rol: 'COACH' | 'ALUMNO') {
    const res = await request<{ token: string; user: any }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ rol }),
    });
    if (res.data?.token) {
      setStoredToken(res.data.token);
    }
    return res;
  },

  async getMe() {
    return request<{ user: any; coach?: any; atleta?: any }>('/auth/me');
  },

  async submitOnboarding(datos: any) {
    const res = await request<{ token: string; user: any }>('/auth/onboarding', {
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
    return request('/auth/logout', { method: 'POST' });
  },

  // Alumno
  async getAthleteToday() {
    return request<any>('/athlete/today');
  },

  async submitWellness(datos: {
    suenio: number;
    fatiga: number;
    dolorMuscular: number;
    estres: number;
    animo: number;
  }) {
    return request<any>('/athlete/wellness', {
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
    seriesCompletadas?: any[];
  }) {
    return request<any>('/athlete/workout/finish', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  async reportCycleDelay() {
    return request<any>('/athlete/cycle/delay', { method: 'POST' });
  },

  async getAthleteHistory() {
    return request<any>('/athlete/history');
  },

  async getAthleteSleep() {
    return request<any>('/athlete/sleep');
  },

  async submitSleep(datos: any) {
    return request<any>('/athlete/sleep', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  // Coach
  async getCoachDashboard() {
    return request<any>('/coach/dashboard');
  },

  async getCoachAthletes() {
    return request<any>('/coach/athletes');
  },

  async getCoachAthleteProfile(id: string) {
    return request<any>(`/coach/athletes/${id}`);
  },

  async createAthlete(datos: any) {
    return request<any>('/coach/athletes', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  async getCoachAlerts() {
    return request<any>('/coach/alerts');
  },

  async resolveAlert(id: string) {
    return request<any>(`/coach/alerts/${id}/resolve`, { method: 'PUT' });
  },

  async submit1rmEvaluation(datos: any) {
    return request<any>('/coach/evaluations/1rm', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  // Catálogo
  async getExercises() {
    return request<any>('/catalog/exercises');
  },

  async getCategories() {
    return request<any>('/catalog/categories');
  },

  async getEquipment() {
    return request<any>('/catalog/equipment');
  },
};
