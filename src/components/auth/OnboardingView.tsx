// =====================================================================
// NEYIMA ATHLETIC - ONBOARDING Y PERSONALIZACIÓN DE PERFIL
// CONECTA CON GOOGLE OAUTH Y CONFIGURA EL ROL (COACH / ALUMNO)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { NeyimaLogo } from '../ui/NeyimaLogo';
import { IconInterface } from '../ui/icons/IconInterface';
import { IconDiscipline, type DisciplineName } from '../ui/icons/IconDiscipline';

interface OnboardingProps {
  onFinalizado?: () => void;
}

export const OnboardingView: React.FC<OnboardingProps> = ({ onFinalizado }) => {
  const { rolActivo, setRolActivo, completarPerfil, atletaActual, usuarioEmail } = useTraining();

  const [rolSeleccionado, setRolSeleccionado] = useState<'COACH' | 'ALUMNO'>(rolActivo);
  
  // Datos comunes
  const [nombre, setNombre] = useState(atletaActual?.nombreCompleto || 'Sofía Rodríguez');
  
  // Datos de Alumno
  const [deporte, setDeporte] = useState<DisciplineName>('equipo');
  const [posicion, setPosicion] = useState('Alera titular');
  const [genero, setGenero] = useState<'F' | 'M' | 'OTRO'>('F');
  const [fechaNacimiento, setFechaNacimiento] = useState('2004-03-15');
  const [peso, setPeso] = useState(68.5);
  const [altura, setAltura] = useState(178);
  const [diasEntreno, setDiasEntreno] = useState(4);
  const [codigoCoach, setCodigoCoach] = useState('COACH-NEYIMA-77');
  
  // Ciclo Menstrual (opcional si F)
  const [monitorearCiclo, setMonitorearCiclo] = useState(true);
  const [fum, setFum] = useState('2026-09-01');
  const [duracionCiclo, setDuracionCiclo] = useState(28);
  const [compartirCiclo, setCompartirCiclo] = useState(true);

  // Datos de Coach
  const [institucion, setInstitucion] = useState('Club Deportivo');
  const [especialidad, setEspecialidad] = useState('Preparación Física y Fuerza');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRolActivo(rolSeleccionado);

    if (rolSeleccionado === 'ALUMNO') {
      completarPerfil({
        nombreCompleto: nombre,
        deportePracticado: deporte === 'equipo' ? 'Básquetbol' : deporte.toUpperCase(),
        posicionEnElCampoDeJuego: posicion,
        generoAtleta: genero,
        fechaNacimiento,
        pesoCorporalKilogramos: Number(peso),
        alturaCentimetros: Number(altura),
        diasDisponiblesParaEntrenarPorSemana: Number(diasEntreno),
        datosCicloMenstrual: genero === 'F' && monitorearCiclo ? {
          activo: true,
          fechaUltimaMenstruacion: fum,
          duracionPromedioCicloDias: Number(duracionCiclo),
          duracionPromedioMenstruacionDias: 5,
          enRetrasoMenstrual: false,
          compartirCicloConCoach: compartirCiclo,
          aplicarAjusteHormonalAutomatico: true,
        } : undefined,
      });
    } else {
      completarPerfil({
        nombreCompleto: nombre,
      });
    }

    if (onFinalizado) {
      onFinalizado();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--txt)] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-[var(--surf)] border border-[var(--bord)] rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-6">
          <NeyimaLogo size="md" variant="lockup" roleTag={rolSeleccionado} />
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-4 tracking-tight">
            Completá tu perfil
          </h1>
          <p className="text-xs sm:text-sm text-[var(--mut)] mt-1">
            Conectado como <b className="text-[var(--txt)]">{usuarioEmail}</b>
          </p>
        </div>

        {/* Selector de Rol */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRolSeleccionado('ALUMNO')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
              rolSeleccionado === 'ALUMNO'
                ? 'border-[var(--navbg)] bg-[var(--bg)] text-[var(--txt)] font-bold shadow-xs'
                : 'border-[var(--bord)] bg-transparent text-[var(--mut)] opacity-70 hover:opacity-100'
            }`}
          >
            <IconInterface name="users" size={24} strokeWidth={2.2} />
            <span className="text-sm font-bold mt-1.5">Soy Atleta</span>
            <span className="text-xs text-[var(--mut)]">Entreno y registro mis cargas</span>
          </button>

          <button
            type="button"
            onClick={() => setRolSeleccionado('COACH')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
              rolSeleccionado === 'COACH'
                ? 'border-[var(--navbg)] bg-[var(--bg)] text-[var(--txt)] font-bold shadow-xs'
                : 'border-[var(--bord)] bg-transparent text-[var(--mut)] opacity-70 hover:opacity-100'
            }`}
          >
            <IconInterface name="users" size={24} strokeWidth={2.2} />
            <span className="text-sm font-bold mt-1.5">Soy Coach</span>
            <span className="text-xs text-[var(--mut)]">Planifico y monitoreo atletas</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label htmlFor="onb-nombre" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
              Nombre Completo
            </label>
            <input
              id="onb-nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] font-medium text-sm focus:border-[var(--link)] outline-hidden"
            />
          </div>

          {/* Formulario específico según rol */}
          {rolSeleccionado === 'COACH' ? (
            <div className="space-y-3 pt-2 border-t border-[var(--bord)]">
              <div>
                <label htmlFor="onb-inst" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                  Institución o Club
                </label>
                <input
                  id="onb-inst"
                  type="text"
                  value={institucion}
                  onChange={(e) => setInstitucion(e.target.value)}
                  placeholder="Ej. Club Atlético, Gimnasio Alto Rendimiento..."
                  className="w-full h-11 px-3.5 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] font-medium text-sm focus:border-[var(--link)] outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="onb-esp" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                  Especialidad deportiva
                </label>
                <input
                  id="onb-esp"
                  type="text"
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  placeholder="Ej. Fuerza y Potencia, Deportes de Equipo..."
                  className="w-full h-11 px-3.5 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] font-medium text-sm focus:border-[var(--link)] outline-hidden"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--bord)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">Tu código de invitación</span>
                <p className="text-sm font-extrabold text-[var(--txt)] mt-0.5 tracking-wider">COACH-NEYIMA-77</p>
                <p className="text-xs text-[var(--mut)] mt-1">
                  Compartí este código con tus atletas para que se vinculen a tu panel.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-[var(--bord)]">
              {/* Disciplina */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1.5">
                  Disciplina Principal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['running', 'fuerza', 'natacion', 'equipo'] as DisciplineName[]).map((disc) => (
                    <button
                      key={disc}
                      type="button"
                      onClick={() => setDeporte(disc)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border-2 transition-all cursor-pointer ${
                        deporte === disc
                          ? 'border-[var(--navbg)] bg-[var(--bg)] font-bold text-[var(--txt)] shadow-2xs'
                          : 'border-[var(--bord)] bg-transparent text-[var(--mut)] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <IconDiscipline discipline={disc} size={22} />
                      <span className="text-xs font-bold capitalize mt-1">{disc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posición, Género y Fecha Nacimiento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label htmlFor="onb-pos" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                    Posición
                  </label>
                  <input
                    id="onb-pos"
                    type="text"
                    value={posicion}
                    onChange={(e) => setPosicion(e.target.value)}
                    placeholder="Ej. Alera, 5K..."
                    className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm focus:border-[var(--link)] outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="onb-gen" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                    Género
                  </label>
                  <select
                    id="onb-gen"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value as 'F' | 'M' | 'OTRO')}
                    className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm focus:border-[var(--link)] outline-hidden"
                  >
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="onb-fn" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                    F. Nacimiento
                  </label>
                  <input
                    id="onb-fn"
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="w-full h-11 px-2.5 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-xs focus:border-[var(--link)] outline-hidden"
                  />
                </div>
              </div>

              {/* Peso, Altura, Días */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="onb-peso" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                    Peso (kg)
                  </label>
                  <input
                    id="onb-peso"
                    type="number"
                    step="0.5"
                    value={peso}
                    onChange={(e) => setPeso(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="onb-alt" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                    Altura (cm)
                  </label>
                  <input
                    id="onb-alt"
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="onb-dias" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                    Días / sem
                  </label>
                  <input
                    id="onb-dias"
                    type="number"
                    min="1"
                    max="7"
                    value={diasEntreno}
                    onChange={(e) => setDiasEntreno(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm outline-hidden"
                  />
                </div>
              </div>

              {/* Código Coach */}
              <div>
                <label htmlFor="onb-coachcode" className="block text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1">
                  Código de Vinculación con tu Coach
                </label>
                <input
                  id="onb-coachcode"
                  type="text"
                  value={codigoCoach}
                  onChange={(e) => setCodigoCoach(e.target.value)}
                  placeholder="Ej. COACH-NEYIMA-77"
                  className="w-full h-11 px-3.5 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-sm outline-hidden"
                />
              </div>

              {/* Sección Privada de Ciclo Menstrual si Femenino */}
              {genero === 'F' && (
                <div className="p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--bord)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--txt)]">Monitoreo Fisiológico del Ciclo</span>
                      <p className="text-xs text-[var(--mut)]">Ajuste automático de cargas (-7.5% en fase lútea)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={monitorearCiclo}
                      onChange={(e) => setMonitorearCiclo(e.target.checked)}
                      className="h-4 w-4 rounded accent-[var(--navbg)] cursor-pointer"
                    />
                  </div>

                  {monitorearCiclo && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--bord)]">
                      <div>
                        <label htmlFor="onb-fum" className="block text-xs font-bold text-[var(--mut)] mb-1">
                          Última menstruación
                        </label>
                        <input
                          id="onb-fum"
                          type="date"
                          value={fum}
                          onChange={(e) => setFum(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-[var(--bord)] bg-[var(--surf)] text-xs text-[var(--txt)]"
                        />
                      </div>
                      <div>
                        <label htmlFor="onb-dur" className="block text-xs font-bold text-[var(--mut)] mb-1">
                          Duración promedio (días)
                        </label>
                        <input
                          id="onb-dur"
                          type="number"
                          value={duracionCiclo}
                          onChange={(e) => setDuracionCiclo(Number(e.target.value))}
                          className="w-full h-9 px-2 rounded-lg border border-[var(--bord)] bg-[var(--surf)] text-xs text-[var(--txt)]"
                        />
                      </div>
                      <div className="col-span-2 pt-1 flex items-center justify-between">
                        <span className="text-xs text-[var(--mut)] font-bold">Compartir con mi entrenador</span>
                        <input
                          type="checkbox"
                          checked={compartirCiclo}
                          onChange={(e) => setCompartirCiclo(e.target.checked)}
                          className="h-3.5 w-3.5 rounded accent-[var(--navbg)] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="w-full min-h-[48px] mt-6 rounded-xl border-0 bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 transition cursor-pointer"
          >
            <IconInterface name="check" size={18} strokeWidth={2.5} />
            <span>Completar perfil y comenzar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
