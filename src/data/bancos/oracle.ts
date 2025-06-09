
import { BancoDados } from '@/types';

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
