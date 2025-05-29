import React, { useState } from 'react';
import {
  ResultadosData,
  CadastroData,
  ServicosData,
  SetorResultado,
} from '../types';
import { jsPDF } from 'jspdf';
import { Timeline } from './ui/Timeline';
import { Modal } from './ui/Modal';
import { calcularTemposPorColaborador } from '../utils/calculos';
import {
  Loader2,
  FileSearch,
  ClipboardList,
  Printer,
  FileStack,
  FileClock,
  FileDown,
  FolderDown,
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

export function Resultados({
  resultados,
  cadastro,
  servicos,
  setoresResultados,
  onRestart,
  onNovoSetor,
  onTimelineClick,
}: Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const temposPorColaborador = calcularTemposPorColaborador(
    parseFloat(resultados.totalComMargem)
  );

  const handleNovoSetorClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    onNovoSetor();
  };

  const gerarResumoPDF = async () => {
    setIsGeneratingPDF(true);
    try {
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
          `${tempo.quantidade} colaborador${
            tempo.quantidade > 1 ? 'es' : ''
          }: ${tempo.dias} dia${tempo.dias > 1 ? 's' : ''} úteis`,
          20,
          yPos
        );
        yPos += 10;
      });

      // Minimal valid 1x1 transparent PNG as base64
      const logo = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

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
    } finally {
      setIsGeneratingPDF(false);
      if (isModalOpen) {
        handleContinue();
      }
    }
  };

  const gerarConsolidadoPDF = async () => {
    setIsGeneratingPDF(true);
    try {
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
          `${tempo.quantidade} colaborador${
            tempo.quantidade > 1 ? 'es' : ''
          }: ${tempo.dias} dia${tempo.dias > 1 ? 's' : ''} úteis`,
          20,
          yPos
        );
        yPos += 10;
      });

      // Minimal valid 1x1 transparent PNG as base64
      const logo = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

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
    } finally {
      setIsGeneratingPDF(false);
    }
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
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                onClick={onRestart}
                disabled={isGeneratingPDF}
              >
                Novo Cálculo
              </button>
              <button
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                onClick={handleNovoSetorClick}
                disabled={isGeneratingPDF}
              >
                Novo Setor
              </button>
              <button
                className="flex-1 bg-[#7AAD35] text-white py-2 px-4 rounded-lg hover:bg-[#6A9D25] transition-colors disabled:opacity-50 flex items-center justify-center"
                onClick={gerarConsolidadoPDF}
                disabled={setoresResultados.length === 0 || isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Consolidado'
                )}
                <FolderDown className="w-6 h-6 ml-2" />
              </button>
              <button
                className="flex-1 bg-[#88BD43] text-white py-2 px-4 rounded-lg hover:bg-[#7AAD35] transition-colors disabled:opacity-50 flex items-center justify-center"
                onClick={gerarResumoPDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Gerar PDF'
                )}
                <FileDown className="w-6 h-6 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleContinue}
        onGeneratePDF={gerarResumoPDF}
      />
    </div>
  );
}