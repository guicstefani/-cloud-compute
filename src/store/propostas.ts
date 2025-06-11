
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Proposta, PropostaState, ResponsavelTecnico, HistoricoAlteracao } from '@/types/proposta';

const RESPONSAVEIS_TECNICOS_DEFAULT: ResponsavelTecnico[] = [
  { id: '1', nome: 'João Silva', email: 'joao@optidata.com.br', ativo: true },
  { id: '2', nome: 'Maria Santos', email: 'maria@optidata.com.br', ativo: true },
  { id: '3', nome: 'Pedro Costa', email: 'pedro@optidata.com.br', ativo: true },
];

export const usePropostasStore = create<PropostaState>()(
  persist(
    (set, get) => ({
      propostas: [],
      selectedPropostaId: null,
      responsaveisTecnicos: RESPONSAVEIS_TECNICOS_DEFAULT,

      criarProposta: (dados) => {
        const novaProposta: Proposta = {
          id: crypto.randomUUID(),
          nomeEmpresa: dados.nomeEmpresa || '',
          nomeProjeto: dados.nomeProjeto || 'Infraestrutura Cloud',
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString(),
          status: 'rascunho',
          responsavelComercial: dados.responsavelComercial || 'Usuário Atual',
          valorTotal: dados.valorTotal || 0,
          descontoAplicado: dados.descontoAplicado || 0,
          prazoValidade: dados.prazoValidade || 30,
          condicoesPagamento: dados.condicoesPagamento || 'mensal',
          observacoesComerciais: dados.observacoesComerciais || '',
          tipoConfiguração: dados.tipoConfiguração || 'vm',
          configuracaoTecnica: dados.configuracaoTecnica || {},
          historico: [
            {
              id: crypto.randomUUID(),
              data: new Date().toISOString(),
              usuario: dados.responsavelComercial || 'Usuário Atual',
              acao: 'criada',
              detalhes: 'Proposta criada'
            }
          ],
          ...dados
        };

        set(state => ({
          propostas: [...state.propostas, novaProposta],
          selectedPropostaId: novaProposta.id
        }));

        return novaProposta.id;
      },

      updateProposta: (id, updates) => {
        set(state => ({
          propostas: state.propostas.map(proposta => 
            proposta.id === id 
              ? { 
                  ...proposta, 
                  ...updates, 
                  dataModificacao: new Date().toISOString() 
                }
              : proposta
          )
        }));
      },

      deleteProposta: (id) => {
        set(state => {
          const novasPropostas = state.propostas.filter(p => p.id !== id);
          return {
            propostas: novasPropostas,
            selectedPropostaId: state.selectedPropostaId === id ? null : state.selectedPropostaId
          };
        });
      },

      selectProposta: (id) => {
        set({ selectedPropostaId: id });
      },

      adicionarHistorico: (propostaId, novaAcao) => {
        set(state => ({
          propostas: state.propostas.map(proposta =>
            proposta.id === propostaId
              ? {
                  ...proposta,
                  historico: [...proposta.historico, { ...novaAcao, id: crypto.randomUUID() }],
                  dataModificacao: new Date().toISOString()
                }
              : proposta
          )
        }));
      }
    }),
    {
      name: 'optidata-propostas',
      version: 1
    }
  )
);
