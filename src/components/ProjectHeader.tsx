
import React from 'react';
import { useProjetoStore } from '@/store/projeto';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Building2, Calendar, Percent } from 'lucide-react';

const ProjectHeader = () => {
  const { dados, desconto, updateDados, updateDesconto } = useProjetoStore();

  const handleModoDescontoChange = (novoModo: 'individual' | 'global') => {
    updateDesconto({ modo: novoModo });
  };

  const handlePercentualGlobalChange = (valores: number[]) => {
    const novoPercentual = valores[0] || 0;
    updateDesconto({ percentualGlobal: novoPercentual });
  };

  return (
    <div className="container mx-auto px-6 py-4">
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Seção A - Identificação */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Dados do Projeto</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="empresa" className="text-sm font-medium text-gray-700">
                  Nome da Empresa *
                </Label>
                <Input
                  id="empresa"
                  value={dados.nomeEmpresa}
                  onChange={(e) => updateDados({ nomeEmpresa: e.target.value })}
                  placeholder="Ex: Empresa ABC Ltda"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="projeto" className="text-sm font-medium text-gray-700">
                  Nome do Projeto
                </Label>
                <Input
                  id="projeto"
                  value={dados.nomeProjeto}
                  onChange={(e) => updateDados({ nomeProjeto: e.target.value })}
                  placeholder="Ex: Migração para Cloud"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="contato" className="text-sm font-medium text-gray-700">
                    Contato Principal
                  </Label>
                  <Input
                    id="contato"
                    value={dados.contato}
                    onChange={(e) => updateDados({ contato: e.target.value })}
                    placeholder="Nome do responsável"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="consultor" className="text-sm font-medium text-gray-700">
                    Consultor Optidata
                  </Label>
                  <Input
                    id="consultor"
                    value={dados.consultor}
                    onChange={(e) => updateDados({ consultor: e.target.value })}
                    placeholder="Seu nome"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={dados.email}
                  onChange={(e) => updateDados({ email: e.target.value })}
                  placeholder="contato@empresa.com"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="pt-2 text-xs text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Proposta gerada em {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Seção B - Política de Desconto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Política de Desconto</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Tipo de Desconto
                </Label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleModoDescontoChange('individual')}
                    className={`
                      w-full p-3 rounded-lg border-2 text-left transition-all
                      ${desconto.modo === 'individual' 
                        ? 'border-blue-500 bg-blue-50 text-blue-900' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Individual</div>
                        <div className="text-xs text-gray-600">Cada VM tem seu próprio desconto</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleModoDescontoChange('global')}
                    className={`
                      w-full p-3 rounded-lg border-2 text-left transition-all
                      ${desconto.modo === 'global' 
                        ? 'border-green-500 bg-green-50 text-green-900' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Global</div>
                        <div className="text-xs text-gray-600">Mesmo desconto para todas as VMs</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {desconto.percentualGlobal}%
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              {desconto.modo === 'global' && (
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Desconto Global: {desconto.percentualGlobal}%
                  </Label>
                  <Slider
                    value={[desconto.percentualGlobal]}
                    onValueChange={handlePercentualGlobalChange}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                  
                  {desconto.percentualGlobal > 0 && (
                    <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                      ✅ Aplicando {desconto.percentualGlobal}% de desconto global
                    </div>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="validade" className="text-sm font-medium text-gray-700">
                    Validade
                  </Label>
                  <Select
                    value={dados.validadeProposta.toString()}
                    onValueChange={(value) => updateDados({ validadeProposta: Number(value) as any })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 dias</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="45">45 dias</SelectItem>
                      <SelectItem value="60">60 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="pagamento" className="text-sm font-medium text-gray-700">
                    Pagamento
                  </Label>
                  <Select
                    value={dados.condicoesPagamento}
                    onValueChange={(value: 'mensal' | 'anual') => updateDados({ condicoesPagamento: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Observações */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">
            Observações do Projeto
          </Label>
          <Textarea
            id="observacoes"
            value={dados.observacoes}
            onChange={(e) => updateDados({ observacoes: e.target.value })}
            placeholder="Informações adicionais sobre o projeto, requisitos específicos, etc."
            className="mt-1"
            rows={2}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProjectHeader;
