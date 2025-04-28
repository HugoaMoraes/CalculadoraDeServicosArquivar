import { ComplexidadeTempo } from '../types';

export const TEMPOS_COMPLEXIDADE: Record<string, ComplexidadeTempo> = {
  simples: { preparacao: 30, remontagem: 15 },
  intermediaria: { preparacao: 60, remontagem: 40 },
  complexa: { preparacao: 90, remontagem: 60 },
};
