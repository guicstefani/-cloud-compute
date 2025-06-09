
import { Template } from '@/types';

export const VM_TEMPLATES: Template[] = [
  {
    id: 'web-basico',
    nome: 'Web Server Básico',
    descricao: 'Servidor web para aplicações pequenas e médias',
    icon: '🌐',
    vm: {
      nome: 'Web Server',
      vcpu: 2,
      ram: 4,
      discoFCM: 0,
      discoSSD: 50,
      backupTipo: 'padrao',
      sistemaOperacional: 'windows-2022-standard',
      bancoDados: '',
      antivirus: true,
      waf: 'pro'
    }
  },
  {
    id: 'database',
    nome: 'Database Server',
    descricao: 'Servidor de banco de dados com alta performance',
    icon: '🗄️',
    vm: {
      nome: 'Database Server',
      vcpu: 8,
      ram: 32,
      discoFCM: 200,
      discoSSD: 100,
      backupTipo: 'duplo',
      sistemaOperacional: 'windows-2022-standard',
      bancoDados: 'sql-standard',
      antivirus: true
    }
  },
  {
    id: 'terminal-server',
    nome: 'Terminal Server',
    descricao: 'Servidor para acesso remoto de múltiplos usuários',
    icon: '🖥️',
    vm: {
      nome: 'Terminal Server',
      vcpu: 4,
      ram: 16,
      discoFCM: 100,
      discoSSD: 50,
      backupTipo: 'padrao',
      sistemaOperacional: 'windows-2022-standard',
      bancoDados: '',
      antivirus: true,
      tsplus: {
        enabled: true,
        usuarios: 25,
        advancedSecurity: true,
        twoFactor: false
      }
    }
  },
  {
    id: 'sap-server',
    nome: 'SAP Server',
    descricao: 'Servidor otimizado para SAP HANA',
    icon: '📊',
    vm: {
      nome: 'SAP Server',
      vcpu: 16,
      ram: 128,
      discoFCM: 500,
      discoSSD: 200,
      backupTipo: 'triplo',
      sistemaOperacional: 'suse-15',
      bancoDados: 'sap-hana'
    }
  }
];
