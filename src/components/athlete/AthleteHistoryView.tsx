import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IndicatorStatus } from '../ui/IndicatorStatus';
import { SesionCompletadaAtleta } from '../../types';

export const AthleteHistoryView: React.FC = () => {
  const { historialSesiones } = useTraining();

  const sesionesMocks: SesionCompletadaAtleta[] = [
    {
      identificadorRegistro: 'HIST-01',
      identificadorAtleta: 'AL0001',
      identificadorSesionOriginal: 'Sesión A: fuerza máxima piernas',
      fechaYHoraFinalizacion: '2026-10-21T18:30:00Z',
      duracionRealMinutos: 62,
      cargaInternaUnidadesArbitrarias: 496,
      ejerciciosEjecutados: [],
      feedbackEntrenamiento: {
        esfuerzoPercibidoSesion: 8,
        nivelFatigaPercibida: 4,
        presentaDolorOMolestia: false,
        comentariosDelAtleta: 'Gran intensidad en las sentadillas, buena respuesta de la rodilla.',
      },
    },
    {
      identificadorRegistro: 'HIST-02',
      identificadorAtleta: 'AL0001',
      identificadorSesionOriginal: 'Sesión B: torso y empujes',
      fechaYHoraFinalizacion: '2026-10-19T17:45:00Z',
      duracionRealMinutos: 55,
      cargaInternaUnidadesArbitrarias: 385,
      ejerciciosEjecutados: [],
      feedbackEntrenamiento: {
        esfuerzoPercibidoSesion: 7,
        nivelFatigaPercibida: 3,
        presentaDolorOMolestia: false,
        comentariosDelAtleta: 'Excelente ritmo en los empujes.',
      },
    },
  ];

  const sesionesAMostrar: SesionCompletadaAtleta[] =
    historialSesiones.length > 0 ? historialSesiones : sesionesMocks;

  const totalUA = sesionesAMostrar.reduce(
    (acc, s) => acc + (s.cargaInternaUnidadesArbitrarias || 0),
    0
  );
  const promedioRpe =
    sesionesAMostrar.length > 0
      ? (
          sesionesAMostrar.reduce(
            (acc, s) => acc + (s.feedbackEntrenamiento.esfuerzoPercibidoSesion || 0),
            0
          ) / sesionesAMostrar.length
        ).toFixed(1)
      : '0';

  return (
    <div className="w-full space-y-6 pb-8 md:pb-4">
      {/* Encabezado */}
      <div className="pt-1">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
          Registro de entrenamientos
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--txt)] tracking-tight mt-0.5">
          Mi historial
        </h1>
      </div>

      {/* Resumen de Carga Acumulada (adaptativo 1 a 3 columnas) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[var(--okbg)] text-[var(--oktx)] p-4 sm:p-5 flex items-center justify-between shadow-xs sm:col-span-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 block">
              Carga interna total
            </span>
            <b className="text-3xl font-extrabold tracking-tight mt-1 block">{totalUA} UA</b>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] block">
            Sesiones registradas
          </span>
          <b className="text-3xl font-extrabold text-[var(--txt)] tracking-tight mt-1 block">
            {sesionesAMostrar.length}
          </b>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] block">
            Esfuerzo promedio (sRPE)
          </span>
          <b className="text-3xl font-extrabold text-[var(--txt)] tracking-tight mt-1 block">
            {promedioRpe} / 10
          </b>
        </div>
      </div>

      {/* Lista de Sesiones en grilla responsiva */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sesionesAMostrar.map((sesion, index) => {
          const feedback = sesion.feedbackEntrenamiento;
          const tieneDolor = feedback.presentaDolorOMolestia;
          const fechaFormateada = sesion.fechaYHoraFinalizacion.split('T')[0] || 'Reciente';

          return (
            <div
              key={sesion.identificadorRegistro || index}
              className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-2.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <b className="text-base font-bold text-[var(--txt)] truncate">
                  {sesion.identificadorSesionOriginal || 'Entrenamiento completado'}
                </b>
                <span className="text-xs font-semibold text-[var(--mut)] shrink-0">
                  {fechaFormateada}
                </span>
              </div>

              {/* Chips de métricas */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                  {sesion.duracionRealMinutos} min
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                  Esfuerzo {feedback.esfuerzoPercibidoSesion}/10
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                  Fatiga {feedback.nivelFatigaPercibida}/5
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                  {sesion.cargaInternaUnidadesArbitrarias} UA
                </span>
              </div>

              {feedback.comentariosDelAtleta && (
                <p className="text-xs text-[var(--txt)] leading-relaxed bg-[var(--bg)]/50 p-2.5 rounded-xl border border-[var(--bord)]/50">
                  "{feedback.comentariosDelAtleta}"
                </p>
              )}

              <div className="pt-1">
                {tieneDolor ? (
                  <IndicatorStatus
                    status="proc"
                    label={`Molestia reportada: ${feedback.zonaCorporalMolestia || 'Molestia'}`}
                    icon="bandage"
                    size="sm"
                  />
                ) : (
                  <span className="text-xs font-medium text-[var(--mut)]">
                    Sin dolor ni molestias
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
