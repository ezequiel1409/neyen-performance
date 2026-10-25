// =====================================================================
// NEYEN ATHLETIC - BANCO DE EJERCICIOS Y TABLAS MAESTRAS (COACH)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { Ejercicio } from '../../types';
import {
  Dumbbell,
  ExternalLink,
  Layers,
  Play,
  Plus,
  Search,
  Settings,
  Star,
  X,
} from 'lucide-react';

export const ExerciseBankView: React.FC = () => {
  const {
    ejercicios,
    categorias,
    equipamientos,
    agregarEjercicio,
    actualizarEjercicio,
    eliminarEjercicio,
    agregarCategoria,
    agregarEquipamiento,
  } = useTraining();

  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');
  const [filtroEquipamiento, setFiltroEquipamiento] = useState<string>('TODOS');
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  
  // Modales
  const [modalEjercicioAbierto, setModalEjercicioAbierto] = useState<boolean>(false);
  const [ejercicioEnEdicion, setEjercicioEnEdicion] = useState<Ejercicio | null>(null);
  const [modalMaestrosAbierto, setModalMaestrosAbierto] = useState<boolean>(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  // Estados de formulario de nuevo ejercicio
  const [formularioEjercicio, setFormularioEjercicio] = useState<Partial<Ejercicio>>({
    nombreEjercicio: '',
    identificadorCategoria: categorias[0]?.identificadorCategoria || 'CAT-01',
    patronDeMovimiento: 'Dominante de rodilla',
    grupoMuscularPrincipal: 'Cuádriceps',
    identificadorEquipamiento: equipamientos[0]?.identificadorEquipamiento || 'EQ-01',
    nivelDificultadEstrellas: 3,
    etiquetasDeportivas: ['fuerza', 'compuesto'],
    enlaceVideoDemostrativoUrl: '',
    observacionesTecnicas: '',
    ratioConversionCargaPorcentual: 1.0,
  });

  // Estados de formulario de nueva categoría / equipamiento
  const [nuevaCatNombre, setNuevaCatNombre] = useState('');
  const [nuevaCatColor, setNuevaCatColor] = useState('#3b82f6');
  const [nuevaCatDesc, setNuevaCatDesc] = useState('');
  const [nuevoEqNombre, setNuevoEqNombre] = useState('');
  const [nuevoEqDesc, setNuevoEqDesc] = useState('');

  // Filtrado de ejercicios
  const ejerciciosFiltrados = ejercicios.filter((ej) => {
    const coincideCat = filtroCategoria === 'TODAS' || ej.identificadorCategoria === filtroCategoria;
    const coincideEq = filtroEquipamiento === 'TODOS' || ej.identificadorEquipamiento === filtroEquipamiento;
    const coincideTexto =
      ej.nombreEjercicio.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      ej.grupoMuscularPrincipal.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      ej.etiquetasDeportivas.some((tag) => tag.toLowerCase().includes(terminoBusqueda.toLowerCase()));
    return coincideCat && coincideEq && coincideTexto;
  });

  const abrirModalCrear = () => {
    setEjercicioEnEdicion(null);
    setFormularioEjercicio({
      nombreEjercicio: '',
      identificadorCategoria: categorias[0]?.identificadorCategoria || 'CAT-01',
      patronDeMovimiento: 'Dominante de rodilla',
      grupoMuscularPrincipal: 'Cuádriceps',
      identificadorEquipamiento: equipamientos[0]?.identificadorEquipamiento || 'EQ-01',
      nivelDificultadEstrellas: 3,
      etiquetasDeportivas: ['fuerza', 'compuesto'],
      enlaceVideoDemostrativoUrl: '',
      observacionesTecnicas: '',
      ratioConversionCargaPorcentual: 1.0,
    });
    setModalEjercicioAbierto(true);
  };

  const abrirModalEditar = (ejercicio: Ejercicio) => {
    setEjercicioEnEdicion(ejercicio);
    setFormularioEjercicio(ejercicio);
    setModalEjercicioAbierto(true);
  };

  const guardarEjercicio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioEjercicio.nombreEjercicio) return;

    if (ejercicioEnEdicion) {
      actualizarEjercicio(formularioEjercicio as Ejercicio);
    } else {
      const nuevoId = `EX${String(ejercicios.length + 1).padStart(4, '0')}`;
      agregarEjercicio({
        ...formularioEjercicio,
        identificadorEjercicio: nuevoId,
      } as Ejercicio);
    }
    setModalEjercicioAbierto(false);
  };

  const guardarNuevaCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCatNombre) return;
    agregarCategoria({
      identificadorCategoria: `CAT-${Date.now()}`,
      nombreCategoria: nuevaCatNombre.toUpperCase(),
      colorDistintivoHexadecimal: nuevaCatColor,
      descripcionCategoria: nuevaCatDesc,
      ordenVisualizacion: categorias.length + 1,
    });
    setNuevaCatNombre('');
    setNuevaCatDesc('');
  };

  const guardarNuevoEquipamiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEqNombre) return;
    agregarEquipamiento({
      identificadorEquipamiento: `EQ-${Date.now()}`,
      nombreEquipamiento: nuevoEqNombre,
      descripcionEquipamiento: nuevoEqDesc,
    });
    setNuevoEqNombre('');
    setNuevoEqDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#163832] dark:text-white flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-[#E85938]" />
            Banco de Ejercicios
          </h1>
          <p className="text-sm text-[#163832]/70 dark:text-[#9EB5B0]">
            Total control del catálogo: taxonomía, ratios de conversión de 1RM y tablas maestras personalizables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalMaestrosAbierto(true)}
            className="flex items-center gap-1.5 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#163630] px-4 py-2.5 text-xs font-bold text-[#163832] dark:text-[#FAF7EE] hover:bg-[#E1ECE5]/40 transition min-h-[44px]"
          >
            <Settings className="h-4 w-4" />
            Gestionar Categorías & Equipos
          </button>
          <button
            onClick={abrirModalCrear}
            className="flex items-center gap-1.5 rounded-xl bg-[#E85938] hover:bg-[#D74F30] px-5 py-2.5 text-xs font-extrabold text-[#112B26] shadow-md transition min-h-[44px]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Nuevo Ejercicio
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:grid-cols-12">
        <div className="relative sm:col-span-5">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, músculo o tag..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="TODAS">Todas las Categorías ({ejercicios.length})</option>
            {categorias.map((cat) => (
              <option key={cat.identificadorCategoria} value={cat.identificadorCategoria}>
                {cat.nombreCategoria}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={filtroEquipamiento}
            onChange={(e) => setFiltroEquipamiento(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="TODOS">Todo el Equipamiento</option>
            {equipamientos.map((eq) => (
              <option key={eq.identificadorEquipamiento} value={eq.identificadorEquipamiento}>
                {eq.nombreEquipamiento}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Tarjetas de Ejercicios */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ejerciciosFiltrados.map((ej) => {
          const cat = categorias.find((c) => c.identificadorCategoria === ej.identificadorCategoria);
          const eq = equipamientos.find((e) => e.identificadorEquipamiento === ej.identificadorEquipamiento);
          const ejercicioBase = ej.identificadorEjercicioBaseTestReferencia
            ? ejercicios.find((b) => b.identificadorEjercicio === ej.identificadorEjercicioBaseTestReferencia)
            : null;

          return (
            <div
              key={ej.identificadorEjercicio}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700 hover:shadow-lg"
            >
              <div className="space-y-3">
                {/* Cabecera de la tarjeta: ID y Categoría */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-500">{ej.identificadorEjercicio}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${cat?.colorDistintivoHexadecimal || '#3b82f6'}20`,
                      color: cat?.colorDistintivoHexadecimal || '#3b82f6',
                      border: `1px solid ${cat?.colorDistintivoHexadecimal || '#3b82f6'}40`,
                    }}
                  >
                    {cat?.nombreCategoria || 'GENERAL'}
                  </span>
                </div>

                {/* Nombre y patrón */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400">{ej.nombreEjercicio}</h3>
                  <p className="text-xs text-slate-400">{ej.patronDeMovimiento} • <span className="text-slate-300 font-medium">{ej.grupoMuscularPrincipal}</span></p>
                </div>

                {/* Dificultad y Equipamiento */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Dificultad:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= ej.nivelDificultadEstrellas
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                    {eq?.nombreEquipamiento || 'Barra'}
                  </span>
                </div>

                {/* Vínculo de Ratio de Conversión para 1RM */}
                {ejercicioBase && (
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 text-xs text-blue-300">
                    <span className="font-semibold">Calculado desde:</span> {ejercicioBase.nombreEjercicio} al{' '}
                    <span className="font-bold text-blue-200">
                      {Math.round((ej.ratioConversionCargaPorcentual || 0.8) * 100)}%
                    </span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {ej.etiquetasDeportivas.map((tag) => (
                    <span key={tag} className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botonera inferior */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
                {ej.enlaceVideoDemostrativoUrl ? (
                  <button
                    onClick={() => setVideoModalUrl(ej.enlaceVideoDemostrativoUrl || null)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                  >
                    <Play className="h-3.5 w-3.5 fill-rose-400" />
                    Ver Video
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-600">Sin video</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => abrirModalEditar(ej)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarEjercicio(ej.identificadorEjercicio)}
                    className="text-xs text-slate-500 hover:text-rose-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Crear / Editar Ejercicio */}
      {modalEjercicioAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {ejercicioEnEdicion ? 'Editar Ejercicio' : 'Nuevo Ejercicio al Banco'}
              </h3>
              <button onClick={() => setModalEjercicioAbierto(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={guardarEjercicio} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">Nombre del Ejercicio</label>
                <input
                  type="text"
                  required
                  value={formularioEjercicio.nombreEjercicio}
                  onChange={(e) => setFormularioEjercicio({ ...formularioEjercicio, nombreEjercicio: e.target.value })}
                  placeholder="ej. Sentadilla Búlgara con Mancuernas"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Categoría</label>
                  <select
                    value={formularioEjercicio.identificadorCategoria}
                    onChange={(e) => setFormularioEjercicio({ ...formularioEjercicio, identificadorCategoria: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    {categorias.map((cat) => (
                      <option key={cat.identificadorCategoria} value={cat.identificadorCategoria}>
                        {cat.nombreCategoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Equipamiento</label>
                  <select
                    value={formularioEjercicio.identificadorEquipamiento}
                    onChange={(e) => setFormularioEjercicio({ ...formularioEjercicio, identificadorEquipamiento: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    {equipamientos.map((eq) => (
                      <option key={eq.identificadorEquipamiento} value={eq.identificadorEquipamiento}>
                        {eq.nombreEquipamiento}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Patrón de Movimiento</label>
                  <input
                    type="text"
                    value={formularioEjercicio.patronDeMovimiento}
                    onChange={(e) => setFormularioEjercicio({ ...formularioEjercicio, patronDeMovimiento: e.target.value })}
                    placeholder="ej. Dominante de rodilla"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Grupo Muscular</label>
                  <input
                    type="text"
                    value={formularioEjercicio.grupoMuscularPrincipal}
                    onChange={(e) => setFormularioEjercicio({ ...formularioEjercicio, grupoMuscularPrincipal: e.target.value })}
                    placeholder="ej. Cuádriceps"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Vínculo para cálculo de 1RM */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <label className="block text-xs font-bold text-blue-400">
                  Ejercicio Base de Referencia para 1RM (Opcional)
                </label>
                <p className="text-[11px] text-slate-400">
                  Si este ejercicio no se testea directamente, se calcula a partir del 1RM de otro ejercicio aplicando un ratio.
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={formularioEjercicio.identificadorEjercicioBaseTestReferencia || ''}
                      onChange={(e) =>
                        setFormularioEjercicio({
                          ...formularioEjercicio,
                          identificadorEjercicioBaseTestReferencia: e.target.value || undefined,
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white"
                    >
                      <option value="">Ninguno (Test independiente)</option>
                      {ejercicios
                        .filter((e) => e.identificadorEjercicio !== ejercicioEnEdicion?.identificadorEjercicio)
                        .map((b) => (
                          <option key={b.identificadorEjercicio} value={b.identificadorEjercicio}>
                            {b.nombreEjercicio}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="1.5"
                      value={formularioEjercicio.ratioConversionCargaPorcentual || 0.8}
                      onChange={(e) =>
                        setFormularioEjercicio({
                          ...formularioEjercicio,
                          ratioConversionCargaPorcentual: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Ratio (ej. 0.82)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Enlace de Video (YouTube)</label>
                <input
                  type="text"
                  value={formularioEjercicio.enlaceVideoDemostrativoUrl}
                  onChange={(e) =>
                    setFormularioEjercicio({ ...formularioEjercicio, enlaceVideoDemostrativoUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalEjercicioAbierto(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Guardar Ejercicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Tablas Maestras (Categorías y Equipamiento) */}
      {modalMaestrosAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-400" />
                Tablas Maestras Personalizables del Coach
              </h3>
              <button onClick={() => setModalMaestrosAbierto(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Sección Categorías */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200">Categorías de Ejercicio</h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {categorias.map((c) => (
                    <div
                      key={c.identificadorCategoria}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.colorDistintivoHexadecimal }} />
                        <span className="font-semibold text-white">{c.nombreCategoria}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">#{c.ordenVisualizacion}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={guardarNuevaCategoria} className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span className="text-xs font-semibold text-blue-400">+ Nueva Categoría</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nombre (ej. AISLACIÓN)"
                      value={nuevaCatNombre}
                      onChange={(e) => setNuevaCatNombre(e.target.value)}
                      className="w-full rounded bg-slate-800 px-2 py-1.5 text-xs text-white"
                    />
                    <input
                      type="color"
                      value={nuevaCatColor}
                      onChange={(e) => setNuevaCatColor(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-blue-600/80 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
                  >
                    Agregar Categoría
                  </button>
                </form>
              </div>

              {/* Sección Equipamientos */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200">Tipos de Equipamiento</h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {equipamientos.map((eq) => (
                    <div
                      key={eq.identificadorEquipamiento}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2 text-xs text-white"
                    >
                      <span className="font-medium">{eq.nombreEquipamiento}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={guardarNuevoEquipamiento} className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span className="text-xs font-semibold text-blue-400">+ Nuevo Equipamiento</span>
                  <input
                    type="text"
                    placeholder="Nombre (ej. Trineo de arrastre)"
                    value={nuevoEqNombre}
                    onChange={(e) => setNuevoEqNombre(e.target.value)}
                    className="w-full rounded bg-slate-800 px-2 py-1.5 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full rounded bg-blue-600/80 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
                  >
                    Agregar Equipamiento
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reproducción de Video de YouTube */}
      {videoModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="h-4 w-4 text-rose-500 fill-rose-500" />
                Demostración Técnica de YouTube
              </span>
              <button onClick={() => setVideoModalUrl(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              {/* Extraer video ID si es link de youtube */}
              {videoModalUrl.includes('youtube.com') || videoModalUrl.includes('youtu.be') ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${
                    videoModalUrl.includes('v=')
                      ? videoModalUrl.split('v=')[1]?.split('&')[0]
                      : videoModalUrl.split('youtu.be/')[1]
                  }`}
                  title="Demostración de ejercicio"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <a href={videoModalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 underline">
                    Abrir enlace externo de video <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
