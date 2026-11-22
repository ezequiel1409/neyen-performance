// =====================================================================
// NEYIMA ATHLETIC - PUENTE NATIVO PARA ANDROID (WEBVIEW / CAPACITOR / PWA)
// Gestiona vibración háptica y botón/gesto físico "Atrás" de Android
// =====================================================================

import { useEffect } from 'react';

export type HapticPattern = 'light' | 'medium' | 'success' | 'warning';

/**
 * Dispara feedback háptico nativo en dispositivos Android (Web Vibrate API)
 */
export function triggerHaptic(pattern: HapticPattern = 'light'): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return;
  }

  try {
    switch (pattern) {
      case 'light':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'success':
        navigator.vibrate([15, 40, 25]);
        break;
      case 'warning':
        navigator.vibrate([30, 50, 30]);
        break;
    }
  } catch {
    // Silenciar en navegadores que bloqueen vibrate sin interacción previa
  }
}

/**
 * Hook que sincroniza el gesto/botón físico "Atrás" de Android (evento popstate)
 * para cerrar modales activos o volver a la pestaña principal sin cerrar la APK.
 */
export function useAndroidBackNavigation(params: {
  workoutActivo: boolean;
  onCerrarWorkout: () => void;
  atletaDetalleAbierto: boolean;
  onCerrarAtletaDetalle: () => void;
  esVistaPrincipal: boolean;
  onVolverAVistaPrincipal: () => void;
}): void {
  const {
    workoutActivo,
    onCerrarWorkout,
    atletaDetalleAbierto,
    onCerrarAtletaDetalle,
    esVistaPrincipal,
    onVolverAVistaPrincipal,
  } = params;

  // Empujar un estado al historial cuando se abre un modal o sub-vista
  useEffect(() => {
    if (workoutActivo || atletaDetalleAbierto || !esVistaPrincipal) {
      try {
        window.history.pushState({ neyimaSubView: true }, '');
      } catch {}
    }
  }, [workoutActivo, atletaDetalleAbierto, esVistaPrincipal]);

  useEffect(() => {
    const handlePopState = () => {
      if (workoutActivo) {
        triggerHaptic('light');
        onCerrarWorkout();
        return;
      }

      if (atletaDetalleAbierto) {
        triggerHaptic('light');
        onCerrarAtletaDetalle();
        return;
      }

      if (!esVistaPrincipal) {
        triggerHaptic('light');
        onVolverAVistaPrincipal();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    workoutActivo,
    onCerrarWorkout,
    atletaDetalleAbierto,
    onCerrarAtletaDetalle,
    esVistaPrincipal,
    onVolverAVistaPrincipal,
  ]);
}
