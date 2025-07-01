
import React, { useState } from 'react';
import { useContratosStore } from '@/store/contratos';
import { formatCurrency } from '@/utils/calculadora';
import { Search, Filter, Plus, Eye, Edit, Trash2, Calendar, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModalNovoContrato from './ModalNovoContrato';

const ListaContratos = () => {
  const { contratos, clientes, selectContrato, cancelarContrato } = useContratosStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'cancelado' | 'pausado'>('todos');
  const [showModal, setShowModal] = useState(false);

  // Filtrar contratos
  const contratosFiltrados = contratos.filter(contrato => {
    const cliente = clientes.find(c => c.id === contrato.cliente_id);
    const matchesSearch = !searchTerm || 
      cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente?.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || contrato.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pausado': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contratos</h1>
          <p className="text-gray-400 mt-1">{contratosFiltrados.length} contratos encontrados</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="premium-btn"
        >
          <Plus className="w-5 h-5" />
          Novo Contrato
        </button>
      </div>

      {/* Filtros */}
      <div className="premium-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, empresa ou vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none"
            />
          </div>

          {/* Filtro de Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="pausado">Pausados</option>
            <option value="cancelado">Cancelados</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white hover:border-gold transition-colors">
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>
      </div>

      {/* Lista de Contratos */}
      <div className="grid gap-4">
        {contratosFiltrados.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum contrato encontrado
            </h3>
            <p className="text-gray-400 mb-6">
              {contratos.length === 0 
                ? 'Cadastre seu primeiro contrato para começar.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {contratos.length === 0 && (
              <button 
                onClick={() => setShowModal(true)}
                className="premium-btn"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Primeiro Contrato
              </button>
            )}
          </div>
        ) : (
          contratosFiltrados.map(contrato => {
            const cliente = clientes.find(c => c.id === contrato.cliente_id);
            
            return (
              <div key={contrato.id} className="premium-card p-6 hover:border-gold transition-colors">
                <div className="flex items-start justify-between">
                  {/* Informações principais */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {cliente?.empresa || 'Cliente não encontrado'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {cliente?.nome}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(contrato.data_fechamento)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valor Mensal</p>
                        <p className="text-lg font-semibold text-white">{formatCurrency(contrato.valor_final)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Desconto Total</p>
                        <p className="text-lg font-semibold text-orange-400">{contrato.desconto_total.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Vendedor</p>
                        <p className="text-sm text-gray-300">{contrato.vendedor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contrato.status)}`}>
                          {contrato.status.charAt(0).toUpperCase() + contrato.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown de Descontos */}
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-400">
                        Software: <span className="text-blue-400 font-medium">{contrato.desconto_software.toFixed(1)}%</span>
                      </span>
                      <span className="text-gray-400">
                        Infra: <span className="text-green-400 font-medium">{contrato.desconto_infra.toFixed(1)}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => selectContrato(contrato.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {contrato.status === 'ativo' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => cancelarContrato(contrato.id, 'Cancelado pelo usuário')}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Observações */}
                {contrato.observacoes && (
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300">{contrato.observacoes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <ModalNovoContrato 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

export default ListaContratos;
