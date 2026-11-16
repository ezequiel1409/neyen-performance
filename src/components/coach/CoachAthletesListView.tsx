// =====================================================================
// NEYIMA ATHLETIC - LISTA DE ATLETAS (COACH)
// CORRESPONDE A atletas-claro.html / atletas-oscuro.html
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from '../ui/icons/IconInterface';
import { Atleta } from '../../types';

interface CoachAthletesListViewProps {
  onAbrirAtleta: (identificadorAtleta: string) => void;
}

export const CoachAthletesListView: React.FC<CoachAthletesListViewProps> = ({ onAbrirAtleta }) => {
  const { atletas, agregarAtleta, setAtletaSeleccionadoId } = useTraining();

  const [busqueda, setBusqueda] = useState('');
  const [deporteFiltro, setDeporteFiltro] = useState('TODOS');
  const [nivelFiltro, setNivelFiltro] = useState('TODOS');

  // Formulario nuevo atleta
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [deporte, setDeporte] = useState('Básquet');
  const [nivel, setNivel] = useState<'Inicial' | 'Intermedio' | 'Avanzado' | 'Competitivo'>('Intermedio');
  const [objetivo, setObjetivo] = useState('Preparación física deportiva');
  const [fechaInicio, setFechaInicio] = useState(() => new Date().toISOString().split('T')[0]);

  const atletasFiltrados = atletas.filter((atleta) => {
    const coincideTexto =
      atleta.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      atleta.identificadorAtleta.toLowerCase().includes(busqueda.toLowerCase());
    const coincideDeporte = deporteFiltro === 'TODOS' || atleta.deportePracticado === deporteFiltro;
    const coincideNivel = nivelFiltro === 'TODOS' || atleta.nivelRendimientoDeportivo === nivelFiltro;
    return coincideTexto && coincideDeporte && coincideNivel;
  });

  const handleCrearAtleta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevoId = `AL000${atletas.length + 1}`;
    const nuevoAtleta: Atleta = {
      identificadorAtleta: nuevoId,
      nombreCompleto: nombre.trim(),
      generoAtleta: 'OTRO',
      fechaNacimiento: '2000-01-01',
      edadCronologicaAnios: 24,
      alturaCentimetros: 175,
      pesoCorporalKilogramos: 70,
      deportePracticado: deporte,
      posicionEnElCampoDeJuego: 'General',
      nivelRendimientoDeportivo: nivel,
      objetivoPrincipalEntrenamiento: objetivo,
      diasDisponiblesParaEntrenarPorSemana: 4,
      historialLesiones: [],
      formulaCalculoRepeticionMaximaPreferida: 'EPLEY',
    };

    agregarAtleta(nuevoAtleta);
    setNombre('');
    setEmail('');
  };

  const handleSeleccionarYAbrir = (id: string) => {
    setAtletaSeleccionadoId(id);
    onAbrirAtleta(id);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">Lista de atletas</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Atletas</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Tabla y filtros */}
        <div className="flex-1 w-full bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
          {/* Barra de Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label htmlFor="search-atleta" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Buscar
              </label>
              <input
                id="search-atleta"
                type="text"
                placeholder="Nombre o ID"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm focus:border-[var(--link)] outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="filtro-deporte" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Deporte
              </label>
              <select
                id="filtro-deporte"
                value={deporteFiltro}
                onChange={(e) => setDeporteFiltro(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm outline-hidden"
              >
                <option value="TODOS">Todos</option>
                <option value="Básquet">Básquet</option>
                <option value="Fútbol">Fútbol</option>
                <option value="Rugby">Rugby</option>
                <option value="Running">Running</option>
              </select>
            </div>
            <div>
              <label htmlFor="filtro-nivel" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Nivel
              </label>
              <select
                id="filtro-nivel"
                value={nivelFiltro}
                onChange={(e) => setNivelFiltro(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm outline-hidden"
              >
                <option value="TODOS">Todos</option>
                <option value="Inicial">Inicial</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Competitivo">Competitivo</option>
              </select>
            </div>
          </div>

          {/* Listado / Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--bord)] text-[var(--mut)] uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-2.5 px-2">ID</th>
                  <th className="py-2.5 px-2">Nombre</th>
                  <th className="py-2.5 px-2">Deporte</th>
                  <th className="py-2.5 px-2">Nivel</th>
                  <th className="py-2.5 px-2">Estado</th>
                  <th className="py-2.5 px-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bord)]">
                {atletasFiltrados.map((atleta) => (
                  <tr key={atleta.identificadorAtleta} className="hover:bg-[var(--bg)]/50 transition">
                    <td className="py-3 px-2 font-extrabold">{atleta.identificadorAtleta}</td>
                    <td className="py-3 px-2 font-bold">{atleta.nombreCompleto}</td>
                    <td className="py-3 px-2 text-[var(--mut)]">{atleta.deportePracticado}</td>
                    <td className="py-3 px-2">{atleta.nivelRendimientoDeportivo}</td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCEBDD] text-[#1B5A37] dark:bg-[#1B5A37]/30 dark:text-[#7BD19F]">
                        <IconInterface name="check" size={12} strokeWidth={2.5} />
                        <span>En plan</span>
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleSeleccionarYAbrir(atleta.identificadorAtleta)}
                        className="px-3 py-1.5 rounded-xl border-2 border-[var(--link)] text-[var(--link)] hover:bg-[var(--link)] hover:text-white text-xs font-bold transition cursor-pointer"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel lateral: Nuevo atleta */}
        <div className="w-full lg:w-80 bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold mb-3">Nuevo atleta</h2>
          <form onSubmit={handleCrearAtleta} className="space-y-3">
            <div>
              <label htmlFor="new-nombre" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Nombre
              </label>
              <input
                id="new-nombre"
                type="text"
                required
                placeholder="Nombre y Apellido"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="new-email" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Correo electrónico
              </label>
              <input
                id="new-email"
                type="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="new-deporte" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Deporte
                </label>
                <select
                  id="new-deporte"
                  value={deporte}
                  onChange={(e) => setDeporte(e.target.value)}
                  className="w-full h-10 px-2 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
                >
                  <option value="Básquet">Básquet</option>
                  <option value="Fútbol">Fútbol</option>
                  <option value="Running">Running</option>
                  <option value="Natación">Natación</option>
                  <option value="Fuerza">Fuerza</option>
                </select>
              </div>
              <div>
                <label htmlFor="new-nivel" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Nivel
                </label>
                <select
                  id="new-nivel"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as 'Inicial' | 'Intermedio' | 'Avanzado' | 'Competitivo')}
                  className="w-full h-10 px-2 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
                >
                  <option value="Inicial">Inicial</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Competitivo">Competitivo</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="new-obj" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Objetivo
              </label>
              <input
                id="new-obj"
                type="text"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="new-fecha" className="block text-xs font-bold text-[var(--mut)] mb-1">
                Fecha de inicio
              </label>
              <input
                id="new-fecha"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[44px] rounded-xl border-0 bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-xs sm:text-sm hover:opacity-95 transition cursor-pointer"
            >
              Guardar atleta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
