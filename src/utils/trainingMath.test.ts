// =====================================================================
// NEYIMA ATHLETIC - SUITE DE TESTS UNITARIOS DE DOMINIO FISIOLÓGICO
// Ejecución nativa con Node 24 Test Runner (node --test)
// =====================================================================

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularUnRepeticionMaximaEpley,
  calcularUnRepeticionMaximaBrzycki,
  calcularUnRepeticionMaximaEfectiva,
  redondearPesoGimnasio,
  calcularCargaPrescrita,
  calcularFaseCicloActual,
  calcularCargaInternaFoster,
} from './trainingMath.ts';

describe('Motor Matemático y Fisiológico NEYIMA (trainingMath)', () => {
  it('calcula 1RM con Fórmula de Epley correctamente', () => {
    // 100 kg x 5 reps => 100 * (1 + 5/30) = 116.7 kg
    assert.equal(calcularUnRepeticionMaximaEpley(100, 5), 116.7);
    assert.equal(calcularUnRepeticionMaximaEpley(80, 1), 80);
    assert.equal(calcularUnRepeticionMaximaEpley(0, 5), 0);
  });

  it('calcula 1RM con Fórmula de Brzycki correctamente', () => {
    // 100 kg x 5 reps => 100 * (36 / 32) = 112.5 kg
    assert.equal(calcularUnRepeticionMaximaBrzycki(100, 5), 112.5);
    assert.equal(calcularUnRepeticionMaximaBrzycki(90, 1), 90);
    assert.equal(calcularUnRepeticionMaximaBrzycki(100, 0), 0);
  });

  it('selecciona 1RM efectiva según la fórmula elegida', () => {
    assert.equal(calcularUnRepeticionMaximaEfectiva(100, 5, 'EPLEY'), 116.7);
    assert.equal(calcularUnRepeticionMaximaEfectiva(100, 5, 'BRZYCKI'), 112.5);
  });

  it('redondea los kilos al incremento práctico de discos de gimnasio', () => {
    assert.equal(redondearPesoGimnasio(73.24, 0.5), 73.0);
    assert.equal(redondearPesoGimnasio(73.26, 0.5), 73.5);
    assert.equal(redondearPesoGimnasio(81.1, 2.5), 80.0);
  });

  it('calcula carga prescrita y aplica autorregulación hormonal (-7.5% en fase lútea)', () => {
    // Sin ajuste hormonal: 100 kg 1RM * 80% = 80 kg
    const sinAjuste = calcularCargaPrescrita({
      unRepeticionMaximaKg: 100,
      porcentajeUnaRepeticionMaxima: 80,
      ratioConversionCarga: 1.0,
      aplicarAjusteHormonal: false,
    });
    assert.equal(sinAjuste.pesoFinalKg, 80);
    assert.equal(sinAjuste.ajusteHormonalAplicadoPorcentaje, 0);

    // Con ajuste hormonal en Fase Lútea (-7.5%): 80 kg * 0.925 = 74 kg
    const conAjusteLutea = calcularCargaPrescrita({
      unRepeticionMaximaKg: 100,
      porcentajeUnaRepeticionMaxima: 80,
      ratioConversionCarga: 1.0,
      faseCicloMenstrual: 'LUTEA',
      aplicarAjusteHormonal: true,
    });
    assert.equal(conAjusteLutea.pesoFinalKg, 74);
    assert.equal(conAjusteLutea.pesoBaseTeoricoKg, 80);
    assert.equal(conAjusteLutea.ajusteHormonalAplicadoPorcentaje, -7.5);
  });

  it('determina correctamente la fase del ciclo menstrual según FUM', () => {
    const hace2Dias = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const estadoMenstrual = calcularFaseCicloActual(hace2Dias, 28, 5);
    assert.equal(estadoMenstrual.faseActual, 'MENSTRUACION');

    const hace20Dias = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const estadoLuteo = calcularFaseCicloActual(hace20Dias, 28, 5);
    assert.equal(estadoLuteo.faseActual, 'LUTEA');
  });

  it('calcula Unidades Arbitrarias (UA) mediante sRPE de Foster', () => {
    // sRPE 8 * 75 min = 600 UA
    assert.equal(calcularCargaInternaFoster(8, 75), 600);
    assert.equal(calcularCargaInternaFoster(6, 45), 270);
  });
});
