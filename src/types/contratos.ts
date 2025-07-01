
export interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  created_at: string;
}

export interface Contrato {
  id: string;
  cliente_id: string;
  cliente?: Cliente;
  data_fechamento: string;
  data_primeira_fatura: string;
  valor_base: number;
  desconto_total: number;
  desconto_software: number;
  desconto_infra: number;
  valor_final: number;
  status: 'ativo' | 'cancelado' | 'pausado';
  vendedor: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface EventoContrato {
  id: string;
  contrato_id: string;
  tipo_evento: 'novo' | 'upgrade' | 'downgrade' | 'cancelamento' | 'reativacao' | 'mudanca_desconto';
  data_evento: string;
  valor_anterior?: number;
  valor_novo: number;
  descricao: string;
  created_at: string;
}

export interface HistoricoMRR {
  id: string;
  mes_ano: string;
  mrr_total: number;
  novos_contratos: number;
  churn: number;
  crescimento_liquido: number;
  ticket_medio: number;
  snapshot_date: string;
}

export interface MetricasMRR {
  mrrAtual: number;
  mrrNovo: number;
  churn: number;
  netMRRGrowth: number;
  ticketMedio: number;
  totalContratos: number;
  contratosAtivos: number;
  descontoMedio: number;
  descontoSoftware: number;
  descontoInfra: number;
}
