
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VM, CalculadoraState, Precos, Desconto } from '@/types';

const PRECOS_DEFAULT: Precos = {
  // Infraestrutura (por hora)
  vcpuHora: 0.0347,
  ramHora: 0.0278,
  horasMes: 720,
  
  // Storage (por mês)
  fcmGB: 0.75,
  ssdGB: 0.55,
  
  // Backup
  backupPadrao: 0.30,
  backupDuplo: 0.25,
  backupTriplo: 0.20,
  
  // Monitoramento (automático)
  monitoramento: 100,
  
  // Licenças adicionais
  antivirus: 55,
  
  // TSPlus
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
  
  // Outras
  thinprint: 850,
  ipAdicional: 70,
  
  // WAF
  waf: {
    pro: 200,
    business: 1600,
    enterprise: 15600
  }
};

function createDefaultVM(): VM {
  return {
    id: crypto.randomUUID(),
    nome: `VM-${Date.now()}`,
    vcpu: 2,
    ram: 4,
    discoFCM: 0,
    discoSSD: 50,
    backupTipo: 'padrao',
    sistemaOperacional: '', // Nenhum SO selecionado inicialmente
    bancoDados: '', // Nenhum BD selecionado inicialmente
    antivirus: false,
    tsplus: {
      enabled: false,
      usuarios: 5,
      advancedSecurity: false,
      twoFactor: false
    },
    thinprint: false,
    ipsAdicionais: 0,
    waf: 'none',
    descontoIndividual: 0,
    status: 'rascunho'
  };
}

export const useCalculadoraStore = create<CalculadoraState>()(
  persist(
    (set, get) => ({
      vms: [],
      selectedVMId: null,
      descontos: [],
      precos: PRECOS_DEFAULT,

      addVM: (vmData = {}) => {
        const newVM = { ...createDefaultVM(), ...vmData };
        set(state => ({
          vms: [...state.vms, newVM],
          selectedVMId: newVM.id
        }));
      },

      updateVM: (id, updates) => {
        set(state => ({
          vms: state.vms.map(vm => 
            vm.id === id ? { ...vm, ...updates } : vm
          )
        }));
      },

      removeVM: (id) => {
        set(state => {
          const newVMs = state.vms.filter(vm => vm.id !== id);
          return {
            vms: newVMs,
            selectedVMId: state.selectedVMId === id 
              ? (newVMs.length > 0 ? newVMs[0].id : null)
              : state.selectedVMId
          };
        });
      },

      duplicateVM: (id) => {
        const vm = get().vms.find(v => v.id === id);
        if (vm) {
          const duplicated = {
            ...vm,
            id: crypto.randomUUID(),
            nome: `${vm.nome} (Cópia)`
          };
          set(state => ({
            vms: [...state.vms, duplicated],
            selectedVMId: duplicated.id
          }));
        }
      },

      selectVM: (id) => {
        set({ selectedVMId: id });
      },

      addDesconto: (desconto) => {
        set(state => ({
          descontos: [...state.descontos, desconto]
        }));
      },

      updateDesconto: (id, updates) => {
        set(state => ({
          descontos: state.descontos.map(d => 
            d.id === id ? { ...d, ...updates } : d
          )
        }));
      },

      removeDesconto: (id) => {
        set(state => ({
          descontos: state.descontos.filter(d => d.id !== id)
        }));
      }
    }),
    {
      name: 'optidata-calculadora',
      version: 2
    }
  )
);
