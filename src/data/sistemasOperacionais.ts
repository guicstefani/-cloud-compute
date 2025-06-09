
import { SistemaOperacional, BancoDados } from '@/types';

export const sistemasWindows: SistemaOperacional[] = [
  {
    id: 'windows-2019-standard',
    nome: 'Windows Server 2019 Standard',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 55,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'windows',
    icon: '🪟'
  },
  {
    id: 'windows-2019-datacenter',
    nome: 'Windows Server 2019 Datacenter',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 110,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'windows',
    icon: '🪟'
  },
  {
    id: 'windows-2022-standard',
    nome: 'Windows Server 2022 Standard',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 60,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'windows',
    icon: '🪟'
  },
  {
    id: 'windows-2022-datacenter',
    nome: 'Windows Server 2022 Datacenter',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 120,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'windows',
    icon: '🪟'
  }
];

export const linuxEnterprise: SistemaOperacional[] = [
  {
    id: 'rhel-8',
    nome: 'Red Hat Enterprise Linux 8',
    preco: 1200,
    descricao: 'Por servidor/mês',
    categoria: 'linux-enterprise',
    icon: '🎩'
  },
  {
    id: 'rhel-9',
    nome: 'Red Hat Enterprise Linux 9',
    preco: 1300,
    descricao: 'Por servidor/mês',
    categoria: 'linux-enterprise',
    icon: '🎩'
  },
  {
    id: 'suse-15',
    nome: 'SUSE Linux Enterprise Server 15',
    preco: 900,
    descricao: 'Por servidor/mês',
    categoria: 'linux-enterprise',
    icon: '🦎'
  },
  {
    id: 'oracle-linux',
    nome: 'Oracle Linux (com suporte)',
    preco: 800,
    descricao: 'Por servidor/mês',
    categoria: 'linux-enterprise',
    icon: '🔴'
  }
];

export const linuxGratuitos: SistemaOperacional[] = [
  {
    id: 'ubuntu-20',
    nome: 'Ubuntu Server 20.04 LTS',
    preco: 0,
    descricao: 'Gratuito',
    categoria: 'linux-gratuito',
    icon: '🟠'
  },
  {
    id: 'ubuntu-22',
    nome: 'Ubuntu Server 22.04 LTS',
    preco: 0,
    descricao: 'Gratuito',
    categoria: 'linux-gratuito',
    icon: '🟠'
  },
  {
    id: 'centos-7',
    nome: 'CentOS 7',
    preco: 0,
    descricao: 'Gratuito',
    categoria: 'linux-gratuito',
    icon: '💜'
  },
  {
    id: 'rocky-linux',
    nome: 'Rocky Linux 8/9',
    preco: 0,
    descricao: 'Gratuito',
    categoria: 'linux-gratuito',
    icon: '🏔️'
  },
  {
    id: 'alma-linux',
    nome: 'AlmaLinux 8/9',
    preco: 0,
    descricao: 'Gratuito',
    categoria: 'linux-gratuito',
    icon: '💚'
  },
  {
    id: 'debian-11',
    nome: 'Debian 11 (Bullseye)',
    preco: 0,
    descricao: 'Gratuito',
    categoria: 'linux-gratuito',
    icon: '🔴'
  },
  {
    id: 'debian-12',
    nome: 'Debian 12 (Bookworm)',
    preco: 0,
    descricao: 'Gratuito',
    categoria: 'linux-gratuito',
    icon: '🔴'
  }
];

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

export const oracle: BancoDados[] = [
  {
    id: 'oracle-xe',
    nome: 'Oracle Database XE',
    preco: 0,
    descricao: 'Gratuito (limitado)',
    categoria: 'oracle',
    limitacao: 'Máximo 12GB, 2GB RAM',
    icon: '🔴'
  },
  {
    id: 'oracle-standard',
    nome: 'Oracle Database Standard',
    preco: 2800,
    descricao: 'Por processador/mês',
    categoria: 'oracle',
    icon: '🔴'
  },
  {
    id: 'oracle-enterprise',
    nome: 'Oracle Database Enterprise',
    preco: 4500,
    descricao: 'Por processador/mês',
    categoria: 'oracle',
    icon: '🔴'
  }
];

export const bancosGratuitos: BancoDados[] = [
  {
    id: 'postgresql',
    nome: 'PostgreSQL 14/15',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: '🐘'
  },
  {
    id: 'mysql',
    nome: 'MySQL Community',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: '🐬'
  },
  {
    id: 'mariadb',
    nome: 'MariaDB',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: '🌊'
  },
  {
    id: 'mongodb',
    nome: 'MongoDB Community',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: '🍃'
  },
  {
    id: 'redis',
    nome: 'Redis',
    preco: 0,
    descricao: 'Cache/NoSQL gratuito',
    categoria: 'open-source',
    icon: '🔴'
  },
  {
    id: 'elasticsearch',
    nome: 'Elasticsearch',
    preco: 0,
    descricao: 'Search engine gratuito',
    categoria: 'open-source',
    icon: '🟡'
  }
];

export const bancosEnterprise: BancoDados[] = [
  {
    id: 'sap-hana',
    nome: 'SAP HANA',
    preco: 5000,
    descricao: 'Por servidor/mês',
    categoria: 'enterprise-nosql',
    icon: '💎'
  },
  {
    id: 'mysql-enterprise',
    nome: 'MySQL Enterprise',
    preco: 800,
    descricao: 'Com suporte Oracle',
    categoria: 'enterprise-nosql',
    icon: '🐬'
  },
  {
    id: 'mongodb-enterprise',
    nome: 'MongoDB Enterprise',
    preco: 1200,
    descricao: 'Com suporte comercial',
    categoria: 'enterprise-nosql',
    icon: '🍃'
  },
  {
    id: 'cassandra-enterprise',
    nome: 'DataStax Enterprise (Cassandra)',
    preco: 1500,
    descricao: 'NoSQL distribuído',
    categoria: 'enterprise-nosql',
    icon: '💫'
  }
];

export const todosSistemasOperacionais = [
  ...sistemasWindows,
  ...linuxEnterprise,
  ...linuxGratuitos
];

export const todosBancosDados = [
  ...sqlServer,
  ...oracle,
  ...bancosGratuitos,
  ...bancosEnterprise
];
