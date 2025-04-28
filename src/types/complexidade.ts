export interface ComplexidadeTempo {
  preparacao: number;
  remontagem: number;
}

export type ComplexidadeType = 'simples' | 'intermediaria' | 'complexa';

export interface ComplexidadeDescricao {
  [key: string]: string;
}
