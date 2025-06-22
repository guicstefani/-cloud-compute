
import React from 'react';
import { Monitor, Cpu, HardDrive, MemoryStick } from 'lucide-react';
import { ObsidianCard } from './ObsidianCard';
import { MonumentText } from './MonumentText';
import { GoldButton } from './GoldButton';
import { formatCurrency } from '@/utils/calculadora';

interface PremiumVMCardProps {
  vm: any;
  custo: any;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

export const PremiumVMCard: React.FC<PremiumVMCardProps> = ({
  vm,
  custo,
  isSelected,
  onSelect,
  onDuplicate,
  onRemove
}) => {
  return (
    <ObsidianCard
      className={cn(
        'cursor-pointer transition-all duration-500',
        isSelected && 'ring-2 ring-gold-pure shadow-gold-glow'
      )}
      breathing={isSelected}
      shimmer={isSelected}
      onClick={onSelect}
    >
      {/* Header Premium */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-pure to-gold-rich rounded-2xl flex items-center justify-center shadow-lg">
            <Monitor className="w-8 h-8 text-obsidian-deep" />
          </div>
          <div>
            <h3 className="hero-text mb-1">{vm.nome}</h3>
            <p className="label-text">ID: {vm.id.slice(0, 8)}</p>
          </div>
        </div>
        
        {isSelected && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gold-whisper rounded-full">
            <div className="w-2 h-2 bg-gold-pure rounded-full animate-pulse" />
            <span className="label-text text-gold-pure">ATIVO</span>
          </div>
        )}
      </div>

      {/* Specs Grid - Respirando */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center breathing-element">
          <div className="flex items-center justify-center mb-2">
            <Cpu className="w-5 h-5 text-gold-pure mr-2" />
          </div>
          <div className="text-3xl font-light text-gold-warm mb-1">{vm.vcpu}</div>
          <div className="label-text">vCPUs</div>
        </div>
        
        <div className="text-center breathing-element" style={{ animationDelay: '1s' }}>
          <div className="flex items-center justify-center mb-2">
            <MemoryStick className="w-5 h-5 text-gold-pure mr-2" />
          </div>
          <div className="text-3xl font-light text-gold-warm mb-1">{vm.ram}</div>
          <div className="label-text">GB RAM</div>
        </div>
        
        <div className="text-center breathing-element" style={{ animationDelay: '2s' }}>
          <div className="flex items-center justify-center mb-2">
            <HardDrive className="w-5 h-5 text-gold-pure mr-2" />
          </div>
          <div className="text-3xl font-light text-gold-warm mb-1">{vm.discoFCM + vm.discoSSD}</div>
          <div className="label-text">GB Storage</div>
        </div>
      </div>

      {/* Licenças com Badges Dourados */}
      {(vm.sistemaOperacional || vm.bancoDados) && (
        <div className="flex flex-wrap gap-2 mb-8">
          {vm.sistemaOperacional && (
            <span className="inline-flex items-center px-3 py-1 bg-gold-whisper text-gold-pure rounded-full text-sm font-medium">
              OS License
            </span>
          )}
          {vm.bancoDados && (
            <span className="inline-flex items-center px-3 py-1 bg-gold-whisper text-gold-pure rounded-full text-sm font-medium">
              DB License
            </span>
          )}
        </div>
      )}

      {/* Separador Dourado */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-breath to-transparent mb-8" />

      {/* Preço Monumental */}
      <div className="flex items-end justify-between">
        <div>
          <p className="label-text mb-2">INVESTIMENTO MENSAL</p>
          <MonumentText 
            value={formatCurrency(custo.total)}
            className="mb-2"
          />
          <p className="label-text opacity-60">+ impostos aplicáveis</p>
        </div>
        
        <div className="flex gap-2">
          <GoldButton
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            Duplicar
          </GoldButton>
          
          <GoldButton
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remover
          </GoldButton>
        </div>
      </div>
    </ObsidianCard>
  );
};
