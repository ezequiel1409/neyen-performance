// =====================================================================
// NEYEN ATHLETIC - BANCO DE EJERCICIOS Y TABLAS MAESTRAS (COACH)
// ORQUESTADOR MODULAR (< 180 LÍNEAS) - SRP & CLEAN ARCHITECTURE
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { Ejercicio } from '../../types';
import { Plus } from 'lucide-react';
import { ExerciseFiltersBar } from './exercise-bank/ExerciseFiltersBar';
import { ExerciseTable } from './exercise-bank/ExerciseTable';
import { ExerciseEditorPanel } from './exercise-bank/ExerciseEditorPanel';
import { CategoryManagerTab } from './exercise-bank/CategoryManagerTab';
import { EquipmentManagerTab } from './exercise-bank/EquipmentManagerTab';

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
          className="flex items-center gap-1.5 rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-sm px-6 py-3.5 shadow-md transition self-start"
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
                ? 'bg-[#2F6B4F] text-white shadow-sm'
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
                ? 'bg-[#2F6B4F] text-white shadow-sm'
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
                ? 'bg-[#2F6B4F] text-white shadow-sm'
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

      {/* VISTA 1: TAB EJERCICIOS */}
      {tabCatalogo === 'EJERCICIOS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <ExerciseFiltersBar
              terminoBusqueda={terminoBusqueda}
              setTerminoBusqueda={setTerminoBusqueda}
              filtroCategoria={filtroCategoria}
              setFiltroCategoria={setFiltroCategoria}
              filtroEquipamiento={filtroEquipamiento}
              setFiltroEquipamiento={setFiltroEquipamiento}
              categorias={categorias}
              equipamientos={equipamientos}
            />
            <ExerciseTable
              ejercicios={ejerciciosFiltrados}
              categorias={categorias}
              equipamientos={equipamientos}
              ejercicioSeleccionadoId={ejercicioSeleccionadoId}
              onSeleccionarEjercicio={seleccionarParaEditar}
            />
          </div>

          <ExerciseEditorPanel
            ejercicioActivo={ejercicioActivo}
            nombreForm={nombreForm}
            setNombreForm={setNombreForm}
            categoriaForm={categoriaForm}
            setCategoriaForm={setCategoriaForm}
            equipamientoForm={equipamientoForm}
            setEquipamientoForm={setEquipamientoForm}
            ejercicioBaseForm={ejercicioBaseForm}
            setEjercicioBaseForm={setEjercicioBaseForm}
            ratioForm={ratioForm}
            setRatioForm={setRatioForm}
            unRMEstimado={unRMEstimado}
            categorias={categorias}
            equipamientos={equipamientos}
            todosLosEjercicios={ejercicios}
            onGuardar={handleGuardarEjercicio}
            onCancelar={() => seleccionarParaEditar(ejercicioActivo)}
          />
        </div>
      )}

      {/* VISTA 2: TAB CATEGORÍAS */}
      {tabCatalogo === 'CATEGORIAS' && (
        <CategoryManagerTab
          categorias={categorias}
          onAgregarCategoria={agregarCategoria}
        />
      )}

      {/* VISTA 3: TAB EQUIPAMIENTO */}
      {tabCatalogo === 'EQUIPAMIENTO' && (
        <EquipmentManagerTab
          equipamientos={equipamientos}
          onAgregarEquipamiento={agregarEquipamiento}
        />
      )}
    </div>
  );
};
