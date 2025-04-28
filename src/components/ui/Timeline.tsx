import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Props {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Timeline({ currentStep, onStepClick }: Props) {
  const steps = [
    { number: 1, title: 'Cadastro' },
    { number: 2, title: 'Serviços' },
    { number: 3, title: 'Resultados' }
  ];

  const handleClick = (step: number) => {
    if (onStepClick && step <= currentStep && step < 3) {
      onStepClick(step);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div 
              className={`flex flex-col items-center ${step.number <= currentStep && step.number < 3 ? 'cursor-pointer' : ''}`}
              onClick={() => handleClick(step.number)}
            >
              <div className="flex items-center">
                {currentStep > step.number ? (
                  <CheckCircle className="w-8 h-8 text-[#88BD43]" />
                ) : currentStep === step.number ? (
                  <Circle className="w-8 h-8 text-[#88BD43] fill-[#88BD43]" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <span className={`mt-2 text-sm ${currentStep === step.number ? 'text-[#88BD43] font-medium' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-24 h-1 mx-2 ${currentStep > step.number + 1 ? 'bg-[#88BD43]' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}