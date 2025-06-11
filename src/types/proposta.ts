
export interface Proposta {
  id: string;
  
  // Dados Básicos do Projeto
  nomeEmpresa: string;
  nomeProjeto: string;
  dataCriacao: string;
  dataModificacao: string;
  status: 'rascunho' | 'enviada' | 'em_analise' | 'aprovada' | 'rejeitada';
  
  // Responsabilidades
  responsavelComercial: string;
  responsavelTecnico?: string;
  aprovadorDesconto?: string;
  
  // Dados Comerciais
  valorTotal: number;
  descontoAplicado: number;
  prazoValidade: 15 | 30 | 45 | 60;
  condicoesPagamento: 'mensal' | 'anual';
  observacoesComerciais: string;
  
  // Configuração Técnica
  tipoConfiguração: 'vm' | 'pool' | 'upgrades';
  configuracaoTecnica: {
    vms?: any[];
    poolRecursos?: any;
    upgrades?: any[];
    descontos?: any[];
  };
  
  // Histórico
  historico: HistoricoAlteracao[];
}

export interface HistoricoAlteracao {
  id: string;
  data: string;
  usuario: string;
  acao: 'criada' | 'modificada' | 'enviada' | 'aprovada' | 'rejeitada' | 'comentario';
  detalhes: string;
}

export interface ResponsavelTecnico {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
}

export interface PropostaState {
  propostas: Proposta[];
  selectedPropostaId: string | null;
  responsaveisTecnicos: ResponsavelTecnico[];
  
  // Actions
  criarProposta: (dados: Partial<Proposta>) => string;
  updateProposta: (id: string, updates: Partial<Proposta>) => void;
  deleteProposta: (id: string) => void;
  selectProposta: (id: string) => void;
  adicionarHistorico: (propostaId: string, acao: HistoricoAlteracao) => void;
}
