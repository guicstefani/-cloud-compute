
import React from 'react';
import { VM } from '@/types';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';

interface PDFConfigurationPageProps {
  vms: VM[];
  calculadora: CalculadoraCloud;
  totalValue: number;
  economia: number;
}

export const PDFConfigurationPage: React.FC<PDFConfigurationPageProps> = ({
  vms,
  calculadora,
  totalValue,
  economia
}) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-white p-16" style={{ pageBreakBefore: 'always' }}>
      <h2 className="text-3xl font-bold mb-8">Configuração dos Servidores</h2>
      
      {/* Tabela de VMs */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="bg-purple-600 text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">ESTRUTURA PARA COMPUTAÇÃO OPTICLOUD</h3>
        </div>
        
        {vms.map((vm, index) => {
          const custo = calculadora.calcularVM(vm);
          const licencas = [];
          if (vm.windowsServer) licencas.push('Windows Server');
          if (vm.rhel) licencas.push('RHEL');
          if (vm.suse) licencas.push('SUSE');
          if (vm.sqlServerSTD) licencas.push('SQL Server');
          
          return (
            <div key={vm.id} className="border-b border-gray-200 p-4">
              <h4 className="text-lg font-semibold mb-2">Servidor {index + 1} - {vm.nome}</h4>
              <p className="text-sm text-gray-600">
                {vm.vcpu} vCPUs • {vm.ram}GB RAM • {vm.discoFCM + vm.discoSSD}GB Storage
                {licencas.length > 0 && ` • ${licencas.join(', ')}`}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Resumo de Custos Detalhado */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Resumo de Custos</h3>
        
        {vms.map((vm, index) => {
          const custo = calculadora.calcularVM(vm);
          return (
            <div key={vm.id} className="mb-6">
              <h4 className="text-base font-semibold mb-3">Servidor {index + 1} - {vm.nome}</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Infraestrutura (vCPU + RAM)</span>
                  <span className="font-medium">{formatCurrency(custo.vcpu + custo.ram)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Armazenamento + Backup</span>
                  <span className="font-medium">{formatCurrency(custo.storage + custo.backup)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Monitoramento</span>
                  <span className="font-medium">{formatCurrency(custo.monitoramento)}</span>
                </div>
                
                {custo.subtotalLicencas > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licenças</span>
                    <span className="font-medium">{formatCurrency(custo.subtotalLicencas)}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Subtotal</span>
                  <span>{formatCurrency(custo.total)}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {economia > 0 && (
          <div className="flex justify-between text-green-600 mb-4">
            <span>Desconto Aplicado</span>
            <span className="font-medium">-{formatCurrency(economia)}</span>
          </div>
        )}
        
        <div className="border-t-2 border-[#C7D82B] pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total Mensal</span>
            <span>{formatCurrency(totalValue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
