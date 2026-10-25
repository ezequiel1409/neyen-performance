// =====================================================================
// NEYEN ATHLETIC - GALERÍA DE FOTOS DE PROGRESO (MLP)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { Camera, Lock, Plus, Sparkles, Upload } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';

export const AthleteGalleryMLP: React.FC = () => {
  const { atletaActual, agregarFotoProgreso } = useTraining();
  const [modalSubidaAbierto, setModalSubidaAbierto] = useState<boolean>(false);
  const [fotoDataUrl, setFotoDataUrl] = useState<string>('');
  const [vistaInput, setVistaInput] = useState<'FRENTE' | 'PERFIL' | 'ESPALDA'>('FRENTE');
  const [notaInput, setNotaInput] = useState<string>('');
  const [errorCarga, setErrorCarga] = useState<string>('');

  const fotos = atletaActual.galeriaFotosProgreso || [];

  // Manejo de carga de archivo local (File API -> Base64) o captura de cámara
  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorCarga('');
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      setErrorCarga('Por favor, selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFotoDataUrl(event.target.result);
      }
    };
    reader.onerror = () => {
      setErrorCarga('Error al leer el archivo. Intenta con otra imagen.');
    };
    reader.readAsDataURL(archivo);
  };

  const handleSubirFoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoDataUrl) {
      setErrorCarga('Debes capturar o seleccionar una imagen.');
      return;
    }
    agregarFotoProgreso(atletaActual.identificadorAtleta, fotoDataUrl, vistaInput, notaInput);
    setFotoDataUrl('');
    setNotaInput('');
    setErrorCarga('');
    setModalSubidaAbierto(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-3 py-0.5 text-xs font-bold text-[#163832] dark:text-[#E1ECE5]">
              MLP PREVIEW
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#163832] dark:text-white flex items-center gap-2">
              <Camera className="h-6 w-6 text-[#E85938]" aria-hidden="true" />
              Galería de Fotos de Progreso Corporal
            </h1>
          </div>
          <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] mt-1">
            Registro visual cronológico de postura y evolución muscular de{' '}
            <strong className="text-[#163832] dark:text-white">{atletaActual.nombreCompleto}</strong>.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setModalSubidaAbierto(true)}
          icon={<Plus className="h-4 w-4 text-purple-400" aria-hidden="true" />}
          className="border-purple-500/40 hover:border-purple-500/70"
        >
          Nueva Foto de Progreso
        </Button>
      </div>

      {/* Aviso de Privacidad y Cifrado Local */}
      <div
        role="region"
        aria-label="Aviso de Privacidad de Fotos"
        className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300"
      >
        <Lock className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
        <span>
          <strong>Privacidad local garantizada:</strong> Las fotos corporales se almacenan de forma
          segura en tu dispositivo local y no se comparten en redes públicas.
        </span>
      </div>

      {/* Comparador Antes y Después */}
      {fotos.length >= 2 && (
        <section
          aria-labelledby="titulo-comparador"
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl"
        >
          <h2
            id="titulo-comparador"
            className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-purple-400" aria-hidden="true" />
            Comparador Visual: Inicio vs Actualidad
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                Punto de Partida ({fotos[fotos.length - 1].fechaRegistro})
              </span>
              <div className="overflow-hidden rounded-xl border border-slate-800 aspect-[3/4] bg-black">
                <img
                  src={fotos[fotos.length - 1].urlFoto}
                  alt={`Foto inicial de progreso (${fotos[fotos.length - 1].tipoVista})`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-400">
                Peso: {fotos[fotos.length - 1].pesoRegistradoKg} kg
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-purple-300 block">
                Estado Actual ({fotos[0].fechaRegistro})
              </span>
              <div className="overflow-hidden rounded-xl border border-purple-500/50 aspect-[3/4] bg-black shadow-lg shadow-purple-500/10">
                <img
                  src={fotos[0].urlFoto}
                  alt={`Foto más reciente de progreso (${fotos[0].tipoVista})`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-purple-300 font-bold">
                Peso: {fotos[0].pesoRegistradoKg} kg
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Feed Cronológico de Fotos */}
      <section aria-label="Historial cronológico de fotos" className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Todas las Capturas ({fotos.length})
        </h2>

        {fotos.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center space-y-3">
            <Camera className="h-10 w-10 text-slate-600 mx-auto" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-300">Aún no hay fotos registradas</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Comienza documentando tu composición corporal en vista de frente, perfil o espalda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((f) => (
              <article
                key={f.identificadorFoto}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition hover:border-slate-700 shadow-md"
              >
                <div className="aspect-[4/5] bg-black relative">
                  <img
                    src={f.urlFoto}
                    alt={`Foto de progreso ${f.tipoVista} del ${f.fechaRegistro}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm border border-white/10">
                    Vista: {f.tipoVista}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{f.fechaRegistro}</span>
                    <span className="text-slate-400 font-mono">{f.pesoRegistradoKg} kg</span>
                  </div>
                  {f.observaciones && (
                    <p className="text-xs text-slate-400 pt-1">{f.observaciones}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal Accesible para Cargar Foto (File API Local) */}
      <Modal
        isOpen={modalSubidaAbierto}
        onClose={() => setModalSubidaAbierto(false)}
        title="Añadir Foto de Progreso"
        description="Selecciona una imagen de tu dispositivo o toma una foto directa con la cámara."
      >
        <form onSubmit={handleSubirFoto} className="space-y-4 pt-2">
          {/* Selector de Archivo Local / Cámara */}
          <div>
            <label
              htmlFor="selector-archivo-foto"
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
            >
              Foto desde el Dispositivo
            </label>

            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 p-4 text-center hover:border-purple-500/50 transition">
              <input
                id="selector-archivo-foto"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleSeleccionarArchivo}
                className="sr-only"
              />

              {fotoDataUrl ? (
                <div className="space-y-2 w-full flex flex-col items-center">
                  <img
                    src={fotoDataUrl}
                    alt="Vista previa de la foto seleccionada"
                    className="h-44 w-auto rounded-lg object-contain border border-slate-700"
                  />
                  <label
                    htmlFor="selector-archivo-foto"
                    className="cursor-pointer text-xs font-bold text-purple-400 hover:underline min-h-[36px] flex items-center"
                  >
                    Cambiar foto seleccionada
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="selector-archivo-foto"
                  className="cursor-pointer flex flex-col items-center gap-2 p-2 w-full"
                >
                  <Upload className="h-8 w-8 text-purple-400" aria-hidden="true" />
                  <span className="text-xs font-bold text-white">
                    Tocar para elegir archivo o abrir cámara
                  </span>
                  <span className="text-xs text-slate-400">JPG, PNG o WebP</span>
                </label>
              )}
            </div>

            {/* Alternativa: botón de muestra para pruebas rápidas */}
            <div className="mt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() =>
                  setFotoDataUrl(
                    'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400'
                  )
                }
                className="text-xs text-purple-400 hover:underline min-h-[44px] flex items-center"
              >
                Cargar foto de muestra de prueba
              </button>
            </div>

            {errorCarga && (
              <p role="alert" className="mt-1 text-xs text-rose-400 font-semibold">
                {errorCarga}
              </p>
            )}
          </div>

          {/* Ángulo de Vista */}
          <div>
            <label
              htmlFor="select-angulo-vista"
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Ángulo de Vista
            </label>
            <select
              id="select-angulo-vista"
              value={vistaInput}
              onChange={(e) => setVistaInput(e.target.value as any)}
              className="w-full min-h-[44px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="FRENTE">Frente (Plano Frontal)</option>
              <option value="PERFIL">Perfil (Plano Sagital)</option>
              <option value="ESPALDA">Espalda (Plano Posterior)</option>
            </select>
          </div>

          {/* Observaciones */}
          <Field label="Observaciones o Fase de Entrenamiento">
            {(props) => (
              <input
                {...props}
                type="text"
                placeholder="ej. Semana 10 de hipertrofia, peso 64.5 kg..."
                value={notaInput}
                onChange={(e) => setNotaInput(e.target.value)}
              />
            )}
          </Field>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setModalSubidaAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={!fotoDataUrl}>
              Guardar Foto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
