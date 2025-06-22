
import { useMemo } from 'react';
import { VM, Precos, DetalhamentoCusto, Desconto } from '@/types';
import { CalculadoraCloud } from '@/utils/calculadora';

export const useOptimizedCalculation = (
  vms: VM[],
  precos: Precos,
  descontos: Desconto[]
) => {
  // Memoizar a instância da calculadora
  const calculadora = useMemo(() => new CalculadoraCloud(precos), [precos]);

  // Memoizar cálculos de VMs individuais
  const vmsCustos = useMemo(() => {
    return vms.map(vm => ({
      vm,
      custo: calculadora.calcularVM(vm)
    }));
  }, [vms, calculadora]);

  // Memoizar o cálculo total
  const totalGeral = useMemo(() => {
    return calculadora.calcularTotalGeral(vms, descontos);
  }, [vms, descontos, calculadora]);

  // Memoizar estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalVCPUs = vms.reduce((total, vm) => total + vm.vcpu, 0);
    const totalRAM = vms.reduce((total, vm) => total + vm.ram, 0);
    const totalStorage = vms.reduce((total, vm) => total + vm.discoFCM + vm.discoSSD, 0);
    
    return {
      totalVCPUs,
      totalRAM,
      totalStorage,
      vmsConfiguradas: vms.length,
      vmsComSO: vms.filter(vm => vm.sistemaOperacional).length,
      vmsComBD: vms.filter(vm => vm.bancoDados).length
    };
  }, [vms]);

  return {
    calculadora,
    vmsCustos,
    totalGeral,
    estatisticas
  };
};
