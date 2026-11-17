// =====================================================================
// NEYIMA ATHLETIC - PANEL DE ALERTAS PARA EL COACH
// CORRESPONDE A alertas-claro.html / alertas-oscuro.html
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from '../ui/icons/IconInterface';

type TipoAlerta = 'TODAS' | 'SALUD' | 'CICLO' | 'CARGA' | 'BIENESTAR' | 'SESIONES';

interface AlertaItem {
  id: string;
  categoria: 'SALUD' | 'CICLO' | 'CARGA' | 'BIENESTAR' | 'SESIONES';
  titulo: string;
  descripcion: string;
  atletaNombre: string;
  tiempo: string;
  nivelRiesgo: 'alto' | 'medio' | 'info';
  accionLabel: string;
  accionTipo: 'FICHA' | 'PLAN' | 'CARGA' | 'BIENESTAR' | 'VOLUMEN' | 'SESION';
}

interface CoachAlertsViewProps {
  onNavegarA?: (seccion: 'FICHA' | 'PLAN' | 'CARGA' | 'BIENESTAR') => void;
}

export const CoachAlertsView: React.FC<CoachAlertsViewProps> = ({ onNavegarA }) => {
  const { atletas } = useTraining();
  const [tabActiva, setTabActiva] = useState<TipoAlerta>('TODAS');
  const [atletaFiltro, setAtletaFiltro] = useState<string>('TODOS');

  const [alertas, setAlertas] = useState<AlertaItem[]>([
    {
      id: 'ALT-01',
      categoria: 'SALUD',
      titulo: 'Dolor reportado en rodilla izquierda',
      descripcion: 'Marcado al finalizar la sesión. Revisá la ficha y las limitaciones funcionales.',
      atletaNombre: 'Sofía Rodríguez',
      tiempo: 'hace 2 h',
      nivelRiesgo: 'alto',
      accionLabel: 'Ver ficha',
      accionTipo: 'FICHA',
    },
    {
      id: 'ALT-02',
      categoria: 'CICLO',
      titulo: 'Retraso de ciclo reportado',
      descripcion: 'Se pausó el cálculo automático de cargas. Vigilar sobreentrenamiento y déficit energético (RED-S).',
      atletaNombre: 'Sofía Rodríguez',
      tiempo: 'hace 5 h',
      nivelRiesgo: 'medio',
      accionLabel: 'Revisar plan',
      accionTipo: 'PLAN',
    },
    {
      id: 'ALT-03',
      categoria: 'CARGA',
      titulo: 'ACWR en Zona de Riesgo (>1,5)',
      descripcion: 'Riesgo alto de sobreuso: se sugiere reducir carga aguda de entrenamiento.',
      atletaNombre: 'Sofía Rodríguez',
      tiempo: 'hace 1 d',
      nivelRiesgo: 'alto',
      accionLabel: 'Ver carga',
      accionTipo: 'CARGA',
    },
    {
      id: 'ALT-04',
      categoria: 'CARGA',
      titulo: 'ACWR en Zona Alerta (1,3 a 1,5)',
      descripcion: 'Atención: monitorear fatiga muscular acumulada y wellness diario.',
      atletaNombre: 'Mateo Rossi',
      tiempo: 'hace 1 d',
      nivelRiesgo: 'medio',
      accionLabel: 'Ver carga',
      accionTipo: 'CARGA',
    },
    {
      id: 'ALT-05',
      categoria: 'BIENESTAR',
      titulo: 'Readiness bajo: alerta de fatiga (<60 %)',
      descripcion: 'Puntaje de preparación física bajo. Reducir volumen 20-30% o programar descarga.',
      atletaNombre: 'Sofía Rodríguez',
      tiempo: 'hace 2 d',
      nivelRiesgo: 'alto',
      accionLabel: 'Ver bienestar',
      accionTipo: 'BIENESTAR',
    },
    {
      id: 'ALT-06',
      categoria: 'CARGA',
      titulo: 'Volumen semanal bajo',
      descripcion: '26 de 40 a 70 series efectivas completadas (por debajo del objetivo planificado).',
      atletaNombre: 'Mateo Rossi',
      tiempo: 'hace 3 d',
      nivelRiesgo: 'medio',
      accionLabel: 'Ver carga',
      accionTipo: 'CARGA',
    },
    {
      id: 'ALT-07',
      categoria: 'SESIONES',
      titulo: 'Sesión sin completar',
      descripcion: 'Sesión 3 – Miércoles | Potencia aún permanece pendiente de ejecución.',
      atletaNombre: 'Sofía Rodríguez',
      tiempo: 'hace 3 d',
      nivelRiesgo: 'info',
      accionLabel: 'Ver sesión',
      accionTipo: 'PLAN',
    },
  ]);

  const descartarAlerta = (id: string) => {
    setAlertas((prev) => prev.filter((a) => a.id !== id));
  };

  const alertasFiltradas = alertas.filter((a) => {
    const coincideTab = tabActiva === 'TODAS' || a.categoria === tabActiva;
    const coincideAtleta = atletaFiltro === 'TODOS' || a.atletaNombre === atletaFiltro;
    return coincideTab && coincideAtleta;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">Lo que pide tu atención</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Alertas</h1>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filtro-atleta-alertas" className="text-xs font-bold text-[var(--mut)]">
            Atleta
          </label>
          <select
            id="filtro-atleta-alertas"
            value={atletaFiltro}
            onChange={(e) => setAtletaFiltro(e.target.value)}
            className="h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)] text-xs font-bold outline-hidden"
          >
            <option value="TODOS">Todos</option>
            {atletas.map((at) => (
              <option key={at.identificadorAtleta} value={at.nombreCompleto}>
                {at.nombreCompleto}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'TODAS', label: `Todas (${alertas.length})` },
            { id: 'SALUD', label: 'Salud' },
            { id: 'CICLO', label: 'Ciclo' },
            { id: 'CARGA', label: 'Carga' },
            { id: 'BIENESTAR', label: 'Bienestar' },
            { id: 'SESIONES', label: 'Sesiones' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTabActiva(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              tabActiva === t.id
                ? 'bg-[var(--navbg)] text-[var(--navon)]'
                : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-2.5">
        {alertasFiltradas.length === 0 ? (
          <div className="p-8 text-center bg-[var(--surf)] border border-[var(--bord)] rounded-2xl">
            <IconInterface name="check" size={32} className="mx-auto text-emerald-600 mb-2" />
            <p className="text-sm font-bold">No hay alertas pendientes en esta categoría</p>
            <p className="text-xs text-[var(--mut)] mt-1">Todos tus atletas están dentro de parámetros normales</p>
          </div>
        ) : (
          alertasFiltradas.map((alerta) => (
            <div
              key={alerta.id}
              className="bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3 flex-1">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    alerta.nivelRiesgo === 'alto'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : alerta.nivelRiesgo === 'medio'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  <IconInterface
                    name={alerta.nivelRiesgo === 'alto' ? 'alert' : 'info'}
                    size={18}
                    strokeWidth={2.2}
                  />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold">{alerta.titulo}</h2>
                  <p className="text-xs text-[var(--mut)] mt-0.5 leading-relaxed">{alerta.descripcion}</p>
                  <p className="text-xs text-[var(--mut)] font-bold mt-1.5">
                    {alerta.atletaNombre} • {alerta.tiempo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => onNavegarA && onNavegarA(alerta.accionTipo === 'FICHA' ? 'FICHA' : 'CARGA')}
                  className="px-3.5 py-1.5 rounded-xl border-2 border-[var(--link)] text-[var(--link)] hover:bg-[var(--link)] hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  {alerta.accionLabel}
                </button>
                <button
                  type="button"
                  onClick={() => descartarAlerta(alerta.id)}
                  className="px-2.5 py-1.5 text-xs text-[var(--mut)] hover:text-[var(--txt)] underline cursor-pointer"
                >
                  Marcar vista
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
