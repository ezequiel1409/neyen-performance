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

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      {/* Encabezado */}
      <div className="pt-2 px-1">
        <h1 className="text-3xl font-extrabold text-[var(--txt)] tracking-tight">Mi historial</h1>
      </div>

      {/* Tarjeta de Carga Acumulada */}
      <div className="rounded-2xl bg-[var(--okbg)] text-[var(--oktx)] p-4 flex items-center justify-between shadow-xs">
        <span className="text-sm font-semibold max-w-[200px] leading-snug">
          Carga interna de las últimas {sesionesAMostrar.length} sesiones
        </span>
        <b className="text-3xl font-extrabold tracking-tight">{totalUA} UA</b>
      </div>

      {/* Lista de Sesiones */}
      <div className="space-y-3">
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
