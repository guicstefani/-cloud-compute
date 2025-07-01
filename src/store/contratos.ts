
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cliente, Contrato, EventoContrato, MetricasMRR } from '@/types/contratos';

interface ContratosState {
  // Estado
  clientes: Cliente[];
  contratos: Contrato[];
  eventos: EventoContrato[];
  selectedContrato: Contrato | null;
  
  // Ações - Clientes
  addCliente: (cliente: Omit<Cliente, 'id' | 'created_at'>) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  removeCliente: (id: string) => void;
  
  // Ações - Contratos
  addContrato: (contrato: Omit<Contrato, 'id' | 'created_at' | 'updated_at'>) => void;
  updateContrato: (id: string, contrato: Partial<Contrato>) => void;
  selectContrato: (id: string | null) => void;
  cancelarContrato: (id: string, motivo: string) => void;
  reativarContrato: (id: string) => void;
  
  // Ações - Eventos
  addEvento: (evento: Omit<EventoContrato, 'id' | 'created_at'>) => void;
  
  // Cálculos
  calcularMRR: () => MetricasMRR;
  getContratosAtivos: () => Contrato[];
  getEventosContrato: (contratoId: string) => EventoContrato[];
}

export const useContratosStore = create<ContratosState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      clientes: [],
      contratos: [],
      eventos: [],
      selectedContrato: null,
      
      // Ações - Clientes
      addCliente: (clienteData) => {
        const cliente: Cliente = {
          ...clienteData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        
        set(state => ({
          clientes: [...state.clientes, cliente]
        }));
      },
      
      updateCliente: (id, clienteData) => {
        set(state => ({
          clientes: state.clientes.map(cliente =>
            cliente.id === id ? { ...cliente, ...clienteData } : cliente
          )
        }));
      },
      
      removeCliente: (id) => {
        set(state => ({
          clientes: state.clientes.filter(cliente => cliente.id !== id)
        }));
      },
      
      // Ações - Contratos
      addContrato: (contratoData) => {
        const contrato: Contrato = {
          ...contratoData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          contratos: [...state.contratos, contrato]
        }));
        
        // Adicionar evento de novo contrato
        get().addEvento({
          contrato_id: contrato.id,
          tipo_evento: 'novo',
          data_evento: contrato.data_fechamento,
          valor_novo: contrato.valor_final,
          descricao: `Novo contrato fechado - ${contrato.vendedor}`
        });
      },
      
      updateContrato: (id, contratoData) => {
        const contratoAtual = get().contratos.find(c => c.id === id);
        if (!contratoAtual) return;
        
        const contratoAtualizado = {
          ...contratoAtual,
          ...contratoData,
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          contratos: state.contratos.map(contrato =>
            contrato.id === id ? contratoAtualizado : contrato
          )
        }));
        
        // Se houve mudança de valor, adicionar evento
        if (contratoData.valor_final && contratoData.valor_final !== contratoAtual.valor_final) {
          const tipoEvento = contratoData.valor_final > contratoAtual.valor_final ? 'upgrade' : 'downgrade';
          get().addEvento({
            contrato_id: id,
            tipo_evento: tipoEvento,
            data_evento: new Date().toISOString(),
            valor_anterior: contratoAtual.valor_final,
            valor_novo: contratoData.valor_final,
            descricao: `${tipoEvento === 'upgrade' ? 'Upgrade' : 'Downgrade'} de contrato`
          });
        }
      },
      
      selectContrato: (id) => {
        const contrato = id ? get().contratos.find(c => c.id === id) || null : null;
        set({ selectedContrato: contrato });
      },
      
      cancelarContrato: (id, motivo) => {
        const contrato = get().contratos.find(c => c.id === id);
        if (!contrato) return;
        
        get().updateContrato(id, { status: 'cancelado' });
        get().addEvento({
          contrato_id: id,
          tipo_evento: 'cancelamento',
          data_evento: new Date().toISOString(),
          valor_novo: 0,
          descricao: `Contrato cancelado: ${motivo}`
        });
      },
      
      reativarContrato: (id) => {
        get().updateContrato(id, { status: 'ativo' });
        get().addEvento({
          contrato_id: id,
          tipo_evento: 'reativacao',
          data_evento: new Date().toISOString(),
          valor_novo: get().contratos.find(c => c.id === id)?.valor_final || 0,
          descricao: 'Contrato reativado'
        });
      },
      
      // Ações - Eventos
      addEvento: (eventoData) => {
        const evento: EventoContrato = {
          ...eventoData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        
        set(state => ({
          eventos: [...state.eventos, evento]
        }));
      },
      
      // Cálculos
      calcularMRR: () => {
        const contratos = get().contratos;
        const contratosAtivos = contratos.filter(c => c.status === 'ativo');
        
        const mrrAtual = contratosAtivos.reduce((total, contrato) => total + contrato.valor_final, 0);
        
        // MRR Novo (contratos deste mês)
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        
        const contratosNovosMes = contratosAtivos.filter(contrato => 
          new Date(contrato.data_fechamento) >= inicioMes
        );
        const mrrNovo = contratosNovosMes.reduce((total, contrato) => total + contrato.valor_final, 0);
        
        // Churn (contratos cancelados este mês)
        const contratosCancelados = contratos.filter(contrato => 
          contrato.status === 'cancelado' &&
          new Date(contrato.updated_at) >= inicioMes
        );
        const churn = contratosCancelados.reduce((total, contrato) => total + contrato.valor_final, 0);
        
        // Cálculos adicionais
        const netMRRGrowth = mrrNovo - churn;
        const ticketMedio = contratosAtivos.length > 0 ? mrrAtual / contratosAtivos.length : 0;
        
        // Descontos
        const descontoTotal = contratosAtivos.reduce((total, contrato) => total + contrato.desconto_total, 0);
        const descontoSoftware = contratosAtivos.reduce((total, contrato) => total + contrato.desconto_software, 0);
        const descontoInfra = contratosAtivos.reduce((total, contrato) => total + contrato.desconto_infra, 0);
        
        const descontoMedio = contratosAtivos.length > 0 ? descontoTotal / contratosAtivos.length : 0;
        const descontoSoftwareMedio = contratosAtivos.length > 0 ? descontoSoftware / contratosAtivos.length : 0;
        const descontoInfraMedio = contratosAtivos.length > 0 ? descontoInfra / contratosAtivos.length : 0;
        
        return {
          mrrAtual,
          mrrNovo,
          churn,
          netMRRGrowth,
          ticketMedio,
          totalContratos: contratos.length,
          contratosAtivos: contratosAtivos.length,
          descontoMedio,
          descontoSoftware: descontoSoftwareMedio,
          descontoInfra: descontoInfraMedio
        };
      },
      
      getContratosAtivos: () => {
        return get().contratos.filter(c => c.status === 'ativo');
      },
      
      getEventosContrato: (contratoId) => {
        return get().eventos.filter(e => e.contrato_id === contratoId)
          .sort((a, b) => new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime());
      }
    }),
    {
      name: 'optidata-contratos',
      version: 1
    }
  )
);
