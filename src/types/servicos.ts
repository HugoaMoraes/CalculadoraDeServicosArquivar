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
