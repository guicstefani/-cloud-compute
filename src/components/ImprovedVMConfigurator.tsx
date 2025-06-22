
import React, { useMemo } from 'react';
import { useCalculadoraStore } from '@/store/calculadora';
import { useOptimizedCalculation } from '@/hooks/useOptimizedCalculation';
import { validateVM } from '@/utils/validators';
import { RadioSelectionCard } from '@/components/RadioSelectionCard';
import { EconomyDisplay } from '@/components/EconomyDisplay';
import { VM } from '@/types';
import { Input } from '@/components/ui/input';
import TouchInput from '@/components/TouchInput';
import CollapsibleCard from '@/components/CollapsibleCard';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Shield, 
  Database, 
  Server,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { 
  sistemasWindows,
  linuxEnterprise,
  linuxGratuitos,
  todosSistemasOperacionais
} from '@/data/sistemasOperacionais';
import { formatCurrency } from '@/utils/calculadora';

interface ImprovedVMConfiguratorProps {
  vm: VM;
}

const ImprovedVMConfigurator = ({ vm }: ImprovedVMConfiguratorProps) => {
  const { updateVM, precos } = useCalculadoraStore();
  const { calculadora } = useOptimizedCalculation([vm], precos, []);
  
  // Memoizar validações
  const validationErrors = useMemo(() => validateVM(vm), [vm]);
  const hasErrors = validationErrors.filter(e => e.severity === 'error').length > 0;
  const hasWarnings = validationErrors.filter(e => e.severity === 'warning').length > 0;
  
  // Memoizar cálculo de custos
  const custo = useMemo(() => calculadora.calcularVM(vm), [vm, calculadora]);

  const handleUpdate = (updates: Partial<VM>) => {
    updateVM(vm.id, updates);
  };

  const handleSOSelection = (soId: string) => {
    handleUpdate({ sistemaOperacional: soId });
  };

  return (
    <div className="space-y-4">
      {/* Header com validação */}
      <CollapsibleCard
        title={vm.nome || 'Nova VM'}
        icon={hasErrors ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
        subtitle={`${vm.vcpu} vCPU • ${vm.ram}GB RAM`}
        value={formatCurrency(custo.total)}
        defaultExpanded
        className={hasErrors ? "border-red-200" : "border-green-200"}
      >
        <div className="space-y-4">
          <Input
            value={vm.nome}
            onChange={(e) => handleUpdate({ nome: e.target.value })}
            className="text-lg font-semibold"
            placeholder="Nome da VM"
          />
          
          {/* Indicadores de validação */}
          {(hasErrors || hasWarnings) && (
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                    error.severity === 'error' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {error.severity === 'error' ? 
                    <AlertTriangle className="w-4 h-4" /> : 
                    <Info className="w-4 h-4" />
                  }
                  <span>{error.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Economia individual */}
          {custo.descontoIndividual > 0 && (
            <EconomyDisplay
              originalValue={custo.subtotalInfraOriginal}
              currentValue={custo.subtotalInfra}
              label="Desconto Individual"
            />
          )}
        </div>
      </CollapsibleCard>

      {/* Recursos Computacionais */}
      <CollapsibleCard
        title="Recursos Computacionais"
        icon={<Cpu className="w-6 h-6" />}
        value={formatCurrency(custo.vcpu + custo.ram)}
        defaultExpanded
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchInput
            label="vCPU"
            icon={<Cpu className="w-4 h-4 text-gray-500" />}
            value={vm.vcpu}
            onChange={(value) => handleUpdate({ vcpu: value })}
            min={1}
            max={128}
            calculation={`${vm.vcpu} × R$ 0,0347 × 720h`}
            calculatedValue={formatCurrency(custo.vcpu)}
          />

          <TouchInput
            label="RAM"
            icon={<MemoryStick className="w-4 h-4 text-gray-500" />}
            value={vm.ram}
            onChange={(value) => handleUpdate({ ram: value })}
            min={1}
            max={1024}
            unit="GB"
            calculation={`${vm.ram}GB × R$ 0,0278 × 720h`}
            calculatedValue={formatCurrency(custo.ram)}
          />
        </div>
      </CollapsibleCard>

      {/* Sistema Operacional com Radio Buttons */}
      <CollapsibleCard
        title="Sistema Operacional"
        icon={<Server className="w-6 h-6" />}
        value={formatCurrency(custo.sistemaOperacional)}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Server className="w-4 h-4 mr-2 text-blue-600" />
              Microsoft Windows Server
            </h5>
            <div className="grid gap-3">
              {sistemasWindows.map(so => {
                const preco = typeof so.preco === 'function' ? so.preco(vm.vcpu) : so.preco;
                return (
                  <RadioSelectionCard
                    key={so.id}
                    id={so.id}
                    name={so.nome}
                    selected={vm.sistemaOperacional === so.id}
                    onSelect={() => handleSOSelection(so.id)}
                    icon={so.icon}
                    price={preco}
                    description={so.descricao}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Server className="w-4 h-4 mr-2 text-red-600" />
              Linux Enterprise (com suporte)
            </h5>
            <div className="grid gap-3">
              {linuxEnterprise.map(so => {
                const preco = typeof so.preco === 'function' ? so.preco(vm.vcpu) : so.preco;
                return (
                  <RadioSelectionCard
                    key={so.id}
                    id={so.id}
                    name={so.nome}
                    selected={vm.sistemaOperacional === so.id}
                    onSelect={() => handleSOSelection(so.id)}
                    icon={so.icon}
                    price={preco}
                    description={so.descricao}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Server className="w-4 h-4 mr-2 text-green-600" />
              Linux Gratuito (sem suporte)
            </h5>
            <div className="grid gap-3">
              {linuxGratuitos.map(so => (
                <RadioSelectionCard
                  key={so.id}
                  id={so.id}
                  name={so.nome}
                  selected={vm.sistemaOperacional === so.id}
                  onSelect={() => handleSOSelection(so.id)}
                  icon={so.icon}
                  price="Gratuito"
                  description={so.descricao}
                />
              ))}
            </div>
          </div>
        </div>
      </CollapsibleCard>

      {/* Resumo otimizado */}
      <CollapsibleCard
        title="Resumo de Custos"
        icon={<Database className="w-6 h-6" />}
        value={formatCurrency(custo.total)}
        defaultExpanded
        className="bg-blue-50 border-blue-200"
      >
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-sm">Infraestrutura</span>
            <span className="font-medium">{formatCurrency(custo.subtotalInfra)}</span>
          </div>
          
          {custo.sistemaOperacional > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm">Sistema Operacional</span>
              <span className="font-medium">{formatCurrency(custo.sistemaOperacional)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-blue-500">
            <span>Total Mensal</span>
            <span className="text-blue-600">{formatCurrency(custo.total)}</span>
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default ImprovedVMConfigurator;
