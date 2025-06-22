
import React from 'react';
import { Cpu, Database, HardDrive, Shield, Globe, Monitor } from 'lucide-react';
import { UpgradeItem } from './types';

export const recursos: UpgradeItem[] = [
  // RECURSOS COMPUTACIONAIS
  {
    id: 'vcpu',
    nome: 'vCPU Adicional',
    descricao: 'Poder de processamento extra para suas aplicações',
    preco: 24.96,
    unidade: '/mês por unidade',
    categoria: 'computacional',
    icon: React.createElement(Cpu, { className: "w-5 h-5" }),
    minimo: 1,
    maximo: 500
  },
  {
    id: 'ram',
    nome: 'RAM Adicional',
    descricao: 'Memória para melhor performance e multitasking',
    preco: 20.02,
    unidade: '/mês por GB',
    categoria: 'computacional',
    icon: React.createElement(Database, { className: "w-5 h-5" }),
    minimo: 1,
    maximo: 1000
  },
  
  // ARMAZENAMENTO
  {
    id: 'ssd',
    nome: 'Storage SSD',
    descricao: 'Armazenamento rápido e confiável para dados críticos',
    preco: 0.55,
    unidade: '/GB/mês',
    categoria: 'storage',
    icon: React.createElement(HardDrive, { className: "w-5 h-5" }),
    minimo: 10,
    maximo: 50000
  },
  {
    id: 'fcm',
    nome: 'Storage FCM',
    descricao: 'Armazenamento econômico para dados frios',
    preco: 0.75,
    unidade: '/GB/mês',
    categoria: 'storage',
    icon: React.createElement(HardDrive, { className: "w-5 h-5" }),
    minimo: 10,
    maximo: 50000
  },
  
  // SEGURANÇA E REDE
  {
    id: 'ip',
    nome: 'IP Adicional',
    descricao: 'Endereço IP dedicado para seus serviços',
    preco: 70.00,
    unidade: '/mês',
    categoria: 'rede',
    icon: React.createElement(Globe, { className: "w-5 h-5" }),
    minimo: 1,
    maximo: 50
  },
  {
    id: 'waf',
    nome: 'WAF Pro',
    descricao: 'Proteção avançada contra ataques web',
    preco: 200.00,
    unidade: '/mês',
    categoria: 'seguranca',
    icon: React.createElement(Shield, { className: "w-5 h-5" }),
    minimo: 1,
    maximo: 10
  },
  
  // LICENÇAS
  {
    id: 'windows',
    nome: 'Windows Server',
    descricao: 'Licença Microsoft para 2 vCPUs',
    preco: 220.00,
    unidade: '/mês por licença',
    categoria: 'licenca',
    icon: React.createElement(Monitor, { className: "w-5 h-5" }),
    minimo: 1,
    maximo: 100
  }
];
