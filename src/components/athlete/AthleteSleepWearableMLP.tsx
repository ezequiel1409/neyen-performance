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
  Sparkles,
  Watch,
  Zap,
} from 'lucide-react';

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
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/30">
              MLP PREVIEW
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Moon className="h-6 w-6 text-indigo-400" />
              Monitoreo de Descanso, Sueño REM & Smartwatch
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Métricas de recuperación fisiológica del sistema nervioso autónomo y fases del sueño para <strong className="text-white">{atletaActual.nombreCompleto}</strong>.
          </p>
        </div>

        {/* Botón Sincronizar Smartwatch */}
        <button
          onClick={handleSincronizar}
          disabled={sincronizando}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-4 w-4 ${sincronizando ? 'animate-spin' : ''}`} />
          {sincronizando ? 'Sincronizando...' : 'Sincronizar Smartwatch'}
        </button>
      </div>

      {mensajeSync && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          {mensajeSync}
        </div>
      )}

      {/* Tarjetas Principales de la Última Noche */}
      {ultimoRegistro ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              Sueño Total
            </span>
            <p className="mt-2 text-2xl font-black text-white font-mono">{ultimoRegistro.horasSuenioTotal} hrs</p>
            <span className="text-[10px] text-emerald-400">Óptimo (+8 hrs)</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Moon className="h-3.5 w-3.5 text-purple-400" />
              Sueño REM
            </span>
            <p className="mt-2 text-2xl font-black text-purple-400 font-mono">{ultimoRegistro.porcentajeSuenioRem}%</p>
            <span className="text-[10px] text-slate-400">Recuperación cognitiva</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-blue-400" />
              Sueño Profundo
            </span>
            <p className="mt-2 text-2xl font-black text-blue-400 font-mono">{ultimoRegistro.porcentajeSuenioProfundo}%</p>
            <span className="text-[10px] text-slate-400">Regeneración muscular (GH)</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              HRV / VFC
            </span>
            <p className="mt-2 text-2xl font-black text-rose-400 font-mono">{ultimoRegistro.variabilidadFrecuenciaCardiacaHrvMs} ms</p>
            <span className="text-[10px] text-emerald-400">Alta recuperación (SNA)</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-400">
          No hay registros de sueño aún. Tocá "Sincronizar Smartwatch" para traer los datos.
        </div>
      )}

      {/* Desglose Arquitectónico de Fases de Sueño */}
      {ultimoRegistro && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              Arquitectura del Sueño (Noche {ultimoRegistro.fechaNoche})
            </h2>
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30">
              Fuente: {ultimoRegistro.fuenteWearable}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Sueño REM ({ultimoRegistro.porcentajeSuenioRem}%)</span>
                <span className="text-purple-400">
                  {((ultimoRegistro.horasSuenioTotal * ultimoRegistro.porcentajeSuenioRem) / 100).toFixed(1)} hrs
                </span>
              </div>
              <div className="mt-1 h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${ultimoRegistro.porcentajeSuenioRem}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Sueño Profundo ({ultimoRegistro.porcentajeSuenioProfundo}%)</span>
                <span className="text-blue-400">
                  {((ultimoRegistro.horasSuenioTotal * ultimoRegistro.porcentajeSuenioProfundo) / 100).toFixed(1)} hrs
                </span>
              </div>
              <div className="mt-1 h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${ultimoRegistro.porcentajeSuenioProfundo}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Sueño Ligero / Transición ({100 - ultimoRegistro.porcentajeSuenioRem - ultimoRegistro.porcentajeSuenioProfundo}%)</span>
                <span className="text-slate-400">
                  {((ultimoRegistro.horasSuenioTotal * (100 - ultimoRegistro.porcentajeSuenioRem - ultimoRegistro.porcentajeSuenioProfundo)) / 100).toFixed(1)} hrs
                </span>
              </div>
              <div className="mt-1 h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-600"
                  style={{ width: `${100 - ultimoRegistro.porcentajeSuenioRem - ultimoRegistro.porcentajeSuenioProfundo}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Noches Registradas */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Watch className="h-5 w-5 text-indigo-400" />
          Historial de Noches Conectadas
        </h2>

        <div className="space-y-2">
          {registros.map((r) => (
            <div
              key={r.identificadorRegistro}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
            >
              <div>
                <span className="font-bold text-white">{r.fechaNoche}</span>
                <span className="ml-2 text-slate-400">Duración: {r.horasSuenioTotal} hrs</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-purple-400 font-semibold">REM: {r.porcentajeSuenioRem}%</span>
                <span className="text-blue-400 font-semibold">Profundo: {r.porcentajeSuenioProfundo}%</span>
                <span className="text-rose-400 font-mono">HRV: {r.variabilidadFrecuenciaCardiacaHrvMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
