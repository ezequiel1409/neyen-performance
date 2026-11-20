// =====================================================================
// NEYIMA ATHLETIC - GOOGLE OAUTH 2.0 TOKEN VERIFIER
// Verificación criptográfica segura de Google ID Tokens
// =====================================================================

export interface GoogleTokenPayload {
  googleSub: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Valida un Google ID Token contra los servidores de autenticación de Google
 * y comprueba la validez del emisor, audiencia y vigencia temporal.
 */
export async function verifyGoogleIdToken(
  idToken: string,
  expectedClientId?: string
): Promise<GoogleTokenPayload | null> {
  if (!idToken || typeof idToken !== 'string') {
    return null;
  }

  try {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      iss?: string;
      sub?: string;
      aud?: string;
      email?: string;
      email_verified?: string;
      name?: string;
      picture?: string;
      exp?: string;
    };

    // 1. Validar emisor oficial de Google
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!data.iss || !validIssuers.includes(data.iss)) {
      return null;
    }

    // 2. Validar que el correo esté verificado por Google
    if (data.email_verified !== 'true' && data.email_verified !== (true as unknown as string)) {
      return null;
    }

    // 3. Validar vigencia temporal
    if (data.exp) {
      const expTime = parseInt(data.exp, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > expTime) {
        return null;
      }
    }

    // 4. Validar Client ID si está configurado en las variables de entorno
    if (expectedClientId && data.aud !== expectedClientId) {
      return null;
    }

    if (!data.sub || !data.email) {
      return null;
    }

    return {
      googleSub: data.sub,
      email: data.email.toLowerCase(),
      name: data.name || data.email.split('@')[0],
      picture: data.picture,
    };
  } catch {
    return null;
  }
}
