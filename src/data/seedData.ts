// =====================================================================
// NEYEN ATHLETIC PERFORMANCE - DATOS SEMILLA (BANCO Y ATLETAS)
// =====================================================================

import {
  Atleta,
  CategoriaEjercicio,
  Ejercicio,
  PlanMacrociclo,
  SesionCompletadaAtleta,
  TipoEquipamiento,
} from '../types';

export const CATEGORIAS_INICIALES: CategoriaEjercicio[] = [
  {
    identificadorCategoria: 'CAT-01',
    nombreCategoria: 'FUERZA',
    descripcionCategoria: 'Ejercicios multiarticulares y accesorios para el desarrollo de fuerza máxima e hipertrofia',
    colorDistintivoHexadecimal: '#3b82f6', // Azul atlético
    ordenVisualizacion: 1,
  },
  {
    identificadorCategoria: 'CAT-02',
    nombreCategoria: 'POTENCIA',
    descripcionCategoria: 'Movimientos derivados del levantamiento olímpico y aceleración de cargas',
    colorDistintivoHexadecimal: '#f59e0b', // Ámbar potencia
    ordenVisualizacion: 2,
  },
  {
    identificadorCategoria: 'CAT-03',
    nombreCategoria: 'PLIOMETRIA',
    descripcionCategoria: 'Ciclo estiramiento-acortamiento (CEA), saltos y reactividad elástica neuromuscular',
    colorDistintivoHexadecimal: '#10b981', // Verde esmeralda
    ordenVisualizacion: 3,
  },
  {
    identificadorCategoria: 'CAT-04',
    nombreCategoria: 'ZONA MEDIA',
    descripcionCategoria: 'Antiextensión, antiflexión lateral y antirrotación para estabilidad central',
    colorDistintivoHexadecimal: '#8b5cf6', // Púrpura
    ordenVisualizacion: 4,
  },
  {
    identificadorCategoria: 'CAT-05',
    nombreCategoria: 'MOVILIDAD',
    descripcionCategoria: 'Rango articular dinámico, dorsiflexión y prevención lesional',
    colorDistintivoHexadecimal: '#06b6d4', // Celeste cian
    ordenVisualizacion: 5,
  },
];

export const EQUIPAMIENTOS_INICIALES: TipoEquipamiento[] = [
  { identificadorEquipamiento: 'EQ-01', nombreEquipamiento: 'Barra Olímpica', descripcionEquipamiento: 'Barra de 20kg con discos olímpicos' },
  { identificadorEquipamiento: 'EQ-02', nombreEquipamiento: 'Mancuernas', descripcionEquipamiento: 'Pares de mancuernas hexagonales o de peso fijo' },
  { identificadorEquipamiento: 'EQ-03', nombreEquipamiento: 'Kettlebell', descripcionEquipamiento: 'Pesas rusas de hierro fundido' },
  { identificadorEquipamiento: 'EQ-04', nombreEquipamiento: 'Peso corporal', descripcionEquipamiento: 'Sin sobrecarga externa (calistenia/autocarga)' },
  { identificadorEquipamiento: 'EQ-05', nombreEquipamiento: 'Cajón de Pliometría', descripcionEquipamiento: 'Cajón de madera o foam (50/60/75 cm)' },
  { identificadorEquipamiento: 'EQ-06', nombreEquipamiento: 'Bandas elásticas', descripcionEquipamiento: 'Superbands o minibands de resistencia progresiva' },
  { identificadorEquipamiento: 'EQ-07', nombreEquipamiento: 'Banco regulable', descripcionEquipamiento: 'Banco plano e inclinable' },
];

export const BANCO_EJERCICIOS_INICIAL: Ejercicio[] = [
  {
    identificadorEjercicio: 'EX0001',
    nombreEjercicio: 'Sentadilla Trasera con barra',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Dominante de rodilla',
    grupoMuscularPrincipal: 'Cuádriceps',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 4,
    etiquetasDeportivas: ['piernas', 'fuerza', 'compuesto', 'basico', 'bilateral'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    observacionesTecnicas: 'Romper paralelo controlando el torso y apertura de rodillas en dirección a las puntas.',
  },
  {
    identificadorEjercicio: 'EX0002',
    nombreEjercicio: 'Sentadilla Frontal con barra',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Dominante de rodilla',
    grupoMuscularPrincipal: 'Cuádriceps y Core',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 5,
    etiquetasDeportivas: ['piernas', 'compuesto', 'funcional', 'postura'],
    identificadoresEjerciciosAlternativos: ['EX0001'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=v-mQm_droHg',
    observacionesTecnicas: 'Codos altos en rack frontal. Gran demanda de dorsiflexión y movilidad torácica.',
    identificadorEjercicioBaseTestReferencia: 'EX0001',
    ratioConversionCargaPorcentual: 0.82, // 82% del 1RM de Sentadilla Trasera
  },
  {
    identificadorEjercicio: 'EX0003',
    nombreEjercicio: 'Peso Muerto Rumano con barra',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Dominante de cadera',
    grupoMuscularPrincipal: 'Isquiosurales y Glúteos',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 3,
    etiquetasDeportivas: ['cadena posterior', 'isquios', 'fuerza excéntrica'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    observacionesTecnicas: 'Empuje de cadera hacia atrás manteniendo tensión en isquios y columna neutra.',
    identificadorEjercicioBaseTestReferencia: 'EX0004',
    ratioConversionCargaPorcentual: 0.72,
  },
  {
    identificadorEjercicio: 'EX0004',
    nombreEjercicio: 'Peso Muerto Convencional',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Dominante de cadera',
    grupoMuscularPrincipal: 'Cadena posterior completa',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 4,
    etiquetasDeportivas: ['fuerza', 'compuesto', 'basico', 'traccion'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    observacionesTecnicas: 'Tensión dorsal antes del despegue, barra pegada a las tibias.',
  },
  {
    identificadorEjercicio: 'EX0005',
    nombreEjercicio: 'Empuje de Cadera / Hip Thrust',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Dominante de cadera',
    grupoMuscularPrincipal: 'Glúteo mayor',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 3,
    etiquetasDeportivas: ['gluteos', 'potencia', 'cadera', 'vector horizontal'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=SEdqd1n01G4',
    observacionesTecnicas: 'Bloqueo pélvico arriba manteniendo mirada al frente y barbilla pegada.',
  },
  {
    identificadorEjercicio: 'EX0006',
    nombreEjercicio: 'Press de Pecho Plano con barra',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Empuje horizontal',
    grupoMuscularPrincipal: 'Pectoral mayor y Tríceps',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 4,
    etiquetasDeportivas: ['pecho', 'empuje', 'fuerza', 'compuesto'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    observacionesTecnicas: 'Retracción escapular, contacto constante de 3 puntos (cabeza, glúteos y pies).',
  },
  {
    identificadorEjercicio: 'EX0007',
    nombreEjercicio: 'Press de Pecho Banco Inclinado',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Empuje horizontal',
    grupoMuscularPrincipal: 'Pectoral superior y Deltoides anterior',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 4,
    etiquetasDeportivas: ['pecho', 'empuje', 'hombro', 'inclinado'],
    identificadoresEjerciciosAlternativos: ['EX0006'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    observacionesTecnicas: 'Inclinación de 30° a 45°. Trayectoria diagonal suave hacia la clavícula.',
    identificadorEjercicioBaseTestReferencia: 'EX0006',
    ratioConversionCargaPorcentual: 0.83, // 83% de Press Plano
  },
  {
    identificadorEjercicio: 'EX0008',
    nombreEjercicio: 'Dominada Prona con lastre',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Tracción vertical',
    grupoMuscularPrincipal: 'Dorsal ancho y Bíceps',
    identificadorEquipamiento: 'EQ-04',
    nivelDificultadEstrellas: 5,
    etiquetasDeportivas: ['espalda', 'traccion vertical', 'calistenia', 'fuerza'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    observacionesTecnicas: 'Extensión completa en la fase excéntrica y mentón superando la barra sin balanceo.',
  },
  {
    identificadorEjercicio: 'EX0009',
    nombreEjercicio: 'Remo con barra bajo',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Tracción horizontal',
    grupoMuscularPrincipal: 'Espalda media y Romboides',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 3,
    etiquetasDeportivas: ['espalda', 'traccion horizontal', 'postura'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=G8l_8chR5BE',
    observacionesTecnicas: 'Torso a 45°, codos dirigidos hacia la cadera.',
    identificadorEjercicioBaseTestReferencia: 'EX0006',
    ratioConversionCargaPorcentual: 0.88,
  },
  {
    identificadorEjercicio: 'EX0010',
    nombreEjercicio: 'Salto al Cajón pliométrico',
    identificadorCategoria: 'CAT-03',
    patronDeMovimiento: 'Salto',
    grupoMuscularPrincipal: 'Extensores de triple articulación',
    identificadorEquipamiento: 'EQ-05',
    nivelDificultadEstrellas: 2,
    etiquetasDeportivas: ['pliometria', 'salto', 'explosivo', 'basquet', 'futbol'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=52r_Ul5k03g',
    observacionesTecnicas: 'Aterrizaje suave en posición de semi-sentadilla. Bajar caminando, no de un salto.',
  },
  {
    identificadorEjercicio: 'EX0011',
    nombreEjercicio: 'Salto Horizontal continuo (Broad Jump)',
    identificadorCategoria: 'CAT-03',
    patronDeMovimiento: 'Salto',
    grupoMuscularPrincipal: 'Glúteos, Cuádriceps y Gemelos',
    identificadorEquipamiento: 'EQ-04',
    nivelDificultadEstrellas: 3,
    etiquetasDeportivas: ['pliometria', 'vector horizontal', 'salto', 'velocidad'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=0hY1j_eM90Q',
    observacionesTecnicas: 'Mínimo tiempo de contacto en suelo entre saltos para optimizar el CEA.',
  },
  {
    identificadorEjercicio: 'EX0012',
    nombreEjercicio: 'Cargada de Potencia / Power Clean',
    identificadorCategoria: 'CAT-02',
    patronDeMovimiento: 'Locomoción y Triple extensión',
    grupoMuscularPrincipal: 'Cuerpo completo y Trapecios',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 5,
    etiquetasDeportivas: ['potencia', 'olimpico', 'explosivo', 'tasa desarrollo fuerza'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=KwYJTpQ_x5A',
    observacionesTecnicas: 'Extensión violenta de tobillos, rodillas y cadera. Recepción en un cuarto de sentadilla.',
  },
  {
    identificadorEjercicio: 'EX0013',
    nombreEjercicio: 'Arranque de Potencia / Power Snatch',
    identificadorCategoria: 'CAT-02',
    patronDeMovimiento: 'Locomoción y Triple extensión',
    grupoMuscularPrincipal: 'Cuerpo completo',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 5,
    etiquetasDeportivas: ['potencia', 'olimpico', 'explosivo', 'coordinacion'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=TL8SMfnW56k',
    observacionesTecnicas: 'Agarre ancho. Recepción firme por encima de la cabeza con codos bloqueados.',
  },
  {
    identificadorEjercicio: 'EX0014',
    nombreEjercicio: 'Bicho Muerto / Dead Bug',
    identificadorCategoria: 'CAT-04',
    patronDeMovimiento: 'Antiextensión',
    grupoMuscularPrincipal: 'Core y Transverso abdominal',
    identificadorEquipamiento: 'EQ-04',
    nivelDificultadEstrellas: 1,
    etiquetasDeportivas: ['zona media', 'core', 'salud lumbar', 'estabilidad'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=4XLEnwUr1d8',
    observacionesTecnicas: 'Presionar la zona lumbar contra el suelo de forma continua sin arquear la espalda.',
  },
  {
    identificadorEjercicio: 'EX0015',
    nombreEjercicio: 'Press Militar de Hombro con barra',
    identificadorCategoria: 'CAT-01',
    patronDeMovimiento: 'Empuje vertical',
    grupoMuscularPrincipal: 'Deltoides y Tríceps',
    identificadorEquipamiento: 'EQ-01',
    nivelDificultadEstrellas: 4,
    etiquetasDeportivas: ['hombro', 'empuje vertical', 'fuerza', 'estabilidad'],
    enlaceVideoDemostrativoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    observacionesTecnicas: 'Glúteos y abdomen apretados. La barra sube pegada a la cara hasta bloquear arriba.',
    identificadorEjercicioBaseTestReferencia: 'EX0006',
    ratioConversionCargaPorcentual: 0.64, // 64% de Press Plano
  },
];

export const ATLETA_FEMENINA_DEMO: Atleta = {
  identificadorAtleta: 'AL0001',
  nombreCompleto: 'Sofía Rodríguez',
  fotoPerfilUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&auto=format&fit=crop&q=80',
  generoAtleta: 'F',
  fechaNacimiento: '2004-03-15',
  edadCronologicaAnios: 22,
  alturaCentimetros: 178,
  pesoCorporalKilogramos: 68.5,
  deportePracticado: 'Básquetbol',
  posicionEnElCampoDeJuego: 'Alera titular',
  nivelRendimientoDeportivo: 'Competitivo',
  objetivoPrincipalEntrenamiento: 'Potencia vertical, primer paso explosivo y prevención de lesiones de LCA',
  diasDisponiblesParaEntrenarPorSemana: 4,
  formulaCalculoRepeticionMaximaPreferida: 'EPLEY',
  identificadorEquipoPerteneciente: 'EQUIPO-01',
  
  // Historial clínico de lesiones
  historialLesiones: [
    {
      identificadorLesion: 'LES-01',
      descripcionLesion: 'Sobrecarga tendón rotuliano izquierdo',
      zonaCorporalAfectada: 'Rodilla izquierda',
      fechaDiagnostico: '2026-08-10',
      estadoLesion: 'EN_REHABILITACION',
      limitacionesDeMovimiento: 'Evitar saltos con caída profunda y flexión de rodilla con carga rápida mayor a 90°',
      observacionesMedicas: 'Realizar protocolo de isometría española antes de cada sesión.',
    },
    {
      identificadorLesion: 'LES-02',
      descripcionLesion: 'Esguince de tobillo grado 1',
      zonaCorporalAfectada: 'Tobillo derecho',
      fechaDiagnostico: '2025-11-20',
      estadoLesion: 'RECUPERADA',
      limitacionesDeMovimiento: 'Ninguna actualmente.',
      observacionesMedicas: 'Mantenimiento de movilidad de dorsiflexión y trabajo propioceptivo.',
    },
  ],

  // Módulo de ciclo menstrual activo:
  // Simulamos FUM hace 23 días para situarla en Fase Lútea Tardía (demostrando reducción del -7.5%)
  datosCicloMenstrual: {
    activo: true,
    fechaUltimaMenstruacion: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duracionPromedioCicloDias: 28,
    duracionPromedioMenstruacionDias: 5,
    enRetrasoMenstrual: false,
    diasDeRetraso: 0,
    historialRetrasosReportados: [],
  },

  // MLP: Galería de progreso
  galeriaFotosProgreso: [
    {
      identificadorFoto: 'FOTO-01',
      fechaRegistro: '2026-06-01',
      urlFoto: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
      tipoVista: 'FRENTE',
      pesoRegistradoKg: 70.2,
      observaciones: 'Inicio de pretemporada',
    },
    {
      identificadorFoto: 'FOTO-02',
      fechaRegistro: '2026-08-15',
      urlFoto: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
      tipoVista: 'FRENTE',
      pesoRegistradoKg: 69.1,
      observaciones: 'Evaluación de mitad de ciclo',
    },
    {
      identificadorFoto: 'FOTO-03',
      fechaRegistro: '2026-10-15',
      urlFoto: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&auto=format&fit=crop&q=80',
      tipoVista: 'FRENTE',
      pesoRegistradoKg: 68.5,
      observaciones: 'Pico de forma pre-playoffs',
    },
  ],

  // MLP: Wearable y sueño
  registrosDescanso: [
    {
      identificadorRegistro: 'SUE-01',
      fechaNoche: '2026-10-23',
      horasSuenioTotal: 8.2,
      porcentajeSuenioRem: 24,
      porcentajeSuenioProfundo: 21,
      frecuenciaCardiacaReposoLpm: 49,
      variabilidadFrecuenciaCardiacaHrvMs: 78,
      calidadSubjetivaDescanso: 5,
      fuenteWearable: 'WHOOP',
    },
    {
      identificadorRegistro: 'SUE-02',
      fechaNoche: '2026-10-22',
      horasSuenioTotal: 7.4,
      porcentajeSuenioRem: 19,
      porcentajeSuenioProfundo: 18,
      frecuenciaCardiacaReposoLpm: 53,
      variabilidadFrecuenciaCardiacaHrvMs: 65,
      calidadSubjetivaDescanso: 4,
      fuenteWearable: 'WHOOP',
    },
  ],
};

export const ATLETA_MASCULINO_DEMO: Atleta = {
  identificadorAtleta: 'AL0002',
  nombreCompleto: 'Lucas Gómez',
  fotoPerfilUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  generoAtleta: 'M',
  fechaNacimiento: '2001-07-22',
  edadCronologicaAnios: 25,
  alturaCentimetros: 182,
  pesoCorporalKilogramos: 77.0,
  deportePracticado: 'Fútbol',
  posicionEnElCampoDeJuego: 'Mediocampista central',
  nivelRendimientoDeportivo: 'Competitivo',
  objetivoPrincipalEntrenamiento: 'Capacidad de aceleración repetida, potencia de piernas y masa magra',
  diasDisponiblesParaEntrenarPorSemana: 5,
  formulaCalculoRepeticionMaximaPreferida: 'EPLEY',
  identificadorEquipoPerteneciente: 'EQUIPO-02',
  historialLesiones: [],
};

// Macrociclo NEYEN 2025-2026 (52 Semanas y 13 Mesociclos)
export const MACROCICLO_NEYEN_DEMO: PlanMacrociclo = {
  identificadorMacrociclo: 'MACRO-2025-2026',
  identificadorAtletaAsignado: 'AL0001',
  identificadorCoachCreador: 'COACH-01',
  nombreMacrociclo: 'Macrociclo Anual NEYEN 2025-2026',
  objetivoGeneralMacrociclo: 'Desarrollo de potencia mecánica, aceleración horizontal/vertical y preparación física para el campeonato anual 2025-2026',
  fechaInicioMacrociclo: '2025-12-15',
  fechaFinMacrociclo: '2026-12-07',
  duracionTotalSemanas: 52,
  esfuerzoPercibidoPromedioObjetivoDelMacrociclo: 7,
  mesociclos: [
    {
      identificadorMesociclo: 'MESO-01',
      identificadorMacrociclo: 'MACRO-2025-2026',
      nombreMesociclo: 'Mesociclo 1: Preparación Física General y Adaptación',
      objetivoSegmentadoMesociclo: 'Acondicionamiento general, estabilidad articular y base neuromuscular',
      tipoPeriodizacionMesociclo: 'ACUMULACION',
      ordenDentroDelMacrociclo: 1,
      duracionTotalSemanas: 4,
      esfuerzoPercibidoObjetivoDelMesociclo: 6,
      microciclos: [
        {
          identificadorMicrociclo: 'MICRO-01',
          identificadorMacrociclo: 'MACRO-2025-2026',
          identificadorMesociclo_Opcional: 'MESO-01',
          nombreMicrociclo: 'Microciclo 1: Carga Progresiva y Testeo Base',
          objetivoSegmentadoMicrociclo: 'Relevamiento de 1RM y toma de ritmo de volumen moderado',
          tipoEstructuraMicrociclo: 'AJUSTE',
          numeroSemanaEnMacrociclo: 1,
          fechaInicioSemana: '2025-12-15',
          esfuerzoPercibidoObjetivoDelMicrociclo: 6,
          sesionesDeEntrenamiento: [
            {
              identificadorSesion: 'SES-01',
              identificadorMicrociclo: 'MICRO-01',
              nombreSesion: 'Sesión A: Fuerza Máxima Piernas y Reactividad Pliométrica',
              diaSemanaSugerido: 1, // Lunes
              ordenEnElMicrociclo: 1,
              objetivoEspecificoSesion: 'Desarrollo de fuerza en sentadilla y potencia elástica en cajón',
              esfuerzoPercibidoObjetivoDeLaSesion: 7,
              duracionEstimadaMinutos: 65,
              bloquesDeEjercicios: [
                {
                  identificadorBloque: 'BLOQ-01',
                  nombreBloque: 'Bloque 1: Fuerza Principal (Bilateral)',
                  tipoEstructura: 'SERIE_SIMPLE',
                  ordenEnLaSesion: 1,
                  esfuerzoPercibidoObjetivoDelBloque: 8,
                  ejerciciosPrescritos: [
                    {
                      identificadorEjercicio: 'EX0001', // Sentadilla trasera
                      ordenDentroDelBloque: 1,
                      indicacionesTecnicas: 'Pausa de 1 segundo en el fondo. Máxima aceleración concéntrica.',
                      seriesPrescritas: [
                        { numeroDeSerie: 1, repeticionesPrescritas: 6, porcentajeUnaRepeticionMaxima: 70, repeticionesEnReservaObjetivo: 3, esfuerzoPercibidoObjetivo: 7, tiempoDescansoEntreSeriesSegundos: 120 },
                        { numeroDeSerie: 2, repeticionesPrescritas: 5, porcentajeUnaRepeticionMaxima: 75, repeticionesEnReservaObjetivo: 2, esfuerzoPercibidoObjetivo: 8, tiempoDescansoEntreSeriesSegundos: 150 },
                        { numeroDeSerie: 3, repeticionesPrescritas: 5, porcentajeUnaRepeticionMaxima: 75, repeticionesEnReservaObjetivo: 2, esfuerzoPercibidoObjetivo: 8, tiempoDescansoEntreSeriesSegundos: 150 },
                        { numeroDeSerie: 4, repeticionesPrescritas: 4, porcentajeUnaRepeticionMaxima: 80, repeticionesEnReservaObjetivo: 1, esfuerzoPercibidoObjetivo: 8, tiempoDescansoEntreSeriesSegundos: 180 },
                      ],
                    },
                  ],
                },
                {
                  identificadorBloque: 'BLOQ-02',
                  nombreBloque: 'Bloque 2: Biserie de Potencia y Cadera',
                  tipoEstructura: 'BISERIE_SUPERSET',
                  ordenEnLaSesion: 2,
                  esfuerzoPercibidoObjetivoDelBloque: 7,
                  tiempoDescansoEntreRondasSegundos: 90,
                  ejerciciosPrescritos: [
                    {
                      identificadorEjercicio: 'EX0005', // Hip Thrust
                      ordenDentroDelBloque: 1,
                      seriesPrescritas: [
                        { numeroDeSerie: 1, repeticionesPrescritas: 8, porcentajeUnaRepeticionMaxima: 75, repeticionesEnReservaObjetivo: 2, esfuerzoPercibidoObjetivo: 7, tiempoDescansoEntreSeriesSegundos: 30 },
                        { numeroDeSerie: 2, repeticionesPrescritas: 8, porcentajeUnaRepeticionMaxima: 75, repeticionesEnReservaObjetivo: 2, esfuerzoPercibidoObjetivo: 7, tiempoDescansoEntreSeriesSegundos: 30 },
                        { numeroDeSerie: 3, repeticionesPrescritas: 8, porcentajeUnaRepeticionMaxima: 75, repeticionesEnReservaObjetivo: 2, esfuerzoPercibidoObjetivo: 7, tiempoDescansoEntreSeriesSegundos: 30 },
                      ],
                    },
                    {
                      identificadorEjercicio: 'EX0010', // Salto al cajón
                      ordenDentroDelBloque: 2,
                      indicacionesTecnicas: 'Transferencia inmediata tras el empuje de cadera.',
                      seriesPrescritas: [
                        { numeroDeSerie: 1, repeticionesPrescritas: 5, tiempoDescansoEntreSeriesSegundos: 90 },
                        { numeroDeSerie: 2, repeticionesPrescritas: 5, tiempoDescansoEntreSeriesSegundos: 90 },
                        { numeroDeSerie: 3, repeticionesPrescritas: 5, tiempoDescansoEntreSeriesSegundos: 90 },
                      ],
                    },
                  ],
                },
                {
                  identificadorBloque: 'BLOQ-03',
                  nombreBloque: 'Bloque 3: Estabilidad Central y Core',
                  tipoEstructura: 'SERIE_SIMPLE',
                  ordenEnLaSesion: 3,
                  esfuerzoPercibidoObjetivoDelBloque: 5,
                  ejerciciosPrescritos: [
                    {
                      identificadorEjercicio: 'EX0014', // Bicho muerto
                      ordenDentroDelBloque: 1,
                      seriesPrescritas: [
                        { numeroDeSerie: 1, repeticionesPrescritas: 10, tiempoDescansoEntreSeriesSegundos: 60 },
                        { numeroDeSerie: 2, repeticionesPrescritas: 10, tiempoDescansoEntreSeriesSegundos: 60 },
                        { numeroDeSerie: 3, repeticionesPrescritas: 10, tiempoDescansoEntreSeriesSegundos: 60 },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              identificadorSesion: 'SES-02',
              identificadorMicrociclo: 'MICRO-01',
              nombreSesion: 'Sesión B: Empuje y Tracción Tren Superior',
              diaSemanaSugerido: 3, // Miércoles
              ordenEnElMicrociclo: 2,
              objetivoEspecificoSesion: 'Fuerza funcional de tren superior y equilibrio escapular',
              esfuerzoPercibidoObjetivoDeLaSesion: 7,
              duracionEstimadaMinutos: 60,
              bloquesDeEjercicios: [
                {
                  identificadorBloque: 'BLOQ-04',
                  nombreBloque: 'Bloque 1: Fuerza Empuje Plano',
                  tipoEstructura: 'SERIE_SIMPLE',
                  ordenEnLaSesion: 1,
                  esfuerzoPercibidoObjetivoDelBloque: 8,
                  ejerciciosPrescritos: [
                    {
                      identificadorEjercicio: 'EX0006', // Press plano
                      ordenDentroDelBloque: 1,
                      seriesPrescritas: [
                        { numeroDeSerie: 1, repeticionesPrescritas: 6, porcentajeUnaRepeticionMaxima: 75, repeticionesEnReservaObjetivo: 2, esfuerzoPercibidoObjetivo: 7, tiempoDescansoEntreSeriesSegundos: 120 },
                        { numeroDeSerie: 2, repeticionesPrescritas: 6, porcentajeUnaRepeticionMaxima: 75, repeticionesEnReservaObjetivo: 2, esfuerzoPercibidoObjetivo: 8, tiempoDescansoEntreSeriesSegundos: 120 },
                        { numeroDeSerie: 3, repeticionesPrescritas: 5, porcentajeUnaRepeticionMaxima: 80, repeticionesEnReservaObjetivo: 1, esfuerzoPercibidoObjetivo: 8, tiempoDescansoEntreSeriesSegundos: 150 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      identificadorMesociclo: 'MESO-02',
      identificadorMacrociclo: 'MACRO-2025-2026',
      nombreMesociclo: 'Mesociclo 2: Hipertrofia Funcional e Isometría',
      objetivoSegmentadoMesociclo: 'Aumento de masa muscular útil para resistencia al choque y fuerza estructural',
      tipoPeriodizacionMesociclo: 'ACUMULACION',
      ordenDentroDelMacrociclo: 2,
      duracionTotalSemanas: 4,
      esfuerzoPercibidoObjetivoDelMesociclo: 7,
      microciclos: [],
    },
    {
      identificadorMesociclo: 'MESO-03',
      identificadorMacrociclo: 'MACRO-2025-2026',
      nombreMesociclo: 'Mesociclo 3: Fuerza Máxima y Cargas Concentradas',
      objetivoSegmentadoMesociclo: 'Reclutamiento de unidades motoras rápidas (>85% 1RM)',
      tipoPeriodizacionMesociclo: 'TRANSFORMACION',
      ordenDentroDelMacrociclo: 3,
      duracionTotalSemanas: 4,
      esfuerzoPercibidoObjetivoDelMesociclo: 8,
      microciclos: [],
    },
    {
      identificadorMesociclo: 'MESO-04',
      identificadorMacrociclo: 'MACRO-2025-2026',
      nombreMesociclo: 'Mesociclo 4: Conversión a Potencia y Transferencia',
      objetivoSegmentadoMesociclo: 'Aceleración de cargas livianas-medias y pliometría intensa',
      tipoPeriodizacionMesociclo: 'REALIZACION',
      ordenDentroDelMacrociclo: 4,
      duracionTotalSemanas: 4,
      esfuerzoPercibidoObjetivoDelMesociclo: 8,
      microciclos: [],
    },
  ],
  // Microciclo directo de transición (demostrando que se puede saltar el mesociclo):
  microciclosDirectos: [
    {
      identificadorMicrociclo: 'MICRO-DIRECTO-TRANSICION',
      identificadorMacrociclo: 'MACRO-2025-2026',
      nombreMicrociclo: 'Semana Especial de Descarga y Re-evaluación',
      objetivoSegmentadoMicrociclo: 'Semana de transición directa sin pertenecer a ningún mesociclo rígido',
      tipoEstructuraMicrociclo: 'RECUPERACION',
      numeroSemanaEnMacrociclo: 13,
      fechaInicioSemana: '2026-03-16',
      esfuerzoPercibidoObjetivoDelMicrociclo: 4,
      sesionesDeEntrenamiento: [],
    },
  ],
};

// Histórico de sesiones completadas para el atleta
export const HISTORIAL_SESIONES_DEMO: SesionCompletadaAtleta[] = [
  {
    identificadorRegistro: 'REG-SES-01',
    identificadorAtleta: 'AL0001',
    identificadorSesionOriginal: 'SES-01',
    fechaYHoraFinalizacion: '2026-10-21T18:45:00Z',
    duracionRealMinutos: 62,
    ejerciciosEjecutados: [
      {
        identificadorEjercicio: 'EX0001',
        seriesRegistradas: [
          { numeroDeSerie: 1, pesoPrescritoKilogramos: 70, repeticionesPrescritas: 6, pesoRealUtilizadoKilogramos: 70, repeticionesRealesRealizadas: 6 },
          { numeroDeSerie: 2, pesoPrescritoKilogramos: 75, repeticionesPrescritas: 5, pesoRealUtilizadoKilogramos: 75, repeticionesRealesRealizadas: 5 },
          { numeroDeSerie: 3, pesoPrescritoKilogramos: 75, repeticionesPrescritas: 5, pesoRealUtilizadoKilogramos: 75, repeticionesRealesRealizadas: 5 },
        ],
      },
    ],
    feedbackEntrenamiento: {
      esfuerzoPercibidoSesion: 8,
      nivelFatigaPercibida: 4,
      presentaDolorOMolestia: false,
      comentariosDelAtleta: 'Gran intensidad en las sentadillas, buena respuesta de la rodilla.',
    },
    cargaInternaUnidadesArbitrarias: 496, // 8 * 62 min
  },
  {
    identificadorRegistro: 'REG-SES-02',
    identificadorAtleta: 'AL0001',
    identificadorSesionOriginal: 'SES-02',
    fechaYHoraFinalizacion: '2026-10-19T19:10:00Z',
    duracionRealMinutos: 55,
    ejerciciosEjecutados: [],
    feedbackEntrenamiento: {
      esfuerzoPercibidoSesion: 7,
      nivelFatigaPercibida: 3,
      presentaDolorOMolestia: false,
      comentariosDelAtleta: 'Excelente ritmo en los empujes.',
    },
    cargaInternaUnidadesArbitrarias: 385, // 7 * 55 min
  },
];
