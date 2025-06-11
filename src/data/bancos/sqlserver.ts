
import { BancoDados } from '@/types';

export const sqlServer: BancoDados[] = [
  {
    id: 'sql-express',
    nome: 'SQL Server Express',
    preco: 0,
    descricao: 'Gratuito (limitado a 10GB)',
    categoria: 'sql-server',
    limitacao: 'Máximo 10GB, 1GB RAM',
    icon: 'sqlserver'
  },
  {
    id: 'sql-web',
    nome: 'SQL Server Web Edition',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 140,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'sql-server',
    icon: 'sqlserver'
  },
  {
    id: 'sql-standard',
    nome: 'SQL Server Standard',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 800,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'sql-server',
    icon: 'sqlserver'
  },
  {
    id: 'sql-enterprise',
    nome: 'SQL Server Enterprise',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 5200,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'sql-server',
    icon: 'sqlserver'
  }
];
