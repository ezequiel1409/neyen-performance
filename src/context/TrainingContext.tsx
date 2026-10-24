// =====================================================================
// NEYEN ATHLETIC - CONTEXTO GLOBAL DE ENTRENAMIENTO (ESTADO REACTIVO)
// =====================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ATLETA_FEMENINA_DEMO,
  ATLETA_MASCULINO_DEMO,
  BANCO_EJERCICIOS_INICIAL,
  CATEGORIAS_INICIALES,
  EQUIPAMIENTOS_INICIALES,
  HISTORIAL_SESIONES_DEMO,
  MACROCICLO_NEYEN_DEMO,
} from '../data/seedData';
import {
  Atleta,
  CategoriaEjercicio,
  Ejercicio,
  EscalaEsfuerzoPercibidoSesion,
  FeedbackEntrenamiento,
  PlanMacrociclo,
  SesionCompletadaAtleta,
  TestCapacidadFisica,
  TestFuerzaMaxima,
  TipoEquipamiento,
} from '../types';
import {
  calcularCargaInternaFoster,
  calcularUnRepeticionMaximaBrzycki,
  calcularUnRepeticionMaximaEpley,
} from '../utils/trainingMath';

interface TrainingContextType {
  // Rol activo
  rolActivo: 'COACH' | 'ALUMNO';
  setRolActivo: (rol: 'COACH' | 'ALUMNO') => void;

  // Atleta seleccionado
  atletaSeleccionadoId: string;
  setAtletaSeleccionadoId: (id: string) => void;
  atletaActual: Atleta;
  atletas: Atleta[];

  // Banco de ejercicios y tablas maestras
  ejercicios: Ejercicio[];
  categorias: CategoriaEjercicio[];
  equipamientos: TipoEquipamiento[];
  agregarEjercicio: (ejercicio: Ejercicio) => void;
  actualizarEjercicio: (ejercicio: Ejercicio) => void;
  eliminarEjercicio: (id: string) => void;
  agregarCategoria: (categoria: CategoriaEjercicio) => void;
  agregarEquipamiento: (equipamiento: TipoEquipamiento) => void;

  // Tests del atleta
  testsFuerza: TestFuerzaMaxima[];
  agregarOActualizarTestFuerza: (test: Omit<TestFuerzaMaxima, 'identificadorTest' | 'unaRepeticionMaximaEstimadaEpley' | 'unaRepeticionMaximaEstimadaBrzycki' | 'unaRepeticionMaximaEfectiva'>) => void;
  testsFisicos: TestCapacidadFisica[];

  // Planificación
  macrociclo: PlanMacrociclo;
  actualizarMacrociclo: (macro: PlanMacrociclo) => void;

  // Historial de sesiones y feedback
  historialSesiones: SesionCompletadaAtleta[];
  finalizarSesionEntrenamiento: (params: {
    identificadorSesionOriginal: string;
    duracionRealMinutos: number;
    feedback: FeedbackEntrenamiento;
  }) => void;

  // Fisiología Femenina
  reportarRetrasoMenstrual: (atletaId: string) => void;
  resetearRetrasoMenstrual: (atletaId: string) => void;

  // MLP
  agregarFotoProgreso: (atletaId: string, urlFoto: string, tipoVista: 'FRENTE' | 'PERFIL' | 'ESPALDA', observaciones?: string) => void;
  sincronizarSmartwatchMock: (atletaId: string) => void;
}

const TrainingContext = createContext<TrainingContextType | null>(null);

const STORAGE_KEY = 'neyen_performance_state_v1';

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rolActivo, setRolActivo] = useState<'COACH' | 'ALUMNO'>('COACH');
  const [atletaSeleccionadoId, setAtletaSeleccionadoId] = useState<string>('AL0001');

  const [atletas, setAtletas] = useState<Atleta[]>([ATLETA_FEMENINA_DEMO, ATLETA_MASCULINO_DEMO]);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>(BANCO_EJERCICIOS_INICIAL);
  const [categorias, setCategorias] = useState<CategoriaEjercicio[]>(CATEGORIAS_INICIALES);
  const [equipamientos, setEquipamientos] = useState<TipoEquipamiento[]>(EQUIPAMIENTOS_INICIALES);
  const [macrociclo, setMacrociclo] = useState<PlanMacrociclo>(MACROCICLO_NEYEN_DEMO);
  const [historialSesiones, setHistorialSesiones] = useState<SesionCompletadaAtleta[]>(HISTORIAL_SESIONES_DEMO);

  // Tests iniciales de fuerza de Sofía Rodríguez (AL0001) basados en la planilla
  const [testsFuerza, setTestsFuerza] = useState<TestFuerzaMaxima[]>([
    {
      identificadorTest: 'TEST-F-01',
      identificadorAtleta: 'AL0001',
      identificadorEjercicioBase: 'EX0001', // Sentadilla trasera
      nombreEjercicioEvaluado: 'Sentadilla Trasera con barra',
      pesoLevantadoKilogramos: 90,
      repeticionesRealizadas: 3,
      unaRepeticionMaximaEstimadaEpley: 99.0,
      unaRepeticionMaximaEstimadaBrzycki: 95.3,
      unaRepeticionMaximaEfectiva: 99.0,
      fechaEvaluacion: '2026-09-15',
      faseCicloMenstrualMomentoEvaluacion: 'FOLICULAR',
    },
    {
      identificadorTest: 'TEST-F-02',
      identificadorAtleta: 'AL0001',
      identificadorEjercicioBase: 'EX0006', // Press plano
      nombreEjercicioEvaluado: 'Press de Pecho Plano con barra',
      pesoLevantadoKilogramos: 125,
      repeticionesRealizadas: 4,
      unaRepeticionMaximaEstimadaEpley: 141.7,
      unaRepeticionMaximaEstimadaBrzycki: 136.4,
      unaRepeticionMaximaEfectiva: 141.7,
      fechaEvaluacion: '2026-09-16',
      faseCicloMenstrualMomentoEvaluacion: 'FOLICULAR',
    },
    {
      identificadorTest: 'TEST-F-03',
      identificadorAtleta: 'AL0001',
      identificadorEjercicioBase: 'EX0004', // Peso muerto
      nombreEjercicioEvaluado: 'Peso Muerto Convencional',
      pesoLevantadoKilogramos: 240,
      repeticionesRealizadas: 3,
      unaRepeticionMaximaEstimadaEpley: 264.0,
      unaRepeticionMaximaEstimadaBrzycki: 254.1,
      unaRepeticionMaximaEfectiva: 264.0,
      fechaEvaluacion: '2026-09-17',
      faseCicloMenstrualMomentoEvaluacion: 'OVULATORIA',
    },
    {
      identificadorTest: 'TEST-F-04',
      identificadorAtleta: 'AL0001',
      identificadorEjercicioBase: 'EX0005', // Hip Thrust
      nombreEjercicioEvaluado: 'Empuje de Cadera / Hip Thrust',
      pesoLevantadoKilogramos: 160,
      repeticionesRealizadas: 5,
      unaRepeticionMaximaEstimadaEpley: 186.7,
      unaRepeticionMaximaEstimadaBrzycki: 180.0,
      unaRepeticionMaximaEfectiva: 186.7,
      fechaEvaluacion: '2026-09-18',
    },
  ]);

  const [testsFisicos] = useState<TestCapacidadFisica[]>([
    {
      identificadorTest: 'TEST-FIS-01',
      identificadorAtleta: 'AL0001',
      fechaEvaluacion: '2026-09-20',
      saltoContramovimientoCentimetros: 38.5, // CMJ
      saltoDesdeSentadillaCentimetros: 34.0, // SJ
      velocidadSprintDiezMetrosSegundos: 1.75,
      velocidadSprintVeinteMetrosSegundos: 3.05,
      velocidadSprintTreintaMetrosSegundos: 4.25,
      resistenciaPlanchaIsometricaSegundos: 150,
      testResistenciaAerobicaCooperMetros: 2650,
    },
  ]);

  // Cargar estado inicial persistido si existe
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed.atletas) setAtletas(parsed.atletas);
        if (parsed.ejercicios) setEjercicios(parsed.ejercicios);
        if (parsed.categorias) setCategorias(parsed.categorias);
        if (parsed.equipamientos) setEquipamientos(parsed.equipamientos);
        if (parsed.testsFuerza) setTestsFuerza(parsed.testsFuerza);
        if (parsed.macrociclo) setMacrociclo(parsed.macrociclo);
        if (parsed.historialSesiones) setHistorialSesiones(parsed.historialSesiones);
      }
    } catch {
      console.warn('No se pudo cargar el estado guardado, usando seed data.');
    }
  }, []);

  // Guardar en localStorage ante cambios
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          atletas,
          ejercicios,
          categorias,
          equipamientos,
          testsFuerza,
          macrociclo,
          historialSesiones,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [atletas, ejercicios, categorias, equipamientos, testsFuerza, macrociclo, historialSesiones]);

  const atletaActual = atletas.find((a) => a.identificadorAtleta === atletaSeleccionadoId) || atletas[0];

  const agregarEjercicio = (nuevo: Ejercicio) => {
    setEjercicios((prev) => [nuevo, ...prev]);
  };

  const actualizarEjercicio = (actualizado: Ejercicio) => {
    setEjercicios((prev) =>
      prev.map((e) => (e.identificadorEjercicio === actualizado.identificadorEjercicio ? actualizado : e))
    );
  };

  const eliminarEjercicio = (id: string) => {
    setEjercicios((prev) => prev.filter((e) => e.identificadorEjercicio !== id));
  };

  const agregarCategoria = (nueva: CategoriaEjercicio) => {
    setCategorias((prev) => [...prev, nueva]);
  };

  const agregarEquipamiento = (nuevo: TipoEquipamiento) => {
    setEquipamientos((prev) => [...prev, nuevo]);
  };

  const agregarOActualizarTestFuerza = (
    testData: Omit<TestFuerzaMaxima, 'identificadorTest' | 'unaRepeticionMaximaEstimadaEpley' | 'unaRepeticionMaximaEstimadaBrzycki' | 'unaRepeticionMaximaEfectiva'>
  ) => {
    const epley = calcularUnRepeticionMaximaEpley(testData.pesoLevantadoKilogramos, testData.repeticionesRealizadas);
    const brzycki = calcularUnRepeticionMaximaBrzycki(testData.pesoLevantadoKilogramos, testData.repeticionesRealizadas);
    const efectiva = atletaActual.formulaCalculoRepeticionMaximaPreferida === 'BRZYCKI' ? brzycki : epley;

    const nuevoTest: TestFuerzaMaxima = {
      ...testData,
      identificadorTest: `TEST-F-${Date.now()}`,
      unaRepeticionMaximaEstimadaEpley: epley,
      unaRepeticionMaximaEstimadaBrzycki: brzycki,
      unaRepeticionMaximaEfectiva: efectiva,
    };

    setTestsFuerza((prev) => {
      // Reemplaza si ya existe para este ejercicio y atleta o agrega
      const filtrados = prev.filter(
        (t) => !(t.identificadorAtleta === testData.identificadorAtleta && t.identificadorEjercicioBase === testData.identificadorEjercicioBase)
      );
      return [nuevoTest, ...filtrados];
    });
  };

  const actualizarMacrociclo = (macro: PlanMacrociclo) => {
    setMacrociclo(macro);
  };

  const finalizarSesionEntrenamiento = ({
    identificadorSesionOriginal,
    duracionRealMinutos,
    feedback,
  }: {
    identificadorSesionOriginal: string;
    duracionRealMinutos: number;
    feedback: FeedbackEntrenamiento;
  }) => {
    const cargaUA = calcularCargaInternaFoster(feedback.esfuerzoPercibidoSesion, duracionRealMinutos);

    const nuevaSesion: SesionCompletadaAtleta = {
      identificadorRegistro: `REG-${Date.now()}`,
      identificadorAtleta: atletaSeleccionadoId,
      identificadorSesionOriginal,
      fechaYHoraFinalizacion: new Date().toISOString(),
      duracionRealMinutos,
      ejerciciosEjecutados: [],
      feedbackEntrenamiento: feedback,
      cargaInternaUnidadesArbitrarias: cargaUA,
    };

    setHistorialSesiones((prev) => [nuevaSesion, ...prev]);
  };

  const reportarRetrasoMenstrual = (atletaId: string) => {
    setAtletas((prev) =>
      prev.map((atleta) => {
        if (atleta.identificadorAtleta === atletaId && atleta.datosCicloMenstrual) {
          const diasRetrasoActual = (atleta.datosCicloMenstrual.diasDeRetraso || 0) + 1;
          const fechaHoy = new Date().toISOString().split('T')[0];
          return {
            ...atleta,
            datosCicloMenstrual: {
              ...atleta.datosCicloMenstrual,
              enRetrasoMenstrual: true,
              diasDeRetraso: diasRetrasoActual,
              fechaReporteRetraso: fechaHoy,
              historialRetrasosReportados: [
                ...(atleta.datosCicloMenstrual.historialRetrasosReportados || []),
                { fechaReporte: fechaHoy, diasDeRetraso: diasRetrasoActual },
              ],
            },
          };
        }
        return atleta;
      })
    );
  };

  const resetearRetrasoMenstrual = (atletaId: string) => {
    setAtletas((prev) =>
      prev.map((atleta) => {
        if (atleta.identificadorAtleta === atletaId && atleta.datosCicloMenstrual) {
          return {
            ...atleta,
            datosCicloMenstrual: {
              ...atleta.datosCicloMenstrual,
              enRetrasoMenstrual: false,
              diasDeRetraso: 0,
              fechaUltimaMenstruacion: new Date().toISOString().split('T')[0],
            },
          };
        }
        return atleta;
      })
    );
  };

  const agregarFotoProgreso = (
    atletaId: string,
    urlFoto: string,
    tipoVista: 'FRENTE' | 'PERFIL' | 'ESPALDA',
    observaciones?: string
  ) => {
    setAtletas((prev) =>
      prev.map((atleta) => {
        if (atleta.identificadorAtleta === atletaId) {
          const nuevaFoto = {
            identificadorFoto: `FOTO-${Date.now()}`,
            fechaRegistro: new Date().toISOString().split('T')[0],
            urlFoto,
            tipoVista,
            pesoRegistradoKg: atleta.pesoCorporalKilogramos,
            observaciones,
          };
          return {
            ...atleta,
            galeriaFotosProgreso: [nuevaFoto, ...(atleta.galeriaFotosProgreso || [])],
          };
        }
        return atleta;
      })
    );
  };

  const sincronizarSmartwatchMock = (atletaId: string) => {
    setAtletas((prev) =>
      prev.map((atleta) => {
        if (atleta.identificadorAtleta === atletaId) {
          const nuevoRegistro = {
            identificadorRegistro: `SUE-${Date.now()}`,
            fechaNoche: new Date().toISOString().split('T')[0],
            horasSuenioTotal: 7.9,
            porcentajeSuenioRem: 22,
            porcentajeSuenioProfundo: 20,
            frecuenciaCardiacaReposoLpm: 48,
            variabilidadFrecuenciaCardiacaHrvMs: 82,
            calidadSubjetivaDescanso: 5 as const,
            fuenteWearable: 'WHOOP' as const,
          };
          return {
            ...atleta,
            registrosDescanso: [nuevoRegistro, ...(atleta.registrosDescanso || [])],
          };
        }
        return atleta;
      })
    );
  };

  return (
    <TrainingContext.Provider
      value={{
        rolActivo,
        setRolActivo,
        atletaSeleccionadoId,
        setAtletaSeleccionadoId,
        atletaActual,
        atletas,
        ejercicios,
        categorias,
        equipamientos,
        agregarEjercicio,
        actualizarEjercicio,
        eliminarEjercicio,
        agregarCategoria,
        agregarEquipamiento,
        testsFuerza,
        agregarOActualizarTestFuerza,
        testsFisicos,
        macrociclo,
        actualizarMacrociclo,
        historialSesiones,
        finalizarSesionEntrenamiento,
        reportarRetrasoMenstrual,
        resetearRetrasoMenstrual,
        agregarFotoProgreso,
        sincronizarSmartwatchMock,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining debe usarse dentro de un TrainingProvider');
  }
  return context;
};
