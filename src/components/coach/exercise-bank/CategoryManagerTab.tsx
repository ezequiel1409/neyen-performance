// =====================================================================
// NEYEN ATHLETIC - GESTOR DE CATEGORÍAS EN BANCO DE EJERCICIOS
// RESPONSABILIDAD ÚNICA: Crear y listar categorías validadas con alertas
// =====================================================================

import React, { useState } from 'react';
import { CategoriaEjercicio } from '../../../types';
import { AlertBanner } from '../../ui/AlertBanner';
import type { StatusType } from '../../ui/IndicatorStatus';
import { IconInterface } from '../../ui/icons/IconInterface';

interface CategoryManagerTabProps {
  categorias: CategoriaEjercicio[];
  onAgregarCategoria: (categoria: CategoriaEjercicio) => void;
}

const normalizar = (texto: string) =>
  texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const CategoryManagerTab: React.FC<CategoryManagerTabProps> = ({
  categorias,
  onAgregarCategoria,
}) => {
  const [nuevaCatNombre, setNuevaCatNombre] = useState('');
  const [errorCampo, setErrorCampo] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<{ status: StatusType; message: string } | null>(null);

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nuevaCatNombre.trim();

    if (!limpio) {
      setErrorCampo('Ingresá un nombre para la categoría.');
      setAlerta({ status: 'bad', message: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    if (limpio.length < 2 || limpio.length > 40) {
      setErrorCampo('Debe tener entre 2 y 40 caracteres.');
      setAlerta({ status: 'bad', message: 'La categoría debe tener entre 2 y 40 caracteres.' });
      return;
    }

    const existe = categorias.some((c) => normalizar(c.nombreCategoria) === normalizar(limpio));
    if (existe) {
      setErrorCampo('Esta categoría ya existe en el catálogo.');
      setAlerta({ status: 'warn', message: `La categoría "${limpio.toUpperCase()}" ya está registrada.` });
      return;
    }

    const nombreFinal = limpio.toUpperCase();
    onAgregarCategoria({
      identificadorCategoria: `CAT-${String(categorias.length + 1).padStart(2, '0')}-${Date.now().toString().slice(-3)}`,
      nombreCategoria: nombreFinal,
      colorDistintivoHexadecimal: '#3C0016',
      ordenVisualizacion: categorias.length + 1,
    });
    setNuevaCatNombre('');
    setErrorCampo(null);
    setAlerta({ status: 'ok', message: `Categoría "${nombreFinal}" agregada correctamente.` });
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {alerta && (
        <AlertBanner
          status={alerta.status}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}

      <form onSubmit={handleAgregar} noValidate className="space-y-1.5">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nueva categoría (ej. VELOCIDAD)..."
            value={nuevaCatNombre}
            aria-label="Nombre de nueva categoría"
            aria-invalid={Boolean(errorCampo)}
            onChange={(e) => {
              setNuevaCatNombre(e.target.value);
              if (errorCampo) setErrorCampo(null);
            }}
            className={`flex-1 rounded-xl border-2 bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--txt)] outline-hidden transition ${
              errorCampo
                ? 'border-[var(--estado-bad-texto)]'
                : 'border-[var(--bord)] focus:border-[var(--link)]'
            }`}
          />
          <button
            type="submit"
            className="rounded-xl bg-[var(--navbg)] text-[var(--navon)] font-extrabold text-sm px-5 py-2.5 shadow-2xs hover:opacity-95 transition cursor-pointer"
          >
            Agregar
          </button>
        </div>

        {errorCampo && (
          <span
            role="alert"
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--estado-bad-texto)]"
          >
            <IconInterface name="alert" size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{errorCampo}</span>
          </span>
        )}
      </form>

      <div className="space-y-2">
        {categorias.map((c) => (
          <div
            key={c.identificadorCategoria}
            className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--bord)] bg-[var(--surf)]"
          >
            <span className="font-bold text-sm text-[var(--txt)]">
              {c.nombreCategoria}
            </span>
            <span className="text-xs text-[var(--mut)] font-mono">
              {c.identificadorCategoria}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
