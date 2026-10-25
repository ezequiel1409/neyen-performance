// =====================================================================
// NEYEN ATHLETIC PERFORMANCE OS - PANTALLA DE LOGIN
// DISEÑO FIEL AL MOCKUP (IMAGEN 2) & SISTEMA DE DISEÑO (IMAGEN 3)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { NeyenLogo } from '../ui/NeyenLogo';

export const LoginView: React.FC = () => {
  const { iniciarSesion } = useTraining();
  const [rolSeleccionado, setRolSeleccionado] = useState<'ALUMNO' | 'COACH'>('ALUMNO');
  const [email, setEmail] = useState<string>('mateo@neyen.com');
  const [password, setPassword] = useState<string>('password123');

  const handleCambiarRol = (nuevoRol: 'ALUMNO' | 'COACH') => {
    setRolSeleccionado(nuevoRol);
    setEmail(nuevoRol === 'ALUMNO' ? 'mateo@neyen.com' : 'coach@neyen.com');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    iniciarSesion(rolSeleccionado, email);
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0F231D]">
      {/* Columna Izquierda: Formulario de inicio de sesión */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 max-w-xl mx-auto lg:mx-0">
        <div>
          {/* Logo NEYEN */}
          <div className="mb-10 sm:mb-12">
            <NeyenLogo size="md" subtitle="Performance OS" />
          </div>

          {/* Título de bienvenida */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D2B24] dark:text-white tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-[#1D2B24]/70 dark:text-[#9EB5B0] font-medium mt-1.5">
              Ingresá para ver tu plan de entrenamiento.
            </p>
          </div>

          {/* Selector de Rol: Alumno vs Coach */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleCambiarRol('ALUMNO')}
              className={`py-3 px-4 rounded-2xl font-bold text-sm transition select-none min-h-[48px] ${
                rolSeleccionado === 'ALUMNO'
                  ? 'bg-[#2F6B4F] text-white shadow-sm'
                  : 'border-2 border-[#2F6B4F] text-[#2F6B4F] dark:text-white bg-transparent hover:bg-[#E3EFE7]/40'
              }`}
            >
              Alumno
            </button>
            <button
              type="button"
              onClick={() => handleCambiarRol('COACH')}
              className={`py-3 px-4 rounded-2xl font-bold text-sm transition select-none min-h-[48px] ${
                rolSeleccionado === 'COACH'
                  ? 'bg-[#2F6B4F] text-white shadow-sm'
                  : 'border-2 border-[#2F6B4F] text-[#2F6B4F] dark:text-white bg-transparent hover:bg-[#E3EFE7]/40'
              }`}
            >
              Coach
            </button>
          </div>

          {/* Tip de acceso rápido demo */}
          <div className="mb-6 rounded-xl bg-[#E3EFE7] dark:bg-[#15332B] px-3.5 py-2 text-xs font-semibold text-[#2F6B4F] dark:text-[#A3D9BE] flex items-center gap-2">
            <span>✨</span>
            <span>Acceso demo listo: hacé clic directo en <strong>Ingresar</strong>.</span>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="correo"
                className="block text-xs font-bold text-[#1D2B24] dark:text-[#FAF7EE] mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className="w-full rounded-2xl border-2 border-slate-300 dark:border-[#244E43] bg-white dark:bg-[#15332B] px-4 py-3.5 text-sm text-[#1D2B24] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] transition min-h-[48px]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-[#1D2B24] dark:text-[#FAF7EE] mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full rounded-2xl border-2 border-slate-300 dark:border-[#244E43] bg-white dark:bg-[#15332B] px-4 py-3.5 text-sm text-[#1D2B24] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F5FA0] transition min-h-[48px]"
              />
              <div className="text-right mt-2">
                <a
                  href="#olvide-contrasena"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Podés solicitar a tu Coach el restablecimiento de tu clave o enlace de acceso.');
                  }}
                  className="text-xs font-bold text-[#1F5FA0] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-base py-4 shadow-md transition min-h-[48px]"
            >
              Ingresar
            </button>
          </form>

          {/* Enlace de registro / acceso */}
          <div className="mt-8 text-center text-xs text-[#1D2B24]/70 dark:text-[#9EB5B0]">
            <span>¿Primera vez? </span>
            <a
              href="#pedir-acceso"
              onClick={(e) => {
                e.preventDefault();
                alert('Contactá a tu preparador físico para que active tu usuario y plan en NEYEN.');
              }}
              className="font-bold text-[#1F5FA0] hover:underline"
            >
              Pedí acceso a tu coach
            </a>
          </div>
        </div>

        {/* Footer legal */}
        <p className="text-[11px] text-[#1D2B24]/40 dark:text-[#9EB5B0]/40 text-center mt-12">
          NEYEN Athletic Performance OS • Versión 2.0
        </p>
      </div>

      {/* Columna Derecha: Ilustración y frase de marca (Fondo Menta #E3EFE7) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E3EFE7] dark:bg-[#112922] relative flex-col justify-between p-16 overflow-hidden">
        {/* Composición de círculos abstractos suaves según el diseño */}
        <div className="relative w-full h-80 my-auto">
          {/* Círculo Menta suave grande */}
          <div className="absolute right-10 top-0 w-80 h-80 rounded-full bg-[#D2E7DB] dark:bg-[#16382E] opacity-90" />
          {/* Círculo Cielo #DCE9F4 */}
          <div className="absolute right-32 top-12 w-64 h-64 rounded-full bg-[#DCE9F4] dark:bg-[#1B3E4F] opacity-95 shadow-sm" />
          {/* Círculo Arena #F4C98B (punto-sol cálido) */}
          <div className="absolute right-20 top-6 w-28 h-28 rounded-full bg-[#F4C98B] opacity-90 shadow-sm" />
        </div>

        {/* Frase de marca y badges de pilares metodológicos */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#1D2B24] dark:text-white tracking-tight leading-tight">
            Entrená con plan.
            <br />
            Recuperá con datos.
          </h2>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white dark:bg-[#15332B] text-[#1D2B24] dark:text-white font-bold text-xs px-5 py-2.5 shadow-sm">
              Cargas por %1RM
            </span>
            <span className="rounded-full bg-white dark:bg-[#15332B] text-[#1D2B24] dark:text-white font-bold text-xs px-5 py-2.5 shadow-sm">
              Sueño y HRV
            </span>
            <span className="rounded-full bg-white dark:bg-[#15332B] text-[#1D2B24] dark:text-white font-bold text-xs px-5 py-2.5 shadow-sm">
              Progreso visible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
