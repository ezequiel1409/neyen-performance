// =====================================================================
// NEYEN ATHLETIC PERFORMANCE OS - MODELO DE DATOS Y TIPOS TYPESCRIPT
// =====================================================================

export enum EscalaEsfuerzoPercibidoSesion {
  REPOSO_O_MUY_SUAVE = 1,
  LIVIANO = 2,
  MODERADO = 3,
  ALGO_PESADO = 4,
  PESADO = 5,
  MUY_PESADO = 6,
  MUY_DURO = 7,
  INTENSO = 8,
  EXTREMADAMENTE_INTENSO = 9,
  ESFUERZO_MAXIMO = 10,
}

export type GeneroAtleta = 'F' | 'M' | 'OTRO';

export type FaseCicloMenstrual = 'MENSTRUACION' | 'FOLICULAR' | 'OVULATORIA' | 'LUTEA';

export type EstadoLesionAtleta = 'ACTIVA' | 'EN_REHABILITACION' | 'RECUPERADA';

export type TipoEstructuraBloque = 'SERIE_SIMPLE' | 'BISERIE_SUPERSET' | 'TRISERIE' | 'CIRCUITO';

export type FormulaCalculoRepeticionMaxima = 'EPLEY' | 'BRZYCKI';

// --- TABLAS MAESTRAS PERSONALIZABLES POR EL COACH ---

export interface CategoriaEjercicio {
  identificadorCategoria: string;
  nombreCategoria: string;
  descripcionCategoria?: string;
  colorDistintivoHexadecimal: string;
  ordenVisualizacion: number;
}

export interface TipoEquipamiento {
  identificadorEquipamiento: string;
  nombreEquipamiento: string;
  descripcionEquipamiento?: string;
}

// --- ENTIDAD EJERCICIO (BANCO DE EJERCICIOS) ---

export interface Ejercicio {
  identificadorEjercicio: string; // ej. "EX0001"
  nombreEjercicio: string;
  identificadorCategoria: string; // FK a CategoriaEjercicio
  patronDeMovimiento: string; // ej. "Dominante de rodilla", "Empuje horizontal"
  grupoMuscularPrincipal: string; // ej. "Cuádriceps", "Isquiosurales", "Pectoral"
  identificadorEquipamiento: string; // FK a TipoEquipamiento
  nivelDificultadEstrellas: 1 | 2 | 3 | 4 | 5;
  etiquetasDeportivas: string[];
  identificadoresEjerciciosAlternativos?: string[];
  enlaceVideoDemostrativoUrl?: string; // YouTube embed o URL
  observacionesTecnicas?: string;
  
  // Vinculación para cálculo automático de 1RM
  identificadorEjercicioBaseTestReferencia?: string; // FK a otro Ejercicio
  ratioConversionCargaPorcentual?: number; // ej. 0.82 (82% de la marca del ejercicio base)
}

// --- HISTORIAL CLÍNICO Y LESIONES ---

export interface LesionAtleta {
  identificadorLesion: string;
  descripcionLesion: string;
  zonaCorporalAfectada: string;
  fechaDiagnostico: string; // YYYY-MM-DD
  estadoLesion: EstadoLesionAtleta;
  limitacionesDeMovimiento?: string;
  observacionesMedicas?: string;
}

// --- FISIOLOGÍA FEMENINA Y CICLO MENSTRUAL ---

export interface DatosCicloMenstrual {
  activo: boolean;
  fechaUltimaMenstruacion: string; // YYYY-MM-DD (FUM)
  duracionPromedioCicloDias: number; // default 28
  duracionPromedioMenstruacionDias: number; // default 5
  enRetrasoMenstrual: boolean;
  diasDeRetraso?: number;
  fechaReporteRetraso?: string;
  historialRetrasosReportados?: Array<{ fechaReporte: string; diasDeRetraso: number }>;
}

// --- MLP: FOTO DE PROGRESO CORPORAL ---

export interface FotoProgresoAtleta {
  identificadorFoto: string;
  fechaRegistro: string;
  urlFoto: string;
  tipoVista: 'FRENTE' | 'PERFIL' | 'ESPALDA';
  pesoRegistradoKg?: number;
  observaciones?: string;
}

// --- MLP: MONITOREO DE DESCANSO Y WEARABLE (SMARTWATCH) ---

export interface RegistroDescansoSuenio {
  identificadorRegistro: string;
  fechaNoche: string; // YYYY-MM-DD
  horasSuenioTotal: number;
  porcentajeSuenioRem: number;
  porcentajeSuenioProfundo: number;
  frecuenciaCardiacaReposoLpm: number;
  variabilidadFrecuenciaCardiacaHrvMs: number;
  calidadSubjetivaDescanso: 1 | 2 | 3 | 4 | 5;
  fuenteWearable: 'MANUAL' | 'APPLE_HEALTH' | 'GARMIN' | 'WHOOP' | 'GOOGLE_FIT';
}

// --- PERFIL DEL ATLETA ---

export interface Atleta {
  identificadorAtleta: string; // ej. "AL0001"
  nombreCompleto: string;
  fotoPerfilUrl?: string;
  generoAtleta: GeneroAtleta;
  fechaNacimiento: string; // YYYY-MM-DD
  edadCronologicaAnios: number;
  alturaCentimetros: number;
  pesoCorporalKilogramos: number;
  deportePracticado: string; // ej. "Básquet"
  posicionEnElCampoDeJuego: string; // ej. "Alero"
  nivelRendimientoDeportivo: 'Inicial' | 'Intermedio' | 'Avanzado' | 'Competitivo';
  objetivoPrincipalEntrenamiento: string;
  diasDisponiblesParaEntrenarPorSemana: number;
  historialLesiones: LesionAtleta[];
  formulaCalculoRepeticionMaximaPreferida: FormulaCalculoRepeticionMaxima;
  identificadorEquipoPerteneciente?: string;
  
  // Fisiología femenina y monitoreo hormonal
  datosCicloMenstrual?: DatosCicloMenstrual;

  // MLP
  galeriaFotosProgreso?: FotoProgresoAtleta[];
  registrosDescanso?: RegistroDescansoSuenio[];
}

// --- EVALUACIONES Y TESTS DEPORTIVOS ---

export interface TestFuerzaMaxima {
  identificadorTest: string;
  identificadorAtleta: string;
  identificadorEjercicioBase: string;
  nombreEjercicioEvaluado: string;
  pesoLevantadoKilogramos: number;
  repeticionesRealizadas: number;
  unaRepeticionMaximaEstimadaEpley: number;
  unaRepeticionMaximaEstimadaBrzycki: number;
  unaRepeticionMaximaEfectiva: number;
  fechaEvaluacion: string;
  faseCicloMenstrualMomentoEvaluacion?: FaseCicloMenstrual;
}

export interface TestCapacidadFisica {
  identificadorTest: string;
  identificadorAtleta: string;
  fechaEvaluacion: string;
  saltoContramovimientoCentimetros?: number; // CMJ
  saltoDesdeSentadillaCentimetros?: number; // SJ
  velocidadSprintDiezMetrosSegundos?: number;
  velocidadSprintVeinteMetrosSegundos?: number;
  velocidadSprintTreintaMetrosSegundos?: number;
  resistenciaPlanchaIsometricaSegundos?: number;
  testResistenciaAerobicaCooperMetros?: number;
  carreraUnKilometroTiempoSegundos?: number;
}

export interface EvaluacionMovilidadArticular {
  identificadorEvaluacion: string;
  identificadorAtleta: string;
  fechaEvaluacion: string;
  dorsiflexionTobilloGrados?: number;
  movilidadCaderaObservacion?: string;
  rotacionCaderaGrados?: number;
  movilidadHombroObservacion?: string;
  sentadillaPorEncimaDeLaCabezaCalificacion?: string;
  testFlexibilidadSitAndReachCentimetros?: number;
}

// --- PLANIFICACIÓN DE ENTRENAMIENTO JERÁRQUICA ---

export interface PrescripcionSerie {
  numeroDeSerie: number;
  repeticionesPrescritas: number;
  porcentajeUnaRepeticionMaxima?: number; // ej. 75 (%)
  repeticionesEnReservaObjetivo?: number; // RIR
  esfuerzoPercibidoObjetivo?: EscalaEsfuerzoPercibidoSesion;
  tiempoDescansoEntreSeriesSegundos: number;
}

export interface EjercicioPrescritoEnBloque {
  identificadorEjercicio: string;
  ordenDentroDelBloque: number;
  seriesPrescritas: PrescripcionSerie[];
  indicacionesTecnicas?: string;
}

export interface BloqueEjercicioPlan {
  identificadorBloque: string;
  nombreBloque: string; // ej. "Bloque A: Fuerza Principal"
  tipoEstructura: TipoEstructuraBloque;
  ordenEnLaSesion: number;
  esfuerzoPercibidoObjetivoDelBloque: EscalaEsfuerzoPercibidoSesion;
  ejerciciosPrescritos: EjercicioPrescritoEnBloque[];
  tiempoDescansoEntreRondasSegundos?: number;
  observacionesGenerales?: string;
}

export interface SesionEntrenamiento {
  identificadorSesion: string;
  identificadorMicrociclo: string;
  nombreSesion: string;
  diaSemanaSugerido?: number; // 1 a 7
  ordenEnElMicrociclo: number;
  objetivoEspecificoSesion: string;
  esfuerzoPercibidoObjetivoDeLaSesion: EscalaEsfuerzoPercibidoSesion;
  bloquesDeEjercicios: BloqueEjercicioPlan[];
  duracionEstimadaMinutos: number;
}

export interface PlanMicrociclo {
  identificadorMicrociclo: string;
  identificadorMacrociclo: string; // FK obligatoria
  identificadorMesociclo_Opcional?: string; // FK opcional (permite saltarse el mesociclo)
  nombreMicrociclo: string;
  objetivoSegmentadoMicrociclo: string;
  tipoEstructuraMicrociclo: 'AJUSTE' | 'CARGA' | 'CHOQUE' | 'RECUPERACION' | 'COMPETICION';
  numeroSemanaEnMacrociclo: number; // 1 a 52
  fechaInicioSemana: string;
  esfuerzoPercibidoObjetivoDelMicrociclo: EscalaEsfuerzoPercibidoSesion;
  sesionesDeEntrenamiento: SesionEntrenamiento[];
}

export interface PlanMesociclo {
  identificadorMesociclo: string;
  identificadorMacrociclo: string;
  nombreMesociclo: string;
  objetivoSegmentadoMesociclo: string;
  tipoPeriodizacionMesociclo: 'ACUMULACION' | 'TRANSFORMACION' | 'REALIZACION' | 'BASE' | 'DESCARGA';
  ordenDentroDelMacrociclo: number;
  duracionTotalSemanas: number;
  esfuerzoPercibidoObjetivoDelMesociclo: EscalaEsfuerzoPercibidoSesion;
  microciclos: PlanMicrociclo[];
}

export interface PlanMacrociclo {
  identificadorMacrociclo: string;
  identificadorAtletaAsignado: string;
  identificadorCoachCreador: string;
  nombreMacrociclo: string;
  objetivoGeneralMacrociclo: string;
  fechaInicioMacrociclo: string;
  fechaFinMacrociclo: string;
  duracionTotalSemanas: number;
  esfuerzoPercibidoPromedioObjetivoDelMacrociclo: EscalaEsfuerzoPercibidoSesion;
  mesociclos: PlanMesociclo[];
  microciclosDirectos?: PlanMicrociclo[];
}

// --- EJECUCIÓN Y REGISTRO DEL ALUMNO (FEEDBACK Y LOG) ---

export interface RegistroSerieAtleta {
  numeroDeSerie: number;
  pesoPrescritoKilogramos: number;
  repeticionesPrescritas: number;
  pesoRealUtilizadoKilogramos: number;
  repeticionesRealesRealizadas: number;
}

export interface RegistroEjercicioAtleta {
  identificadorEjercicio: string;
  seriesRegistradas: RegistroSerieAtleta[];
}

export interface FeedbackEntrenamiento {
  esfuerzoPercibidoSesion: EscalaEsfuerzoPercibidoSesion;
  nivelFatigaPercibida: 1 | 2 | 3 | 4 | 5;
  presentaDolorOMolestia: boolean;
  zonaCorporalMolestia?: string;
  comentariosDelAtleta?: string;
}

export interface SesionCompletadaAtleta {
  identificadorRegistro: string;
  identificadorAtleta: string;
  identificadorSesionOriginal: string;
  fechaYHoraFinalizacion: string;
  duracionRealMinutos: number;
  ejerciciosEjecutados: RegistroEjercicioAtleta[];
  feedbackEntrenamiento: FeedbackEntrenamiento;
  cargaInternaUnidadesArbitrarias: number; // sRPE * duracionRealMinutos (Foster sRPE)
}
