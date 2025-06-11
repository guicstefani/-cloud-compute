
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VM, Precos } from '@/types';
import { useProjetoStore } from './projeto';

interface CalculadoraState {
  vms: VM[];
  selectedVMId: string | null;
  precos: Precos;
  
  // Actions
  addVM: () => void;
  removeVM: (id: string) => void;
  updateVM: (id: string, updates: Partial<VM>) => void;
  selectVM: (id: string) => void;
  resetCalculadora: () => void;
}

const PRECOS_DEFAULT: Precos = {
  vcpuHora: 0.0347,
  ramHora: 0.0278,
  horasMes: 720,
  fcmGB: 0.89,
  ssdGB: 2.69,
  backupPadrao: 0.30,
  backupDuplo: 0.25,
  backupTriplo: 0.35,
  monitoramento: 35,
  antivirus: 55,
  tsplus: {
    3: 140,
    5: 180,
    10: 310,
    15: 390,
    25: 550,
    35: 730,
    49: 990,
    ilimitado: 1190
  },
  tsplusAdvSec: 140,
  tsplus2FA: 165,
  thinprint: 850,
  ipAdicional: 70,
  waf: {
    pro: 200,
    business: 1600,
    enterprise: 15600
  }
};

const criarNovaVM = (): VM => ({
  id: crypto.randomUUID(),
  nome: `VM ${Date.now().toString().slice(-4)}`,
  vcpu: 2,
  ram: 4,
  discoFCM: 50,
  discoSSD: 0,
  backupTipo: 'padrao',
  sistemaOperacional: '',
  bancoDados: '',
  antivirus: false,
  tsplus: {
    enabled: false,
    usuarios: 3,
    advancedSecurity: false,
    twoFactor: false
  },
  thinprint: false,
  ipsAdicionais: 0,
  waf: 'none',
  descontoIndividual: 0,
  status: 'rascunho'
});

export const useCalculadoraStore = create<CalculadoraState>()(
  persist(
    (set, get) => ({
      vms: [criarNovaVM()],
      selectedVMId: null,
      precos: PRECOS_DEFAULT,

      addVM: () => {
        const novaVM = criarNovaVM();
        set((state) => ({
          vms: [...state.vms, novaVM],
          selectedVMId: novaVM.id
        }));
      },

      removeVM: (id) => {
        set((state) => {
          const novasVMs = state.vms.filter(vm => vm.id !== id);
          return {
            vms: novasVMs,
            selectedVMId: state.selectedVMId === id 
              ? (novasVMs.length > 0 ? novasVMs[0].id : null)
              : state.selectedVMId
          };
        });
      },

      updateVM: (id, updates) => {
        set((state) => ({
          vms: state.vms.map(vm => 
            vm.id === id ? { ...vm, ...updates } : vm
          )
        }));
      },

      selectVM: (id) => {
        set({ selectedVMId: id });
      },

      resetCalculadora: () => {
        const novaVM = criarNovaVM();
        set({
          vms: [novaVM],
          selectedVMId: novaVM.id
        });
      }
    }),
    {
      name: 'optidata-calculadora',
      version: 1
    }
  )
);

// Hook para obter desconto efetivo (global ou individual)
export const useDescontoEfetivo = (vm: VM) => {
  const { desconto } = useProjetoStore();
  
  if (desconto.modo === 'global') {
    return desconto.percentualGlobal;
  }
  
  return vm.descontoIndividual || 0;
};
