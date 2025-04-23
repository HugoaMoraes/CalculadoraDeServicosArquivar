export interface CadastroData {
  nomeUsuario: string;
  data: string;
  nomeCliente: string;
  setor: string;
}

export interface ServicosData {
  digitalizacao: {
    paginas: number;
    tempoScanner: number;
  };
  indexacao: {
    quantidade: number;
    tempoPorArquivo: number;
  };
  caixas: {
    quantidade: number;
    complexidade: 'simples' | 'intermediaria' | 'complexa';
  };
}

export interface ResultadosData {
  preparacao: string;
  digitalizacao: string;
  indexacao: string;
  remontagem: string;
  totalComMargem: string;
}

export interface ComplexidadeTempo {
  preparacao: number;
  remontagem: number;
}

export interface SetorResultado {
  setor: string;
  resultados: ResultadosData;
}
