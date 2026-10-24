// =====================================================================
// NEYEN ATHLETIC - DASHBOARD DE PROGRESO ANUAL DEL ALUMNO
// =====================================================================

import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  Flame,
  LineChart,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const AthleteAnnualProgressView: React.FC = () => {
  const { atletaActual, testsFuerza, historialSesiones } = useTraining();

  const testsAtleta = testsFuerza.filter((t) => t.identificadorAtleta === atletaActual.identificadorAtleta);
  const sesionesAtleta = historialSesiones.filter((s) => s.identificadorAtleta === atletaActual.identificadorAtleta);

  const cargaTotalAcumuladaUA = sesionesAtleta.reduce((acc, curr) => acc + curr.cargaInternaUnidadesArbitrarias, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-emerald-400" />
          Mi Progreso Anual & Cargas de Entrenamiento
        </h1>
        <p className="text-sm text-slate-400">
          Evolución de fuerza máxima (1RM), carga interna de Foster acumulada y registro de entrenamientos.
        </p>
      </div>

      {/* Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            Carga Acumulada
          </span>
          <p className="mt-2 text-2xl font-black text-amber-400 font-mono">{cargaTotalAcumuladaUA} UA</p>
          <span className="text-[10px] text-slate-500">Unidades Arbitrarias</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            Sesiones Hechas
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-400 font-mono">{sesionesAtleta.length}</p>
          <span className="text-[10px] text-slate-500">Adherencia del 94%</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Dumbbell className="h-3.5 w-3.5 text-blue-400" />
            1RM Sentadilla
          </span>
          <p className="mt-2 text-2xl font-black text-blue-400 font-mono">
            {testsAtleta.find((t) => t.identificadorEjercicioBase === 'EX0001')?.unaRepeticionMaximaEfectiva || 99} kg
          </p>
          <span className="text-[10px] text-emerald-400">+12% en la temporada</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            1RM Peso Muerto
          </span>
          <p className="mt-2 text-2xl font-black text-purple-400 font-mono">
            {testsAtleta.find((t) => t.identificadorEjercicioBase === 'EX0004')?.unaRepeticionMaximaEfectiva || 264} kg
          </p>
          <span className="text-[10px] text-emerald-400">Marca récord de club</span>
        </div>
      </div>

      {/* Gráfico Visual de Evolución de 1RM */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-400" />
          Evolución de Fuerza Máxima en los 4 Grandes Básicos
        </h2>

        <div className="space-y-4 pt-2">
          {testsAtleta.map((t) => (
            <div key={t.identificadorTest} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{t.nombreEjercicioEvaluado}</span>
                <span className="font-mono text-emerald-400 font-bold">{t.unaRepeticionMaximaEfectiva} kg</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                  style={{ width: `${Math.min(100, (t.unaRepeticionMaximaEfectiva / 300) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Evaluado: {t.fechaEvaluacion} ({t.faseCicloMenstrualMomentoEvaluacion || 'Fase Regular'})</span>
                <span>Fórmula: {atletaActual.formulaCalculoRepeticionMaximaPreferida}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historial de Sesiones Completadas con sRPE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-400" />
          Historial Reciente de Sesiones y Respuesta al Entrenamiento
        </h2>

        <div className="space-y-3">
          {sesionesAtleta.map((ses) => (
            <div
              key={ses.identificadorRegistro}
              className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">Sesión Finalizada</span>
                  <p className="text-xs text-slate-400">
                    Duración: <strong className="text-white">{ses.duracionRealMinutos} min</strong> • Finalizada: {new Date(ses.fechaYHoraFinalizacion).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-400 border border-emerald-500/30">
                    {ses.cargaInternaUnidadesArbitrarias} UA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 border-t border-slate-800/80 pt-2">
                <span>
                  sRPE de Sesión: <strong className="text-amber-400">{ses.feedbackEntrenamiento.esfuerzoPercibidoSesion} / 10</strong>
                </span>
                <span>
                  Fatiga: <strong className="text-blue-400">{ses.feedbackEntrenamiento.nivelFatigaPercibida} / 5</strong>
                </span>
                {ses.feedbackEntrenamiento.presentaDolorOMolestia && (
                  <span className="text-rose-400 font-semibold">
                    ⚠️ Dolor: {ses.feedbackEntrenamiento.zonaCorporalMolestia}
                  </span>
                )}
              </div>

              {ses.feedbackEntrenamiento.comentariosDelAtleta && (
                <p className="text-xs text-slate-400 italic bg-slate-900 p-2 rounded-lg">
                  "{ses.feedbackEntrenamiento.comentariosDelAtleta}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
