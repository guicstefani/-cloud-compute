
import React from 'react';

export interface UpgradeItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  unidade: string;
  categoria: string;
  icon: React.ReactNode;
  minimo?: number;
  maximo?: number;
}

export interface CarrinhoItem extends UpgradeItem {
  quantidade: number;
  subtotal: number;
}

export const categorias = {
  computacional: { nome: '💻 Recursos Computacionais', cor: 'from-blue-500 to-cyan-500' },
  storage: { nome: '💾 Armazenamento', cor: 'from-green-500 to-emerald-500' },
  rede: { nome: '🌐 Rede & Conectividade', cor: 'from-purple-500 to-violet-500' },
  seguranca: { nome: '🛡️ Segurança', cor: 'from-red-500 to-orange-500' },
  licenca: { nome: '🪟 Licenças', cor: 'from-yellow-500 to-orange-500' }
};
