// =====================================================================
// NEYIMA ATHLETIC - CONTROL DE CARGA Y ACWR (ACUTE:CHRONIC WORKLOAD RATIO)
// =====================================================================

import React, { useState } from 'react';
import { IndicatorStatus } from '../ui/IndicatorStatus';
import { Button } from '../ui/Button';

interface LoadControlACWRViewProps {
  onVerTodasLasSesiones?: () => void;
}

export const LoadControlACWRView: React.FC<LoadControlACWRViewProps> = ({
  onVerTodasLasSesiones,
}) => {
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<string>('Lucía Fernández');

  const sesionesHistoricas = [
    {
      fecha: '27/09',
      micro: 'Micro 1 · Día 1',
      sesion: 'Sesión 1 · Empuje',
      min: 75,
      rpe: 8,
      ua: 600,
      aguda: 600.0,
      cronica: 600.0,
      acwr: '1,00',
      zona: 'Sweet Spot',
      status: 'ok' as const,
    },
    {
      fecha: '28/09',
      micro: 'Micro 1 · Día 2',
      sesion: 'Sesión 2 · Pierna fuerza',
      min: 85,
      rpe: 8.5,
      ua: 722.5,
      aguda: 661.2,
      cronica: 661.2,
      acwr: '1,00',
      zona: 'Sweet Spot',
      status: 'ok' as const,
    },
    {
      fecha: '29/09',
      micro: 'Micro 1 · Día 3',
      sesion: 'Sesión 3 · Tracción',
      min: 70,
      rpe: 8,
      ua: 560,
      aguda: 627.5,
      cronica: 627.5,
      acwr: '1,00',
      zona: 'Sweet Spot',
      status: 'ok' as const,
    },
    {
      fecha: '30/09',
      micro: 'Micro 1 · Día 4',
      sesion: 'Sesión 4 · Pierna hipertrofia',
      min: 80,
      rpe: 8.5,
      ua: 680,
      aguda: 640.6,
      cronica: 640.6,
      acwr: '1,00',
      zona: 'Sweet Spot',
      status: 'ok' as const,
    },
    {
      fecha: '01/10',
      micro: 'Micro 1 · Día 5',
      sesion: 'Sesión 5 · Full body',
      min: 75,
      rpe: 8,
      ua: 600,
      aguda: 632.5,
      cronica: 632.5,
      acwr: '1,00',
      zona: 'Sweet Spot',
      status: 'ok' as const,
    },
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Carga interna y riesgo epidemiológico
          </p>
          <h1 className="text-3xl font-extrabold text-[var(--txt)] tracking-tight">
            Control de carga & ACWR
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="selector-atleta-carga" className="text-xs font-bold text-[var(--mut)]">
            Atleta
          </label>
          <select
            id="selector-atleta-carga"
            value={atletaSeleccionado}
            onChange={(e) => setAtletaSeleccionado(e.target.value)}
            className="h-10 rounded-xl border border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)] text-xs font-bold px-3 focus:outline-none"
          >
            <option>Lucía Fernández</option>
            <option>Martín Benítez</option>
            <option>Camila Rossi</option>
            <option>Joaquín Gómez</option>
          </select>
        </div>
      </div>

      {/* 4 KPIs de Carga */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Carga semanal
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">3.855 UA</p>
          <div className="mt-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
              últimos 7 días
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Ratio ACWR
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">1,03</p>
          <div className="mt-1">
            <IndicatorStatus status="ok" label="Sweet Spot" size="sm" icon="check" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Readiness promedio
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">72,3 %</p>
          <div className="mt-1">
            <IndicatorStatus status="warn" label="Moderado (ajustar RPE)" size="sm" icon="alert" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">
            Sueño promedio
          </p>
          <p className="text-3xl font-extrabold text-[var(--txt)] mt-1">3,5 / 5</p>
          <div className="mt-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--okbg)] text-[var(--oktx)]">
              check-in diario
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico ACWR + Zonas y Recomendación */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Gráfico SVG ACWR */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-2">
          <div className="flex items-baseline justify-between">
            <b className="text-base font-extrabold text-[var(--txt)]">Evolución del ratio ACWR</b>
            <span className="text-xs text-[var(--mut)]">carga aguda (7D) ÷ carga crónica (28D)</span>
          </div>

          <div className="w-full overflow-hidden rounded-xl bg-[var(--bg)]/50 p-2">
            <svg
              width="100%"
              viewBox="0 0 600 214"
              role="img"
              aria-label="Ratio ACWR de los últimos 17 días en el Sweet Spot"
              className="select-none"
            >
              {/* Franja Desentrenamiento */}
              <rect x="44" y="154.0" width="540" height="36.0" fill="var(--estado-neu-fondo)" />
              <text x="578" y="168.0" textAnchor="end" fontSize="11" fontWeight="700" fill="var(--estado-neu-texto)">
                Desentrenamiento (&lt;0.8)
              </text>

              {/* Franja Sweet Spot */}
              <rect x="44" y="64.0" width="540" height="90.0" fill="var(--estado-ok-fondo)" />
              <text x="578" y="78.0" textAnchor="end" fontSize="11" fontWeight="700" fill="var(--estado-ok-texto)">
                Sweet Spot (0.8 - 1.3)
              </text>

              {/* Franja Alerta */}
              <rect x="44" y="28.0" width="540" height="36.0" fill="var(--estado-warn-fondo)" />
              <text x="578" y="42.0" textAnchor="end" fontSize="11" fontWeight="700" fill="var(--estado-warn-texto)">
                Zona Alerta (1.3 - 1.5)
              </text>

              {/* Franja Riesgo */}
              <rect x="44" y="10.0" width="540" height="18.0" fill="var(--estado-bad-fondo)" />
              <text x="578" y="24.0" textAnchor="end" fontSize="11" fontWeight="700" fill="var(--estado-bad-texto)">
                Zona de Riesgo (&gt;1.5)
              </text>

              {/* Línea de ratio ACWR */}
              <polyline
                fill="none"
                stroke="var(--txt)"
                strokeWidth="2.8"
                points="54.0,118.0 86.5,118.0 119.0,118.0 151.5,118.0 184.0,118.0 216.5,118.0 249.0,118.0 281.5,121.6 314.0,128.8 346.5,128.8 379.0,130.6 411.5,130.6 444.0,127.0 476.5,114.4 509.0,114.4 541.5,119.8 574.0,119.8"
              />

              {/* Puntos de datos */}
              {[
                [54.0, 118.0],
                [86.5, 118.0],
                [119.0, 118.0],
                [151.5, 118.0],
                [184.0, 118.0],
                [216.5, 118.0],
                [249.0, 118.0],
                [281.5, 121.6],
                [314.0, 128.8],
                [346.5, 128.8],
                [379.0, 130.6],
                [411.5, 130.6],
                [444.0, 127.0],
                [476.5, 114.4],
                [509.0, 114.4],
                [541.5, 119.8],
                [574.0, 119.8],
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="3.5" fill="var(--txt)" />
              ))}

              {/* Ejes Y */}
              <text x="38" y="158.0" textAnchor="end" fontSize="11" fill="var(--mut)">0,8</text>
              <text x="38" y="122.0" textAnchor="end" fontSize="11" fill="var(--mut)">1,0</text>
              <text x="38" y="68.0" textAnchor="end" fontSize="11" fill="var(--mut)">1,3</text>
              <text x="38" y="32.0" textAnchor="end" fontSize="11" fill="var(--mut)">1,5</text>

              {/* Ejes X */}
              <text x="54" y="206" fontSize="11" fill="var(--mut)">27/09</text>
              <text x="574" y="206" textAnchor="end" fontSize="11" fill="var(--mut)">13/10</text>
            </svg>
          </div>
        </div>

        {/* Zonas y Recomendación */}
        <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-3">
          <b className="text-base font-extrabold text-[var(--txt)] block">Zonas y recomendación</b>

          <div className="space-y-2.5 text-xs">
            <div>
              <IndicatorStatus status="neu" label="Desentrenamiento (< 0,8)" size="sm" icon="info" />
              <p className="text-[var(--mut)] mt-1 ml-1 leading-relaxed">
                Aumentar volumen o intensidad progresivamente para evitar pérdida adaptativa.
              </p>
            </div>

            <div>
              <IndicatorStatus status="ok" label="Sweet Spot (0,8 a 1,3)" size="sm" icon="check" />
              <p className="text-[var(--mut)] mt-1 ml-1 leading-relaxed">
                Zona óptima: estímulo de sobrecarga balanceado y seguro contra lesiones.
              </p>
            </div>

            <div>
              <IndicatorStatus status="warn" label="Zona Alerta (1,3 a 1,5)" size="sm" icon="alert" />
              <p className="text-[var(--mut)] mt-1 ml-1 leading-relaxed">
                Monitorear fatiga acumulada, DOMS y calidad de sueño del atleta.
              </p>
            </div>

            <div>
              <IndicatorStatus status="bad" label="Zona de Riesgo (> 1,5)" size="sm" icon="alert" />
              <p className="text-[var(--mut)] mt-1 ml-1 leading-relaxed">
                Riesgo alto de sobreentrenamiento o lesión. Reducir volumen inmediatamente.
              </p>
            </div>
          </div>

          <p className="text-xs text-[var(--mut)] pt-2 border-t border-[var(--bord)]">
            Carga de la sesión = duración (min) × sRPE (1 a 10).
          </p>
        </div>
      </div>

      {/* Tabla de Registro de Sesiones */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--bord)] pb-2.5">
          <b className="text-base font-extrabold text-[var(--txt)]">Registro de sesiones</b>
          <Button variant="secondary" size="sm" onClick={onVerTodasLasSesiones} className="font-bold">
            Ver todas
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs select-none">
            <thead>
              <tr className="font-bold uppercase tracking-wider text-[var(--mut)] border-b border-[var(--bord)] pb-2">
                <th className="py-2 pr-2">Fecha</th>
                <th className="py-2 pr-2">Microciclo</th>
                <th className="py-2 pr-2">Sesión / Enfoque</th>
                <th className="py-2 pr-2">Min</th>
                <th className="py-2 pr-2">sRPE</th>
                <th className="py-2 pr-2">UA</th>
                <th className="py-2 pr-2">Aguda 7D</th>
                <th className="py-2 pr-2">Crónica 28D</th>
                <th className="py-2 pr-2">ACWR</th>
                <th className="py-2">Zona</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bord)] font-medium">
              {sesionesHistoricas.map((s, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg)]/40 transition">
                  <td className="py-2.5 pr-2 font-bold text-[var(--txt)]">{s.fecha}</td>
                  <td className="py-2.5 pr-2 text-[var(--mut)]">{s.micro}</td>
                  <td className="py-2.5 pr-2 font-semibold text-[var(--txt)]">{s.sesion}</td>
                  <td className="py-2.5 pr-2 font-mono">{s.min}</td>
                  <td className="py-2.5 pr-2 font-mono">{s.rpe}</td>
                  <td className="py-2.5 pr-2 font-mono font-bold text-[var(--txt)]">{s.ua}</td>
                  <td className="py-2.5 pr-2 font-mono text-[var(--mut)]">{s.aguda}</td>
                  <td className="py-2.5 pr-2 font-mono text-[var(--mut)]">{s.cronica}</td>
                  <td className="py-2.5 pr-2 font-mono font-extrabold text-[var(--txt)]">{s.acwr}</td>
                  <td className="py-2.5">
                    <IndicatorStatus status={s.status} label={s.zona} size="sm" icon="check" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
