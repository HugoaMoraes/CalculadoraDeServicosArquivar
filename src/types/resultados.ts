export interface ResultadosData {
  preparacao: string;
  digitalizacao: string;
  indexacao: string;
  remontagem: string;
  totalComMargem: string;
}

export interface SetorResultado {
  setor: string;
  resultados: ResultadosData;
}
