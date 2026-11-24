import React, { useState } from 'react';
import { api } from '../../infrastructure/api/client';
import { Button } from '../ui/Button';
import { IndicatorStatus } from '../ui/IndicatorStatus';
import { IconInterface, type IconInterfaceName } from '../ui/icons/IconInterface';

interface AthleteWellnessViewProps {
  onGuardadoExitoso?: () => void;
}

type Nivel1a5 = 1 | 2 | 3 | 4 | 5;

export const AthleteWellnessView: React.FC<AthleteWellnessViewProps> = ({ onGuardadoExitoso }) => {
  const [suenio, setSuenio] = useState<Nivel1a5>(4);
  const [fatiga, setFatiga] = useState<Nivel1a5>(4);
  const [dolorMuscular, setDolorMuscular] = useState<Nivel1a5>(3);
  const [estres, setEstres] = useState<Nivel1a5>(4);
  const [animo, setAnimo] = useState<Nivel1a5>(4);
  const [guardado, setGuardado] = useState<boolean>(false);

  // Cálculo en tiempo real: Suma (máx 25) y %
  const sumaPuntos = suenio + fatiga + dolorMuscular + estres + animo;
  const porcentaje = Math.round((sumaPuntos / 25) * 100);

  const getEstadoPreparacion = () => {
    if (porcentaje >= 80) {
      return { status: 'ok' as const, label: 'Óptimo', mensaje: 'Listo para alta intensidad' };
    }
    if (porcentaje >= 60) {
      return { status: 'warn' as const, label: 'Moderado', mensaje: 'Monitorear RPE y descanso' };
    }
    return { status: 'bad' as const, label: 'Alerta', mensaje: 'Considerar descarga o sesión regenerativa' };
  };

  const estado = getEstadoPreparacion();

  const handleGuardar = () => {
    setGuardado(true);

    // Persistir en backend Cloudflare D1
    api
      .submitWellness({
        suenio,
        fatiga,
        dolorMuscular,
        estres,
        animo,
      })
      .catch(console.warn);

    setTimeout(() => {
      setGuardado(false);
      if (onGuardadoExitoso) onGuardadoExitoso();
    }, 1200);
  };

  const renderSelector = (
    label: string,
    icon: IconInterfaceName,
    valor: Nivel1a5,
    setValor: (val: Nivel1a5) => void
  ) => {
    const niveles: Nivel1a5[] = [1, 2, 3, 4, 5];

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--txt)]">
          <IconInterface name={icon} size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{label}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {niveles.map((n) => {
            const isSelected = valor === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setValor(n)}
                aria-pressed={isSelected}
                aria-label={`${label} ${n} de 5`}
                className={`h-12 rounded-xl font-extrabold text-base transition-all select-none cursor-pointer border-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--focus)] ${
                  isSelected
                    ? 'border-[var(--navbg)] bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                    : 'border-[var(--field)] bg-transparent text-[var(--txt)] hover:bg-[var(--surf)]'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 pb-8 md:pb-4">
      {/* Encabezado */}
      <div className="pt-1">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
          Check-in de hoy · 1 minuto
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--txt)] tracking-tight mt-0.5">
          Mi bienestar
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Columna izquierda: Escalas de bienestar */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Leyenda explicativa */}
          <div className="flex items-start gap-2 text-xs text-[var(--mut)] leading-relaxed bg-[var(--surf)] border border-[var(--bord)] p-3.5 rounded-xl">
            <IconInterface name="info" size={16} className="mt-0.5 shrink-0" strokeWidth={2.2} />
            <span>En todas las escalas, 1 es lo más desfavorable y 5 lo mejor (5 en fatiga = sin fatiga).</span>
          </div>

          {/* Selectores de bienestar */}
          <div className="space-y-4 bg-[var(--surf)] border border-[var(--bord)] p-4 sm:p-6 rounded-2xl shadow-xs">
            {renderSelector('Sueño', 'moon', suenio, setSuenio)}
            {renderSelector('Fatiga', 'gauge', fatiga, setFatiga)}
            {renderSelector('Dolor muscular', 'activity', dolorMuscular, setDolorMuscular)}
            {renderSelector('Estrés', 'heart', estres, setEstres)}
            {renderSelector('Ánimo', 'heart', animo, setAnimo)}
          </div>
        </div>

        {/* Columna derecha: Resultado y guardado */}
        <aside className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-8">
          {/* Tarjeta de cálculo de preparación */}
          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
                  Índice de preparación
                </p>
                <b className="text-3xl font-extrabold text-[var(--txt)] block mt-1">
                  {porcentaje} %
                </b>
              </div>

              <IndicatorStatus
                status={estado.status}
                label={estado.label}
                icon={estado.status === 'ok' ? 'check' : 'alert'}
              />
            </div>

            <div className="h-2.5 w-full rounded-full bg-[var(--bg)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--navbg)] transition-all duration-300"
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            <p className="text-xs text-[var(--mut)] leading-relaxed">
              {estado.mensaje} · Puntaje: <b className="text-[var(--txt)]">{sumaPuntos} / 25</b>
            </p>

            {/* Botón de guardado */}
            <div className="pt-1">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleGuardar}
                disabled={guardado}
                className="text-base font-extrabold shadow-md min-h-[52px]"
              >
                {guardado ? '✓ Check-in guardado' : 'Guardar check-in'}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
