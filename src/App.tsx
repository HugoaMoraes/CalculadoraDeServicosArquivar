import React, { useState } from 'react';
import { CadastroForm } from './components/CadastroForm';
import { ServicosForm } from './components/ServicosForm';
import { Resultados } from './components/Resultados';
import { CadastroData, ServicosData, ResultadosData, ComplexidadeTempo } from './types';

const TEMPOS_COMPLEXIDADE: Record<string, ComplexidadeTempo> = {
  simples: { preparacao: 30, remontagem: 15 },
  intermediaria: { preparacao: 60, remontagem: 40 },
  complexa: { preparacao: 90, remontagem: 60 }
};

function App() {
  const [tela, setTela] = useState(1);
  const [cadastro, setCadastro] = useState<CadastroData>({
    nomeUsuario: '',
    data: '',
    nomeCliente: '',
    setor: ''
  });
  const [servicos, setServicos] = useState<ServicosData>({
    digitalizacao: {
      paginas: 0,
      tempoScanner: 10
    },
    indexacao: {
      quantidade: 0,
      tempoPorArquivo: 10
    },
    caixas: {
      quantidade: 0,
      complexidade: 'simples'
    }
  });
  const [resultados, setResultados] = useState<ResultadosData>({
    preparacao: '0',
    digitalizacao: '0',
    indexacao: '0',
    remontagem: '0',
    totalComMargem: '0'
  });

  const calcularTempos = () => {
    const { digitalizacao, indexacao, caixas } = servicos;
    
    const tempoDigitalizacaoMin = digitalizacao.paginas / digitalizacao.tempoScanner;
    const tempoIndexacaoMin = (indexacao.quantidade * indexacao.tempoPorArquivo) / 60;
    
    const temposComplexidade = TEMPOS_COMPLEXIDADE[caixas.complexidade];
    const tempoPreparacaoMin = caixas.quantidade * temposComplexidade.preparacao;
    const tempoRemontagemMin = caixas.quantidade * temposComplexidade.remontagem;
    
    const tempoTotalMin = tempoPreparacaoMin + tempoDigitalizacaoMin + tempoIndexacaoMin + tempoRemontagemMin;
    const tempoComMargem = tempoTotalMin * 1.10;

    setResultados({
      preparacao: (tempoPreparacaoMin / 60).toFixed(2),
      digitalizacao: (tempoDigitalizacaoMin / 60).toFixed(2),
      indexacao: (tempoIndexacaoMin / 60).toFixed(2),
      remontagem: (tempoRemontagemMin / 60).toFixed(2),
      totalComMargem: (tempoComMargem / 60).toFixed(2)
    });

    setTela(3);
  };

  const reiniciarCalculos = () => {
    setCadastro({
      nomeUsuario: '',
      data: '',
      nomeCliente: '',
      setor: ''
    });
    setServicos({
      digitalizacao: {
        paginas: 0,
        tempoScanner: 10
      },
      indexacao: {
        quantidade: 0,
        tempoPorArquivo: 10
      },
      caixas: {
        quantidade: 0,
        complexidade: 'simples'
      }
    });
    setResultados({
      preparacao: '0',
      digitalizacao: '0',
      indexacao: '0',
      remontagem: '0',
      totalComMargem: '0'
    });
    setTela(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <a href="https://github.com/HugoaMoraes" className="github-corner" aria-label="View source on GitHub">
        <svg width="85" height="85" viewBox="0 0 250 250"
          style={{ fill: '#88BD43', color: '#fffeff', position: 'absolute', top: 0, border: 0, right: 0 }} aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm"></path>
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor" className="octo-body"></path>
        </svg>
      </a>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Calculadora de Serviço</h1>
        
        <div className="py-4">
          {tela === 1 && (
            <CadastroForm
              cadastro={cadastro}
              onUpdate={(data) => setCadastro({ ...cadastro, ...data })}
              onAdvance={() => setTela(2)}
            />
          )}
          {tela === 2 && (
            <ServicosForm
              servicos={servicos}
              onUpdate={(data) => setServicos({ ...servicos, ...data })}
              onCalculate={calcularTempos}
            />
          )}
          {tela === 3 && (
            <Resultados
              resultados={resultados}
              cadastro={cadastro}
              servicos={servicos}
              onRestart={reiniciarCalculos}
            />
          )}
        </div>
      </div>

      <footer className="rodapé mt-auto py-4">
        <div className="copyright">
          &copy; 2025. Developed by
          <a href="https://bento.me/ohugo" target="_blank" rel="noopener noreferrer">
            <div className="logohugo"></div>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App