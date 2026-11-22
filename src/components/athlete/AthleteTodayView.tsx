import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import { calcularFaseCicloActual } from '../../utils/trainingMath';
import { IndicatorStatus } from '../ui/IndicatorStatus';
import { Button } from '../ui/Button';
import { IconInterface } from '../ui/icons/IconInterface';

interface AthleteTodayViewProps {
  onIniciarEntrenamiento: () => void;
  onIrABienestar: () => void;
}

export const AthleteTodayView: React.FC<AthleteTodayViewProps> = ({
  onIniciarEntrenamiento,
  onIrABienestar,
}) => {
  const { atletaActual, macrociclo } = useTraining();

  const sesionHoy =
    macrociclo.mesociclos[0]?.microciclos[0]?.sesionesDeEntrenamiento[0] || {
      nombreSesion: 'Sesión 1 – Lunes | Tren superior (Empuje)',
      duracionEstimadaMinutos: 60,
      rpeObjetivo: 8,
    };

  const nombreAtleta = atletaActual.nombreCompleto.split(' ')[0] || 'Atleta';
  const esFemeninoConCiclo =
    atletaActual.generoAtleta === 'F' && Boolean(atletaActual.datosCicloMenstrual?.activo);

  const infoCiclo =
    esFemeninoConCiclo && atletaActual.datosCicloMenstrual
      ? calcularFaseCicloActual(
          atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
          atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
          atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
        )
      : null;

  const enRetraso = Boolean(atletaActual.datosCicloMenstrual?.enRetrasoMenstrual);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      {/* Encabezado: Hoy / Hola, [Nombre] + Club */}
      <div className="pt-2 px-1 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Hoy · {atletaActual.identificadorEquipoPerteneciente || 'Personalizado (1 a 1)'}
          </p>
          <h1 className="text-3xl font-extrabold text-[var(--txt)] tracking-tight">
            Hola, {nombreAtleta}
          </h1>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold border border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)]">
          Perfil {atletaActual.generoAtleta === 'F' ? 'Femenino (F)' : 'Masculino (M)'}
        </span>
      </div>

      {/* Tarjeta 1: Check-in de hoy (1 minuto) */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-full bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)] flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <IconInterface name="heart" size={20} strokeWidth={2.2} />
          </span>
          <div>
            <b className="text-sm font-bold text-[var(--txt)] block">Check-in de hoy</b>
            <p className="text-xs text-[var(--mut)]">Pendiente · 1 minuto</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onIrABienestar}
          className="font-bold rounded-xl"
        >
          Hacer
        </Button>
      </div>

      {/* Tarjeta 2: Sesión de hoy con bloques A, B, C */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-3">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase text-[var(--mut)]">
            Sesión de hoy
          </p>
          <h2 className="text-lg font-extrabold text-[var(--txt)] mt-0.5 leading-snug">
            {sesionHoy.nombreSesion}
          </h2>
        </div>

        {/* Badges de sesión: duración, series, RPE */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
            <IconInterface name="clock" size={13} strokeWidth={2.2} aria-hidden="true" />
            ~{sesionHoy.duracionEstimadaMinutos || 60} min
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
            22 series
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
            RPE {sesionHoy.esfuerzoPercibidoObjetivoDeLaSesion || 8}
          </span>
        </div>

        {/* Bloque A */}
        <div className="pt-2.5 border-t border-[var(--bord)]">
          <b className="text-xs font-bold text-[var(--txt)] block">Bloque A: Entrada en calor</b>
          <p className="text-xs text-[var(--mut)] mt-0.5">
            Bicho muerto · Arranque · Peso muerto convencional
          </p>
        </div>

        {/* Bloque B */}
        <div className="pt-2.5 border-t border-[var(--bord)]">
          <b className="text-xs font-bold text-[var(--txt)] block">Bloque B: Fuerza principal</b>
          <p className="text-xs text-[var(--mut)] mt-0.5">
            Press de pecho plano · Peso muerto rumano con barra
          </p>
        </div>

        {/* Bloque C */}
        <div className="pt-2.5 border-t border-[var(--bord)]">
          <b className="text-xs font-bold text-[var(--txt)] block">Bloque C: Accesorios</b>
          <p className="text-xs text-[var(--mut)] mt-0.5">
            Plancha baja · Dominada prona
          </p>
        </div>
      </div>

      {/* Badges de estado fisiológico */}
      <div className="flex flex-wrap gap-2">
        <IndicatorStatus
          status="ok"
          label="Carga: Sweet Spot"
          icon="check"
        />

        {esFemeninoConCiclo && infoCiclo && (
          <IndicatorStatus
            status={enRetraso ? 'warn' : infoCiclo.faseActual === 'LUTEA' ? 'neu' : 'ok'}
            label={
              enRetraso
                ? 'Ciclo en pausa por retraso'
                : infoCiclo.faseActual === 'LUTEA'
                  ? `Día ${infoCiclo.diaActualDelCiclo} · Fase lútea (−7,5 %)`
                  : infoCiclo.faseActual === 'MENSTRUACION'
                    ? `Día ${infoCiclo.diaActualDelCiclo} · Menstrual (−5 %)`
                    : `Día ${infoCiclo.diaActualDelCiclo} · ${infoCiclo.nombreFaseLegible} (100 %)`
            }
            icon="drop"
          />
        )}
      </div>

      {/* Botón de acción principal */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onIniciarEntrenamiento}
          className="text-base font-extrabold shadow-md min-h-[52px]"
        >
          Comenzar entrenamiento
        </Button>
      </div>
    </div>
  );
};
