import { ServicosData, ResultadosData } from '../types';
import { TEMPOS_COMPLEXIDADE } from '../constants/tempos';

export function calcularTemposServico(servicos: ServicosData): ResultadosData {
  const { digitalizacao, indexacao, caixas } = servicos;

  const tempoDigitalizacaoMin =
    digitalizacao.paginas / digitalizacao.tempoScanner;
  const tempoIndexacaoMin =
    (indexacao.quantidade * indexacao.tempoPorArquivo) / 60;

  const temposComplexidade = TEMPOS_COMPLEXIDADE[caixas.complexidade];
  const tempoPreparacaoMin = caixas.quantidade * temposComplexidade.preparacao;
  const tempoRemontagemMin = caixas.quantidade * temposComplexidade.remontagem;

  const tempoTotalMin =
    tempoPreparacaoMin +
    tempoDigitalizacaoMin +
    tempoIndexacaoMin +
    tempoRemontagemMin;
  const tempoComMargem = tempoTotalMin * 1.1;

  return {
    preparacao: (tempoPreparacaoMin / 60).toFixed(2),
    digitalizacao: (tempoDigitalizacaoMin / 60).toFixed(2),
    indexacao: (tempoIndexacaoMin / 60).toFixed(2),
    remontagem: (tempoRemontagemMin / 60).toFixed(2),
    totalComMargem: (tempoComMargem / 60).toFixed(2),
  };
}

export function calcularTemposPorColaborador(horasTotal: number) {
  const horasPorDia = 8;
  const horasHomem = horasTotal;

  return Array.from({ length: 10 }, (_, i) => {
    const qtdPessoas = i + 1;
    return {
      quantidade: qtdPessoas,
      dias: Math.ceil(horasHomem / (qtdPessoas * horasPorDia)),
    };
  });
}
