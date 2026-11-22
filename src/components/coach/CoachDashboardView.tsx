// =====================================================================
// NEYIMA ATHLETIC - PANEL DEL COACH (DASHBOARD GENERAL Y POR CLUBES)
// DISEÑO EXACTO FIEL A MOCKUPS NEYIMA (13 MESOCICLOS CON ACTIVO EN ROJO)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { calcularFaseCicloActual } from '../../utils/trainingMath';
import { IndicatorStatus } from '../ui/IndicatorStatus';
import { Button } from '../ui/Button';
import { IconInterface } from '../ui/icons/IconInterface';
import { IconDiscipline, type DisciplineName } from '../ui/icons/IconDiscipline';

interface CoachDashboardViewProps {
  onAbrirPlanificador?: () => void;
  onVerAlertas?: () => void;
  onIrAAtletas?: () => void;
  onSeleccionarAtleta?: (atletaId: string) => void;
}

function mapDeporteToDiscipline(deporte: string): DisciplineName {
  const lower = deporte.toLowerCase();
  if (lower.includes('run')) return 'running';
  if (lower.includes('nat')) return 'natacion';
  if (lower.includes('fuerza')) return 'fuerza';
  return 'equipo';
}

export const CoachDashboardView: React.FC<CoachDashboardViewProps> = ({
  onAbrirPlanificador,
  onVerAlertas,
  onIrAAtletas,
  onSeleccionarAtleta,
}) => {
  const { atletas, clubes, testsFuerza, historialSesiones, setAtletaSeleccionadoId } = useTraining();
  const [filtroClub, setFiltroClub] = useState<string>('TODOS');
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>('Todas');

  const disciplinasDisponibles = ['Todas', 'Básquetbol', 'Fútbol', 'Running', 'Natación', 'Fuerza'];

  const atletasFiltrados = atletas.filter((a) => {
    const coincideClub =
      filtroClub === 'TODOS' || a.identificadorEquipoPerteneciente === filtroClub;
    const coincideDisciplina =
      filtroDisciplina === 'Todas' ||
      a.deportePracticado.toLowerCase().includes(filtroDisciplina.toLowerCase());
    return coincideClub && coincideDisciplina;
  });

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
            Panel del coach · {filtroClub === 'TODOS' ? `${clubes.length} clubes activos` : filtroClub}
          </p>
          <h1 className="text-3xl font-extrabold text-[var(--txt)] tracking-tight">
            Hola, Coach
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onIrAAtletas}
          className="font-extrabold self-start sm:self-auto"
        >
          + Nuevo atleta / Club
        </Button>
      </div>

      {/* Selector rápido de Clubes del Coach */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setFiltroClub('TODOS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            filtroClub === 'TODOS'
              ? 'bg-[var(--navbg)] text-[var(--navon)]'
              : 'border border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)]'
          }`}
        >
          Todos los clubes ({atletas.length})
        </button>
        {clubes.map((club) => {
          const count = atletas.filter((a) => a.identificadorEquipoPerteneciente === club).length;
          return (
            <button
              key={club}
              type="button"
              onClick={() => setFiltroClub(club)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                filtroClub === club
                  ? 'bg-[var(--navbg)] text-[var(--navon)]'
                  : 'border border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)]'
              }`}
            >
              {club} ({count})
            </button>
          );
        })}
      </div>

      {/* 4 KPIs Clave reactivos al Club */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Atletas en vista
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">
            {String(atletasFiltrados.length).padStart(2, '0')}
          </p>
          <p className="text-xs text-[var(--mut)] mt-0.5">
            {atletasFiltrados.filter((a) => a.generoAtleta === 'F').length} F ·{' '}
            {atletasFiltrados.filter((a) => a.generoAtleta === 'M').length} M
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Clubes gestionados
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">
            {String(clubes.length).padStart(2, '0')}
          </p>
          <p className="text-xs text-[var(--mut)] mt-0.5">planteles activos</p>
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
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">94%</p>
          <p className="text-xs text-[var(--mut)] mt-0.5">evolución semanal</p>
        </div>
      </div>

      {/* Grilla Principal: Tabla de evolución por Club (2.1fr) + Alertas (1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Tabla Mis Atletas y Evolución por Club */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--bord)] pb-2.5">
            <div>
              <h2 className="text-lg font-extrabold text-[var(--txt)]">
                Evolución por Club y Atleta
              </h2>
              <p className="text-xs text-[var(--mut)]">
                Seguimiento de 1RM, carga UA y validación de fase lútea (F/M)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="filtro-dis" className="text-xs font-bold text-[var(--mut)]">
                Deporte
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
                  <th className="py-2 pr-3">Club / Deporte</th>
                  <th className="py-2 pr-3">Sexo / Ciclo</th>
                  <th className="py-2 pr-3">1RM / Carga</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bord)]">
                {atletasFiltrados.map((a) => {
                  const testSq = testsFuerza.find(
                    (t) =>
                      t.identificadorAtleta === a.identificadorAtleta &&
                      t.identificadorEjercicioBase === 'EX0001'
                  );
                  const sesionesA = historialSesiones.filter(
                    (s) => s.identificadorAtleta === a.identificadorAtleta
                  );
                  const cargaUA =
                    sesionesA.reduce((acc, s) => acc + s.cargaInternaUnidadesArbitrarias, 0) || 520;

                  const infoCiclo =
                    a.generoAtleta === 'F' && a.datosCicloMenstrual?.activo
                      ? calcularFaseCicloActual(
                          a.datosCicloMenstrual.fechaUltimaMenstruacion,
                          a.datosCicloMenstrual.duracionPromedioCicloDias,
                          a.datosCicloMenstrual.duracionPromedioMenstruacionDias
                        )
                      : null;

                  const tieneLesionActiva = a.historialLesiones.some(
                    (l) => l.estadoLesion !== 'RECUPERADA'
                  );

                  return (
                    <tr key={a.identificadorAtleta} className="hover:bg-[var(--bg)]/40 transition">
                      <td className="py-2.5 pr-3 font-bold text-[var(--txt)] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--okbg)] text-[var(--oktx)] flex items-center justify-center font-extrabold text-xs">
                            {a.nombreCompleto.charAt(0)}
                          </div>
                          <div>
                            <span className="block">{a.nombreCompleto}</span>
                            <span className="block text-xs text-[var(--mut)]">
                              {a.identificadorAtleta} · M04
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 pr-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <IconDiscipline
                            discipline={mapDeporteToDiscipline(a.deportePracticado)}
                            size={24}
                            rounded={true}
                          />
                          <div>
                            <span className="block text-xs font-extrabold text-[var(--txt)]">
                              {a.identificadorEquipoPerteneciente || 'Sin club'}
                            </span>
                            <span className="block text-xs text-[var(--mut)]">
                              {a.deportePracticado}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 pr-3 text-xs whitespace-nowrap">
                        {a.generoAtleta === 'F' ? (
                          <div>
                            <span className="font-extrabold text-[var(--txt)]">
                              F · {infoCiclo ? `Día ${infoCiclo.diaActualDelCiclo}` : 'Ciclo'}
                            </span>
                            <span className="block text-[var(--mut)]">
                              {infoCiclo?.faseActual === 'LUTEA'
                                ? 'Lútea (−7,5 %)'
                                : infoCiclo?.nombreFaseLegible || '100 %'}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-extrabold text-[var(--txt)]">M · Masculino</span>
                            <span className="block text-[var(--mut)]">Carga 100 %</span>
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 pr-3 text-xs font-bold text-[var(--txt)] font-mono whitespace-nowrap">
                        <span className="block">
                          1RM: {testSq ? `${testSq.unaRepeticionMaximaEfectiva} kg` : '—'}
                        </span>
                        <span className="block text-[var(--mut)]">{cargaUA} UA</span>
                      </td>

                      <td className="py-2.5 pr-3 whitespace-nowrap">
                        <IndicatorStatus
                          status={tieneLesionActiva ? 'warn' : 'ok'}
                          label={tieneLesionActiva ? 'Revisar' : 'En plan'}
                          size="sm"
                        />
                      </td>

                      <td className="py-2.5 text-right whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAbrirAtleta(a.identificadorAtleta)}
                          className="font-bold py-1 px-3 min-h-[36px]"
                        >
                          Ficha
                        </Button>
                      </td>
                    </tr>
                  );
                })}
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
                  <p className="font-bold text-[var(--txt)]">Sofía Rodríguez (Club Obras)</p>
                  <p className="text-[var(--mut)]">Sobrecarga tendón rotuliano izquierdo</p>
                </div>
              </div>

              <div className="py-2.5 flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[var(--estado-warn-fondo)] text-[var(--estado-warn-texto)] flex items-center justify-center shrink-0">
                  <IconInterface name="drop" size={14} />
                </span>
                <div>
                  <p className="font-bold text-[var(--txt)]">Sofía Rodríguez (F · Día 24)</p>
                  <p className="text-[var(--mut)]">Fase lútea activa: ajuste −7,5 % aplicado</p>
                </div>
              </div>

              <div className="py-2.5 flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[var(--okbg)] text-[var(--oktx)] flex items-center justify-center shrink-0">
                  <IconInterface name="clock" size={14} />
                </span>
                <div>
                  <p className="font-bold text-[var(--txt)]">Lucas Gómez (Club River Plate)</p>
                  <p className="text-[var(--mut)]">Evaluación de 1RM programada esta semana</p>
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

          <div className="flex gap-1.5 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((mesoNum) => {
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
