
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Proposta } from '@/types/proposta';
import { formatCurrency } from '@/utils/calculadora';
import { Building, User, Calendar, Server, Shield, Database, HardDrive, Monitor } from 'lucide-react';
import { todosSistemasOperacionais, todosBancosDados } from '@/data/sistemasOperacionais';

interface VisualizarPropostaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposta: Proposta | null;
}

const VisualizarPropostaModal = ({ open, onOpenChange, proposta }: VisualizarPropostaModalProps) => {
  if (!proposta) return null;

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obterNomeSistemaOperacional = (id: string) => {
    const so = todosSistemasOperacionais.find(s => s.id === id);
    return so ? so.nome : 'Não selecionado';
  };

  const obterNomeBancoDados = (id: string) => {
    const bd = todosBancosDados.find(b => b.id === id);
    return bd ? bd.nome : 'Não selecionado';
  };

  const obterTipoBackup = (tipo: string) => {
    switch(tipo) {
      case 'padrao': return 'Backup Padrão';
      case 'duplo': return 'Backup Duplo';
      case 'triplo': return 'Backup Triplo';
      default: return 'Backup Padrão';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="space-y-4">
            {/* Cabeçalho Principal */}
            <div className="bg-gradient-to-r from-[#0066CC] to-blue-600 text-white p-6 rounded-lg -m-6 mb-4">
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                PROPOSTA OPTIDATA
              </DialogTitle>
              <div className="flex items-center gap-2 text-blue-100 mb-2">
                <Building className="w-5 h-5" />
                <span className="text-xl font-semibold">{proposta.nomeEmpresa}</span>
              </div>
              <div className="text-blue-200">
                Projeto: {proposta.nomeProjeto}
              </div>
            </div>

            {/* Informações da Proposta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Responsável Comercial</span>
                </div>
                <p className="text-gray-900">{proposta.responsavelComercial}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Responsável Técnico</span>
                </div>
                <p className="text-gray-900">{proposta.responsavelTecnico}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Data de Criação</span>
                </div>
                <p className="text-gray-900">{formatarData(proposta.dataCriacao)}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Resumo Financeiro */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Resumo Financeiro</h3>
          <div className="flex items-center justify-between">
            <span className="text-green-700">Valor Total Mensal:</span>
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              {formatCurrency(proposta.configuracao.valorTotal)}/mês
            </Badge>
          </div>
        </div>

        {/* Detalhamento das VMs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#0066CC]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Máquinas Virtuais Configuradas ({proposta.configuracao.vms.length})
            </h3>
          </div>
          
          {proposta.configuracao.vms.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da VM</TableHead>
                    <TableHead>vCPU</TableHead>
                    <TableHead>Memória</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>S.O.</TableHead>
                    <TableHead>Backup</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposta.configuracao.vms.map((vm: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{vm.nome || `VM ${index + 1}`}</TableCell>
                      <TableCell>{vm.vcpu || vm.vCPU || 'N/A'} vCPUs</TableCell>
                      <TableCell>{vm.ram || vm.memoria || 'N/A'} GB</TableCell>
                      <TableCell>
                        {vm.discoFCM > 0 && `${vm.discoFCM}GB FCM`}
                        {vm.discoFCM > 0 && vm.discoSSD > 0 && ' + '}
                        {vm.discoSSD > 0 && `${vm.discoSSD}GB SSD`}
                        {!vm.discoFCM && !vm.discoSSD && 'N/A'}
                      </TableCell>
                      <TableCell>{obterNomeSistemaOperacional(vm.sistemaOperacional)}</TableCell>
                      <TableCell>{obterTipoBackup(vm.backupTipo)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma VM configurada nesta proposta
            </div>
          )}
        </div>

        {/* Licenças e Serviços */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0066CC]" />
            <h3 className="text-lg font-semibold text-gray-900">Licenças e Serviços Inclusos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sistemas Operacionais */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Sistemas Operacionais
              </h4>
              {proposta.configuracao.vms.filter((vm: any) => vm.sistemaOperacional).length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {proposta.configuracao.vms
                    .filter((vm: any) => vm.sistemaOperacional)
                    .map((vm: any, index: number) => (
                      <li key={index} className="text-blue-700">
                        • {vm.nome}: {obterNomeSistemaOperacional(vm.sistemaOperacional)}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-blue-600 text-sm">Nenhum sistema operacional licenciado</p>
              )}
            </div>

            {/* Bancos de Dados */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Bancos de Dados
              </h4>
              {proposta.configuracao.vms.filter((vm: any) => vm.bancoDados).length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {proposta.configuracao.vms
                    .filter((vm: any) => vm.bancoDados)
                    .map((vm: any, index: number) => (
                      <li key={index} className="text-purple-700">
                        • {vm.nome}: {obterNomeBancoDados(vm.bancoDados)}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-purple-600 text-sm">Nenhum banco de dados licenciado</p>
              )}
            </div>

            {/* Serviços Adicionais */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Serviços Adicionais
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="text-orange-700">• Monitoramento 24/7 (incluído)</li>
                {proposta.configuracao.vms.some((vm: any) => vm.antivirus) && (
                  <li className="text-orange-700">• Antivírus corporativo</li>
                )}
                {proposta.configuracao.vms.some((vm: any) => vm.tsplus?.enabled) && (
                  <li className="text-orange-700">• TSPlus (Terminal Server)</li>
                )}
                {proposta.configuracao.vms.some((vm: any) => vm.waf !== 'none') && (
                  <li className="text-orange-700">• Web Application Firewall (WAF)</li>
                )}
              </ul>
            </div>

            {/* Storage e Backup */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <HardDrive className="w-4 h-4 mr-2" />
                Storage e Backup
              </h4>
              <ul className="space-y-1 text-sm">
                {proposta.configuracao.vms.map((vm: any, index: number) => (
                  <li key={index} className="text-green-700">
                    • {vm.nome}: {obterTipoBackup(vm.backupTipo)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Descontos Aplicados */}
        {proposta.configuracao.descontos && proposta.configuracao.descontos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Descontos Aplicados</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              {proposta.configuracao.descontos.map((desconto: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-yellow-800">{desconto.nome || `Desconto ${index + 1}`}</span>
                  <span className="font-medium text-yellow-900">
                    {desconto.valor ? `${desconto.valor}%` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="border-t pt-4 mt-6">
          <div className="text-center text-sm text-gray-500">
            Proposta gerada pela Calculadora Optidata • {formatarData(proposta.dataCriacao)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizarPropostaModal;
