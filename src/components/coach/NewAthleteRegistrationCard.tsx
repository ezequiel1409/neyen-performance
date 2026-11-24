// =====================================================================
// NEYIMA ATHLETIC - FORMULARIO DE ALTA DE ATLETA CON VALIDACIÓN M/F Y CLUB
// RESPONSABILIDAD ÚNICA: Registro validado de atleta, club y fase lútea
// =====================================================================

import React, { useState } from 'react';
import { Atleta, GeneroAtleta } from '../../types';
import { calcularFaseCicloActual } from '../../utils/trainingMath';
import { AlertBanner } from '../ui/AlertBanner';

interface NewAthleteRegistrationCardProps {
  totalAtletas: number;
  clubes: string[];
  onAgregarClub: (nombreClub: string) => void;
  onCrearAtleta: (nuevoAtleta: Atleta) => void;
}

export const NewAthleteRegistrationCard: React.FC<NewAthleteRegistrationCardProps> = ({
  totalAtletas,
  clubes,
  onAgregarClub,
  onCrearAtleta,
}) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [genero, setGenero] = useState<GeneroAtleta>('F');
  const [clubSeleccionado, setClubSeleccionado] = useState<string>(clubes[0] || 'Club Atlético Obras');
  const [modoNuevoClub, setModoNuevoClub] = useState<boolean>(false);
  const [nuevoClubNombre, setNuevoClubNombre] = useState<string>('');
  const [deporte, setDeporte] = useState('Básquetbol');
  const [nivel, setNivel] = useState<'Inicial' | 'Intermedio' | 'Avanzado' | 'Competitivo'>('Competitivo');
  const [pesoKg, setPesoKg] = useState<string>('68');
  const [alturaCm, setAlturaCm] = useState<string>('175');

  // Parámetros de validación fisiológica femenina (Fase Lútea)
  const [fum, setFum] = useState<string>(
    () => new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [duracionCiclo, setDuracionCiclo] = useState<number>(28);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const [hoyStr] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Cálculo en vivo de fase menstrual si es F
  const previewCiclo =
    genero === 'F' && fum ? calcularFaseCicloActual(fum, duracionCiclo, 5) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);
    setMensajeExito(null);

    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length < 3) {
      setErrorValidacion('Ingresá el nombre y apellido completo (mínimo 3 caracteres).');
      return;
    }

    if (genero !== 'F' && genero !== 'M') {
      setErrorValidacion('Debés indicar si el sexo biológico es Femenino (F) o Masculino (M).');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorValidacion('Ingresá un correo electrónico válido o dejalo vacío.');
      return;
    }

    const pesoNum = parseFloat(pesoKg);
    const alturaNum = parseFloat(alturaCm);
    if (isNaN(pesoNum) || pesoNum < 30 || pesoNum > 220) {
      setErrorValidacion('El peso corporal debe estar entre 30 kg y 220 kg.');
      return;
    }
    if (isNaN(alturaNum) || alturaNum < 120 || alturaNum > 235) {
      setErrorValidacion('La altura debe estar entre 120 cm y 235 cm.');
      return;
    }

    let clubFinal: string | undefined =
      clubSeleccionado === 'PERSONALIZADO' ? undefined : clubSeleccionado;
    if (modoNuevoClub) {
      if (nuevoClubNombre.trim().length < 3) {
        setErrorValidacion('El nombre del nuevo club debe tener al menos 3 caracteres.');
        return;
      }
      clubFinal = nuevoClubNombre.trim();
      onAgregarClub(clubFinal);
    }

    if (genero === 'F') {
      if (!fum || fum > hoyStr) {
        setErrorValidacion('La Fecha de Última Menstruación (FUM) no puede ser futura.');
        return;
      }
      if (duracionCiclo < 21 || duracionCiclo > 38) {
        setErrorValidacion('La duración fisiológica del ciclo debe estar entre 21 y 38 días.');
        return;
      }
    }

    const nuevoId = `AL000${totalAtletas + 1}`;
    const nuevoAtleta: Atleta = {
      identificadorAtleta: nuevoId,
      nombreCompleto: nombreLimpio,
      generoAtleta: genero,
      fechaNacimiento: '2002-05-15',
      edadCronologicaAnios: 24,
      alturaCentimetros: alturaNum,
      pesoCorporalKilogramos: pesoNum,
      deportePracticado: deporte,
      posicionEnElCampoDeJuego: 'Plantel Superior',
      nivelRendimientoDeportivo: nivel,
      objetivoPrincipalEntrenamiento: 'Fuerza, potencia y prevención de lesiones',
      diasDisponiblesParaEntrenarPorSemana: 4,
      historialLesiones: [],
      formulaCalculoRepeticionMaximaPreferida: 'EPLEY',
      identificadorEquipoPerteneciente: clubFinal,
      datosCicloMenstrual:
        genero === 'F'
          ? {
              activo: true,
              fechaUltimaMenstruacion: fum,
              duracionPromedioCicloDias: duracionCiclo,
              duracionPromedioMenstruacionDias: 5,
              enRetrasoMenstrual: false,
              diasDeRetraso: 0,
              historialRetrasosReportados: [],
            }
          : undefined,
    };

    onCrearAtleta(nuevoAtleta);
    setNombre('');
    setEmail('');
    setModoNuevoClub(false);
    setNuevoClubNombre('');
    setMensajeExito(
      `${nombreLimpio} (${genero}) registrado como ${clubFinal || 'Atleta Personalizado (1 a 1)'}${
        genero === 'F' ? ` · ${previewCiclo?.nombreFaseLegible}` : ''
      }`
    );
  };

  return (
    <div className="w-full lg:w-88 bg-[var(--surf)] border border-[var(--bord)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div>
        <h2 className="text-base sm:text-lg font-extrabold text-[var(--txt)]">
          Registrar atleta en Club
        </h2>
        <p className="text-xs text-[var(--mut)]">
          Define club y sexo biológico (M/F) para validación de fase lútea.
        </p>
      </div>

      {errorValidacion && (
        <AlertBanner
          status="bad"
          message={errorValidacion}
          onClose={() => setErrorValidacion(null)}
        />
      )}

      {mensajeExito && (
        <AlertBanner
          status="ok"
          message={mensajeExito}
          onClose={() => setMensajeExito(null)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {/* Sexo Biológico M / F obligatorio */}
        <div>
          <span className="block text-xs font-bold text-[var(--mut)] mb-1">
            Sexo biológico (Requerido para cálculo hormonal) *
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGenero('F')}
              aria-pressed={genero === 'F'}
              className={`h-11 rounded-xl font-extrabold text-xs border-2 transition cursor-pointer ${
                genero === 'F'
                  ? 'bg-[var(--navbg)] text-[var(--navon)] border-[var(--navbg)]'
                  : 'bg-[var(--bg)] text-[var(--txt)] border-[var(--bord)]'
              }`}
            >
              Femenino (F) · Ciclo
            </button>
            <button
              type="button"
              onClick={() => setGenero('M')}
              aria-pressed={genero === 'M'}
              className={`h-11 rounded-xl font-extrabold text-xs border-2 transition cursor-pointer ${
                genero === 'M'
                  ? 'bg-[var(--navbg)] text-[var(--navon)] border-[var(--navbg)]'
                  : 'bg-[var(--bg)] text-[var(--txt)] border-[var(--bord)]'
              }`}
            >
              Masculino (M)
            </button>
          </div>
        </div>

        {/* Validación condicional de Fase Lútea si es F */}
        {genero === 'F' ? (
          <div className="rounded-xl border border-[var(--bord)] bg-[var(--bg)] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[var(--txt)]">
                Validación Ciclo & Fase Lútea
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--okbg)] text-[var(--oktx)]">
                −7,5 % en lútea
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="reg-fum" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Último período (FUM)
                </label>
                <input
                  id="reg-fum"
                  type="date"
                  max={hoyStr}
                  value={fum}
                  onChange={(e) => setFum(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-[var(--bord)] bg-[var(--surf)] text-xs text-[var(--txt)]"
                />
              </div>
              <div>
                <label htmlFor="reg-ciclo" className="block text-xs font-bold text-[var(--mut)] mb-1">
                  Ciclo (21-38 días)
                </label>
                <input
                  id="reg-ciclo"
                  type="number"
                  min={21}
                  max={38}
                  value={duracionCiclo}
                  onChange={(e) => setDuracionCiclo(Number(e.target.value))}
                  className="w-full h-9 px-2 rounded-lg border border-[var(--bord)] bg-[var(--surf)] text-xs text-[var(--txt)]"
                />
              </div>
            </div>

            {previewCiclo && (
              <p className="text-xs font-bold text-[var(--mut)]">
                Estado actual: Día {previewCiclo.diaActualDelCiclo} ·{' '}
                <strong className="text-[var(--txt)]">{previewCiclo.nombreFaseLegible}</strong>
                {previewCiclo.faseActual === 'LUTEA' ? ' (Aplica −7,5 %)' : ' (100 % carga)'}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--bord)] bg-[var(--bg)] p-2.5 text-xs text-[var(--mut)] font-medium">
            Perfil Masculino (M): Sin módulo de ciclo menstrual ni descuento de fase lútea (100 % 1RM).
          </div>
        )}

        {/* Modalidad: Personalizado (1 a 1) o Club / Plantel */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="new-club" className="text-xs font-bold text-[var(--mut)]">
              Modalidad / Club *
            </label>
            <button
              type="button"
              onClick={() => setModoNuevoClub((prev) => !prev)}
              className="text-xs font-bold text-[var(--link)] underline cursor-pointer"
            >
              {modoNuevoClub ? 'Elegir de la lista' : '+ Crear club'}
            </button>
          </div>
          {modoNuevoClub ? (
            <input
              id="new-club"
              type="text"
              placeholder="Ej: Club Atlético Vélez"
              value={nuevoClubNombre}
              onChange={(e) => setNuevoClubNombre(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border-2 border-[var(--link)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
            />
          ) : (
            <select
              id="new-club"
              value={clubSeleccionado}
              onChange={(e) => setClubSeleccionado(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs font-bold text-[var(--txt)] outline-hidden"
            >
              <option value="PERSONALIZADO">Personalizado / Sin club (1 a 1)</option>
              <optgroup label="Clubes / Planteles">
                {clubes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            </select>
          )}
        </div>

        {/* Nombre y Email */}
        <div>
          <label htmlFor="new-nombre" className="block text-xs font-bold text-[var(--mut)] mb-1">
            Nombre y Apellido *
          </label>
          <input
            id="new-nombre"
            type="text"
            required
            placeholder="Ej: Martina Silva"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
          />
        </div>

        <div>
          <label htmlFor="new-email" className="block text-xs font-bold text-[var(--mut)] mb-1">
            Correo de sesión
          </label>
          <input
            id="new-email"
            type="email"
            placeholder="atleta@club.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
          />
        </div>

        {/* Peso, Altura, Deporte y Nivel */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="new-peso" className="block text-xs font-bold text-[var(--mut)] mb-1">
              Peso (kg) *
            </label>
            <input
              id="new-peso"
              type="number"
              step="0.5"
              min={30}
              max={220}
              value={pesoKg}
              onChange={(e) => setPesoKg(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
            />
          </div>
          <div>
            <label htmlFor="new-altura" className="block text-xs font-bold text-[var(--mut)] mb-1">
              Altura (cm) *
            </label>
            <input
              id="new-altura"
              type="number"
              min={120}
              max={235}
              value={alturaCm}
              onChange={(e) => setAlturaCm(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
            />
          </div>
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
              <option value="Básquetbol">Básquetbol</option>
              <option value="Fútbol">Fútbol</option>
              <option value="Running">Running</option>
              <option value="Natación">Natación</option>
              <option value="Rugby">Rugby</option>
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
              onChange={(e) =>
                setNivel(e.target.value as 'Inicial' | 'Intermedio' | 'Avanzado' | 'Competitivo')
              }
              className="w-full h-10 px-2 rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] text-xs text-[var(--txt)] outline-hidden"
            >
              <option value="Inicial">Inicial</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Competitivo">Competitivo</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full min-h-[46px] rounded-xl border-0 bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-xs sm:text-sm hover:opacity-95 transition cursor-pointer"
        >
          Guardar atleta en Club
        </button>
      </form>
    </div>
  );
};
