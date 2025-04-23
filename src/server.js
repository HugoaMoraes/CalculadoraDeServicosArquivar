import express from 'express';
import cors from 'cors';
import PDFDocument from 'pdfkit';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const TEMPO_PREPARACAO_POR_CAIXA_MIN = 60;
const TEMPO_REMONTAGEM_POR_CAIXA_MIN = 45;
const NOME_ARQUIVO_SAIDA_PDF = 'relatorio.pdf';

function calcularTempos(servicos) {
  const { digitalizacao, indexacao, caixas } = servicos;
  const minutosPorPagina = digitalizacao.tempoScanner / 60;
  const tempoDigitalizacaoMin = digitalizacao.paginas * minutosPorPagina;
  const tempoIndexacaoMin =
    (indexacao.quantidade * indexacao.tempoPorArquivo) / 60;
  const tempoPreparacaoMin = caixas * TEMPO_PREPARACAO_POR_CAIXA_MIN;
  const tempoRemontagemMin = caixas * TEMPO_REMONTAGEM_POR_CAIXA_MIN;
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

const middlewareVerificarCorpoRequisicao = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Corpo da requisição vazio' });
  }
  next();
};

// Endpoint para calcular tempos
app.post('/api/calcular', middlewareVerificarCorpoRequisicao, (req, res) => {
  try {
    const { servicos } = req.body;
    const resultados = calcularTempos(servicos);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao calcular tempos' });
  }
});

// Endpoint para gerar PDF
app.post('/api/gerar-pdf', middlewareVerificarCorpoRequisicao, (req, res) => {
  try {
    const { servicos } = req.body;
    const resultados = calcularTempos(servicos);

    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(24).text('Relatório de Tempos', 100, 100);
    doc
      .fontSize(18)
      .text(`Preparação: ${resultados.preparacao} horas`, 100, 150);
    doc
      .fontSize(18)
      .text(`Digitalização: ${resultados.digitalizacao} horas`, 100, 200);
    doc.fontSize(18).text(`Indexação: ${resultados.indexacao} horas`, 100, 250);
    doc
      .fontSize(18)
      .text(`Remontagem: ${resultados.remontagem} horas`, 100, 300);
    doc
      .fontSize(18)
      .text(`Total com margem: ${resultados.totalComMargem} horas`, 100, 350);
    doc.end();
    res.set(
      'Content-Disposition',
      `attachment; filename="${NOME_ARQUIVO_SAIDA_PDF}"`
    );
  } catch (error) {
    res.status(400).json({ error: 'Erro ao gerar PDF' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
