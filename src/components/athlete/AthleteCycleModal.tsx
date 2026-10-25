// =====================================================================
// NEYEN ATHLETIC - MODAL "MI CICLO" (DISEÑO LIGHT & DARK)
// =====================================================================

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { calcularFaseCicloActual } from '../../utils/trainingMath';

interface AthleteCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AthleteCycleModal: React.FC<AthleteCycleModalProps> = ({ isOpen, onClose }) => {
  const {
    atletaActual,
    reportarRetrasoMenstrual,
    resetearRetrasoMenstrual,
    actualizarPreferenciasCiclo,
  } = useTraining();

  const [fechaFUM, setFechaFUM] = useState<string>(
    atletaActual.datosCicloMenstrual?.fechaUltimaMenstruacion || '2026-10-01'
  );
  const [duracionCiclo, setDuracionCiclo] = useState<number>(
    atletaActual.datosCicloMenstrual?.duracionPromedioCicloDias || 28
  );
  const [mensajeAlerta, setMensajeAlerta] = useState<string | null>(null);

  if (!isOpen) return null;

  const compartirConCoach = atletaActual.datosCicloMenstrual?.compartirCicloConCoach ?? true;

  const infoCiclo = calcularFaseCicloActual(
    fechaFUM,
    duracionCiclo,
    atletaActual.datosCicloMenstrual?.duracionPromedioMenstruacionDias || 5
  );

  const handleToggleCompartir = () => {
    actualizarPreferenciasCiclo(atletaActual.identificadorAtleta, {
      compartirCicloConCoach: !compartirConCoach,
    });
  };

  const handleReportarRetraso = () => {
    reportarRetrasoMenstrual(atletaActual.identificadorAtleta);
    setMensajeAlerta('Retraso reportado a tu entrenador. Cargas pausadas.');
    setTimeout(() => setMensajeAlerta(null), 3000);
  };

  const handleLlegoPeriodo = () => {
    resetearRetrasoMenstrual(atletaActual.identificadorAtleta);
    setMensajeAlerta('¡Registro actualizado! Tu nuevo ciclo ha comenzado.');
    setTimeout(() => setMensajeAlerta(null), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mi ciclo"
      className="fixed inset-0 z-50 flex flex-col bg-[#FAF7EE] dark:bg-[#0E2420] text-[#163832] dark:text-[#FAF7EE] overflow-y-auto"
    >
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-between space-y-5">
        {/* Encabezado con Botón Volver y Título */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Volver atrás"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 active:scale-95 transition"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-bold text-[#163832] dark:text-white tracking-tight">
              Mi ciclo
            </h1>
          </div>

          {mensajeAlerta && (
            <div className="rounded-2xl bg-emerald-600 text-white p-3 text-xs font-bold text-center animate-fade-in shadow-md">
              {mensajeAlerta}
            </div>
          )}

          {/* Tarjeta 1: Compartir con mi coach */}
          <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base text-[#163832] dark:text-white">
                Compartir con mi coach
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={compartirConCoach}
                onClick={handleToggleCompartir}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  compartirConCoach
                    ? 'bg-[#163832] dark:bg-[#E85938]'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white dark:bg-[#102824] shadow ring-0 transition duration-200 ease-in-out ${
                    compartirConCoach ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-[#163832]/80 dark:text-[#9EB5B0] leading-relaxed">
              Tu coach lo usa para cuidar tu carga de entrenamiento. Podés dejar de compartirlo cuando quieras.
            </p>
          </div>

          {/* Tarjeta 2: HOY - Día del ciclo */}
          <div className="rounded-2xl bg-[#E1ECE5] dark:bg-[#183E37] p-4 space-y-1 shadow-sm">
            <span className="uppercase font-bold text-xs tracking-wider text-[#163832]/80 dark:text-[#9EB5B0]">
              HOY
            </span>
            <p className="font-bold text-2xl text-[#163832] dark:text-white">
              Día [{String(infoCiclo.diaActualDelCiclo).padStart(2, '0')}] del ciclo
            </p>
            <p className="text-sm font-medium text-[#163832] dark:text-[#E1ECE5]">
              Fase: [{infoCiclo.nombreFaseLegible}]
            </p>
          </div>

          {/* Tarjeta 3: Inputs de fecha y duración */}
          <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#163832] dark:text-white">
                Fecha de última menstruación
              </label>
              <input
                type="text"
                value={fechaFUM}
                onChange={(e) => setFechaFUM(e.target.value)}
                placeholder="[dd/mm/aaaa]"
                className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent px-4 py-3 text-base text-[#163832] dark:text-white placeholder:text-[#163832]/40 dark:placeholder:text-[#9EB5B0]/40 focus:outline-none focus:ring-2 focus:ring-[#E85938]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#163832] dark:text-white">
                Duración habitual del ciclo (días)
              </label>
              <input
                type="number"
                value={duracionCiclo}
                onChange={(e) => setDuracionCiclo(parseInt(e.target.value) || 28)}
                className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-transparent px-4 py-3 text-base text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938]"
              />
            </div>
          </div>

          {/* Banner de alerta: ¿Hay retraso? */}
          <div className="rounded-2xl bg-[#E85938] p-4 text-[#112B26] leading-relaxed shadow-sm">
            <strong className="font-bold">¿Hay retraso?</strong> Si lo reportás, se pausa el cálculo automático de tus cargas y se avisa a tu coach.
          </div>
        </div>

        {/* Botones de acción inferiores */}
        <div className="space-y-3 pt-4 pb-2">
          <button
            type="button"
            onClick={handleReportarRetraso}
            className="w-full rounded-2xl bg-[#E85938] hover:bg-[#D74F30] active:scale-[0.99] text-[#112B26] font-extrabold text-base py-4 text-center shadow-md transition"
          >
            Reportar retraso
          </button>
          <button
            type="button"
            onClick={handleLlegoPeriodo}
            className="w-full rounded-2xl border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-[#FAF7EE] font-extrabold text-base py-4 text-center bg-transparent hover:bg-[#E1ECE5]/40 active:scale-[0.99] transition"
          >
            Mi período llegó
          </button>
        </div>
      </div>
    </div>
  );
};
