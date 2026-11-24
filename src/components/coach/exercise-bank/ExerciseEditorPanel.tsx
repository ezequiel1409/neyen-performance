// =====================================================================
// NEYEN ATHLETIC - PANEL LATERAL DE CREACIÓN / EDICIÓN DE EJERCICIO
// RESPONSABILIDAD ÚNICA: Formulario validado y cálculo de 1RM por ratio
// =====================================================================

import React from 'react';
import { CategoriaEjercicio, Ejercicio, TipoEquipamiento } from '../../../types';
import { IndicatorStatus } from '../../ui/IndicatorStatus';
import { IconInterface } from '../../ui/icons/IconInterface';

export interface ExerciseFormErrors {
  nombre?: string;
  categoria?: string;
  equipamiento?: string;
  ejercicioBase?: string;
  ratio?: string;
}

interface ExerciseEditorPanelProps {
  modoCreacion: boolean;
  ejercicioActivo?: Ejercicio;
  nombreInputRef?: React.RefObject<HTMLInputElement | null>;
  nombreForm: string;
  setNombreForm: (nombre: string) => void;
  categoriaForm: string;
  setCategoriaForm: (cat: string) => void;
  equipamientoForm: string;
  setEquipamientoForm: (eq: string) => void;
  ejercicioBaseForm: string;
  setEjercicioBaseForm: (baseId: string) => void;
  ratioForm: string;
  setRatioForm: (ratio: string) => void;
  errores: ExerciseFormErrors;
  unRMEstimado: number | null;
  categorias: CategoriaEjercicio[];
  equipamientos: TipoEquipamiento[];
  todosLosEjercicios: Ejercicio[];
  onGuardar: (e: React.FormEvent) => void;
  onCancelar: () => void;
}

const renderErrorCampo = (mensaje?: string) => {
  if (!mensaje) return null;
  return (
    <span
      role="alert"
      className="flex items-center gap-1.5 text-xs font-bold text-[var(--estado-bad-texto)] pt-0.5"
    >
      <IconInterface name="alert" size={14} strokeWidth={2.2} aria-hidden="true" />
      <span>{mensaje}</span>
    </span>
  );
};

export const ExerciseEditorPanel: React.FC<ExerciseEditorPanelProps> = ({
  modoCreacion,
  ejercicioActivo,
  nombreInputRef,
  nombreForm,
  setNombreForm,
  categoriaForm,
  setCategoriaForm,
  equipamientoForm,
  setEquipamientoForm,
  ejercicioBaseForm,
  setEjercicioBaseForm,
  ratioForm,
  setRatioForm,
  errores,
  unRMEstimado,
  categorias,
  equipamientos,
  todosLosEjercicios,
  onGuardar,
  onCancelar,
}) => {
  const ejerciciosBaseDisponibles = todosLosEjercicios.filter(
    (ej) => modoCreacion || ej.identificadorEjercicio !== ejercicioActivo?.identificadorEjercicio
  );

  return (
    <div
      className={`lg:col-span-5 xl:col-span-4 rounded-2xl border bg-[var(--surf)] p-5 space-y-4 shadow-2xs transition-colors ${
        modoCreacion ? 'border-2 border-[var(--navbg)]' : 'border-[var(--bord)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-extrabold text-[var(--txt)]">
          {modoCreacion ? 'Nuevo ejercicio' : 'Editar ejercicio'}
        </h2>
        {modoCreacion && <IndicatorStatus status="proc" label="Nuevo" size="sm" />}
      </div>

      <form onSubmit={onGuardar} noValidate className="space-y-4">
        {/* Campo Nombre */}
        <div className="space-y-1">
          <label htmlFor="ej-nombre" className="block text-xs font-bold text-[var(--mut)]">
            Nombre *
          </label>
          <input
            ref={nombreInputRef}
            id="ej-nombre"
            type="text"
            value={nombreForm}
            onChange={(e) => setNombreForm(e.target.value)}
            aria-invalid={Boolean(errores.nombre)}
            placeholder="Ej: Sentadilla búlgara con mancuernas"
            className={`w-full rounded-xl border-2 bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--txt)] outline-hidden transition ${
              errores.nombre
                ? 'border-[var(--estado-bad-texto)]'
                : 'border-[var(--bord)] focus:border-[var(--link)]'
            }`}
          />
          {renderErrorCampo(errores.nombre)}
        </div>

        {/* Categoría y Equipamiento en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="ej-categoria" className="block text-xs font-bold text-[var(--mut)]">
              Categoría *
            </label>
            <select
              id="ej-categoria"
              value={categoriaForm}
              onChange={(e) => setCategoriaForm(e.target.value)}
              aria-invalid={Boolean(errores.categoria)}
              className={`w-full rounded-xl border-2 bg-[var(--bg)] px-3 py-2 text-xs text-[var(--txt)] outline-hidden cursor-pointer ${
                errores.categoria
                  ? 'border-[var(--estado-bad-texto)]'
                  : 'border-[var(--bord)] focus:border-[var(--link)]'
              }`}
            >
              {categorias.map((c) => (
                <option key={c.identificadorCategoria} value={c.identificadorCategoria}>
                  {c.nombreCategoria}
                </option>
              ))}
            </select>
            {renderErrorCampo(errores.categoria)}
          </div>

          <div className="space-y-1">
            <label htmlFor="ej-equipamiento" className="block text-xs font-bold text-[var(--mut)]">
              Equipamiento *
            </label>
            <select
              id="ej-equipamiento"
              value={equipamientoForm}
              onChange={(e) => setEquipamientoForm(e.target.value)}
              aria-invalid={Boolean(errores.equipamiento)}
              className={`w-full rounded-xl border-2 bg-[var(--bg)] px-3 py-2 text-xs text-[var(--txt)] outline-hidden cursor-pointer ${
                errores.equipamiento
                  ? 'border-[var(--estado-bad-texto)]'
                  : 'border-[var(--bord)] focus:border-[var(--link)]'
              }`}
            >
              {equipamientos.map((eq) => (
                <option key={eq.identificadorEquipamiento} value={eq.identificadorEquipamiento}>
                  {eq.nombreEquipamiento}
                </option>
              ))}
            </select>
            {renderErrorCampo(errores.equipamiento)}
          </div>
        </div>

        {/* Caja: 1RM estimado sin test directo */}
        <div className="rounded-2xl bg-[var(--bg)] border border-[var(--bord)] p-4 space-y-2.5">
          <h3 className="font-bold text-xs text-[var(--txt)] uppercase tracking-wider">
            1RM estimado sin test directo
          </h3>
          <p className="text-xs text-[var(--mut)] leading-relaxed">
            Si este ejercicio no tiene test propio, podés vincularlo a un ejercicio base y aplicar un ratio (0,20 a 1,50).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label htmlFor="ej-base" className="block text-xs font-bold text-[var(--mut)]">
                Ejercicio base
              </label>
              <select
                id="ej-base"
                value={ejercicioBaseForm}
                onChange={(e) => setEjercicioBaseForm(e.target.value)}
                aria-invalid={Boolean(errores.ejercicioBase)}
                className={`w-full rounded-xl border-2 bg-[var(--surf)] px-2.5 py-2 text-xs text-[var(--txt)] outline-hidden cursor-pointer ${
                  errores.ejercicioBase
                    ? 'border-[var(--estado-bad-texto)]'
                    : 'border-[var(--bord)] focus:border-[var(--link)]'
                }`}
              >
                <option value="">Ninguno (Test directo)</option>
                {ejerciciosBaseDisponibles.map((ej) => (
                  <option key={ej.identificadorEjercicio} value={ej.identificadorEjercicio}>
                    {ej.nombreEjercicio}
                  </option>
                ))}
              </select>
              {renderErrorCampo(errores.ejercicioBase)}
            </div>

            <div className="space-y-1">
              <label htmlFor="ej-ratio" className="block text-xs font-bold text-[var(--mut)]">
                Ratio
              </label>
              <input
                id="ej-ratio"
                type="number"
                step="0.01"
                min="0.2"
                max="1.5"
                disabled={!ejercicioBaseForm}
                value={ratioForm}
                onChange={(e) => setRatioForm(e.target.value)}
                aria-invalid={Boolean(errores.ratio)}
                className={`w-full rounded-xl border-2 bg-[var(--surf)] px-3 py-2 text-xs font-bold text-[var(--txt)] text-center outline-hidden disabled:opacity-50 ${
                  errores.ratio
                    ? 'border-[var(--estado-bad-texto)]'
                    : 'border-[var(--bord)] focus:border-[var(--link)]'
                }`}
              />
              {renderErrorCampo(errores.ratio)}
            </div>
          </div>

          <p className="text-xs font-bold text-[var(--txt)] pt-1">
            {unRMEstimado !== null ? (
              <>
                1RM estimado: <strong className="text-sm">{unRMEstimado} kg</strong> (1RM base × ratio)
              </>
            ) : (
              <span className="text-[var(--mut)] font-semibold">
                Usa test directo propio del ejercicio.
              </span>
            )}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-[var(--navbg)] text-[var(--navon)] hover:opacity-95 font-extrabold text-xs sm:text-sm px-5 py-2.5 shadow-2xs transition cursor-pointer"
          >
            {modoCreacion ? 'Crear ejercicio' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-xl border border-[var(--bord)] text-[var(--mut)] hover:text-[var(--txt)] font-bold text-xs sm:text-sm px-4 py-2.5 bg-transparent hover:bg-[var(--bg)] transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
