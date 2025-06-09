
import { SistemaOperacional } from '@/types';

export const linuxEnterprise: SistemaOperacional[] = [
  {
    id: 'rhel-8',
    nome: 'Red Hat Enterprise Linux 8',
    preco: 1200,
    descricao: 'Por servidor/mês',
    categoria: 'linux-enterprise',
    icon: '🎩'
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
