
import React from 'react';
import { Check } from 'lucide-react';
import { SistemaOperacional } from '@/types';

interface SistemaOperacionalButtonProps {
  sistema: SistemaOperacional;
  selecionado: boolean;
  onSelect: () => void;
  vcpu?: number;
}

const SistemaOperacionalButton = ({ 
  sistema, 
  selecionado, 
  onSelect, 
  vcpu = 2 
}: SistemaOperacionalButtonProps) => {
  const preco = typeof sistema.preco === 'function' 
    ? sistema.preco(vcpu) 
    : sistema.preco;

  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-3 rounded-lg border-2 text-left transition-all
        ${selecionado 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-300 bg-white hover:border-gray-400'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start flex-1">
          <div className={`
            w-5 h-5 rounded border-2 mr-3 flex items-center justify-center mt-0.5
            ${selecionado 
              ? 'bg-green-500 border-green-500' 
              : 'bg-white border-gray-300'
            }
          `}>
            {selecionado && <Check className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="text-lg mr-2">{sistema.icon}</span>
              <span className={`font-medium ${selecionado ? 'text-green-900' : ''}`}>
                {sistema.nome}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {sistema.descricao}
            </p>
            {sistema.limitacao && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ {sistema.limitacao}
              </p>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          {preco === 0 ? (
            <span className="text-sm font-medium text-green-600">
              GRATUITO
            </span>
          ) : (
            <span className="text-sm text-gray-600">
              R$ {preco.toFixed(2)}/mês
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default SistemaOperacionalButton;
