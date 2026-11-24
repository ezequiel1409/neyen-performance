// =====================================================================
// NEYEN ATHLETIC - BANCO DE EJERCICIOS Y TABLAS MAESTRAS (COACH)
// ORQUESTADOR MODULAR - SRP, VALIDACIONES Y ESTÁNDAR DE ALERTAS NEYIMA
// =====================================================================

import React, { useRef, useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { Ejercicio } from '../../types';
import { AlertBanner } from '../ui/AlertBanner';
import type { StatusType } from '../ui/IndicatorStatus';
import { IconInterface } from '../ui/icons/IconInterface';
import { ExerciseFiltersBar } from './exercise-bank/ExerciseFiltersBar';
import { ExerciseTable } from './exercise-bank/ExerciseTable';
import { ExerciseEditorPanel, type ExerciseFormErrors } from './exercise-bank/ExerciseEditorPanel';
import { CategoryManagerTab } from './exercise-bank/CategoryManagerTab';
import { EquipmentManagerTab } from './exercise-bank/EquipmentManagerTab';

interface AlertaCatalogo {
  status: StatusType;
  title?: string;
  message: string;
}

const normalizarTexto = (valor: string) =>
  valor
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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

  const [tabCatalogo, setTabCatalogo] = useState<'EJERCICIOS' | 'CATEGORIAS' | 'EQUIPAMIENTO'>('EJERCICIOS');
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');
  const [filtroEquipamiento, setFiltroEquipamiento] = useState<string>('TODOS');

  const [modoCreacion, setModoCreacion] = useState<boolean>(false);
  const [ejercicioSeleccionadoId, setEjercicioSeleccionadoId] = useState<string>(
    ejercicios[1]?.identificadorEjercicio || ejercicios[0]?.identificadorEjercicio || 'EX0002'
  );

  const ejercicioActivo = modoCreacion
    ? undefined
    : ejercicios.find((e) => e.identificadorEjercicio === ejercicioSeleccionadoId) || ejercicios[0];

  // Estado del formulario de creación / edición
  const [nombreForm, setNombreForm] = useState<string>(ejercicioActivo?.nombreEjercicio || '');
  const [categoriaForm, setCategoriaForm] = useState<string>(
    ejercicioActivo?.identificadorCategoria || categorias[0]?.identificadorCategoria || 'CAT-01'
  );
  const [equipamientoForm, setEquipamientoForm] = useState<string>(
    ejercicioActivo?.identificadorEquipamiento || equipamientos[0]?.identificadorEquipamiento || 'EQ-01'
  );
  const [ejercicioBaseForm, setEjercicioBaseForm] = useState<string>(
    ejercicioActivo?.identificadorEjercicioBaseTestReferencia || ''
  );
  const [ratioForm, setRatioForm] = useState<string>(
    String(ejercicioActivo?.ratioConversionCargaPorcentual ?? 0.82)
  );
  const [erroresForm, setErroresForm] = useState<ExerciseFormErrors>({});
  const [alerta, setAlerta] = useState<AlertaCatalogo | null>(null);

  const nombreInputRef = useRef<HTMLInputElement>(null);

  const mostrarAlerta = (nuevaAlerta: AlertaCatalogo) => {
    setAlerta(nuevaAlerta);
  };

  // Sincronizar formulario al seleccionar un ejercicio existente
  const seleccionarParaEditar = (ej: Ejercicio) => {
    setModoCreacion(false);
    setEjercicioSeleccionadoId(ej.identificadorEjercicio);
    setNombreForm(ej.nombreEjercicio);
    setCategoriaForm(ej.identificadorCategoria);
    setEquipamientoForm(ej.identificadorEquipamiento);
    setEjercicioBaseForm(ej.identificadorEjercicioBaseTestReferencia || '');
    setRatioForm(String(ej.ratioConversionCargaPorcentual ?? 1.0));
    setErroresForm({});
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

  // Iniciar modo creación SIN insertar duplicados hasta validar y confirmar
  const handleIniciarNuevo = () => {
    if (tabCatalogo !== 'EJERCICIOS') {
      setTabCatalogo('EJERCICIOS');
    }

    if (modoCreacion) {
      mostrarAlerta({
        status: 'warn',
        title: 'Creación en curso',
        message: 'Ya tenés abierto el formulario de nuevo ejercicio. Completá los datos y presioná "Crear ejercicio".',
      });
      nombreInputRef.current?.focus();
      return;
    }

    setModoCreacion(true);
    setNombreForm('');
    setCategoriaForm(categorias[0]?.identificadorCategoria || '');
    setEquipamientoForm(equipamientos[0]?.identificadorEquipamiento || '');
    setEjercicioBaseForm('');
    setRatioForm('0.85');
    setErroresForm({});
    mostrarAlerta({
      status: 'proc',
      title: 'Nuevo ejercicio',
      message: 'Completá el nombre, categoría y equipamiento para incorporarlo al banco.',
    });
    setTimeout(() => nombreInputRef.current?.focus(), 0);
  };

  // Validar campos del ejercicio
  const validarFormulario = (): ExerciseFormErrors => {
    const errores: ExerciseFormErrors = {};
    const nombreLimpio = nombreForm.trim();

    if (!nombreLimpio) {
      errores.nombre = 'Ingresá el nombre del ejercicio.';
    } else if (nombreLimpio.length < 3 || nombreLimpio.length > 80) {
      errores.nombre = 'El nombre debe tener entre 3 y 80 caracteres.';
    } else if (/^\[.*\]$/.test(nombreLimpio)) {
      errores.nombre = 'Reemplazá el texto de ejemplo por un nombre real.';
    } else {
      const nombreNormalizado = normalizarTexto(nombreLimpio);
      const duplicado = ejercicios.some(
        (ej) =>
          normalizarTexto(ej.nombreEjercicio) === nombreNormalizado &&
          (modoCreacion || ej.identificadorEjercicio !== ejercicioActivo?.identificadorEjercicio)
      );
      if (duplicado) {
        errores.nombre = 'Ya existe un ejercicio con este nombre en el banco.';
      }
    }

    if (!categoriaForm || !categorias.some((c) => c.identificadorCategoria === categoriaForm)) {
      errores.categoria = 'Seleccioná una categoría válida.';
    }

    if (!equipamientoForm || !equipamientos.some((eq) => eq.identificadorEquipamiento === equipamientoForm)) {
      errores.equipamiento = 'Seleccioná un equipamiento válido.';
    }

    if (ejercicioBaseForm) {
      if (!modoCreacion && ejercicioBaseForm === ejercicioActivo?.identificadorEjercicio) {
        errores.ejercicioBase = 'Un ejercicio no puede ser su propio ejercicio base de referencia.';
      }

      const ratioNum = Number(ratioForm.replace(',', '.'));
      if (!ratioForm.trim() || Number.isNaN(ratioNum) || ratioNum < 0.2 || ratioNum > 1.5) {
        errores.ratio = 'El ratio debe estar entre 0,20 y 1,50.';
      }
    }

    return errores;
  };

  // Guardar creación o edición validada
  const handleGuardarEjercicio = (e: React.FormEvent) => {
    e.preventDefault();
    const errores = validarFormulario();
    setErroresForm(errores);

    if (Object.keys(errores).length > 0) {
      mostrarAlerta({
        status: 'bad',
        title: 'Revisá los campos obligatorios',
        message: 'Corregí los errores marcados antes de guardar el ejercicio.',
      });
      return;
    }

    const nombreLimpio = nombreForm.trim();
    const ratioNum = ejercicioBaseForm
      ? Number(Number(ratioForm.replace(',', '.')).toFixed(2))
      : undefined;

    if (modoCreacion) {
      const maxId = ejercicios.reduce((acc, ej) => {
        const match = ej.identificadorEjercicio.match(/^EX(\d+)$/);
        return match ? Math.max(acc, Number(match[1])) : acc;
      }, ejercicios.length);

      const nuevo: Ejercicio = {
        identificadorEjercicio: `EX${String(maxId + 1).padStart(4, '0')}`,
        nombreEjercicio: nombreLimpio,
        identificadorCategoria: categoriaForm,
        patronDeMovimiento: 'Compuesto',
        grupoMuscularPrincipal: 'General',
        identificadorEquipamiento: equipamientoForm,
        nivelDificultadEstrellas: 3,
        etiquetasDeportivas: ['fuerza'],
        identificadorEjercicioBaseTestReferencia: ejercicioBaseForm || undefined,
        ratioConversionCargaPorcentual: ratioNum,
      };

      agregarEjercicio(nuevo);
      seleccionarParaEditar(nuevo);
      mostrarAlerta({
        status: 'ok',
        title: 'Ejercicio creado',
        message: `"${nombreLimpio}" se agregó correctamente al banco de ejercicios.`,
      });
      return;
    }

    if (!ejercicioActivo) return;

    actualizarEjercicio({
      ...ejercicioActivo,
      nombreEjercicio: nombreLimpio,
      identificadorCategoria: categoriaForm,
      identificadorEquipamiento: equipamientoForm,
      identificadorEjercicioBaseTestReferencia: ejercicioBaseForm || undefined,
      ratioConversionCargaPorcentual: ratioNum,
    });

    mostrarAlerta({
      status: 'ok',
      title: 'Cambios guardados',
      message: `"${nombreLimpio}" se actualizó correctamente.`,
    });
  };

  const handleCancelar = () => {
    setErroresForm({});
    if (modoCreacion) {
      const seleccionado =
        ejercicios.find((e) => e.identificadorEjercicio === ejercicioSeleccionadoId) || ejercicios[0];
      if (seleccionado) seleccionarParaEditar(seleccionado);
      else setModoCreacion(false);
      mostrarAlerta({
        status: 'neu',
        message: 'Se canceló la creación del ejercicio. No se guardaron cambios.',
      });
      return;
    }
    if (ejercicioActivo) {
      seleccionarParaEditar(ejercicioActivo);
      mostrarAlerta({
        status: 'neu',
        message: 'Se descartaron los cambios sin guardar.',
      });
    }
  };

  // Cálculo de 1RM estimado en tiempo real para el panel
  const ratioNumericoValido = Number(ratioForm.replace(',', '.'));
  const testBaseAtleta = ejercicioBaseForm
    ? testsFuerza.find(
        (t) =>
          t.identificadorAtleta === atletaActual.identificadorAtleta &&
          t.identificadorEjercicioBase === ejercicioBaseForm
      )
    : undefined;
  const unRMBase = testBaseAtleta?.unaRepeticionMaximaEfectiva || 100;
  const unRMEstimado =
    ejercicioBaseForm && !Number.isNaN(ratioNumericoValido) && ratioNumericoValido > 0
      ? Math.round(unRMBase * ratioNumericoValido)
      : null;

  return (
    <div className="space-y-5">
      {/* Cabecera: Subtítulo, Título y Botón + Nuevo ejercicio */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-bold text-[var(--mut)] block">
            Gestión del catálogo
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
            Banco de ejercicios
          </h1>
        </div>

        <button
          type="button"
          onClick={handleIniciarNuevo}
          aria-pressed={modoCreacion}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--navbg)] text-[var(--navon)] hover:opacity-95 font-extrabold text-xs sm:text-sm px-5 py-2.5 shadow-2xs transition self-start cursor-pointer"
        >
          <IconInterface name="plus" size={16} strokeWidth={2.5} />
          <span>{modoCreacion ? 'Creando ejercicio...' : 'Nuevo ejercicio'}</span>
        </button>
      </div>

      {/* Pestañas: Ejercicios, Categorías, Equipamiento */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTabCatalogo('EJERCICIOS')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition select-none cursor-pointer ${
              tabCatalogo === 'EJERCICIOS'
                ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
            }`}
          >
            Ejercicios ({ejercicios.length})
          </button>
          <button
            type="button"
            onClick={() => setTabCatalogo('CATEGORIAS')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition select-none cursor-pointer ${
              tabCatalogo === 'CATEGORIAS'
                ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
            }`}
          >
            Categorías ({categorias.length})
          </button>
          <button
            type="button"
            onClick={() => setTabCatalogo('EQUIPAMIENTO')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition select-none cursor-pointer ${
              tabCatalogo === 'EQUIPAMIENTO'
                ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
            }`}
          >
            Equipamiento ({equipamientos.length})
          </button>
        </div>

        <p className="text-xs text-[var(--mut)] pt-0.5">
          Las categorías y los tipos de equipamiento los define cada coach, según su club o gimnasio.
        </p>
      </div>

      {alerta && (
        <AlertBanner
          status={alerta.status}
          title={alerta.title}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
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
              ejercicioSeleccionadoId={modoCreacion ? '' : ejercicioSeleccionadoId}
              onSeleccionarEjercicio={seleccionarParaEditar}
            />
          </div>

          <ExerciseEditorPanel
            modoCreacion={modoCreacion}
            ejercicioActivo={ejercicioActivo}
            nombreInputRef={nombreInputRef}
            nombreForm={nombreForm}
            setNombreForm={(val) => {
              setNombreForm(val);
              if (erroresForm.nombre) setErroresForm((prev) => ({ ...prev, nombre: undefined }));
            }}
            categoriaForm={categoriaForm}
            setCategoriaForm={(val) => {
              setCategoriaForm(val);
              if (erroresForm.categoria) setErroresForm((prev) => ({ ...prev, categoria: undefined }));
            }}
            equipamientoForm={equipamientoForm}
            setEquipamientoForm={(val) => {
              setEquipamientoForm(val);
              if (erroresForm.equipamiento) setErroresForm((prev) => ({ ...prev, equipamiento: undefined }));
            }}
            ejercicioBaseForm={ejercicioBaseForm}
            setEjercicioBaseForm={(val) => {
              setEjercicioBaseForm(val);
              if (erroresForm.ejercicioBase || erroresForm.ratio) {
                setErroresForm((prev) => ({ ...prev, ejercicioBase: undefined, ratio: undefined }));
              }
            }}
            ratioForm={ratioForm}
            setRatioForm={(val) => {
              setRatioForm(val);
              if (erroresForm.ratio) setErroresForm((prev) => ({ ...prev, ratio: undefined }));
            }}
            errores={erroresForm}
            unRMEstimado={unRMEstimado}
            categorias={categorias}
            equipamientos={equipamientos}
            todosLosEjercicios={ejercicios}
            onGuardar={handleGuardarEjercicio}
            onCancelar={handleCancelar}
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
