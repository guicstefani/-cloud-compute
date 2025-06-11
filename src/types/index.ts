export interface VM {
  id: string;
  nome: string;
  vcpu: number;
  ram: number;
  discoFCM: number;
  discoSSD: number;
  backupTipo: 'padrao' | 'duplo' | 'triplo';
  
  // Sistema Operacional (apenas um)
  sistemaOperacional: string; // ID do sistema selecionado
  
  // Banco de Dados (apenas um)
  bancoDados: string; // ID do banco selecionado
  
  // Licenças adicionais (todas opcionais)
  antivirus: boolean;
  tsplus: {
    enabled: boolean;
    usuarios: 3 | 5 | 10 | 15 | 25 | 35 | 49 | 'ilimitado';
    advancedSecurity: boolean;
    twoFactor: boolean;
  };
  thinprint: boolean;
  ipsAdicionais: number;
  waf: 'none' | 'pro' | 'business' | 'enterprise';
  
  // Desconto individual da VM (apenas infraestrutura)
  descontoIndividual: number; // percentual 0-50
  
  // Status
  status: 'rascunho' | 'finalizado';
  grupo?: string;
}

export interface SistemaOperacional {
  id: string;
  nome: string;
  preco: number | ((vcpu: number) => number);
  descricao: string;
  categoria: 'windows' | 'linux-enterprise' | 'linux-gratuito';
  limitacao?: string;
  icon?: string;
}

export interface BancoDados {
  id: string;
  nome: string;
  preco: number | ((vcpu: number) => number);
  descricao: string;
  categoria: 'sql-server' | 'oracle' | 'open-source' | 'enterprise-nosql';
  limitacao?: string;
  icon?: string;
}

export interface Precos {
  // Infraestrutura (por hora)
  vcpuHora: number;
  ramHora: number;
  horasMes: number;
  
  // Storage (por mês)
  fcmGB: number;
  ssdGB: number;
  
  // Backup
  backupPadrao: number;
  backupDuplo: number;
  backupTriplo: number;
  
  // Monitoramento (automático)
  monitoramento: number;
  
  // Licenças adicionais
  antivirus: number;
  
  // TSPlus
  tsplus: {
    3: number;
    5: number;
    10: number;
    15: number;
    25: number;
    35: number;
    49: number;
    ilimitado: number;
  };
  tsplusAdvSec: number;
  tsplus2FA: number;
  
  // Outras
  thinprint: number;
  ipAdicional: number;
  
  // WAF
  waf: {
    pro: number;
    business: number;
    enterprise: number;
  };
}

export interface DetalhamentoCusto {
  vcpu: number;
  ram: number;
  storage: number;
  backup: number;
  monitoramento: number;
  sistemaOperacional: number;
  bancoDados: number;
  licencasAdicionais: Record<string, number>;
  subtotalInfra: number;
  subtotalInfraOriginal: number;
  subtotalLicencas: number;
  descontoIndividual: number;
  total: number;
}

export interface Desconto {
  id: string;
  tipo: 'global' | 'categoria' | 'item';
  valor: number; // percentual
  categoria?: 'infraestrutura' | 'licencas';
  itemId?: string;
  ativo: boolean;
}

export interface CalculadoraState {
  vms: VM[];
  selectedVMId: string | null;
  descontos: Desconto[];
  precos: Precos;
  
  // Actions
  addVM: (vm?: Partial<VM>) => void;
  updateVM: (id: string, updates: Partial<VM>) => void;
  removeVM: (id: string) => void;
  duplicateVM: (id: string) => void;
  selectVM: (id: string) => void;
  
  addDesconto: (desconto: Desconto) => void;
  updateDesconto: (id: string, updates: Partial<Desconto>) => void;
  removeDesconto: (id: string) => void;
}

export interface Template {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
  vm: Partial<VM>;
}

export * from './proposta';
