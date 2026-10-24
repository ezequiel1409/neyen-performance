// =====================================================================
// NEYEN ATHLETIC - MOTOR MATEMÁTICO Y FISIOLÓGICO DE ENTRENAMIENTO
// =====================================================================

import { EscalaEsfuerzoPercibidoSesion, FaseCicloMenstrual, FormulaCalculoRepeticionMaxima } from '../types';

/**
 * Fórmula de Epley para estimar 1RM:
 * 1RM = Peso * (1 + Reps / 30)
 */
export function calcularUnRepeticionMaximaEpley(pesoKg: number, repeticiones: number): number {
  if (repeticiones <= 0 || pesoKg <= 0) return 0;
  if (repeticiones === 1) return pesoKg;
  const unRM = pesoKg * (1 + repeticiones / 30);
  return Math.round(unRM * 10) / 10;
}

/**
 * Fórmula de Brzycki para estimar 1RM:
 * 1RM = Peso * (36 / (37 - Reps))
 * Precisión recomendada para repeticiones <= 10.
 */
export function calcularUnRepeticionMaximaBrzycki(pesoKg: number, repeticiones: number): number {
  if (repeticiones <= 0 || pesoKg <= 0) return 0;
  if (repeticiones === 1) return pesoKg;
  if (repeticiones >= 37) return pesoKg; // Protección matemática
  const unRM = pesoKg * (36 / (37 - repeticiones));
  return Math.round(unRM * 10) / 10;
}

/**
 * Calcula el 1RM efectivo según la preferencia configurada
 */
export function calcularUnRepeticionMaximaEfectiva(
  pesoKg: number,
  repeticiones: number,
  formula: FormulaCalculoRepeticionMaxima = 'EPLEY'
): number {
  return formula === 'BRZYCKI'
    ? calcularUnRepeticionMaximaBrzycki(pesoKg, repeticiones)
    : calcularUnRepeticionMaximaEpley(pesoKg, repeticiones);
}

/**
 * Redondeo práctico de gimnasio (a los 0.5 kg o 1.25 kg más cercanos para discos)
 */
export function redondearPesoGimnasio(pesoKg: number, incremento: number = 0.5): number {
  return Math.round(pesoKg / incremento) * incremento;
}

/**
 * Calcula la carga en kg para una prescripción de serie, considerando:
 * 1. El 1RM base del ejercicio o ejercicio de referencia con ratio
 * 2. El %1RM prescrito por el coach
 * 3. La reducción adaptativa automática si la atleta está en fase de alta fatiga hormonal (-7.5%)
 */
export function calcularCargaPrescrita({
  unRepeticionMaximaKg,
  porcentajeUnaRepeticionMaxima,
  ratioConversionCarga = 1,
  faseCicloMenstrual,
  aplicarAjusteHormonal = false,
}: {
  unRepeticionMaximaKg: number;
  porcentajeUnaRepeticionMaxima?: number;
  ratioConversionCarga?: number;
  faseCicloMenstrual?: FaseCicloMenstrual;
  aplicarAjusteHormonal?: boolean;
}): {
  pesoFinalKg: number;
  pesoBaseTeoricoKg: number;
  ajusteHormonalAplicadoPorcentaje: number;
  mensajeAjuste?: string;
} {
  if (!porcentajeUnaRepeticionMaxima || unRepeticionMaximaKg <= 0) {
    return { pesoFinalKg: 0, pesoBaseTeoricoKg: 0, ajusteHormonalAplicadoPorcentaje: 0 };
  }

  // 1RM efectivo considerando el ratio si es ejercicio derivado (ej. Press inclinado = 82% de plano)
  const unRMEfectivo = unRepeticionMaximaKg * ratioConversionCarga;
  const pesoBase = (unRMEfectivo * porcentajeUnaRepeticionMaxima) / 100;

  let factorAjuste = 1.0;
  let porcentajeAjuste = 0;
  let mensaje: string | undefined = undefined;

  // Ajuste automático por fisiología femenina:
  // En fase Lútea Tardía o Menstruación temprana, la evidencia en S&C muestra mayor fatiga y peor recuperación glucolítica
  if (aplicarAjusteHormonal && faseCicloMenstrual) {
    if (faseCicloMenstrual === 'LUTEA') {
      porcentajeAjuste = -7.5;
      factorAjuste = 0.925;
      mensaje = 'Carga autorregulada (-7.5%) por Fase Lútea (mayor fatiga / estrés catabólico)';
    } else if (faseCicloMenstrual === 'MENSTRUACION') {
      porcentajeAjuste = -5.0;
      factorAjuste = 0.95;
      mensaje = 'Carga autorregulada (-5%) por inicio de ciclo menstrual';
    }
  }

  const pesoAjustado = pesoBase * factorAjuste;
  const pesoFinalRedondeado = redondearPesoGimnasio(pesoAjustado, 0.5);

  return {
    pesoFinalKg: pesoFinalRedondeado,
    pesoBaseTeoricoKg: redondearPesoGimnasio(pesoBase, 0.5),
    ajusteHormonalAplicadoPorcentaje: porcentajeAjuste,
    mensajeAjuste: mensaje,
  };
}

/**
 * Calcula la fase actual del ciclo menstrual a partir de la Fecha de Última Menstruación (FUM)
 */
export function calcularFaseCicloActual(
  fechaUltimaMenstruacion: string,
  duracionCicloDias: number = 28,
  duracionMenstruacionDias: number = 5
): {
  diaActualDelCiclo: number;
  faseActual: FaseCicloMenstrual;
  nombreFaseLegible: string;
  recomendacionDeportiva: string;
  colorHex: string;
} {
  const fechaFum = new Date(fechaUltimaMenstruacion);
  const hoy = new Date();
  const diferenciaMilisegundos = hoy.getTime() - fechaFum.getTime();
  const diasTranscurridos = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  // Día normalizado del ciclo (1 a duracionCicloDias)
  const diaCiclo = ((diasTranscurridos % duracionCicloDias) + duracionCicloDias) % duracionCicloDias + 1;

  if (diaCiclo <= duracionMenstruacionDias) {
    return {
      diaActualDelCiclo: diaCiclo,
      faseActual: 'MENSTRUACION',
      nombreFaseLegible: 'Fase Menstrual',
      recomendacionDeportiva: 'Bajos estrógenos. Priorizar hidratación y movilidad. Ajuste ligero de volumen.',
      colorHex: '#ef4444', // Rojo deportivo
    };
  } else if (diaCiclo <= 13) {
    return {
      diaActualDelCiclo: diaCiclo,
      faseActual: 'FOLICULAR',
      nombreFaseLegible: 'Fase Folicular Tardía',
      recomendacionDeportiva: 'Pico de estrógenos. Máxima tolerancia al esfuerzo, óptima síntesis proteica y fuerza alta.',
      colorHex: '#3b82f6', // Azul
    };
  } else if (diaCiclo <= 16) {
    return {
      diaActualDelCiclo: diaCiclo,
      faseActual: 'OVULATORIA',
      nombreFaseLegible: 'Fase Ovulatoria',
      recomendacionDeportiva: 'Pico de fuerza máxima y potencia. Atención al control neuromuscular y estabilidad articular.',
      colorHex: '#10b981', // Verde esmeralda
    };
  } else {
    return {
      diaActualDelCiclo: diaCiclo,
      faseActual: 'LUTEA',
      nombreFaseLegible: 'Fase Lútea',
      recomendacionDeportiva: 'Progesterona alta. Mayor fatiga percibida y temperatura basal. Se aplica autorregulación de carga.',
      colorHex: '#f59e0b', // Ámbar
    };
  }
}

/**
 * Cuantificación de Carga Interna de Foster:
 * Carga de Sesión (UA) = sRPE (1-10) * Duración en Minutos
 */
export function calcularCargaInternaFoster(
  esfuerzoPercibido: EscalaEsfuerzoPercibidoSesion | number,
  duracionMinutos: number
): number {
  return Math.round(esfuerzoPercibido * duracionMinutos);
}
