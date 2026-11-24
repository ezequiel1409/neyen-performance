// =====================================================================
// NEYIMA ATHLETIC - GALERÍA DE FOTOS DE PROGRESO (MLP)
// CORRESPONDE A progreso-claro.html / progreso-oscuro.html
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { AlertBanner } from '../ui/AlertBanner';
import { IconInterface } from '../ui/icons/IconInterface';

export const AthleteGalleryMLP: React.FC = () => {
  const { atletaActual, agregarFotoProgreso } = useTraining();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fotoDataUrl, setFotoDataUrl] = useState('');
  const [vistaInput, setVistaInput] = useState<'FRENTE' | 'PERFIL' | 'ESPALDA'>('FRENTE');
  const [notaInput, setNotaInput] = useState('');
  const [errorCarga, setErrorCarga] = useState('');

  const fotos = atletaActual.galeriaFotosProgreso || [];

  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorCarga('');
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      setErrorCarga('Selecciona un archivo de imagen válido (JPG, PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFotoDataUrl(event.target.result);
      }
    };
    reader.readAsDataURL(archivo);
  };

  const handleSubirFoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoDataUrl) {
      setErrorCarga('Debes seleccionar una imagen.');
      return;
    }
    agregarFotoProgreso(atletaActual.identificadorAtleta, fotoDataUrl, vistaInput, notaInput);
    setFotoDataUrl('');
    setNotaInput('');
    setModalAbierto(false);
  };

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">Composición corporal</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Fotos de Progreso</h1>
        </div>

        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2 rounded-xl bg-[var(--navbg)] text-[var(--navon)] hover:opacity-95 font-bold text-xs sm:text-sm transition self-start cursor-pointer flex items-center gap-1.5"
        >
          <IconInterface name="plus" size={16} strokeWidth={2.5} />
          <span>Nueva Foto</span>
        </button>
      </div>

      {/* Aviso de Privacidad */}
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3 text-xs text-[var(--mut)]">
        <IconInterface name="info" size={16} className="text-[var(--link)] shrink-0" />
        <span>
          <strong>Privacidad garantizada:</strong> Las fotos de composición corporal se guardan de forma privada en tu perfil y sólo las comparte con tu coach si está habilitado.
        </span>
      </div>

      {/* Comparador Inicio vs Actualidad */}
      {fotos.length >= 2 && (
        <section className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 space-y-3 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] flex items-center gap-2">
            <IconInterface name="star" size={16} />
            <span>Comparador Visual: Inicio vs Actualidad</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[var(--mut)] block">
                Inicio ({fotos[fotos.length - 1].fechaRegistro})
              </span>
              <div className="overflow-hidden rounded-xl border border-[var(--bord)] aspect-[3/4] bg-[var(--bg)]">
                <img
                  src={fotos[fotos.length - 1].urlFoto}
                  alt={`Foto inicial (${fotos[fotos.length - 1].tipoVista})`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-[var(--mut)] font-bold">
                {fotos[fotos.length - 1].pesoRegistradoKg} kg
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[var(--txt)] block">
                Actualidad ({fotos[0].fechaRegistro})
              </span>
              <div className="overflow-hidden rounded-xl border-2 border-[var(--link)] aspect-[3/4] bg-[var(--bg)] shadow-2xs">
                <img
                  src={fotos[0].urlFoto}
                  alt={`Foto actual (${fotos[0].tipoVista})`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs font-bold text-[var(--txt)]">
                {fotos[0].pesoRegistradoKg} kg
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Todas las fotos */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
          Capturas registradas ({fotos.length})
        </h2>

        {fotos.length === 0 ? (
          <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-8 text-center space-y-2">
            <p className="text-sm font-bold text-[var(--txt)]">Aún no hay fotos registradas</p>
            <p className="text-xs text-[var(--mut)] max-w-sm mx-auto">
              Comenzá documentando tu postura y evolución en vista de frente, perfil o espalda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {fotos.map((f) => (
              <article
                key={f.identificadorFoto}
                className="overflow-hidden rounded-2xl border border-[var(--bord)] bg-[var(--surf)] shadow-2xs"
              >
                <div className="aspect-[4/5] bg-[var(--bg)] relative">
                  <img
                    src={f.urlFoto}
                    alt={`Foto ${f.tipoVista} ${f.fechaRegistro}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 right-2 rounded-full bg-[var(--bg)]/90 px-2.5 py-0.5 text-xs font-bold text-[var(--txt)] border border-[var(--bord)]">
                    {f.tipoVista}
                  </span>
                </div>
                <div className="p-3 text-xs flex justify-between items-center">
                  <span className="font-bold">{f.fechaRegistro}</span>
                  <span className="text-[var(--mut)] font-mono">{f.pesoRegistradoKg} kg</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal Subida */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--bord)] pb-3">
              <h3 className="font-extrabold text-base">Registrar Nueva Foto</h3>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="text-[var(--mut)] hover:text-[var(--txt)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubirFoto} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[var(--mut)] mb-1">
                  Tipo de Vista
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FRENTE', 'PERFIL', 'ESPALDA'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVistaInput(v)}
                      className={`py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        vistaInput === v
                          ? 'border-[var(--navbg)] bg-[var(--bg)] text-[var(--txt)]'
                          : 'border-[var(--bord)] text-[var(--mut)]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--mut)] mb-1">
                  Seleccionar Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSeleccionarArchivo}
                  className="w-full text-xs text-[var(--mut)] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-[var(--bord)] file:bg-[var(--bg)] file:text-xs file:font-bold file:cursor-pointer"
                />
              </div>

              {fotoDataUrl && (
                <div className="w-28 h-36 mx-auto rounded-xl overflow-hidden border border-[var(--bord)]">
                  <img src={fotoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {errorCarga && (
                <AlertBanner
                  status="bad"
                  message={errorCarga}
                  onClose={() => setErrorCarga('')}
                />
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--bord)] text-[var(--mut)] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--navbg)] text-[var(--navon)] font-extrabold cursor-pointer"
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
