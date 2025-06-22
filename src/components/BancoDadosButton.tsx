
import React from 'react';
import { Check } from 'lucide-react';
import { BancoDados } from '@/types';
import ProfessionalIcon from './ProfessionalIcon';

interface BancoDadosButtonProps {
  banco: BancoDados;
  selecionado: boolean;
  onSelect: () => void;
  vcpu?: number;
}

const BancoDadosButton = ({ 
  banco, 
  selecionado, 
  onSelect, 
  vcpu = 2 
}: BancoDadosButtonProps) => {
  const preco = typeof banco.preco === 'function' 
    ? banco.preco(vcpu) 
    : banco.preco;

  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-200 group
        ${selecionado 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          {/* Checkbox com melhor design */}
          <div className={`
            w-5 h-5 rounded border-2 mr-4 flex items-center justify-center mt-1 transition-all
            ${selecionado 
              ? 'bg-blue-500 border-blue-500' 
              : 'bg-white border-gray-300 group-hover:border-gray-400'
            }
          `}>
            {selecionado && <Check className="w-3 h-3 text-white" />}
          </div>
          
          <div className="flex-1">
            {/* Header com ícone e nome */}
            <div className="flex items-center mb-2">
              <div className="mr-3">
                <ProfessionalIcon 
                  type={banco.icon} 
                  size={20} 
                />
              </div>
              <h3 className={`font-semibold text-base leading-tight ${
                selecionado ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {banco.nome}
              </h3>
            </div>
            
            {/* Descrição técnica */}
            <p className="text-sm text-gray-600 mb-1">
              {banco.descricao}
            </p>
            
            {/* Limitações em destaque */}
            {banco.limitacao && (
              <div className="flex items-start mt-2">
                <div className="w-1 h-1 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <p className="text-xs text-amber-700 font-medium">
                  {banco.limitacao}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Preço com melhor hierarquia visual */}
        <div className="text-right ml-6 flex-shrink-0">
          {preco === 0 ? (
            <div className="px-3 py-1 bg-gray-700 border border-green-500/20 text-green-400 text-sm font-semibold rounded-full transition-all duration-200 hover:bg-green-500/10 hover:border-green-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              GRATUITO
            </div>
          ) : (
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                R$ {preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-500">
                por mês
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default BancoDadosButton;
