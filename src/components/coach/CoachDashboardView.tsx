// =====================================================================
// NEYIMA ATHLETIC - PANEL DEL COACH (DASHBOARD GENERAL)
// DISEÑO EXACTO FIEL A MOCKUPS NEYIMA (13 MESOCICLOS CON ACTIVO EN ROJO)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IndicatorStatus } from '../ui/IndicatorStatus';
import { Button } from '../ui/Button';
import { IconInterface } from '../ui/icons/IconInterface';
import { IconDiscipline, type DisciplineName } from '../ui/icons/IconDiscipline';

interface CoachDashboardViewProps {
  onAbrirPlanificador?: () => void;
  onVerAlertas?: () => void;
  onSeleccionarAtleta?: (atletaId: string) => void;
}

export const CoachDashboardView: React.FC<CoachDashboardViewProps> = ({
  onAbrirPlanificador,
  onVerAlertas,
  onSeleccionarAtleta,
}) => {
  const { atletas, setAtletaSeleccionadoId } = useTraining();
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>('Todas');

  const disciplinasDisponibles = ['Todas', 'Running', 'Fuerza', 'Natación', 'Equipo'];

  const atletasMocks = [
    {
      id: 'AL0001',
      nombre: 'Lucía Fernández',
      disciplina: 'running' as DisciplineName,
      disciplinaLabel: 'Running',
      meso: 'M04',
      cargaUA: 520,
      estado: { status: 'ok' as const, label: 'En plan' },
    },
    {
      id: 'AL0002',
      nombre: 'Martín Benítez',
      disciplina: 'fuerza' as DisciplineName,
      disciplinaLabel: 'Fuerza',
      meso: 'M04',
      cargaUA: 640,
      estado: { status: 'warn' as const, label: 'Revisar' },
    },
    {
      id: 'AL0003',
      nombre: 'Camila Rossi',
      disciplina: 'natacion' as DisciplineName,
      disciplinaLabel: 'Natación',
      meso: 'M03',
      cargaUA: 480,
      estado: { status: 'ok' as const, label: 'En plan' },
    },
    {
      id: 'AL0004',
      nombre: 'Joaquín Gómez',
      disciplina: 'equipo' as DisciplineName,
      disciplinaLabel: 'Equipo',
      meso: 'M04',
      cargaUA: 590,
      estado: { status: 'warn' as const, label: 'Revisar' },
    },
    {
      id: 'AL0005',
      nombre: 'Sofía Álvarez',
      disciplina: 'running' as DisciplineName,
      disciplinaLabel: 'Running',
      meso: 'M05',
      cargaUA: 410,
      estado: { status: 'ok' as const, label: 'En plan' },
    },
  ];

  const atletasFiltrados =
    filtroDisciplina === 'Todas'
      ? atletasMocks
      : atletasMocks.filter((a) => a.disciplinaLabel.toLowerCase() === filtroDisciplina.toLowerCase());

  const handleAbrirAtleta = (atletaId: string) => {
    setAtletaSeleccionadoId(atletaId);
    if (onSeleccionarAtleta) onSeleccionarAtleta(atletaId);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Encabezado: Panel del coach | Hola, Coach | Botón + Nuevo atleta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Panel del coach
          </p>
          <h1 className="text-3xl font-extrabold text-[var(--txt)] tracking-tight">
            Hola, Coach
          </h1>
        </div>

        <Button variant="primary" size="md" className="font-extrabold self-start sm:self-auto">
          + Nuevo atleta
        </Button>
      </div>

      {/* 4 KPIs Clave */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Atletas activos
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">
            {String(atletas.length || 5).padStart(2, '0')}
          </p>
          <p className="text-xs text-[var(--mut)] mt-0.5">todas las disciplinas</p>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Sesiones de hoy
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">04</p>
          <p className="text-xs text-[var(--mut)] mt-0.5">programadas</p>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Alertas
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">03</p>
          <p className="text-xs text-[var(--mut)] mt-0.5">por revisar</p>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Cumplimiento
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">92%</p>
          <p className="text-xs text-[var(--mut)] mt-0.5">esta semana</p>
        </div>
      </div>

      {/* Grilla Principal: Tabla de atletas (2.1fr) + Alertas (1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Tabla Mis Atletas */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--bord)] pb-2.5">
            <h2 className="text-lg font-extrabold text-[var(--txt)]">Mis atletas</h2>

            <div className="flex items-center gap-2">
              <label htmlFor="filtro-dis" className="text-xs font-bold text-[var(--mut)]">
                Disciplina
              </label>
              <select
                id="filtro-dis"
                value={filtroDisciplina}
                onChange={(e) => setFiltroDisciplina(e.target.value)}
                className="h-9 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-xs font-bold px-2.5 focus:outline-none"
              >
                {disciplinasDisponibles.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm select-none">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] border-b border-[var(--bord)] pb-2">
                  <th className="py-2 pr-3">Atleta</th>
                  <th className="py-2 pr-3">Disciplina</th>
                  <th className="py-2 pr-3">Meso</th>
                  <th className="py-2 pr-3">Carga</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bord)]">
                {atletasFiltrados.map((a) => (
                  <tr key={a.id} className="hover:bg-[var(--bg)]/40 transition">
                    <td className="py-2.5 pr-3 font-bold text-[var(--txt)] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--okbg)] text-[var(--oktx)] flex items-center justify-center font-extrabold text-xs">
                          {a.nombre.charAt(0)}
                        </div>
                        <span>{a.nombre}</span>
                      </div>
                    </td>

                    <td className="py-2.5 pr-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <IconDiscipline discipline={a.disciplina} size={26} rounded={true} />
                        <span className="text-xs font-bold text-[var(--txt)]">{a.disciplinaLabel}</span>
                      </div>
                    </td>

                    <td className="py-2.5 pr-3 text-xs font-semibold text-[var(--mut)]">
                      {a.meso}
                    </td>

                    <td className="py-2.5 pr-3 text-xs font-bold text-[var(--txt)] font-mono">
                      {a.cargaUA} UA
                    </td>

                    <td className="py-2.5 pr-3 whitespace-nowrap">
                      <IndicatorStatus status={a.estado.status} label={a.estado.label} size="sm" />
                    </td>

                    <td className="py-2.5 text-right whitespace-nowrap">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAbrirAtleta(a.id)}
                        className="font-bold py-1 px-3 min-h-[36px]"
                      >
                        Abrir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel de Alertas Rápidas */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--bord)] pb-2.5">
              <h2 className="text-lg font-extrabold text-[var(--txt)]">Alertas</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--estado-bad-fondo)] text-[var(--estado-bad-texto)]">
                3 activas
              </span>
            </div>

            <div className="divide-y divide-[var(--bord)] text-xs font-medium">
              <div className="py-2.5 flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[var(--estado-proc-fondo)] text-[var(--estado-proc-texto)] flex items-center justify-center shrink-0">
                  <IconInterface name="activity" size={14} />
                </span>
                <div>
                  <p className="font-bold text-[var(--txt)]">Martín Benítez</p>
                  <p className="text-[var(--mut)]">Reportó dolor en tendón rotuliano</p>
                </div>
              </div>

              <div className="py-2.5 flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)] flex items-center justify-center shrink-0">
                  <IconInterface name="calclock" size={14} />
                </span>
                <div>
                  <p className="font-bold text-[var(--txt)]">Camila Rossi</p>
                  <p className="text-[var(--mut)]">Retraso de ciclo ovárico reportado</p>
                </div>
              </div>

              <div className="py-2.5 flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[var(--okbg)] text-[var(--oktx)] flex items-center justify-center shrink-0">
                  <IconInterface name="clock" size={14} />
                </span>
                <div>
                  <p className="font-bold text-[var(--txt)]">Joaquín Gómez</p>
                  <p className="text-[var(--mut)]">Sesión del jueves sin completar</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onVerAlertas}
            className="font-bold"
          >
            Ver todas las alertas
          </Button>
        </div>
      </div>

      {/* Macrociclo: 13 Mesociclos con mesociclo actual en rojo (#F92424) */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Macrociclo anual · 13 mesociclos
          </p>

          {/* Barra segmentada de 13 mesociclos */}
          <div className="flex gap-1.5 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((mesoNum) => {
              // Regla de color NEYIMA: Mesociclo actual activo en rojo (#F92424), pasados en done, futuros en todo
              const isDone = mesoNum < 4;
              const isCurrent = mesoNum === 4;

              return (
                <div
                  key={mesoNum}
                  title={`Mesociclo ${mesoNum}${isCurrent ? ' (Actual)' : ''}`}
                  className="flex-1 h-3.5 rounded-full transition-transform hover:scale-105"
                  style={{
                    backgroundColor: isCurrent
                      ? 'var(--rojo, #F92424)'
                      : isDone
                      ? 'var(--done)'
                      : 'var(--todo)',
                  }}
                />
              );
            })}
          </div>

          <p className="text-xs text-[var(--mut)]">
            Mesociclo actual en <b className="text-[var(--rojo)]">rojo (#F92424)</b> · próximo:{' '}
            <span className="font-bold text-[var(--txt)]">Fuerza Potencia (M05)</span>
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onAbrirPlanificador}
          className="font-extrabold whitespace-nowrap self-stretch md:self-auto min-h-[48px]"
        >
          Abrir planificador
        </Button>
      </div>
    </div>
  );
};
