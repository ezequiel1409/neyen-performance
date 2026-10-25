// =====================================================================
// NEYEN ATHLETIC - DESCANSO, SUEÑO REM & WEARABLES SMARTWATCH (MLP)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  Activity,
  CheckCircle2,
  Clock,
  Heart,
  Moon,
  RefreshCw,
  Watch,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const AthleteSleepWearableMLP: React.FC = () => {
  const { atletaActual, sincronizarSmartwatchMock } = useTraining();
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [mensajeSync, setMensajeSync] = useState<string | null>(null);

  const registros = atletaActual.registrosDescanso || [];
  const ultimoRegistro = registros[0];

  const handleSincronizar = () => {
    setSincronizando(true);
    setTimeout(() => {
      sincronizarSmartwatchMock(atletaActual.identificadorAtleta);
      setSincronizando(false);
      setMensajeSync('✓ Datos de sueño y HRV sincronizados con éxito desde el Smartwatch.');
      setTimeout(() => setMensajeSync(null), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-3 py-0.5 text-xs font-bold text-[#163832] dark:text-[#E1ECE5]">
              MLP PREVIEW
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#163832] dark:text-white flex items-center gap-2">
              <Moon className="h-6 w-6 text-[#2F6B4F]" aria-hidden="true" />
              Monitoreo de Descanso & Wearables
            </h1>
          </div>
          <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] mt-1">
            Métricas de recuperación fisiológica del sistema nervioso autónomo y fases del sueño para{' '}
            <strong className="text-[#163832] dark:text-white">{atletaActual.nombreCompleto}</strong>.
          </p>
        </div>

        {/* Botón Sincronizar Smartwatch con min 44px de alto */}
        <Button
          variant="primary"
          size="md"
          onClick={handleSincronizar}
          disabled={sincronizando}
          icon={
            <RefreshCw
              className={`h-4 w-4 ${sincronizando ? 'animate-spin motion-reduce:animate-none' : ''}`}
              aria-hidden="true"
            />
          }
          className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-600/30"
        >
          {sincronizando ? 'Sincronizando...' : 'Sincronizar Smartwatch'}
        </Button>
      </header>

      {/* Región de anuncio dinámico accesible */}
      {mensajeSync && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-300 flex items-center gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{mensajeSync}</span>
        </div>
      )}

      {/* Tarjetas Principales de la Última Noche */}
      {ultimoRegistro ? (
        <section aria-label="Métricas de la última noche" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-indigo-400 shrink-0" aria-hidden="true" />
              Sueño Total
            </span>
            <p className="mt-2 text-2xl font-black text-white font-mono">
              {ultimoRegistro.horasSuenioTotal} hrs
            </p>
            <span className="text-xs text-emerald-400 font-semibold">Óptimo (+8 hrs)</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Moon className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
              Sueño REM
            </span>
            <p className="mt-2 text-2xl font-black text-purple-400 font-mono">
              {ultimoRegistro.porcentajeSuenioRem}%
            </p>
            <span className="text-xs text-slate-400">Recuperación neural</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
              Sueño Profundo
            </span>
            <p className="mt-2 text-2xl font-black text-blue-400 font-mono">
              {ultimoRegistro.porcentajeSuenioProfundo}%
            </p>
            <span className="text-xs text-slate-400">Reparación tisular</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-400 shrink-0" aria-hidden="true" />
              HRV / VFC
            </span>
            <p className="mt-2 text-2xl font-black text-rose-400 font-mono">
              {ultimoRegistro.variabilidadFrecuenciaCardiacaHrvMs} ms
            </p>
            <span className="text-xs text-emerald-400 font-semibold">Alta recuperación</span>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-xs text-slate-400">
          No hay registros de descanso aún. Toca en <strong>«Sincronizar Smartwatch»</strong> para
          simular la conexión con tu dispositivo wearable.
        </div>
      )}

      {/* Desglose Arquitectónico de Fases de Sueño */}
      {ultimoRegistro && (
        <section
          aria-labelledby="titulo-arquitectura-suenio"
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 id="titulo-arquitectura-suenio" className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              Arquitectura del Sueño (Noche {ultimoRegistro.fechaNoche})
            </h2>
            <span className="rounded bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
              Dispositivo: {ultimoRegistro.fuenteWearable}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Sueño REM ({ultimoRegistro.porcentajeSuenioRem}%)</span>
                <span className="text-purple-400 font-mono">
                  {((ultimoRegistro.horasSuenioTotal * ultimoRegistro.porcentajeSuenioRem) / 100).toFixed(1)} hrs
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Porcentaje de Sueño REM"
                aria-valuenow={ultimoRegistro.porcentajeSuenioRem}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-1.5 h-3.5 w-full rounded-full bg-slate-800 overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500 motion-reduce:transition-none"
                  style={{ width: `${ultimoRegistro.porcentajeSuenioRem}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Sueño Profundo ({ultimoRegistro.porcentajeSuenioProfundo}%)</span>
                <span className="text-blue-400 font-mono">
                  {((ultimoRegistro.horasSuenioTotal * ultimoRegistro.porcentajeSuenioProfundo) / 100).toFixed(1)} hrs
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Porcentaje de Sueño Profundo"
                aria-valuenow={ultimoRegistro.porcentajeSuenioProfundo}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-1.5 h-3.5 w-full rounded-full bg-slate-800 overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500 motion-reduce:transition-none"
                  style={{ width: `${ultimoRegistro.porcentajeSuenioProfundo}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>
                  Sueño Ligero / Transición (
                  {100 - ultimoRegistro.porcentajeSuenioRem - ultimoRegistro.porcentajeSuenioProfundo}%)
                </span>
                <span className="text-slate-400 font-mono">
                  {(
                    (ultimoRegistro.horasSuenioTotal *
                      (100 -
                        ultimoRegistro.porcentajeSuenioRem -
                        ultimoRegistro.porcentajeSuenioProfundo)) /
                    100
                  ).toFixed(1)}{' '}
                  hrs
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Porcentaje de Sueño Ligero"
                aria-valuenow={
                  100 -
                  ultimoRegistro.porcentajeSuenioRem -
                  ultimoRegistro.porcentajeSuenioProfundo
                }
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-1.5 h-3.5 w-full rounded-full bg-slate-800 overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-slate-600 transition-all duration-500 motion-reduce:transition-none"
                  style={{
                    width: `${
                      100 -
                      ultimoRegistro.porcentajeSuenioRem -
                      ultimoRegistro.porcentajeSuenioProfundo
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Historial de Noches Registradas */}
      <section
        aria-labelledby="titulo-historial-noches"
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-xl"
      >
        <h2 id="titulo-historial-noches" className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Watch className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          Historial de Noches Conectadas ({registros.length})
        </h2>

        <div className="space-y-2">
          {registros.map((r) => (
            <div
              key={r.identificadorRegistro}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs"
            >
              <div>
                <span className="font-bold text-white">{r.fechaNoche}</span>
                <span className="ml-2 text-slate-400 font-medium">
                  Duración: <strong className="text-slate-200">{r.horasSuenioTotal} hrs</strong>
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-purple-400">REM: {r.porcentajeSuenioRem}%</span>
                <span className="text-blue-400">Profundo: {r.porcentajeSuenioProfundo}%</span>
                <span className="text-rose-400 font-mono">HRV: {r.variabilidadFrecuenciaCardiacaHrvMs} ms</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
