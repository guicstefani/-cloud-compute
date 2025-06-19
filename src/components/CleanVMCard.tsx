
import React, { useState } from 'react';
import { VM } from '@/types';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import { MoreHorizontal, Trash2, Copy, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CleanVMCardProps {
  vm: VM;
  calculadora: CalculadoraCloud;
  isSelected: boolean;
  onSelect: () => void;
}

export function CleanVMCard({ vm, calculadora, isSelected, onSelect }: CleanVMCardProps) {
  const { duplicateVM, removeVM } = useCalculadoraStore();
  const custo = calculadora.calcularVM(vm);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`
        bg-white rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md
        ${isSelected ? 'border-gray-900 shadow-sm' : 'border-gray-200'}
      `}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{vm.nome}</h3>
            <p className="text-sm text-gray-500">
              {vm.vcpu} vCPU • {vm.ram}GB RAM • {vm.discoFCM + vm.discoSSD}GB Storage
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(custo.total)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                {showDetails ? 'Ocultar' : 'Detalhes'}
              </button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  duplicateVM(vm.id);
                }}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVM(vm.id);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {showDetails && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Infraestrutura:</span>
                <span className="ml-2 font-medium">{formatCurrency(custo.subtotalInfra)}</span>
              </div>
              <div>
                <span className="text-gray-500">Licenças:</span>
                <span className="ml-2 font-medium">{formatCurrency(custo.subtotalLicencas)}</span>
              </div>
              <div>
                <span className="text-gray-500">Backup:</span>
                <span className="ml-2 font-medium">{formatCurrency(custo.backup)}</span>
              </div>
              <div>
                <span className="text-gray-500">Storage:</span>
                <span className="ml-2 font-medium">{formatCurrency(custo.storage)}</span>
              </div>
            </div>
            {vm.sistemaOperacional && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                  Sistema Operacional
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
