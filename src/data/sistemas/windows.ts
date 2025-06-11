
import { SistemaOperacional } from '@/types';

export const sistemasWindows: SistemaOperacional[] = [
  {
    id: 'windows-2019-datacenter',
    nome: 'Windows Server 2019 Datacenter',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 55,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'windows',
    icon: 'windows'
  },
  {
    id: 'windows-2022-datacenter',
    nome: 'Windows Server 2022 Datacenter',
    preco: (vcpu: number) => Math.ceil(vcpu / 2) * 55,
    descricao: 'Licença a cada 2 vCPUs',
    categoria: 'windows',
    icon: 'windows'
  }
];
