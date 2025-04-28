import React from 'react';
import { CadastroData } from '../types';
import { Timeline } from './ui/Timeline';

interface Props {
  cadastro: CadastroData;
  onUpdate: (data: Partial<CadastroData>) => void;
  onAdvance: () => void;
  isNewSector?: boolean;
}

export function CadastroForm({
  cadastro,
  onUpdate,
  onAdvance,
  isNewSector = false,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Timeline currentStep={1} onStepClick={onAdvance} />
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Cadastro do Cliente
          </h2>
          <div className="space-y-4">
            <input
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent ${
                isNewSector ? 'bg-gray-100 text-gray-500' : ''
              }`}
              placeholder="Nome do Vendedor"
              value={cadastro.nomeUsuario}
              onChange={(e) => onUpdate({ nomeUsuario: e.target.value })}
              disabled={isNewSector}
            />
            <input
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent ${
                isNewSector ? 'bg-gray-100 text-gray-500' : ''
              }`}
              type="date"
              value={cadastro.data}
              onChange={(e) => onUpdate({ data: e.target.value })}
              disabled={isNewSector}
            />
            <input
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent ${
                isNewSector ? 'bg-gray-100 text-gray-500' : ''
              }`}
              placeholder="Nome do Cliente"
              value={cadastro.nomeCliente}
              onChange={(e) => onUpdate({ nomeCliente: e.target.value })}
              disabled={isNewSector}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BD43] focus:border-transparent"
              placeholder="Setor"
              value={cadastro.setor}
              onChange={(e) => onUpdate({ setor: e.target.value })}
            />
            <button
              className="w-full bg-[#88BD43] text-white py-2 px-4 rounded-lg hover:bg-[#7AAD35] transition-colors"
              onClick={onAdvance}
            >
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
