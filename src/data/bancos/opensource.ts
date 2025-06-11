
import { BancoDados } from '@/types';

export const bancosGratuitos: BancoDados[] = [
  {
    id: 'postgresql',
    nome: 'PostgreSQL 14/15',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: 'postgresql'
  },
  {
    id: 'mysql',
    nome: 'MySQL Community',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: 'mysql'
  },
  {
    id: 'mariadb',
    nome: 'MariaDB',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: 'mariadb'
  },
  {
    id: 'mongodb',
    nome: 'MongoDB Community',
    preco: 0,
    descricao: 'Gratuito e open source',
    categoria: 'open-source',
    icon: 'mongodb'
  },
  {
    id: 'redis',
    nome: 'Redis',
    preco: 0,
    descricao: 'Cache/NoSQL gratuito',
    categoria: 'open-source',
    icon: 'redis'
  },
  {
    id: 'elasticsearch',
    nome: 'Elasticsearch',
    preco: 0,
    descricao: 'Search engine gratuito',
    categoria: 'open-source',
    icon: 'elasticsearch'
  }
];

export const bancosEnterprise: BancoDados[] = [
  {
    id: 'sap-hana',
    nome: 'SAP HANA',
    preco: 5000,
    descricao: 'Por servidor/mês',
    categoria: 'enterprise-nosql',
    icon: 'sap'
  },
  {
    id: 'mysql-enterprise',
    nome: 'MySQL Enterprise',
    preco: 800,
    descricao: 'Com suporte Oracle',
    categoria: 'enterprise-nosql',
    icon: 'mysql'
  },
  {
    id: 'mongodb-enterprise',
    nome: 'MongoDB Enterprise',
    preco: 1200,
    descricao: 'Com suporte comercial',
    categoria: 'enterprise-nosql',
    icon: 'mongodb'
  },
  {
    id: 'cassandra-enterprise',
    nome: 'DataStax Enterprise (Cassandra)',
    preco: 1500,
    descricao: 'NoSQL distribuído',
    categoria: 'enterprise-nosql',
    icon: 'cassandra'
  }
];
