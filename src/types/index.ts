
export interface VM {
  id: string;
  nome: string;
  vcpu: number;
  ram: number;
  discoFCM: number;
  discoSSD: number;
  backupTipo: 'padrao' | 'duplo' | 'triplo';
  
  // Licenças (todas opcionais)
  windowsServer: boolean;
  antivirus: boolean;
  sqlServerSTD: boolean;
  sqlServerWEB: boolean;
  tsplus: {
    enabled: boolean;
    usuarios: 3 | 5 | 10 | 15 | 25 | 35 | 49 | 'ilimitado';
    advancedSecurity: boolean;
    twoFactor: boolean;
  };
  thinprint: boolean;
  hana: boolean;
  suse: boolean;
  redhat: boolean;
  ipsAdicionais: number;
  waf: 'none' | 'pro' | 'business' | 'enterprise';
  
  // Status
  status: 'rascunho' | 'finalizado';
  grupo?: string;
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
  
  // Licenças
  windowsServer: number;
  antivirus: number;
  sqlServerSTD: number; // por 2 vCPUs
  sqlServerWEB: number;
  
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
  hana: number;
  suse: number;
  redhat: number;
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
  licencas: Record<string, number>;
  subtotalInfra: number;
  subtotalLicencas: number;
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
