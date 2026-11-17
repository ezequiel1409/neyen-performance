// =====================================================================
// NEYIMA ATHLETIC PERFORMANCE OS - PANTALLA DE LOGIN
// DISEÑO EXACTO FIEL A MOCKUPS NEYIMA (loginb-claro / loginb-oscuro)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { NeyimaLogo } from '../ui/NeyimaLogo';
import { Button } from '../ui/Button';

export const LoginView: React.FC = () => {
  const { iniciarSesion } = useTraining();
  const [rolSeleccionado, setRolSeleccionado] = useState<'ALUMNO' | 'COACH'>('ALUMNO');
  const [email, setEmail] = useState<string>('mateo@neyima.com');
  const [password, setPassword] = useState<string>('password123');

  const handleCambiarRol = (nuevoRol: 'ALUMNO' | 'COACH') => {
    setRolSeleccionado(nuevoRol);
    setEmail(nuevoRol === 'ALUMNO' ? 'mateo@neyima.com' : 'coach@neyima.com');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    iniciarSesion(rolSeleccionado, email);
  };

  const handleGoogleLogin = () => {
    iniciarSesion(rolSeleccionado, email);
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--bg)] text-[var(--txt)] transition-colors">
      {/* Columna Izquierda: Formulario de inicio de sesión */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 max-w-xl mx-auto lg:mx-0">
        <div>
          {/* Logo NEYIMA con Emblema oficial */}
          <div className="mb-10 sm:mb-12">
            <NeyimaLogo size="md" variant="emblema" />
          </div>

          {/* Título de bienvenida */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--txt)] tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-base text-[var(--mut)] font-medium mt-1.5">
              Ingresá para ver tu plan de entrenamiento.
            </p>
          </div>

          {/* Selector de Rol: Alumno vs Coach */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleCambiarRol('ALUMNO')}
              aria-pressed={rolSeleccionado === 'ALUMNO'}
              className={`py-3 px-4 rounded-xl font-bold text-base transition select-none min-h-[48px] cursor-pointer ${
                rolSeleccionado === 'ALUMNO'
                  ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                  : 'border-2 border-[var(--link)] text-[var(--link)] bg-transparent hover:bg-[var(--surf)]'
              }`}
            >
              Alumno
            </button>
            <button
              type="button"
              onClick={() => handleCambiarRol('COACH')}
              aria-pressed={rolSeleccionado === 'COACH'}
              className={`py-3 px-4 rounded-xl font-bold text-base transition select-none min-h-[48px] cursor-pointer ${
                rolSeleccionado === 'COACH'
                  ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                  : 'border-2 border-[var(--link)] text-[var(--link)] bg-transparent hover:bg-[var(--surf)]'
              }`}
            >
              Coach
            </button>
          </div>

          {/* Botón de Google OAuth */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full min-h-[48px] rounded-xl border border-[var(--bord)] bg-[var(--surf)] hover:bg-[var(--bg)] text-[var(--txt)] font-bold text-sm flex items-center justify-center gap-3 transition shadow-xs cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.15 0 9.97 0 12s.45 3.85 1.25 5.43l4.03-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-[var(--bord)] w-full" />
            <span className="bg-[var(--bg)] px-3 text-xs font-bold text-[var(--mut)] uppercase tracking-wider absolute">
              o con correo
            </span>
          </div>

          {/* Formulario Tradicional */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="correo"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--txt)] mb-1"
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
                className="w-full rounded-xl border-2 border-[var(--field)] bg-[var(--surf)] px-3.5 py-2.5 text-sm text-[var(--txt)] placeholder-[var(--mut)] focus:outline-none focus:border-[var(--link)] transition min-h-[48px]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--txt)] mb-1"
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
                className="w-full rounded-xl border-2 border-[var(--field)] bg-[var(--surf)] px-3.5 py-2.5 text-sm text-[var(--txt)] placeholder-[var(--mut)] focus:outline-none focus:border-[var(--link)] transition min-h-[48px]"
              />
              <div className="text-right mt-1.5">
                <a
                  href="#olvide-contrasena"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Podés solicitar a tu Coach el restablecimiento de tu clave o enlace de acceso.');
                  }}
                  className="text-xs font-bold text-[var(--link)] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="font-extrabold text-base min-h-[52px] shadow-sm"
            >
              Ingresar
            </Button>
          </form>

          {/* Enlace de registro / acceso */}
          <div className="mt-6 text-center text-xs text-[var(--mut)]">
            <span>¿Primera vez? </span>
            <a
              href="#pedir-acceso"
              onClick={(e) => {
                e.preventDefault();
                alert('Contactá a tu preparador físico para que active tu usuario y plan en NEYIMA.');
              }}
              className="font-bold text-[var(--txt)] underline"
            >
              Pedí acceso a tu coach
            </a>
          </div>
        </div>

        {/* Footer legal */}
        <p className="text-xs text-[var(--mut)] text-center mt-8">
          NEYIMA Athletic Performance OS • Versión 2.0
        </p>
      </div>

      {/* Columna Derecha: Ilustración y composición geométrica de marca */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#3C0016] relative flex-col justify-end p-16 overflow-hidden select-none">
        {/* Composición de círculos de marca según diseño NEYIMA */}
        <div
          className="absolute w-[520px] h-[520px] rounded-full bg-[#5A1830] right-[-140px] top-[-120px]"
          aria-hidden="true"
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full bg-[#2A000F] right-[140px] top-[200px]"
          aria-hidden="true"
        />
        <div
          className="absolute w-[120px] h-[120px] rounded-full bg-[#F92424] right-[90px] top-[150px] shadow-lg"
          aria-hidden="true"
        />

        {/* Frase de marca y badges de pilares metodológicos */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#F1EADD] tracking-tight leading-tight max-w-lg">
            Entrená con plan.
            <br />
            Recuperá con datos.
          </h2>

          <div className="flex flex-wrap gap-2.5">
            <span className="rounded-full bg-[#FAF6EE] text-[#3C0016] font-bold text-xs px-4 py-2 shadow-sm">
              Cargas por %1RM
            </span>
            <span className="rounded-full bg-[#FAF6EE] text-[#3C0016] font-bold text-xs px-4 py-2 shadow-sm">
              Sueño y HRV
            </span>
            <span className="rounded-full bg-[#FAF6EE] text-[#3C0016] font-bold text-xs px-4 py-2 shadow-sm">
              Progreso visible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
