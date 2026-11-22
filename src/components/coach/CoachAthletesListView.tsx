// =====================================================================
// NEYIMA ATHLETIC - DIRECTORIO DE CLUBES Y EVOLUCIÓN DE ATLETAS (COACH)
// Segmentación por Club (<select> escalable >10 clubes) o Personalizado (1 a 1)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { calcularFaseCicloActual } from '../../utils/trainingMath';
import { IconInterface } from '../ui/icons/IconInterface';
import { NewAthleteRegistrationCard } from './NewAthleteRegistrationCard';

interface CoachAthletesListViewProps {
  onAbrirAtleta: (identificadorAtleta: string) => void;
}

export const CoachAthletesListView: React.FC<CoachAthletesListViewProps> = ({ onAbrirAtleta }) => {
  const {
    atletas,
    agregarAtleta,
    setAtletaSeleccionadoId,
    clubes,
    agregarClub,
    testsFuerza,
    historialSesiones,
  } = useTraining();

  const [busqueda, setBusqueda] = useState('');
  const [clubFiltro, setClubFiltro] = useState<string>('TODOS');
  const [generoFiltro, setGeneroFiltro] = useState<'TODOS' | 'F' | 'M'>('TODOS');

  const totalPersonalizados = atletas.filter(
    (a) => !a.identificadorEquipoPerteneciente
  ).length;

  const atletasFiltrados = atletas.filter((atleta) => {
    const coincideTexto =
      atleta.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      atleta.identificadorAtleta.toLowerCase().includes(busqueda.toLowerCase()) ||
      (atleta.identificadorEquipoPerteneciente || 'personalizado')
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideClub =
      clubFiltro === 'TODOS'
        ? true
        : clubFiltro === 'PERSONALIZADO'
          ? !atleta.identificadorEquipoPerteneciente
          : atleta.identificadorEquipoPerteneciente === clubFiltro;

    const coincideGenero = generoFiltro === 'TODOS' || atleta.generoAtleta === generoFiltro;
    return coincideTexto && coincideClub && coincideGenero;
  });

  const handleSeleccionarYAbrir = (id: string) => {
    setAtletaSeleccionadoId(id);
    onAbrirAtleta(id);
  };

  const totalFemeninasClub = atletasFiltrados.filter((a) => a.generoAtleta === 'F').length;
  const totalMasculinosClub = atletasFiltrados.filter((a) => a.generoAtleta === 'M').length;

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">
            Gestión por planteles, personalizados (1 a 1) y evolución individual
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Clubes y Atletas
          </h1>
        </div>
      </div>

      {/* Resumen de Evolución del Grupo / Club Seleccionado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Grupo / Modalidad activa
          </span>
          <p className="text-lg font-extrabold text-[var(--txt)] mt-0.5 truncate">
            {clubFiltro === 'TODOS'
              ? 'Todos (Clubes y 1 a 1)'
              : clubFiltro === 'PERSONALIZADO'
                ? 'Personalizados / Sin club'
                : clubFiltro}
          </p>
          <span className="text-xs text-[var(--mut)]">
            {atletasFiltrados.length} integrante(s) en vista
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Distribución Biológica (M / F)
          </span>
          <p className="text-lg font-extrabold text-[var(--txt)] mt-0.5">
            {totalFemeninasClub} F · {totalMasculinosClub} M
          </p>
          <span className="text-xs text-[var(--mut)]">
            Validación hormonal activa en perfiles F
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Fuerza Media 1RM (Sentadilla)
          </span>
          <p className="text-lg font-extrabold text-[var(--txt)] mt-0.5 font-mono">
            {(() => {
              const rms = atletasFiltrados
                .map(
                  (a) =>
                    testsFuerza.find(
                      (t) =>
                        t.identificadorAtleta === a.identificadorAtleta &&
                        t.identificadorEjercicioBase === 'EX0001'
                    )?.unaRepeticionMaximaEfectiva || 0
                )
                .filter((v) => v > 0);
              if (rms.length === 0) return 'Sin tests';
              const prom = Math.round((rms.reduce((s, v) => s + v, 0) / rms.length) * 10) / 10;
              return `${prom} kg`;
            })()}
          </p>
          <span className="text-xs text-[var(--mut)]">Promedio del grupo seleccionado</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Tabla de Evolución por Club / Personalizado y Persona */}
        <div className="flex-1 w-full bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
          {/* Barra de Filtros con <select> escalable para >10 clubes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label htmlFor="search-atleta" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Buscar persona o club
              </label>
              <input
                id="search-atleta"
                type="text"
                placeholder="Nombre, ID o Club..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm focus:border-[var(--link)] outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="filtro-club" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Modalidad / Club ({clubes.length} clubes)
              </label>
              <select
                id="filtro-club"
                value={clubFiltro}
                onChange={(e) => setClubFiltro(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm font-bold outline-hidden"
              >
                <option value="TODOS">Todos (Clubes y Personalizados) ({atletas.length})</option>
                <option value="PERSONALIZADO">
                  Personalizados / Sin club (1 a 1) ({totalPersonalizados})
                </option>
                <optgroup label={`Clubes / Planteles (${clubes.length})`}>
                  {clubes.map((c) => {
                    const count = atletas.filter(
                      (a) => a.identificadorEquipoPerteneciente === c
                    ).length;
                    return (
                      <option key={c} value={c}>
                        {c} ({count})
                      </option>
                    );
                  })}
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="filtro-genero" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Sexo biológico (M / F)
              </label>
              <select
                id="filtro-genero"
                value={generoFiltro}
                onChange={(e) => setGeneroFiltro(e.target.value as 'TODOS' | 'F' | 'M')}
                className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm outline-hidden"
              >
                <option value="TODOS">Todos (F y M)</option>
                <option value="F">Femenino (F · Con Fase Lútea)</option>
                <option value="M">Masculino (M · Estándar)</option>
              </select>
            </div>
          </div>

          {/* Tabla de Evolución Individual */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--bord)] text-[var(--mut)] uppercase tracking-wider text-xs font-bold">
                  <th className="py-2.5 px-2">Atleta</th>
                  <th className="py-2.5 px-2">Modalidad / Club</th>
                  <th className="py-2.5 px-2">Sexo / Fase Lútea</th>
                  <th className="py-2.5 px-2">Evolución 1RM</th>
                  <th className="py-2.5 px-2">Carga / Peso</th>
                  <th className="py-2.5 px-2 text-right">Evolución</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bord)]">
                {atletasFiltrados.map((atleta) => {
                  const testSq = testsFuerza.find(
                    (t) =>
                      t.identificadorAtleta === atleta.identificadorAtleta &&
                      t.identificadorEjercicioBase === 'EX0001'
                  );
                  const testBp = testsFuerza.find(
                    (t) =>
                      t.identificadorAtleta === atleta.identificadorAtleta &&
                      t.identificadorEjercicioBase === 'EX0006'
                  );
                  const sesionesAtleta = historialSesiones.filter(
                    (s) => s.identificadorAtleta === atleta.identificadorAtleta
                  );
                  const cargaAcumuladaUA = sesionesAtleta.reduce(
                    (acc, s) => acc + s.cargaInternaUnidadesArbitrarias,
                    0
                  );

                  const infoCiclo =
                    atleta.generoAtleta === 'F' && atleta.datosCicloMenstrual?.activo
                      ? calcularFaseCicloActual(
                          atleta.datosCicloMenstrual.fechaUltimaMenstruacion,
                          atleta.datosCicloMenstrual.duracionPromedioCicloDias,
                          atleta.datosCicloMenstrual.duracionPromedioMenstruacionDias
                        )
                      : null;

                  return (
                    <tr
                      key={atleta.identificadorAtleta}
                      className="hover:bg-[var(--bg)]/50 transition"
                    >
                      <td className="py-3 px-2">
                        <b className="font-extrabold text-[var(--txt)] block">
                          {atleta.nombreCompleto}
                        </b>
                        <span className="text-xs text-[var(--mut)]">
                          {atleta.identificadorAtleta} · {atleta.deportePracticado}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-xs">
                        {atleta.identificadorEquipoPerteneciente ? (
                          <span className="font-extrabold text-[var(--txt)]">
                            {atleta.identificadorEquipoPerteneciente}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border border-[var(--bord)] bg-[var(--bg)] text-[var(--mut)]">
                            Personalizado (1 a 1)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-2">
                        {atleta.generoAtleta === 'F' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-[var(--okbg)] text-[var(--oktx)]">
                              <IconInterface name="drop" size={11} />
                              <span>
                                F · {infoCiclo ? `Día ${infoCiclo.diaActualDelCiclo}` : 'Ciclo'}
                              </span>
                            </span>
                            {infoCiclo?.faseActual === 'LUTEA' ? (
                              <span className="block text-xs font-bold text-[var(--estado-warn-texto)]">
                                Fase Lútea (−7,5 %)
                              </span>
                            ) : (
                              <span className="block text-xs text-[var(--mut)]">
                                {infoCiclo?.nombreFaseLegible || '100 % carga'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)]">
                            M · Estándar (100 %)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-2 font-mono text-xs">
                        <span className="block font-bold text-[var(--txt)]">
                          SQ: {testSq ? `${testSq.unaRepeticionMaximaEfectiva} kg` : '—'}
                        </span>
                        <span className="block text-[var(--mut)]">
                          BP: {testBp ? `${testBp.unaRepeticionMaximaEfectiva} kg` : '—'}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-xs">
                        <span className="font-bold text-[var(--txt)] block font-mono">
                          {cargaAcumuladaUA > 0 ? `${cargaAcumuladaUA} UA` : '480 UA'}
                        </span>
                        <span className="text-[var(--mut)]">
                          {atleta.pesoCorporalKilogramos} kg · {atleta.nivelRendimientoDeportivo}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleSeleccionarYAbrir(atleta.identificadorAtleta)}
                          className="px-3 py-1.5 rounded-xl border-2 border-[var(--link)] text-[var(--link)] hover:bg-[var(--link)] hover:text-white text-xs font-bold transition cursor-pointer"
                        >
                          Ver evolución
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel lateral: Registro de Nuevo Atleta con validación M/F y Club / Personalizado */}
        <NewAthleteRegistrationCard
          totalAtletas={atletas.length}
          clubes={clubes}
          onAgregarClub={agregarClub}
          onCrearAtleta={agregarAtleta}
        />
      </div>
    </div>
  );
};
