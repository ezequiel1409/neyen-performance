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
    <div className="w-full space-y-6 pb-8 md:pb-4">
      {/* Encabezado: Hoy / Hola, [Nombre] + Club */}
      <div className="pt-1 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Hoy · {atletaActual.identificadorEquipoPerteneciente || 'Personalizado (1 a 1)'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--txt)] tracking-tight mt-0.5">
            Hola, {nombreAtleta}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold border border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)]">
            {atletaActual.deportePracticado}
            {atletaActual.posicionEnElCampoDeJuego ? ` · ${atletaActual.posicionEnElCampoDeJuego}` : ''}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold border border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)]">
            Perfil {atletaActual.generoAtleta === 'F' ? 'Femenino (F)' : 'Masculino (M)'}
          </span>
        </div>
      </div>

      {/* Layout responsivo: 1 columna en móvil, 2 columnas equilibradas en tablet/desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Columna principal: Sesión de hoy y CTA */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-wider uppercase text-[var(--mut)]">
                Sesión de hoy
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--txt)] leading-snug">
                {sesionHoy.nombreSesion}
              </h2>
            </div>

            {/* Badges de sesión: duración, series, RPE */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                <IconInterface name="clock" size={13} strokeWidth={2.2} aria-hidden="true" />
                ~{sesionHoy.duracionEstimadaMinutos || 60} min
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                22 series
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                RPE {sesionHoy.esfuerzoPercibidoObjetivoDeLaSesion || 8}
              </span>
            </div>

            {/* Bloques de la sesión */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 pt-2 border-t border-[var(--bord)]">
              <div className="rounded-xl bg-[var(--bg)]/70 border border-[var(--bord)]/70 p-3.5">
                <b className="text-xs font-extrabold text-[var(--txt)] block">
                  Bloque A: Entrada en calor
                </b>
                <p className="text-xs text-[var(--mut)] mt-1 leading-relaxed">
                  Bicho muerto · Arranque · Peso muerto convencional
                </p>
              </div>

              <div className="rounded-xl bg-[var(--bg)]/70 border border-[var(--bord)]/70 p-3.5">
                <b className="text-xs font-extrabold text-[var(--txt)] block">
                  Bloque B: Fuerza principal
                </b>
                <p className="text-xs text-[var(--mut)] mt-1 leading-relaxed">
                  Press de pecho plano · Peso muerto rumano con barra
                </p>
              </div>

              <div className="rounded-xl bg-[var(--bg)]/70 border border-[var(--bord)]/70 p-3.5">
                <b className="text-xs font-extrabold text-[var(--txt)] block">
                  Bloque C: Accesorios
                </b>
                <p className="text-xs text-[var(--mut)] mt-1 leading-relaxed">
                  Plancha baja · Dominada prona
                </p>
              </div>
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
        </section>

        {/* Columna secundaria: Check-in diario, Estado fisiológico y Resumen del atleta */}
        <aside className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Tarjeta: Check-in de hoy (1 minuto) */}
          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-10 h-10 rounded-full bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <IconInterface name="heart" size={20} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <b className="text-sm font-bold text-[var(--txt)] block">Check-in de hoy</b>
                <p className="text-xs text-[var(--mut)]">Pendiente · 1 minuto</p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={onIrABienestar}
              className="font-bold rounded-xl shrink-0"
            >
              Hacer
            </Button>
          </div>

          {/* Tarjeta: Estado fisiológico */}
          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
              Estado fisiológico
            </p>
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
          </div>

          {/* Tarjeta: Objetivo y frecuencia del plan */}
          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
              Foco del ciclo actual
            </p>
            <p className="text-sm font-bold text-[var(--txt)] leading-snug">
              {atletaActual.objetivoPrincipalEntrenamiento}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-[var(--mut)] font-semibold">
              <span>Nivel: {atletaActual.nivelRendimientoDeportivo}</span>
              <span>·</span>
              <span>{atletaActual.diasDisponiblesParaEntrenarPorSemana} días/semana</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
