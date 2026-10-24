// =====================================================================
// NEYEN ATHLETIC - GALERÍA DE FOTOS DE PROGRESO (MLP)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { Camera, Plus, Sparkles, X } from 'lucide-react';

export const AthleteGalleryMLP: React.FC = () => {
  const { atletaActual, agregarFotoProgreso } = useTraining();
  const [modalSubidaAbierto, setModalSubidaAbierto] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [vistaInput, setVistaInput] = useState<'FRENTE' | 'PERFIL' | 'ESPALDA'>('FRENTE');
  const [notaInput, setNotaInput] = useState<string>('');

  const fotos = atletaActual.galeriaFotosProgreso || [];

  const handleSubirFoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    agregarFotoProgreso(atletaActual.identificadorAtleta, urlInput, vistaInput, notaInput);
    setUrlInput('');
    setNotaInput('');
    setModalSubidaAbierto(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-400 border border-purple-500/30">
              MLP PREVIEW
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Camera className="h-6 w-6 text-purple-400" />
              Galería de Fotos de Progreso Corporal
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Registro visual cronológico de postura, composición corporal y evolución muscular de <strong className="text-white">{atletaActual.nombreCompleto}</strong>.
          </p>
        </div>

        <button
          onClick={() => setModalSubidaAbierto(true)}
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
        >
          <Plus className="h-4 w-4" />
          Nueva Foto de Progreso
        </button>
      </div>

      {/* Comparador Antes y Después */}
      {fotos.length >= 2 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Comparador Visual: Inicio vs Actualidad
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Punto de Partida ({fotos[fotos.length - 1].fechaRegistro})</span>
              <div className="overflow-hidden rounded-xl border border-slate-800 aspect-[3/4] bg-black">
                <img
                  src={fotos[fotos.length - 1].urlFoto}
                  alt="Inicio"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-400">Peso: {fotos[fotos.length - 1].pesoRegistradoKg} kg</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-purple-300">Estado Actual ({fotos[0].fechaRegistro})</span>
              <div className="overflow-hidden rounded-xl border border-purple-500/50 aspect-[3/4] bg-black shadow-lg shadow-purple-500/10">
                <img
                  src={fotos[0].urlFoto}
                  alt="Actual"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-purple-300 font-bold">Peso: {fotos[0].pesoRegistradoKg} kg</p>
            </div>
          </div>
        </div>
      )}

      {/* Feed Cronológico de Fotos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fotos.map((f) => (
          <div
            key={f.identificadorFoto}
            className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition hover:border-slate-700"
          >
            <div className="aspect-[4/5] bg-black relative">
              <img src={f.urlFoto} alt={f.tipoVista} className="h-full w-full object-cover" />
              <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                Vista: {f.tipoVista}
              </span>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{f.fechaRegistro}</span>
                <span className="text-slate-400">{f.pesoRegistradoKg} kg</span>
              </div>
              {f.observaciones && <p className="text-xs text-slate-400">{f.observaciones}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para añadir foto */}
      {modalSubidaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Añadir Foto de Progreso</h3>
              <button onClick={() => setModalSubidaAbierto(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubirFoto} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300">URL de la Foto</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => setUrlInput('https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400')}
                  className="mt-1 text-[11px] text-purple-400 hover:underline"
                >
                  Usar foto de muestra de atleta
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Ángulo de Vista</label>
                <select
                  value={vistaInput}
                  onChange={(e) => setVistaInput(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  <option value="FRENTE">Frente</option>
                  <option value="PERFIL">Perfil</option>
                  <option value="ESPALDA">Espalda</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Observaciones</label>
                <input
                  type="text"
                  placeholder="ej. Semana 10 de fuerza hipertrófica"
                  value={notaInput}
                  onChange={(e) => setNotaInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalSubidaAbierto(false)}
                  className="rounded-lg px-3 py-2 text-xs text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
                >
                  Guardar Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
