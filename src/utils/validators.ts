
import { VM } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export const validateVM = (vm: VM): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validações obrigatórias
  if (!vm.nome || vm.nome.trim() === '') {
    errors.push({
      field: 'nome',
      message: 'Nome da VM é obrigatório',
      severity: 'error'
    });
  }

  if (!vm.sistemaOperacional) {
    errors.push({
      field: 'sistemaOperacional',
      message: 'Sistema Operacional é obrigatório',
      severity: 'error'
    });
  }

  if (vm.vcpu < 1) {
    errors.push({
      field: 'vcpu',
      message: 'VM deve ter pelo menos 1 vCPU',
      severity: 'error'
    });
  }

  if (vm.ram < 1) {
    errors.push({
      field: 'ram',
      message: 'VM deve ter pelo menos 1GB de RAM',
      severity: 'error'
    });
  }

  if (vm.discoSSD === 0 && vm.discoFCM === 0) {
    errors.push({
      field: 'storage',
      message: 'VM deve ter pelo menos um tipo de armazenamento',
      severity: 'error'
    });
  }

  // Validações de recomendação
  const ratioRAMvCPU = vm.ram / vm.vcpu;
  if (ratioRAMvCPU < 2) {
    errors.push({
      field: 'ram',
      message: 'Recomendado: proporção mínima de 2GB RAM por vCPU',
      severity: 'warning'
    });
  }

  if (ratioRAMvCPU > 8) {
    errors.push({
      field: 'ram',
      message: 'Atenção: proporção muito alta de RAM por vCPU pode ser desnecessária',
      severity: 'warning'
    });
  }

  return errors;
};

export const validateVMList = (vms: VM[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (vms.length === 0) {
    errors.push({
      field: 'general',
      message: 'Configure pelo menos uma VM',
      severity: 'error'
    });
  }

  // Verificar nomes duplicados
  const nomes = vms.map(vm => vm.nome.trim().toLowerCase());
  const nomesDuplicados = nomes.filter((nome, index) => nomes.indexOf(nome) !== index);
  
  if (nomesDuplicados.length > 0) {
    errors.push({
      field: 'general',
      message: 'Existem VMs com nomes duplicados',
      severity: 'warning'
    });
  }

  return errors;
};

export const canCreateProposal = (vms: VM[]): boolean => {
  const allVMsValid = vms.every(vm => {
    const vmErrors = validateVM(vm);
    return vmErrors.filter(error => error.severity === 'error').length === 0;
  });

  return allVMsValid && vms.length > 0;
};
