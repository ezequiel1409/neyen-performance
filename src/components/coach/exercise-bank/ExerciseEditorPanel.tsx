// =====================================================================
// NEYEN ATHLETIC - PANEL LATERAL DE EDICIÓN DE EJERCICIO
// RESPONSABILIDAD ÚNICA: Formulario de edición y cálculo de 1RM por ratio
// =====================================================================

import React from 'react';
import { CategoriaEjercicio, Ejercicio, TipoEquipamiento } from '../../../types';

interface ExerciseEditorPanelProps {
  ejercicioActivo?: Ejercicio;
  nombreForm: string;
  setNombreForm: (nombre: string) => void;
  categoriaForm: string;
  setCategoriaForm: (cat: string) => void;
  equipamientoForm: string;
  setEquipamientoForm: (eq: string) => void;
  ejercicioBaseForm: string;
  setEjercicioBaseForm: (baseId: string) => void;
  ratioForm: number;
  setRatioForm: (ratio: number) => void;
  unRMEstimado: number;
  categorias: CategoriaEjercicio[];
  equipamientos: TipoEquipamiento[];
  todosLosEjercicios: Ejercicio[];
  onGuardar: (e: React.FormEvent) => void;
  onCancelar: () => void;
}

export const ExerciseEditorPanel: React.FC<ExerciseEditorPanelProps> = ({
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
  unRMEstimado,
  categorias,
  equipamientos,
  todosLosEjercicios,
  onGuardar,
  onCancelar,
}) => {
  return (
    <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-5 space-y-4 shadow-2xs">
      <h2 className="text-base sm:text-lg font-bold">
        Editar ejercicio
      </h2>

      <form onSubmit={onGuardar} className="space-y-4">
        {/* Campo Nombre */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--mut)]">
            Nombre
          </label>
          <input
            type="text"
            required
            value={nombreForm}
            onChange={(e) => setNombreForm(e.target.value)}
            placeholder="[Nombre del ejercicio]"
            className="w-full rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--txt)] focus:border-[var(--link)] outline-hidden"
          />
        </div>

        {/* Categoría y Equipamiento en 2 columnas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--mut)]">
              Categoría
            </label>
            <select
              value={categoriaForm}
              onChange={(e) => setCategoriaForm(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--txt)] focus:border-[var(--link)] outline-hidden cursor-pointer"
            >
              {categorias.map((c) => (
                <option key={c.identificadorCategoria} value={c.identificadorCategoria}>
                  {c.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--mut)]">
              Equipamiento
            </label>
            <select
              value={equipamientoForm}
              onChange={(e) => setEquipamientoForm(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--txt)] focus:border-[var(--link)] outline-hidden cursor-pointer"
            >
              {equipamientos.map((eq) => (
                <option key={eq.identificadorEquipamiento} value={eq.identificadorEquipamiento}>
                  {eq.nombreEquipamiento}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Caja: 1RM estimado sin test directo */}
        <div className="rounded-2xl bg-[var(--bg)] border border-[var(--bord)] p-4 space-y-2.5">
          <h3 className="font-bold text-xs text-[var(--txt)] uppercase tracking-wider">
            1RM estimado sin test directo
          </h3>
          <p className="text-xs text-[var(--mut)] leading-relaxed">
            Si este ejercicio no tiene test propio, toma el de otro y le aplica un ratio.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[var(--mut)] mb-1">
                Ejercicio base
              </label>
              <select
                value={ejercicioBaseForm}
                onChange={(e) => setEjercicioBaseForm(e.target.value)}
                className="w-full rounded-xl border border-[var(--bord)] bg-[var(--surf)] px-2.5 py-2 text-xs text-[var(--txt)] focus:border-[var(--link)] outline-hidden cursor-pointer"
              >
                {todosLosEjercicios.map((ej) => (
                  <option key={ej.identificadorEjercicio} value={ej.identificadorEjercicio}>
                    {ej.nombreEjercicio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--mut)] mb-1">
                Ratio
              </label>
              <input
                type="number"
                step="0.01"
                value={ratioForm}
                onChange={(e) => setRatioForm(parseFloat(e.target.value) || 1.0)}
                className="w-full rounded-xl border border-[var(--bord)] bg-[var(--surf)] px-3 py-2 text-xs font-bold text-[var(--txt)] text-center focus:border-[var(--link)] outline-hidden"
              />
            </div>
          </div>

          <p className="text-xs font-bold text-[var(--txt)] pt-1">
            1RM estimado: <strong className="text-sm">{unRMEstimado} kg</strong> (1RM base × ratio)
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-[var(--navbg)] text-[var(--navon)] hover:opacity-95 font-extrabold text-xs sm:text-sm px-5 py-2.5 shadow-2xs transition cursor-pointer"
          >
            Guardar
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
