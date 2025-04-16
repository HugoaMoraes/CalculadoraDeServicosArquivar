import React from 'react';
import { ServicosData } from '../types';
import { Timeline } from './Timeline';

interface Props {
  servicos: ServicosData;
  onUpdate: (data: Partial<ServicosData>) => void;
  onCalculate: () => void;
}

export function ServicosForm({ servicos, onUpdate, onCalculate }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <Timeline currentStep={2} />
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Serviços</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Páginas para digitalização:
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent"
              value={servicos.digitalizacao.paginas || ''}
              onChange={(e) => onUpdate({
                digitalizacao: {
                  ...servicos.digitalizacao,
                  paginas: Number(e.target.value)
                }
              })}
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
                    onChange={() => onUpdate({
                      digitalizacao: {
                        ...servicos.digitalizacao,
                        tempoScanner: velocidade
                      }
                    })}
                    className="text-[#88BD43] focus:ring-[#88BD43]"
                  />
                  <span>{velocidade} ppm</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indexações:
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent"
              value={servicos.indexacao.quantidade || ''}
              onChange={(e) => onUpdate({
                indexacao: {
                  ...servicos.indexacao,
                  quantidade: Number(e.target.value)
                }
              })}
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
                    onChange={() => onUpdate({
                      indexacao: {
                        ...servicos.indexacao,
                        tempoPorArquivo: tempo
                      }
                    })}
                    className="text-[#88BD43] focus:ring-[#88BD43]"
                  />
                  <span>{tempo}s</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de caixas:
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent mb-4"
              value={servicos.caixas.quantidade || ''}
              onChange={(e) => onUpdate({
                caixas: {
                  ...servicos.caixas,
                  quantidade: Number(e.target.value)
                }
              })}
            />
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complexidade das caixas:
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'simples', label: 'Simples' },
                { value: 'intermediaria', label: 'Intermediária' },
                { value: 'complexa', label: 'Complexa' }
              ].map((tipo) => (
                <label key={tipo.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="complexidadeCaixa"
                    checked={servicos.caixas.complexidade === tipo.value}
                    onChange={() => onUpdate({
                      caixas: {
                        ...servicos.caixas,
                        complexidade: tipo.value as 'simples' | 'intermediaria' | 'complexa'
                      }
                    })}
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