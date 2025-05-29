import React from 'react';
import { X, FileDown, ArrowRight, CheckCheck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onGeneratePDF: () => Promise<void>;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  onGeneratePDF,
}: ModalProps) {
  if (!isOpen) return null;

  const handleGeneratePDF = async () => {
    await onGeneratePDF();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <CheckCheck className="inline w-6 h-6 mr-2 " style={{ color: '#88BD43' }} />
            Confirmação</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Você já baixou o PDF deste setor? Ou deseja continuar mesmo assim?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleGeneratePDF}
            className="flex items-center px-4 py-2 bg-[#88BD43] text-white rounded-lg hover:bg-[#7AAD35] transition-colors"
          >
            Gerar PDF
            <FileDown className="w-6 h-6 ml-2" />
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Continuar
            <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
