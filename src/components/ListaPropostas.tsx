
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Proposta } from '@/types/proposta';
import { formatCurrency } from '@/utils/calculadora';
import { FileText, Calendar, User, Building } from 'lucide-react';

const ListaPropostas = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  useEffect(() => {
    const proposalsSalvas = JSON.parse(localStorage.getItem('propostas') || '[]');
    setPropostas(proposalsSalvas);
  }, []);

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  if (propostas.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma proposta salva
        </h3>
        <p className="text-gray-600">
          Crie sua primeira proposta usando as outras abas da calculadora.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-[#0066CC]" />
          Propostas Salvas ({propostas.length})
        </h2>
        
        <div className="space-y-4">
          {propostas.map((proposta) => (
            <Card key={proposta.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-[#0066CC]" />
                    {proposta.nomeEmpresa}
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
                  <span>Criada em: {formatarData(proposta.dataCriacao)}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">{proposta.configuracao.vms.length}</span> VMs configuradas
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Visualizar
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaPropostas;
