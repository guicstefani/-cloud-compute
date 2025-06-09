
import { BancoDados } from '@/types';

export const sqlServer: BancoDados[] = [
  {
    id: 'sql-express',
    nome: 'SQL Server Express',
    preco: 0,
    descricao: 'Gratuito (limitado a 10GB)',
    categoria: 'sql-server',
    limitacao: 'Máximo 10GB, 1GB RAM',
    icon: '🔵'
  },
  {
    id: 'sql-web',
    nome: 'SQL Server Web Edition',
    preco: 250,
    descricao: 'Para aplicações web',
    categoria: 'sql-server',
    icon: '🔵'
  },
  {
    id: 'sql-standard',
    nome: 'SQL Server Standard',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 1450,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'sql-server',
    icon: '🔵'
  },
  {
    id: 'sql-enterprise',
    nome: 'SQL Server Enterprise',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 3500,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'sql-server',
    icon: '🔵'
  }
];
