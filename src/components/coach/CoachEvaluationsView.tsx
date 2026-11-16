// =====================================================================
// NEYIMA ATHLETIC - EVALUACIONES FÍSICAS Y MOVILIDAD ARTICULAR (COACH)
// CORRESPONDE A evals-claro.html / movil-claro.html
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from '../ui/icons/IconInterface';

export const CoachEvaluationsView: React.FC = () => {
  const { atletaActual, atletas, setAtletaSeleccionadoId, testsFuerza, agregarOActualizarTestFuerza, ejercicios } = useTraining();

  const [tabActiva, setTabActiva] = useState<'FUERZA' | 'MOVILIDAD'>('FUERZA');

  // Formulario nuevo test de fuerza 1RM
  const [ejercicioId, setEjercicioId] = useState(ejercicios[0]?.identificadorEjercicio || 'EX0001');
  const [peso, setPeso] = useState(100);
  const [reps, setReps] = useState(3);
  const [fechaFuerza, setFechaFuerza] = useState(() => new Date().toISOString().split('T')[0]);

  // Formulario tests de movilidad articular
  const [dorsiflexion, setDorsiflexion] = useState('38');
  const [movCadera, setMovCadera] = useState('Completa sin pinzamiento');
  const [rotCadera, setRotCadera] = useState('42');
  const [movHombro, setMovHombro] = useState('Simétrica 16 cm');
  const [overheadSquat, setOverheadSquat] = useState('3/3');
  const [sitAndReach, setSitAndReach] = useState('+8');
  const [mensajeGuardado, setMensajeGuardado] = useState(false);

  const testsAtleta = testsFuerza.filter((t) => t.identificadorAtleta === atletaActual.identificadorAtleta);

  const handleGuardarTestFuerza = (e: React.FormEvent) => {
    e.preventDefault();
    const ej = ejercicios.find((item) => item.identificadorEjercicio === ejercicioId);
    if (!ej) return;

    agregarOActualizarTestFuerza({
      identificadorAtleta: atletaActual.identificadorAtleta,
      identificadorEjercicioBase: ejercicioId,
      nombreEjercicioEvaluado: ej.nombreEjercicio,
      pesoLevantadoKilogramos: Number(peso),
      repeticionesRealizadas: Number(reps),
      fechaEvaluacion: fechaFuerza,
    });
  };

  const handleGuardarMovilidad = (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">Batería de tests</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Evaluaciones físicas</h1>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="eval-atleta" className="text-xs font-bold text-[var(--mut)]">
            Atleta
          </label>
          <select
            id="eval-atleta"
            value={atletaActual.identificadorAtleta}
            onChange={(e) => setAtletaSeleccionadoId(e.target.value)}
            className="h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)] text-xs font-bold outline-hidden"
          >
            {atletas.map((at) => (
              <option key={at.identificadorAtleta} value={at.identificadorAtleta}>
                {at.nombreCompleto}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTabActiva('FUERZA')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            tabActiva === 'FUERZA'
              ? 'bg-[var(--navbg)] text-[var(--navon)]'
              : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
          }`}
        >
          Fuerza y capacidades
        </button>
        <button
          type="button"
          onClick={() => setTabActiva('MOVILIDAD')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            tabActiva === 'MOVILIDAD'
              ? 'bg-[var(--navbg)] text-[var(--navon)]'
              : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
          }`}
        >
          Movilidad articular
        </button>
      </div>

      {/* Tab Fuerza */}
      {tabActiva === 'FUERZA' ? (
        <div className="space-y-4">
          {/* Histórico 1RM */}
          <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-bold mb-3">Registros de 1RM estimadas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--bord)] text-[var(--mut)] uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-2 px-2">Ejercicio</th>
                    <th className="py-2 px-2">Carga × Reps</th>
                    <th className="py-2 px-2">Epley</th>
                    <th className="py-2 px-2">Brzycki</th>
                    <th className="py-2 px-2">1RM Efectiva</th>
                    <th className="py-2 px-2 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bord)]">
                  {testsAtleta.map((t) => (
                    <tr key={t.identificadorTest}>
                      <td className="py-2.5 px-2 font-bold">{t.nombreEjercicioEvaluado}</td>
                      <td className="py-2.5 px-2">{t.pesoLevantadoKilogramos} kg × {t.repeticionesRealizadas}</td>
                      <td className="py-2.5 px-2 text-[var(--mut)]">{t.unaRepeticionMaximaEstimadaEpley.toFixed(1)} kg</td>
                      <td className="py-2.5 px-2 text-[var(--mut)]">{t.unaRepeticionMaximaEstimadaBrzycki.toFixed(1)} kg</td>
                      <td className="py-2.5 px-2 font-extrabold">{t.unaRepeticionMaximaEfectiva.toFixed(1)} kg</td>
                      <td className="py-2.5 px-2 text-right text-[var(--mut)]">{t.fechaEvaluacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formulario nuevo test de fuerza */}
          <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
            <h2 className="text-base font-bold mb-3">Registrar nuevo test submáximo</h2>
            <form onSubmit={handleGuardarTestFuerza} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="eval-ej" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Ejercicio
                </label>
                <select
                  id="eval-ej"
                  value={ejercicioId}
                  onChange={(e) => setEjercicioId(e.target.value)}
                  className="w-full h-10 px-2 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs font-bold outline-hidden"
                >
                  {ejercicios.map((ej) => (
                    <option key={ej.identificadorEjercicio} value={ej.identificadorEjercicio}>
                      {ej.nombreEjercicio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="eval-peso" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Peso (kg)
                </label>
                <input
                  id="eval-peso"
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs font-bold outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="eval-reps" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Repeticiones
                </label>
                <input
                  id="eval-reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs font-bold outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="eval-fecha" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Fecha
                </label>
                <div className="flex gap-2">
                  <input
                    id="eval-fecha"
                    type="date"
                    value={fechaFuerza}
                    onChange={(e) => setFechaFuerza(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 h-10 rounded-xl bg-[var(--navbg)] text-[var(--navon)] font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Tab Movilidad Articular */
        <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold mb-3">Protocolo de Movilidad Articular</h2>
          <form onSubmit={handleGuardarMovilidad} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="mov-dorsi" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Dorsiflexión de tobillo (°)
                </label>
                <input
                  id="mov-dorsi"
                  type="text"
                  value={dorsiflexion}
                  onChange={(e) => setDorsiflexion(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="mov-cadera" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Movilidad de cadera
                </label>
                <input
                  id="mov-cadera"
                  type="text"
                  value={movCadera}
                  onChange={(e) => setMovCadera(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="mov-rot" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Rotación de cadera (°)
                </label>
                <input
                  id="mov-rot"
                  type="text"
                  value={rotCadera}
                  onChange={(e) => setRotCadera(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="mov-hombro" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Movilidad de hombro
                </label>
                <input
                  id="mov-hombro"
                  type="text"
                  value={movHombro}
                  onChange={(e) => setMovHombro(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="mov-ohs" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Sentadilla sobre la cabeza
                </label>
                <input
                  id="mov-ohs"
                  type="text"
                  value={overheadSquat}
                  onChange={(e) => setOverheadSquat(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="mov-snr" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Sit & Reach (cm)
                </label>
                <input
                  id="mov-snr"
                  type="text"
                  value={sitAndReach}
                  onChange={(e) => setSitAndReach(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-xs outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                Guardar evaluación
              </button>
              {mensajeGuardado && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <IconInterface name="check" size={14} />
                  Evaluación guardada correctamente
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
