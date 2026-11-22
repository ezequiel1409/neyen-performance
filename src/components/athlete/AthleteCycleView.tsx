import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { calcularFaseCicloActual } from '../../utils/trainingMath';
import { Button } from '../ui/Button';
import { IconInterface } from '../ui/icons/IconInterface';

export const AthleteCycleView: React.FC = () => {
  const { atletaActual, reportarRetrasoMenstrual, resetearRetrasoMenstrual } = useTraining();

  const [hoyStr] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const [compartirCiclo, setCompartirCiclo] = useState<boolean>(true);
  const [fechaUltimaMenstruacion, setFechaUltimaMenstruacion] = useState<string>(
    () =>
      atletaActual.datosCicloMenstrual?.fechaUltimaMenstruacion ||
      new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [duracionCicloDias, setDuracionCicloDias] = useState<number>(
    () => atletaActual.datosCicloMenstrual?.duracionPromedioCicloDias || 28
  );
  const [duracionMenstruacionDias, setDuracionMenstruacionDias] = useState<number>(
    () => atletaActual.datosCicloMenstrual?.duracionPromedioMenstruacionDias || 5
  );
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const enRetraso = Boolean(atletaActual.datosCicloMenstrual?.enRetrasoMenstrual);
  const infoCiclo = calcularFaseCicloActual(
    fechaUltimaMenstruacion,
    Math.min(40, Math.max(21, duracionCicloDias || 28)),
    Math.min(10, Math.max(2, duracionMenstruacionDias || 5))
  );

  const handleReportarRetraso = () => {
    reportarRetrasoMenstrual(atletaActual.identificadorAtleta);
    setMensajeExito('Retraso reportado. Se pausó el cálculo automático y se notificó a tu coach.');
    setTimeout(() => setMensajeExito(null), 4000);
  };

  const handlePeriodoLlego = () => {
    resetearRetrasoMenstrual(atletaActual.identificadorAtleta);
    setMensajeExito('¡Excelente! Se reinició el ciclo ovárico y la autorregulación de cargas.');
    setTimeout(() => setMensajeExito(null), 4000);
  };

  return (
    <div className="max-w-md mx-auto space-y-3.5 pb-20">
      {/* Encabezado */}
      <div className="pt-2 px-1">
        <h1 className="text-3xl font-extrabold text-[var(--txt)] tracking-tight">Mi ciclo</h1>
      </div>

      {/* Tarjeta 1: Switch compartir ciclo */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-[var(--txt)]">
            Compartir mi ciclo ({compartirCiclo ? 'activo' : 'inactivo'})
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={compartirCiclo}
            aria-label="Compartir mi ciclo con el coach"
            onClick={() => setCompartirCiclo(!compartirCiclo)}
            className={`w-14 h-8 rounded-full border-2 transition-colors relative cursor-pointer select-none ${
              compartirCiclo
                ? 'border-[var(--navbg)] bg-[var(--navbg)]'
                : 'border-[var(--bord)] bg-[var(--bg)]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full transition-transform ${
                compartirCiclo
                  ? 'right-0.5 bg-[var(--navon)]'
                  : 'left-0.5 bg-[var(--field)]'
              }`}
            />
          </button>
        </div>

        <p className="text-xs text-[var(--mut)] leading-relaxed">
          Tu coach lo usa para cuidar tu carga. Podés dejar de compartirlo cuando quieras.
        </p>
      </div>

      {/* Tarjeta 2: Fase actual del ciclo */}
      <div className="rounded-2xl bg-[var(--okbg)] text-[var(--oktx)] p-4 shadow-xs space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">HOY</p>
        <p className="text-2xl font-extrabold leading-tight">
          {enRetraso
            ? 'Ciclo en pausa por retraso'
            : `Día ${infoCiclo.diaActualDelCiclo} · ${infoCiclo.nombreFaseLegible}`}
        </p>
        <p className="text-xs font-medium">
          {enRetraso
            ? 'Cálculo de cargas pausado preventivamente.'
            : infoCiclo.faseActual === 'LUTEA'
              ? 'Tus kilos se ajustan −7,5 % en fase lútea para optimizar la recuperación.'
              : infoCiclo.faseActual === 'MENSTRUACION'
                ? 'Ajuste preventivo del −5 % en inicio de ciclo menstrual.'
                : `${infoCiclo.recomendacionDeportiva} (100 % de carga).`}
        </p>
      </div>

      {/* Tarjeta 3: Configuración de fechas */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <label htmlFor="fecha-ult-menst" className="text-xs font-bold text-[var(--txt)] block">
            Última menstruación (FUM)
          </label>
          <input
            id="fecha-ult-menst"
            type="date"
            max={hoyStr}
            value={fechaUltimaMenstruacion}
            onChange={(e) => setFechaUltimaMenstruacion(e.target.value)}
            className="w-full h-12 rounded-xl border-2 border-[var(--field)] bg-[var(--surf)] text-[var(--txt)] px-3 text-sm font-semibold focus:outline-none focus:border-[var(--link)]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="dur-ciclo" className="text-xs font-bold text-[var(--txt)] block">
            Ciclo (días)
          </label>
          <input
            id="dur-ciclo"
            type="number"
            min={21}
            max={40}
            value={duracionCicloDias}
            onChange={(e) => setDuracionCicloDias(Number(e.target.value))}
            className="w-full h-12 rounded-xl border-2 border-[var(--field)] bg-[var(--surf)] text-[var(--txt)] px-3 text-sm font-semibold focus:outline-none focus:border-[var(--link)]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="dur-menst" className="text-xs font-bold text-[var(--txt)] block">
            Menstruación (días)
          </label>
          <input
            id="dur-menst"
            type="number"
            min={2}
            max={10}
            value={duracionMenstruacionDias}
            onChange={(e) => setDuracionMenstruacionDias(Number(e.target.value))}
            className="w-full h-12 rounded-xl border-2 border-[var(--field)] bg-[var(--surf)] text-[var(--txt)] px-3 text-sm font-semibold focus:outline-none focus:border-[var(--link)]"
          />
        </div>
      </div>

      {/* Tarjeta 4: Alerta y retrasos */}
      <div className="rounded-2xl bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)] p-3.5 flex items-start gap-3 shadow-xs">
        <IconInterface name="calclock" size={20} className="mt-0.5 shrink-0" strokeWidth={2.2} />
        <div className="text-xs leading-relaxed">
          <b>¿Hay retraso?</b> Se pausa el cálculo automático y se avisa a tu coach para adaptar
          el estímulo. Historial de retrasos: ninguno.
        </div>
      </div>

      {mensajeExito && (
        <div className="rounded-xl bg-[var(--estado-ok-fondo)] text-[var(--estado-ok-texto)] p-3 text-xs font-bold animate-fade-in">
          {mensajeExito}
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-2 pt-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleReportarRetraso}
          className="text-base font-extrabold min-h-[52px]"
        >
          Reportar retraso
        </Button>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handlePeriodoLlego}
          className="text-base font-bold min-h-[52px]"
        >
          Mi período llegó
        </Button>
      </div>
    </div>
  );
};
