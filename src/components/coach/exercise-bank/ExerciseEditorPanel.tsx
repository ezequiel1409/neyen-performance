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
    <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-5 space-y-4 shadow-sm">
      <h2 className="text-lg font-bold text-[#163832] dark:text-white">
        Editar ejercicio
      </h2>

      <form onSubmit={onGuardar} className="space-y-4">
        {/* Campo Nombre */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0]">
            Nombre
          </label>
          <input
            type="text"
            required
            value={nombreForm}
            onChange={(e) => setNombreForm(e.target.value)}
            placeholder="[Nombre del ejercicio]"
            className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
          />
        </div>

        {/* Categoría y Equipamiento en 2 columnas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0]">
              Categoría
            </label>
            <select
              value={categoriaForm}
              onChange={(e) => setCategoriaForm(e.target.value)}
              className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3 py-2 text-xs text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] cursor-pointer"
            >
              {categorias.map((c) => (
                <option key={c.identificadorCategoria} value={c.identificadorCategoria}>
                  {c.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0]">
              Equipamiento
            </label>
            <select
              value={equipamientoForm}
              onChange={(e) => setEquipamientoForm(e.target.value)}
              className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3 py-2 text-xs text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] cursor-pointer"
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
        <div className="rounded-2xl bg-[#E1ECE5] dark:bg-[#1C4740] p-4 space-y-3">
          <h3 className="font-bold text-sm text-[#163832] dark:text-[#E1ECE5]">
            1RM estimado sin test directo
          </h3>
          <p className="text-xs text-[#163832]/80 dark:text-[#9EB5B0] leading-relaxed">
            Si este ejercicio no tiene test propio, toma el de otro y le aplica un ratio.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
                Ejercicio base
              </label>
              <select
                value={ejercicioBaseForm}
                onChange={(e) => setEjercicioBaseForm(e.target.value)}
                className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-2.5 py-2 text-xs text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] cursor-pointer"
              >
                {todosLosEjercicios.map((ej) => (
                  <option key={ej.identificadorEjercicio} value={ej.identificadorEjercicio}>
                    {ej.nombreEjercicio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
                Ratio
              </label>
              <input
                type="number"
                step="0.01"
                value={ratioForm}
                onChange={(e) => setRatioForm(parseFloat(e.target.value) || 1.0)}
                className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3 py-2 text-xs font-bold text-[#163832] dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
              />
            </div>
          </div>

          <p className="text-xs font-bold text-[#163832] dark:text-white pt-1">
            1RM estimado: <strong>{unRMEstimado} kg</strong> (1RM del base × ratio)
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-sm px-6 py-3 shadow-md transition"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-2xl border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white font-bold text-sm px-6 py-3 bg-transparent hover:bg-[#E1ECE5]/40 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
