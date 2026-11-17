// =====================================================================
// NEYIMA ATHLETIC - DESCANSO, SUEÑO & WEARABLES SMARTWATCH (MLP)
// CORRESPONDE A sueno-claro.html / sueno-oscuro.html
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from '../ui/icons/IconInterface';

export const AthleteSleepWearableMLP: React.FC = () => {
  const { atletaActual, sincronizarSmartwatchMock } = useTraining();
  const [sincronizando, setSincronizando] = useState(false);
  const [mensajeSync, setMensajeSync] = useState<string | null>(null);

  const registros = atletaActual.registrosDescanso || [];
  const ultimoRegistro = registros[0];

  const handleSincronizar = () => {
    setSincronizando(true);
    setTimeout(() => {
      sincronizarSmartwatchMock(atletaActual.identificadorAtleta);
      setSincronizando(false);
      setMensajeSync('✓ Datos de descanso y HRV sincronizados con éxito.');
      setTimeout(() => setMensajeSync(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">Biometría y recuperación</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Descanso y Wearables</h1>
        </div>

        <button
          type="button"
          onClick={handleSincronizar}
          disabled={sincronizando}
          className="px-4 py-2 rounded-xl bg-[var(--navbg)] text-[var(--navon)] hover:opacity-95 font-bold text-xs sm:text-sm transition self-start cursor-pointer flex items-center gap-2"
        >
          <IconInterface name="gauge" size={16} />
          <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar Smartwatch'}</span>
        </button>
      </div>

      {mensajeSync && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <IconInterface name="check" size={14} />
          <span>{mensajeSync}</span>
        </div>
      )}

      {/* Tarjetas Principales de la Última Noche */}
      {ultimoRegistro ? (
        <section aria-label="Métricas de la última noche" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
            <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
              <IconInterface name="clock" size={14} />
              Sueño Total
            </span>
            <p className="mt-1.5 text-2xl font-black text-[var(--txt)] font-mono">
              {ultimoRegistro.horasSuenioTotal} hrs
            </p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Óptimo (+7.5 hrs)</span>
          </div>

          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
            <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
              <IconInterface name="heart" size={14} />
              HRV Nocturna
            </span>
            <p className="mt-1.5 text-2xl font-black text-[var(--txt)] font-mono">
              {ultimoRegistro.variabilidadFrecuenciaCardiacaHrvMs} ms
            </p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Tono vagal alto</span>
          </div>

          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
            <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
              <IconInterface name="heart" size={14} />
              FC Reposo
            </span>
            <p className="mt-1.5 text-2xl font-black text-[var(--txt)] font-mono">
              {ultimoRegistro.frecuenciaCardiacaReposoLpm} lpm
            </p>
            <span className="text-xs text-[var(--mut)]">Línea base deportiva</span>
          </div>

          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-2xs">
            <span className="text-xs text-[var(--mut)] font-bold flex items-center gap-1.5">
              <IconInterface name="star" size={14} />
              Calidad Subjetiva
            </span>
            <p className="mt-1.5 text-2xl font-black text-[var(--txt)] font-mono">
              {ultimoRegistro.calidadSubjetivaDescanso} / 5
            </p>
            <span className="text-xs text-[var(--mut)]">Fuente: {ultimoRegistro.fuenteWearable}</span>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-8 text-center text-xs text-[var(--mut)]">
          No hay registros de descanso aún. Presioná &ldquo;Sincronizar Smartwatch&rdquo; para cargar la última noche.
        </div>
      )}

      {/* Desglose de Fases de Sueño */}
      {ultimoRegistro && (
        <section className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 space-y-3 shadow-2xs">
          <h2 className="text-sm font-bold flex items-center gap-2 border-b border-[var(--bord)] pb-2.5">
            <IconInterface name="moon" size={16} />
            <span>Fases del Sueño y Calidad Restaurativa</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>Sueño Profundo (Reparación Muscular)</span>
                <span className="font-mono">{ultimoRegistro.porcentajeSuenioProfundo}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[var(--bg)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--navbg)]"
                  style={{ width: `${ultimoRegistro.porcentajeSuenioProfundo * 2.5}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>Sueño REM (Consolidación Motriz)</span>
                <span className="font-mono">{ultimoRegistro.porcentajeSuenioRem}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[var(--bg)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--navbg)]"
                  style={{ width: `${ultimoRegistro.porcentajeSuenioRem * 2.5}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Historial de Noches */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
          Historial de Descanso ({registros.length} noches)
        </h2>

        <div className="space-y-2">
          {registros.map((reg) => (
            <div
              key={reg.identificadorRegistro}
              className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3 flex items-center justify-between text-xs shadow-2xs"
            >
              <div>
                <b className="text-sm font-bold">{reg.fechaNoche}</b>
                <p className="text-xs text-[var(--mut)] mt-0.5">
                  {reg.horasSuenioTotal} hrs • FC Reposo: {reg.frecuenciaCardiacaReposoLpm} lpm • Fuente: {reg.fuenteWearable}
                </p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)] font-mono">
                  HRV: {reg.variabilidadFrecuenciaCardiacaHrvMs} ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
