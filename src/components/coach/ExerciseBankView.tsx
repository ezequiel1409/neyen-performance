// =====================================================================
// NEYEN ATHLETIC - BANCO DE EJERCICIOS Y TABLAS MAESTRAS (COACH)
// DISEÑO FIEL A MOCKUPS (LIGHT & DARK THEME)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { Ejercicio } from '../../types';
import { Plus } from 'lucide-react';

export const ExerciseBankView: React.FC = () => {
  const {
    ejercicios,
    categorias,
    equipamientos,
    testsFuerza,
    atletaActual,
    agregarEjercicio,
    actualizarEjercicio,
    agregarCategoria,
    agregarEquipamiento,
  } = useTraining();

  // Pestañas superiores
  const [tabCatalogo, setTabCatalogo] = useState<'EJERCICIOS' | 'CATEGORIAS' | 'EQUIPAMIENTO'>('EJERCICIOS');

  // Filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');
  const [filtroEquipamiento, setFiltroEquipamiento] = useState<string>('TODOS');

  // Ejercicio seleccionado para edición en el panel lateral
  const [ejercicioSeleccionadoId, setEjercicioSeleccionadoId] = useState<string>(
    ejercicios[1]?.identificadorEjercicio || ejercicios[0]?.identificadorEjercicio || 'EX0002'
  );

  const ejercicioActivo =
    ejercicios.find((e) => e.identificadorEjercicio === ejercicioSeleccionadoId) || ejercicios[0];

  // Estado del formulario de edición en el panel lateral
  const [nombreForm, setNombreForm] = useState<string>(ejercicioActivo?.nombreEjercicio || '');
  const [categoriaForm, setCategoriaForm] = useState<string>(
    ejercicioActivo?.identificadorCategoria || categorias[0]?.identificadorCategoria || 'CAT-01'
  );
  const [equipamientoForm, setEquipamientoForm] = useState<string>(
    ejercicioActivo?.identificadorEquipamiento || equipamientos[0]?.identificadorEquipamiento || 'EQ-01'
  );
  const [ejercicioBaseForm, setEjercicioBaseForm] = useState<string>(
    ejercicioActivo?.identificadorEjercicioBaseTestReferencia || 'EX0006'
  );
  const [ratioForm, setRatioForm] = useState<number>(
    ejercicioActivo?.ratioConversionCargaPorcentual || 0.82
  );
  const [mensajeGuardado, setMensajeGuardado] = useState<string | null>(null);

  // Formularios para creación rápida de categorías y equipos
  const [nuevaCatNombre, setNuevaCatNombre] = useState('');
  const [nuevoEqNombre, setNuevoEqNombre] = useState('');

  // Sincronizar formulario al cambiar de ejercicio
  const seleccionarParaEditar = (ej: Ejercicio) => {
    setEjercicioSeleccionadoId(ej.identificadorEjercicio);
    setNombreForm(ej.nombreEjercicio);
    setCategoriaForm(ej.identificadorCategoria);
    setEquipamientoForm(ej.identificadorEquipamiento);
    setEjercicioBaseForm(ej.identificadorEjercicioBaseTestReferencia || 'EX0006');
    setRatioForm(ej.ratioConversionCargaPorcentual || 0.82);
  };

  // Filtrado de ejercicios
  const ejerciciosFiltrados = ejercicios.filter((ej) => {
    const coincideCat = filtroCategoria === 'TODAS' || ej.identificadorCategoria === filtroCategoria;
    const coincideEq = filtroEquipamiento === 'TODOS' || ej.identificadorEquipamiento === filtroEquipamiento;
    const coincideTexto =
      ej.nombreEjercicio.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      ej.grupoMuscularPrincipal.toLowerCase().includes(terminoBusqueda.toLowerCase());
    return coincideCat && coincideEq && coincideTexto;
  });

  // Guardar edición
  const handleGuardarEjercicio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ejercicioActivo) return;

    actualizarEjercicio({
      ...ejercicioActivo,
      nombreEjercicio: nombreForm,
      identificadorCategoria: categoriaForm,
      identificadorEquipamiento: equipamientoForm,
      identificadorEjercicioBaseTestReferencia: ejercicioBaseForm,
      ratioConversionCargaPorcentual: ratioForm,
    });

    setMensajeGuardado('Ejercicio actualizado con éxito');
    setTimeout(() => setMensajeGuardado(null), 3000);
  };

  // Crear nuevo ejercicio
  const handleCrearNuevo = () => {
    const nuevoId = `EX${String(ejercicios.length + 1).padStart(4, '0')}`;
    const nuevo: Ejercicio = {
      identificadorEjercicio: nuevoId,
      nombreEjercicio: '[Nuevo ejercicio]',
      identificadorCategoria: categorias[0]?.identificadorCategoria || 'CAT-01',
      patronDeMovimiento: 'Compuesto',
      grupoMuscularPrincipal: 'General',
      identificadorEquipamiento: equipamientos[0]?.identificadorEquipamiento || 'EQ-01',
      nivelDificultadEstrellas: 3,
      etiquetasDeportivas: ['fuerza'],
      ratioConversionCargaPorcentual: 1.0,
    };
    agregarEjercicio(nuevo);
    seleccionarParaEditar(nuevo);
  };

  // Cálculo de 1RM estimado en tiempo real para el panel
  const testBaseAtleta = testsFuerza.find(
    (t) =>
      t.identificadorAtleta === atletaActual.identificadorAtleta &&
      t.identificadorEjercicioBase === ejercicioBaseForm
  );
  const unRMBase = testBaseAtleta?.unaRepeticionMaximaEfectiva || 100;
  const unRMEstimado = Math.round(unRMBase * ratioForm);

  return (
    <div className="space-y-6">
      {/* Cabecera: Subtítulo, Título y Botón + Nuevo ejercicio */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-[#163832]/60 dark:text-[#9EB5B0] block">
            Gestión del catálogo
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#163832] dark:text-white mt-0.5">
            Banco de ejercicios
          </h1>
        </div>

        <button
          type="button"
          onClick={handleCrearNuevo}
          className="flex items-center gap-1.5 rounded-2xl bg-[#E85938] hover:bg-[#D74F30] active:scale-[0.99] text-[#112B26] font-extrabold text-sm px-6 py-3.5 shadow-md transition self-start"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Nuevo ejercicio</span>
        </button>
      </div>

      {/* Pestañas: Ejercicios, Categorías, Equipamiento */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setTabCatalogo('EJERCICIOS')}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition select-none ${
              tabCatalogo === 'EJERCICIOS'
                ? 'bg-[#1D4A41] dark:bg-[#E85938] text-white dark:text-[#112B26] shadow-sm'
                : 'border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40'
            }`}
          >
            Ejercicios
          </button>
          <button
            type="button"
            onClick={() => setTabCatalogo('CATEGORIAS')}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition select-none ${
              tabCatalogo === 'CATEGORIAS'
                ? 'bg-[#1D4A41] dark:bg-[#E85938] text-white dark:text-[#112B26] shadow-sm'
                : 'border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40'
            }`}
          >
            Categorías
          </button>
          <button
            type="button"
            onClick={() => setTabCatalogo('EQUIPAMIENTO')}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition select-none ${
              tabCatalogo === 'EQUIPAMIENTO'
                ? 'bg-[#1D4A41] dark:bg-[#E85938] text-white dark:text-[#112B26] shadow-sm'
                : 'border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40'
            }`}
          >
            Equipamiento
          </button>
        </div>

        <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-medium pt-1">
          Las categorías y los tipos de equipamiento los define cada coach, según su club o gimnasio.
        </p>
      </div>

      {mensajeGuardado && (
        <div className="rounded-2xl bg-emerald-600 text-white p-3 text-xs font-bold text-center animate-fade-in shadow-md">
          {mensajeGuardado}
        </div>
      )}

      {/* VISTA 1: TAB EJERCICIOS (LAYOUT DE 2 COLUMNAS FIEL A IMÁGENES 1 Y 2) */}
      {tabCatalogo === 'EJERCICIOS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Tabla y Filtros */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Filtros: Buscar, Categoría, Equipamiento */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
                  Buscar
                </label>
                <input
                  type="text"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  placeholder="Buscar ejercicio..."
                  className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white placeholder-[#163832]/40 dark:placeholder-[#9EB5B0]/40 focus:outline-none focus:ring-2 focus:ring-[#E85938]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
                  Categoría
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938] cursor-pointer"
                >
                  <option value="TODAS">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.identificadorCategoria} value={c.identificadorCategoria}>
                      {c.nombreCategoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
                  Equipamiento
                </label>
                <select
                  value={filtroEquipamiento}
                  onChange={(e) => setFiltroEquipamiento(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938] cursor-pointer"
                >
                  <option value="TODOS">Todos</option>
                  {equipamientos.map((eq) => (
                    <option key={eq.identificadorEquipamiento} value={eq.identificadorEquipamiento}>
                      {eq.nombreEquipamiento}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabla de Ejercicios */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E2D5] dark:border-[#25524A] text-[#163832]/60 dark:text-[#9EB5B0] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">EJERCICIO</th>
                    <th className="py-3 px-3">CATEGORÍA</th>
                    <th className="py-3 px-3">EQUIPAMIENTO</th>
                    <th className="py-3 px-3">TEST BASE</th>
                    <th className="py-3 px-3 text-right">RATIO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2D5]/70 dark:divide-[#25524A]/50">
                  {ejerciciosFiltrados.map((ej) => {
                    const cat = categorias.find((c) => c.identificadorCategoria === ej.identificadorCategoria);
                    const eq = equipamientos.find((e) => e.identificadorEquipamiento === ej.identificadorEquipamiento);
                    const ejBase = ej.identificadorEjercicioBaseTestReferencia
                      ? ejercicios.find((b) => b.identificadorEjercicio === ej.identificadorEjercicioBaseTestReferencia)
                      : null;

                    const isSelected = ej.identificadorEjercicio === ejercicioSeleccionadoId;

                    return (
                      <tr
                        key={ej.identificadorEjercicio}
                        onClick={() => seleccionarParaEditar(ej)}
                        className={`cursor-pointer transition ${
                          isSelected
                            ? 'border-2 border-[#163832] dark:border-[#E85938] bg-white dark:bg-[#163630] font-bold shadow-sm'
                            : 'hover:bg-[#E1ECE5]/40 text-[#163832] dark:text-[#FAF7EE]'
                        }`}
                      >
                        <td className="py-3.5 px-3 font-bold text-[#163832] dark:text-white">
                          {ej.nombreEjercicio}
                        </td>
                        <td className="py-3.5 px-3 text-[#163832]/80 dark:text-[#9EB5B0]">
                          {cat?.nombreCategoria || '[Categoría]'}
                        </td>
                        <td className="py-3.5 px-3 text-[#163832]/80 dark:text-[#9EB5B0]">
                          {eq?.nombreEquipamiento || '[Equipamiento]'}
                        </td>
                        <td className="py-3.5 px-3 text-[#163832]/80 dark:text-[#9EB5B0]">
                          {ejBase ? `[${ejBase.nombreEjercicio}]` : '—'}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-[#163832] dark:text-white">
                          {ej.ratioConversionCargaPorcentual
                            ? ej.ratioConversionCargaPorcentual.toFixed(2).replace('.', ',')
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta "Editar ejercicio" */}
          <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-5 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#163832] dark:text-white">
              Editar ejercicio
            </h2>

            <form onSubmit={handleGuardarEjercicio} className="space-y-4">
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
                  className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938]"
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
                    className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3 py-2 text-xs text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938] cursor-pointer"
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
                    className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3 py-2 text-xs text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938] cursor-pointer"
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
                      className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-2.5 py-2 text-xs text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85938] cursor-pointer"
                    >
                      {ejercicios.map((ej) => (
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
                      className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3 py-2 text-xs font-bold text-[#163832] dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-[#E85938]"
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
                  className="rounded-2xl bg-[#E85938] hover:bg-[#D74F30] active:scale-[0.99] text-[#112B26] font-extrabold text-sm px-6 py-3 shadow-md transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => seleccionarParaEditar(ejercicioActivo)}
                  className="rounded-2xl border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white font-bold text-sm px-6 py-3 bg-transparent hover:bg-[#E1ECE5]/40 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VISTA 2: CATEGORÍAS */}
      {tabCatalogo === 'CATEGORIAS' && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nueva categoría..."
              value={nuevaCatNombre}
              onChange={(e) => setNuevaCatNombre(e.target.value)}
              className="flex-1 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!nuevaCatNombre) return;
                agregarCategoria({
                  identificadorCategoria: `CAT-${Date.now()}`,
                  nombreCategoria: nuevaCatNombre.toUpperCase(),
                  colorDistintivoHexadecimal: '#163832',
                  ordenVisualizacion: categorias.length + 1,
                });
                setNuevaCatNombre('');
              }}
              className="rounded-2xl bg-[#E85938] text-[#112B26] font-extrabold text-sm px-6 py-2.5 shadow-md"
            >
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {categorias.map((c) => (
              <div
                key={c.identificadorCategoria}
                className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630]"
              >
                <span className="font-bold text-sm text-[#163832] dark:text-white">{c.nombreCategoria}</span>
                <span className="text-xs text-[#163832]/60 dark:text-[#9EB5B0] font-mono">{c.identificadorCategoria}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: EQUIPAMIENTO */}
      {tabCatalogo === 'EQUIPAMIENTO' && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nuevo equipamiento..."
              value={nuevoEqNombre}
              onChange={(e) => setNuevoEqNombre(e.target.value)}
              className="flex-1 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm text-[#163832] dark:text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!nuevoEqNombre) return;
                agregarEquipamiento({
                  identificadorEquipamiento: `EQ-${Date.now()}`,
                  nombreEquipamiento: nuevoEqNombre,
                });
                setNuevoEqNombre('');
              }}
              className="rounded-2xl bg-[#E85938] text-[#112B26] font-extrabold text-sm px-6 py-2.5 shadow-md"
            >
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {equipamientos.map((eq) => (
              <div
                key={eq.identificadorEquipamiento}
                className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630]"
              >
                <span className="font-bold text-sm text-[#163832] dark:text-white">{eq.nombreEquipamiento}</span>
                <span className="text-xs text-[#163832]/60 dark:text-[#9EB5B0] font-mono">{eq.identificadorEquipamiento}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
