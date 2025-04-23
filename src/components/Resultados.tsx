import React from 'react';
import {
  ResultadosData,
  CadastroData,
  ServicosData,
  SetorResultado,
} from '../types';
import { jsPDF } from 'jspdf';
import { Timeline } from './Timeline';
import {
  FileSearch,
  ClipboardList,
  Printer,
  FileStack,
  FileClock,
} from 'lucide-react';

interface Props {
  resultados: ResultadosData;
  cadastro: CadastroData;
  servicos: ServicosData;
  setoresResultados: SetorResultado[];
  onRestart: () => void;
  onNovoSetor: () => void;
  onTimelineClick: (step: number) => void;
}

interface ColaboradorTempo {
  quantidade: number;
  dias: number;
}

export function Resultados({
  resultados,
  cadastro,
  servicos,
  setoresResultados,
  onRestart,
  onNovoSetor,
  onTimelineClick,
}: Props) {
  const calcularTemposPorColaborador = (
    horasTotal: number
  ): ColaboradorTempo[] => {
    const horasPorDia = 8;
    const horasHomem = horasTotal;

    return Array.from({ length: 10 }, (_, i) => {
      const qtdPessoas = i + 1;
      return {
        quantidade: qtdPessoas,
        dias: Math.ceil(horasHomem / (qtdPessoas * horasPorDia)),
      };
    });
  };

  const temposPorColaborador = calcularTemposPorColaborador(
    parseFloat(resultados.totalComMargem)
  );

  const gerarResumoPDF = () => {
    const doc = new jsPDF();

    // Configurações iniciais
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFillColor(136, 189, 67); // #88BD43
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Resumo de Serviços', 105, 25, { align: 'center' });

    // Reset cor do texto
    doc.setTextColor(0, 0, 0);

    // Informações do cadastro
    doc.setFontSize(14);
    doc.text('Informações do Projeto', 20, 50);
    doc.setDrawColor(136, 189, 67); // #88BD43
    doc.line(20, 52, 190, 52);

    doc.setFontSize(12);
    doc.text(`Vendedor: ${cadastro.nomeUsuario}`, 20, 65);
    doc.text(`Cliente: ${cadastro.nomeCliente}`, 20, 75);
    doc.text(`Data: ${cadastro.data}`, 20, 85);
    doc.text(`Setor: ${cadastro.setor}`, 20, 95);

    // Dados do serviço
    doc.setFontSize(14);
    doc.text('Detalhes do Serviço', 20, 115);
    doc.line(20, 117, 190, 117);

    doc.setFontSize(12);
    doc.text(
      `Páginas para digitalização: ${servicos.digitalizacao.paginas}`,
      20,
      130
    );
    doc.text(
      `Velocidade do scanner: ${servicos.digitalizacao.tempoScanner} páginas por minuto`,
      20,
      140
    );
    doc.text(`Indexações: ${servicos.indexacao.quantidade}`, 20, 150);
    doc.text(
      `Tempo por indexação: ${servicos.indexacao.tempoPorArquivo} seg`,
      20,
      160
    );
    doc.text(`Caixas: ${servicos.caixas.quantidade}`, 20, 170);
    doc.text(`Complexidade: ${servicos.caixas.complexidade}`, 20, 180);

    // Resultados
    doc.setFontSize(14);
    doc.text('Tempo Estimado por Serviço', 20, 200);
    doc.line(20, 202, 190, 202);

    doc.setFontSize(12);
    doc.text(`Preparação: ${resultados.preparacao} horas`, 20, 215);
    doc.text(`Digitalização: ${resultados.digitalizacao} horas`, 20, 225);
    doc.text(`Indexação: ${resultados.indexacao} horas`, 20, 235);
    doc.text(`Remontagem: ${resultados.remontagem} horas`, 20, 245);

    // Total
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 255, 170, 25, 'F');
    doc.setFontSize(14);
    doc.text(
      `Total com margem de 10%: ${resultados.totalComMargem} horas`,
      25,
      270
    );

    // Adicionar nova página para estimativas por colaborador
    doc.addPage();

    // Cabeçalho da segunda página
    doc.setFillColor(136, 189, 67); // #88BD43
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Estimativas por Equipe', 105, 25, { align: 'center' });

    // Reset cor do texto
    doc.setTextColor(0, 0, 0);

    // Tabela de colaboradores
    doc.setFontSize(14);
    doc.text('Tempo Estimado por Quantidade de Colaboradores', 20, 50);
    doc.line(20, 52, 190, 52);

    doc.setFontSize(12);
    let yPos = 70;
    temposPorColaborador.forEach((tempo) => {
      doc.text(
        `${tempo.quantidade} colaborador${tempo.quantidade > 1 ? 'es' : ''}: ${
          tempo.dias
        } dia${tempo.dias > 1 ? 's' : ''} úteis`,
        20,
        yPos
      );
      yPos += 10;
    });

    // Rodapé

    // Logo
    const logo =
      'data:image/png;base64,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'; // https://www.base64-image.de/

    // Centraliza horizontalmente com largura proporcional
    const pageWidth = doc.internal.pageSize.getWidth();
    const imageWidth = 10;
    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = doc.internal.pageSize.getHeight() - 30;

    doc.addImage(logo, 'PNG', imageX, imageY, imageWidth, 0);
    const footerText =
      'Documento referente ao tempo de trabalho na digitalização - Arquivar Brasília,Software Desenvolvido por Hugo Moraes.';
    const pageCount = doc.internal.pages.length;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(footerText, 105, 285, { align: 'center' });
    }

    // Salvar o PDF
    doc.save(`resumo_servicos_${cadastro.nomeCliente}_${cadastro.setor}.pdf`);
  };

  const gerarConsolidadoPDF = () => {
    const doc = new jsPDF();

    // Configurações iniciais
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFillColor(136, 189, 67);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Resumo Consolidado', 105, 25, { align: 'center' });

    // Reset cor do texto
    doc.setTextColor(0, 0, 0);

    // Informações do cliente
    doc.setFontSize(14);
    doc.text('Informações do Cliente', 20, 50);
    doc.setDrawColor(136, 189, 67);
    doc.line(20, 52, 190, 52);

    doc.setFontSize(12);
    doc.text(`Vendedor: ${cadastro.nomeUsuario}`, 20, 65);
    doc.text(`Cliente: ${cadastro.nomeCliente}`, 20, 75);
    doc.text(`Data: ${cadastro.data}`, 20, 85);

    // Resultados por setor
    doc.setFontSize(14);
    doc.text('Resultados por Setor', 20, 105);
    doc.line(20, 107, 190, 107);

    // Lista de setores
    const setores = setoresResultados.map((s) => s.setor).join(', ');
    doc.setFontSize(12);
    doc.text(`Setores: ${setores}`, 20, 120);

    // Somatório dos resultados
    let totalPreparacao = 0;
    let totalDigitalizacao = 0;
    let totalIndexacao = 0;
    let totalRemontagem = 0;
    let totalHoras = 0;

    setoresResultados.forEach((setorRes) => {
      totalPreparacao += parseFloat(setorRes.resultados.preparacao);
      totalDigitalizacao += parseFloat(setorRes.resultados.digitalizacao);
      totalIndexacao += parseFloat(setorRes.resultados.indexacao);
      totalRemontagem += parseFloat(setorRes.resultados.remontagem);
      totalHoras += parseFloat(setorRes.resultados.totalComMargem);
    });

    // Exibir totais
    doc.text(`Preparação: ${totalPreparacao.toFixed(2)}h`, 20, 140);
    doc.text(`Digitalização: ${totalDigitalizacao.toFixed(2)}h`, 20, 155);
    doc.text(`Indexação: ${totalIndexacao.toFixed(2)}h`, 20, 170);
    doc.text(`Remontagem: ${totalRemontagem.toFixed(2)}h`, 20, 185);

    // Total geral
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 200, 170, 25, 'F');
    doc.setFontSize(14);
    doc.text(`Total geral: ${totalHoras.toFixed(2)} horas`, 25, 215);

    // Nova página para estimativas consolidadas
    doc.addPage();

    // Cabeçalho da segunda página
    doc.setFillColor(136, 189, 67);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Estimativas Consolidadas', 105, 25, { align: 'center' });

    // Reset cor do texto
    doc.setTextColor(0, 0, 0);

    // Estimativas por quantidade de colaboradores
    doc.setFontSize(14);
    doc.text('Tempo Estimado por Quantidade de Colaboradores', 20, 50);
    doc.line(20, 52, 190, 52);

    const temposConsolidados = calcularTemposPorColaborador(totalHoras);

    let yPos = 70;
    temposConsolidados.forEach((tempo) => {
      doc.setFontSize(12);
      doc.text(
        `${tempo.quantidade} colaborador${tempo.quantidade > 1 ? 'es' : ''}: ${
          tempo.dias
        } dia${tempo.dias > 1 ? 's' : ''} úteis`,
        20,
        yPos
      );
      yPos += 10;
    });

    // Rodapé

    // Logo
    const logo =
      'data:image/png;base64,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'; // https://www.base64-image.de/

    // Centraliza horizontalmente com largura proporcional
    const pageWidth = doc.internal.pageSize.getWidth();
    const imageWidth = 10;
    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = doc.internal.pageSize.getHeight() - 30;

    doc.addImage(logo, 'PNG', imageX, imageY, imageWidth, 0);

    const footerText =
      'Documento referente ao tempo de trabalho na digitalização - Arquivar Brasília,Software Desenvolvido por Hugo Moraes.';
    const pageCount = doc.internal.pages.length;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(footerText, 105, 285, { align: 'center' });
    }

    // Salvar o PDF
    doc.save(`resumo_consolidado_${cadastro.nomeCliente}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Timeline currentStep={3} onStepClick={onTimelineClick} />
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            <span className="text-gray-800">Resultados do Setor </span>
            <span className="text-[#88BD43]">{cadastro.setor}</span>
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <ClipboardList className="w-5 h-5 text-[#88BD43] mr-2" />
                  <p className="text-sm text-gray-600">Preparação</p>
                </div>
                <p className="text-xl font-semibold">
                  {resultados.preparacao} horas
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Printer className="w-5 h-5 text-[#88BD43] mr-2" />
                  <p className="text-sm text-gray-600">Digitalização</p>
                </div>
                <p className="text-xl font-semibold">
                  {resultados.digitalizacao} horas
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileSearch className="w-5 h-5 text-[#88BD43] mr-2" />
                  <p className="text-sm text-gray-600">Indexação</p>
                </div>
                <p className="text-xl font-semibold">
                  {resultados.indexacao} horas
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileStack className="w-5 h-5 text-[#88BD43] mr-2" />
                  <p className="text-sm text-gray-600">Remontagem</p>
                </div>
                <p className="text-xl font-semibold">
                  {resultados.remontagem} horas
                </p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-[#F0F7E6] rounded-lg">
              <div className="flex items-center mb-2">
                <FileClock className="w-5 h-5 text-[#88BD43] mr-2" />
                <p className="text-sm text-[#88BD43]">
                  Total com margem de 10%
                </p>
              </div>
              <p className="text-2xl font-bold text-[#88BD43]">
                {resultados.totalComMargem} horas
              </p>
            </div>

            <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Estimativa por Quantidade de Colaboradores
              </h3>
              <div className="space-y-2">
                {temposPorColaborador.map((tempo) => (
                  <div
                    key={tempo.quantidade}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-600">
                      {tempo.quantidade} colaborador
                      {tempo.quantidade > 1 ? 'es' : ''}
                    </span>
                    <span className="font-medium">
                      {tempo.dias} dia{tempo.dias > 1 ? 's' : ''} úteis
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={onRestart}
              >
                Novo Cálculo
              </button>
              <button
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={onNovoSetor}
              >
                Novo Setor
              </button>
              <button
                className="flex-1 bg-[#7AAD35] text-white py-2 px-4 rounded-lg hover:bg-[#6A9D25] transition-colors"
                onClick={gerarConsolidadoPDF}
                disabled={setoresResultados.length === 0}
              >
                Consolidado (PDF)
              </button>
              <button
                className="flex-1 bg-[#88BD43] text-white py-2 px-4 rounded-lg hover:bg-[#7AAD35] transition-colors"
                onClick={gerarResumoPDF}
              >
                Gerar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
