
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DadosProjeto {
  nomeEmpresa: string;
  nomeProjeto: string;
  contato: string;
  email: string;
  consultor: string;
  validadeProposta: 15 | 30 | 45 | 60;
  condicoesPagamento: 'mensal' | 'anual';
  observacoes: string;
  dataCriacao: string;
}

export interface TipoDesconto {
  modo: 'individual' | 'global';
  percentualGlobal: number;
}

export interface ProjetoState {
  dados: DadosProjeto;
  desconto: TipoDesconto;
  
  // Actions
  updateDados: (dados: Partial<DadosProjeto>) => void;
  updateDesconto: (desconto: Partial<TipoDesconto>) => void;
  resetProjeto: () => void;
}

const DADOS_DEFAULT: DadosProjeto = {
  nomeEmpresa: '',
  nomeProjeto: 'Infraestrutura Cloud',
  contato: '',
  email: '',
  consultor: '',
  validadeProposta: 30,
  condicoesPagamento: 'mensal',
  observacoes: '',
  dataCriacao: new Date().toISOString()
};

const DESCONTO_DEFAULT: TipoDesconto = {
  modo: 'individual',
  percentualGlobal: 0
};

export const useProjetoStore = create<ProjetoState>()(
  persist(
    (set) => ({
      dados: DADOS_DEFAULT,
      desconto: DESCONTO_DEFAULT,

      updateDados: (novosDados) => {
        set((state) => ({
          dados: { ...state.dados, ...novosDados }
        }));
      },

      updateDesconto: (novoDesconto) => {
        set((state) => ({
          desconto: { ...state.desconto, ...novoDesconto }
        }));
      },

      resetProjeto: () => {
        set({
          dados: { ...DADOS_DEFAULT, dataCriacao: new Date().toISOString() },
          desconto: DESCONTO_DEFAULT
        });
      }
    }),
    {
      name: 'optidata-projeto',
      version: 1
    }
  )
);
