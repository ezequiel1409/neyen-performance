// =====================================================================
// NEYIMA ATHLETIC - FICHA TÉCNICA DEL ATLETA (COACH)
// CORRESPONDE A ficha-claro.html / ficha-oscuro.html
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from '../ui/icons/IconInterface';
import { calcularFaseCicloActual } from '../../utils/trainingMath';

interface AthleteProfileViewProps {
  onIrAlPlan?: () => void;
  onVerEvaluaciones?: () => void;
}

export const AthleteProfileView: React.FC<AthleteProfileViewProps> = ({
  onIrAlPlan,
  onVerEvaluaciones,
}) => {
  const {
    atletaActual,
    testsFuerza,
    reportarRetrasoMenstrual,
    resetearRetrasoMenstrual,
  } = useTraining();

  const [tabActiva, setTabActiva] = useState<'RESUMEN' | 'LESIONES' | 'EVALUACIONES' | 'CICLO'>('RESUMEN');
  const [formula1RM, setFormula1RM] = useState<'EPLEY' | 'BRZYCKI'>(
    atletaActual.formulaCalculoRepeticionMaximaPreferida || 'EPLEY'
  );

  // Form states editables
  const [altura, setAltura] = useState(atletaActual.alturaCentimetros);
  const [peso, setPeso] = useState(atletaActual.pesoCorporalKilogramos);
  const [posicion, setPosicion] = useState(atletaActual.posicionEnElCampoDeJuego);
  const [diasEntreno, setDiasEntreno] = useState(atletaActual.diasDisponiblesParaEntrenarPorSemana);
  const [objetivo, setObjetivo] = useState(atletaActual.objetivoPrincipalEntrenamiento);
  const [guardadoFeedback, setGuardadoFeedback] = useState(false);

  // Datos de Ciclo Menstrual si aplica
  const infoCiclo =
    atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.activo
      ? calcularFaseCicloActual(
          atletaActual.datosCicloMenstrual.fechaUltimaMenstruacion,
          atletaActual.datosCicloMenstrual.duracionPromedioCicloDias,
          atletaActual.datosCicloMenstrual.duracionPromedioMenstruacionDias
        )
      : null;

  const testsAtleta = testsFuerza.filter((t) => t.identificadorAtleta === atletaActual.identificadorAtleta);

  const handleGuardarCambios = () => {
    setGuardadoFeedback(true);
    setTimeout(() => setGuardadoFeedback(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">
            Atletas › {atletaActual.nombreCompleto}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ficha del atleta</h1>
        </div>
        <div className="flex items-center gap-2">
          {onIrAlPlan && (
            <button
              type="button"
              onClick={onIrAlPlan}
              className="px-4 py-2 rounded-xl border-2 border-[var(--link)] text-[var(--link)] hover:bg-[var(--link)] hover:text-white text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              Ir al plan
            </button>
          )}
          <button
            type="button"
            onClick={handleGuardarCambios}
            className="px-4 py-2 rounded-xl border-0 bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-xs sm:text-sm hover:opacity-95 transition cursor-pointer"
          >
            {guardadoFeedback ? '¡Guardado!' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Tarjeta Resumen Atleta */}
      <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-[var(--okbg)] flex items-center justify-center font-extrabold text-lg text-[var(--txt)] border border-[var(--bord)]">
            {atletaActual.nombreCompleto.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{atletaActual.nombreCompleto}</h2>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                {atletaActual.deportePracticado}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                {atletaActual.posicionEnElCampoDeJuego}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
                {atletaActual.nivelRendimientoDeportivo}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs de Ficha */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['RESUMEN', 'LESIONES', 'EVALUACIONES', 'CICLO'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTabActiva(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition cursor-pointer ${
                tabActiva === tab
                  ? 'bg-[var(--navbg)] text-[var(--navon)]'
                  : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--bg)]'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de 2 Columnas: Datos vs Lesiones & Ciclo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Columna Izquierda: Datos y Objetivo */}
        <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5 space-y-3.5">
          <h2 className="text-base sm:text-lg font-bold">Datos y objetivo</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[var(--mut)] font-bold">Fecha de nacimiento</span>
              <p className="font-extrabold text-sm mt-0.5">{atletaActual.fechaNacimiento}</p>
            </div>
            <div>
              <span className="text-[var(--mut)] font-bold">Edad cronológica</span>
              <p className="font-extrabold text-sm mt-0.5">{atletaActual.edadCronologicaAnios} años</p>
            </div>
            <div>
              <label htmlFor="prof-alt" className="text-[var(--mut)] font-bold">Altura (cm)</label>
              <input
                id="prof-alt"
                type="number"
                value={altura}
                onChange={(e) => setAltura(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs font-bold mt-0.5 outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="prof-peso" className="text-[var(--mut)] font-bold">Peso (kg)</label>
              <input
                id="prof-peso"
                type="number"
                step="0.5"
                value={peso}
                onChange={(e) => setPeso(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs font-bold mt-0.5 outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="prof-pos" className="text-[var(--mut)] font-bold">Posición en el campo</label>
              <input
                id="prof-pos"
                type="text"
                value={posicion}
                onChange={(e) => setPosicion(e.target.value)}
                className="w-full h-9 px-2.5 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs font-bold mt-0.5 outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="prof-dias" className="text-[var(--mut)] font-bold">Días disponibles/sem</label>
              <input
                id="prof-dias"
                type="number"
                value={diasEntreno}
                onChange={(e) => setDiasEntreno(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs font-bold mt-0.5 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prof-obj" className="block text-xs text-[var(--mut)] font-bold mb-1">
              Objetivo principal de entrenamiento
            </label>
            <textarea
              id="prof-obj"
              rows={2}
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs leading-relaxed outline-hidden"
            />
          </div>

          <div>
            <span className="block text-xs text-[var(--mut)] font-bold mb-1.5">
              Fórmula de 1RM preferida
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormula1RM('EPLEY')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  formula1RM === 'EPLEY'
                    ? 'bg-[var(--navbg)] text-[var(--navon)]'
                    : 'border border-[var(--bord)] text-[var(--txt)]'
                }`}
              >
                Epley
              </button>
              <button
                type="button"
                onClick={() => setFormula1RM('BRZYCKI')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  formula1RM === 'BRZYCKI'
                    ? 'bg-[var(--navbg)] text-[var(--navon)]'
                    : 'border border-[var(--bord)] text-[var(--txt)]'
                }`}
              >
                Brzycki
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Lesiones & Ciclo */}
        <div className="space-y-4">
          {/* Lesiones */}
          <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold">Lesiones e historial</h2>
              <span className="text-xs font-bold text-[var(--mut)]">
                {atletaActual.historialLesiones.length} registradas
              </span>
            </div>

            <div className="divide-y divide-[var(--bord)]">
              {atletaActual.historialLesiones.map((lesion) => (
                <div key={lesion.identificadorLesion} className="py-2.5 first:pt-0 last:pb-0 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <b className="text-sm font-bold">{lesion.descripcionLesion}</b>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#DCEBDD] text-[#1B5A37]">
                      {lesion.estadoLesion}
                    </span>
                  </div>
                  <p className="text-[var(--mut)]">{lesion.zonaCorporalAfectada} • Dx: {lesion.fechaDiagnostico}</p>
                  {lesion.limitacionesDeMovimiento && (
                    <p className="text-xs">
                      <b>Limitaciones:</b> {lesion.limitacionesDeMovimiento}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ciclo Menstrual si F */}
          {atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual && (
            <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold">Ciclo menstrual</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)] flex items-center gap-1">
                  <IconInterface name="check" size={12} />
                  Compartido
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                Fase actual:{' '}
                <b className="capitalize text-[var(--txt)]">{infoCiclo?.nombreFaseLegible || 'Fase lútea'}</b>{' '}
                <span className="text-[var(--mut)]">({infoCiclo?.faseActual === 'LUTEA' ? 'kilos −7,5 %' : 'cargas 100%'})</span>
              </p>
              {atletaActual.datosCicloMenstrual.enRetrasoMenstrual ? (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <span>Retraso de {atletaActual.datosCicloMenstrual.diasDeRetraso} días</span>
                  <button
                    type="button"
                    onClick={() => resetearRetrasoMenstrual(atletaActual.identificadorAtleta)}
                    className="underline font-bold cursor-pointer"
                  >
                    Resetear
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => reportarRetrasoMenstrual(atletaActual.identificadorAtleta)}
                  className="text-xs text-[var(--mut)] hover:text-[var(--txt)] underline cursor-pointer"
                >
                  Reportar retraso de ciclo
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tests de Fuerza Recientes */}
      <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold">Últimos tests de fuerza (1RM)</h2>
          {onVerEvaluaciones && (
            <button
              type="button"
              onClick={onVerEvaluaciones}
              className="text-xs font-bold text-[var(--link)] hover:underline cursor-pointer"
            >
              Ver evaluaciones completas
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--bord)] text-[var(--mut)] uppercase tracking-wider text-xs font-bold">
                <th className="py-2 px-2">Ejercicio</th>
                <th className="py-2 px-2">Peso × Reps</th>
                <th className="py-2 px-2">Epley / Brzycki</th>
                <th className="py-2 px-2">1RM Efectiva</th>
                <th className="py-2 px-2 text-right">Fase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bord)]">
              {testsAtleta.map((t) => (
                <tr key={t.identificadorTest}>
                  <td className="py-2.5 px-2 font-bold">{t.nombreEjercicioEvaluado}</td>
                  <td className="py-2.5 px-2">{t.pesoLevantadoKilogramos} kg × {t.repeticionesRealizadas}</td>
                  <td className="py-2.5 px-2 text-[var(--mut)]">
                    {t.unaRepeticionMaximaEstimadaEpley.toFixed(1)} / {t.unaRepeticionMaximaEstimadaBrzycki.toFixed(1)} kg
                  </td>
                  <td className="py-2.5 px-2 font-extrabold">{t.unaRepeticionMaximaEfectiva.toFixed(1)} kg</td>
                  <td className="py-2.5 px-2 text-right text-[var(--mut)]">
                    {t.faseCicloMenstrualMomentoEvaluacion || 'General'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
