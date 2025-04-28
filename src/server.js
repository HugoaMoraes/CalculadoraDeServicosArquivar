import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import PDFDocument from 'pdfkit';

const app = express();
const port = 3001;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const TEMPO_PREPARACAO_POR_CAIXA_MIN = 60;
const TEMPO_REMONTAGEM_POR_CAIXA_MIN = 45;

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

// API routes
app.post('/api/calcular', (req, res) => {
  try {
    const { servicos } = req.body;
    const resultados = calcularTempos(servicos);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

app.post('/api/gerar-pdf', (req, res) => {
  try {
    const { cadastro, servicos, resultados } = req.body;

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=resumo_servicos_${cadastro.nomeCliente}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(16).text('Resumo de Serviços', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Usuário: ${cadastro.nomeUsuario}`);
    doc.text(`Cliente: ${cadastro.nomeCliente}`);
    doc.text(`Data: ${cadastro.data}`);
    doc.text(`Setor: ${cadastro.setor}`);
    doc.moveDown();

    doc.text('Dados Informados', { underline: true });
    doc.text(`Páginas para digitalização: ${servicos.digitalizacao.paginas}`);
    doc.text(
      `Tempo por página (scanner): ${servicos.digitalizacao.tempoScanner} min`
    );
    doc.text(`Indexações: ${servicos.indexacao.quantidade}`);
    doc.text(`Tempo por indexação: ${servicos.indexacao.tempoPorArquivo} seg`);
    doc.text(`Caixas: ${servicos.caixas}`);
    doc.moveDown();

    doc.text('Tempo Estimado por Serviço (em horas)', { underline: true });
    doc.text(`Preparação: ${resultados.preparacao}`);
    doc.text(`Digitalização: ${resultados.digitalizacao}`);
    doc.text(`Indexação: ${resultados.indexacao}`);
    doc.text(`Remontagem: ${resultados.remontagem}`);
    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Total com margem de 10%: ${resultados.totalComMargem} horas`, {
        bold: true,
      });

    doc.end();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao gerar PDF' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
