import React, { useMemo } from 'react';
import { ServicosData } from '../types';
import { Timeline } from './ui/Timeline';
import { Tooltip } from './ui/Tooltip';
import { Info, FileScan, Archive, FileSearch } from 'lucide-react';

interface Props {
  servicos: ServicosData;
  onUpdate: (data: Partial<ServicosData>) => void;
  onCalculate: () => void;
  setor: string;
  onTimelineClick: (step: number) => void;
}

export function ServicosForm({
  servicos,
  onUpdate,
  onCalculate,
  setor,
  onTimelineClick,
}: Props) {
  const complexidadeDescricoes = useMemo(
    () => ({
      simples:
        'Documentos organizados, sem grampos ou clipes, fácil manuseio. 30min para preparação, 15min para remontagem',
      intermediaria:
        'Documentos parcialmente organizados, com grampos e clipes comuns. 60min para preparação, 40min para remontagem',
      complexa:
        'Documentos desorganizados, com múltiplos grampos, clipes e necessidade de restauração. 90min para preparação, 60min para remontagem',
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Timeline currentStep={2} onStepClick={onTimelineClick} />
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-gray-800">Serviços do Setor </span>
          <span className="text-[#88BD43]">{setor}</span>
        </h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-base font-medium text-gray-700 mb-2 mt-4">
              <FileScan className="w-6 h-6 text-[#88BD43] mr-2" />
              Páginas para digitalização:
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent"
              value={servicos.digitalizacao.paginas || ''}
              onChange={(e) =>
                onUpdate({
                  digitalizacao: {
                    ...servicos.digitalizacao,
                    paginas: Number(e.target.value),
                  },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Velocidade do scanner (páginas por minuto):
            </label>
            <div className="flex space-x-4">
              {[10, 30, 60].map((velocidade) => (
                <label key={velocidade} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="tempoScanner"
                    checked={servicos.digitalizacao.tempoScanner === velocidade}
                    onChange={() =>
                      onUpdate({
                        digitalizacao: {
                          ...servicos.digitalizacao,
                          tempoScanner: velocidade,
                        },
                      })
                    }
                    className="text-[#88BD43] focus:ring-[#88BD43]"
                  />
                  <span>{velocidade} ppm</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-base font-medium text-gray-700 mb-2 mt-8">
              <FileSearch className="w-6 h-6 text-[#88BD43] mr-2" />
              Indexações:
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent"
              value={servicos.indexacao.quantidade || ''}
              onChange={(e) =>
                onUpdate({
                  indexacao: {
                    ...servicos.indexacao,
                    quantidade: Number(e.target.value),
                  },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo por indexação:
            </label>
            <div className="flex space-x-4">
              {[10, 60, 120].map((tempo) => (
                <label key={tempo} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="tempoIndex"
                    checked={servicos.indexacao.tempoPorArquivo === tempo}
                    onChange={() =>
                      onUpdate({
                        indexacao: {
                          ...servicos.indexacao,
                          tempoPorArquivo: tempo,
                        },
                      })
                    }
                    className="text-[#88BD43] focus:ring-[#88BD43]"
                  />
                  <span>{tempo}s</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-base font-medium text-gray-700 mb-2 mt-8">
              <Archive className="w-6 h-6 text-[#88BD43] mr-2" />
              Quantidade de caixas:
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent mb-4"
              value={servicos.caixas.quantidade || ''}
              onChange={(e) =>
                onUpdate({
                  caixas: {
                    ...servicos.caixas,
                    quantidade: Number(e.target.value),
                  },
                })
              }
            />

            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              Complexidade das caixas:
              <Tooltip
                content={
                  <div className="space-y-2">
                    <p>
                      <strong>Simples:</strong> {complexidadeDescricoes.simples}
                    </p>
                    <p>
                      <strong>Intermediária:</strong>{' '}
                      {complexidadeDescricoes.intermediaria}
                    </p>
                    <p>
                      <strong>Complexa:</strong>{' '}
                      {complexidadeDescricoes.complexa}
                    </p>
                  </div>
                }
              >
                <Info className="w-4 h-4 ml-2 text-gray-500 cursor-help" />
              </Tooltip>
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'simples', label: 'Simples' },
                { value: 'intermediaria', label: 'Intermediária' },
                { value: 'complexa', label: 'Complexa' },
              ].map((tipo) => (
                <label key={tipo.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="complexidadeCaixa"
                    checked={servicos.caixas.complexidade === tipo.value}
                    onChange={() =>
                      onUpdate({
                        caixas: {
                          ...servicos.caixas,
                          complexidade: tipo.value as
                            | 'simples'
                            | 'intermediaria'
                            | 'complexa',
                        },
                      })
                    }
                    className="text-[#88BD43] focus:ring-[#88BD43]"
                  />
                  <span>{tipo.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-[#88BD43] text-white py-2 px-4 rounded-lg hover:bg-[#7AAD35] transition-colors"
            onClick={onCalculate}
          >
            Calcular
          </button>
        </div>
      </div>
    </div>
  );
}
