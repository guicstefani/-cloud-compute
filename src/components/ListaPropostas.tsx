
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Proposta } from '@/types/proposta';
import { formatCurrency } from '@/utils/calculadora';
import { FileText, Calendar, User, Building, Archive, Edit } from 'lucide-react';
import VisualizarPropostaModal from '@/components/VisualizarPropostaModal';

const ListaPropostas = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [propostasArquivadas, setPropostasArquivadas] = useState<Proposta[]>([]);
  const [propostaSelecionada, setPropostaSelecionada] = useState<Proposta | null>(null);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'ativas' | 'arquivadas'>('ativas');

  useEffect(() => {
    const proposalsSalvas = JSON.parse(localStorage.getItem('propostas') || '[]');
    const proposalsArquivadas = JSON.parse(localStorage.getItem('propostasArquivadas') || '[]');
    setPropostas(proposalsSalvas);
    setPropostasArquivadas(proposalsArquivadas);
  }, []);

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  const handleVisualizarProposta = (proposta: Proposta) => {
    setPropostaSelecionada(proposta);
    setModalVisualizarAberto(true);
  };

  const handleArquivarProposta = (proposta: Proposta) => {
    if (confirm(`Tem certeza que deseja arquivar a proposta "${proposta.nomeEmpresa} - ${proposta.nomeProjeto}"?`)) {
      // Remove das propostas ativas
      const novasPropostas = propostas.filter(p => p.id !== proposta.id);
      setPropostas(novasPropostas);
      localStorage.setItem('propostas', JSON.stringify(novasPropostas));

      // Adiciona às arquivadas
      const novasArquivadas = [...propostasArquivadas, { ...proposta, dataArquivamento: new Date().toISOString() }];
      setPropostasArquivadas(novasArquivadas);
      localStorage.setItem('propostasArquivadas', JSON.stringify(novasArquivadas));
    }
  };

  const handleDesarquivarProposta = (proposta: Proposta) => {
    if (confirm(`Tem certeza que deseja reativar a proposta "${proposta.nomeEmpresa} - ${proposta.nomeProjeto}"?`)) {
      // Remove das arquivadas
      const novasArquivadas = propostasArquivadas.filter(p => p.id !== proposta.id);
      setPropostasArquivadas(novasArquivadas);
      localStorage.setItem('propostasArquivadas', JSON.stringify(novasArquivadas));

      // Adiciona às ativas (remove a data de arquivamento)
      const { dataArquivamento, ...propostaSemArquivamento } = proposta as any;
      const novasPropostas = [...propostas, propostaSemArquivamento];
      setPropostas(novasPropostas);
      localStorage.setItem('propostas', JSON.stringify(novasPropostas));
    }
  };

  const handleExcluirDefinitivamente = (proposta: Proposta) => {
    if (confirm(`⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nTem certeza que deseja EXCLUIR PERMANENTEMENTE a proposta "${proposta.nomeEmpresa} - ${proposta.nomeProjeto}"?\n\nTodos os dados serão perdidos para sempre.`)) {
      const novasArquivadas = propostasArquivadas.filter(p => p.id !== proposta.id);
      setPropostasArquivadas(novasArquivadas);
      localStorage.setItem('propostasArquivadas', JSON.stringify(novasArquivadas));
    }
  };

  const listaAtual = modoVisualizacao === 'ativas' ? propostas : propostasArquivadas;

  if (listaAtual.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {modoVisualizacao === 'ativas' ? 'Nenhuma proposta ativa' : 'Nenhuma proposta arquivada'}
        </h3>
        <p className="text-gray-600">
          {modoVisualizacao === 'ativas' 
            ? 'Crie sua primeira proposta usando as outras abas da calculadora.'
            : 'As propostas arquivadas aparecerão aqui.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        {/* Toggle entre Ativas e Arquivadas */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <FileText className="w-6 h-6 mr-2 text-[#0066CC]" />
            Propostas ({listaAtual.length})
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant={modoVisualizacao === 'ativas' ? 'default' : 'outline'}
              onClick={() => setModoVisualizacao('ativas')}
              size="sm"
            >
              Ativas ({propostas.length})
            </Button>
            <Button
              variant={modoVisualizacao === 'arquivadas' ? 'default' : 'outline'}
              onClick={() => setModoVisualizacao('arquivadas')}
              size="sm"
            >
              <Archive className="w-4 h-4 mr-1" />
              Arquivadas ({propostasArquivadas.length})
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {listaAtual.map((proposta: any) => (
            <Card key={proposta.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-[#0066CC]" />
                    {proposta.nomeEmpresa}
                    {modoVisualizacao === 'arquivadas' && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Arquivada
                      </Badge>
                    )}
                  </h3>
                  <p className="text-gray-600">{proposta.nomeProjeto}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  {formatCurrency(proposta.configuracao.valorTotal)}/mês
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Comercial: {proposta.responsavelComercial}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Técnico: {proposta.responsavelTecnico}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {modoVisualizacao === 'ativas' 
                      ? `Criada em: ${formatarData(proposta.dataCriacao)}`
                      : `Arquivada em: ${formatarData(proposta.dataArquivamento)}`
                    }
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">{proposta.configuracao.vms.length}</span> VMs configuradas
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleVisualizarProposta(proposta)}
                >
                  Visualizar
                </Button>
                
                {modoVisualizacao === 'ativas' ? (
                  <>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      onClick={() => handleArquivarProposta(proposta)}
                    >
                      <Archive className="w-4 h-4 mr-1" />
                      Arquivar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDesarquivarProposta(proposta)}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Reativar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleExcluirDefinitivamente(proposta)}
                    >
                      Excluir Definitivamente
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de Visualização */}
      <VisualizarPropostaModal 
        open={modalVisualizarAberto}
        onOpenChange={setModalVisualizarAberto}
        proposta={propostaSelecionada}
      />
    </div>
  );
};

export default ListaPropostas;
