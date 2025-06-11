
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCalculadoraStore } from '@/store/calculadora';
import { usePropostasStore } from '@/store/propostas';
import { CalculadoraCloud, formatCurrency } from '@/utils/calculadora';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface CriarPropostaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoConfiguracao: 'vm' | 'pool' | 'upgrades';
  valorTotal: number;
  descontoAplicado: number;
  configuracaoTecnica: any;
}

interface FormData {
  nomeEmpresa: string;
  nomeProjeto: string;
  responsavelTecnico?: string;
  prazoValidade: 15 | 30 | 45 | 60;
  condicoesPagamento: 'mensal' | 'anual';
  observacoesComerciais: string;
}

const CriarPropostaModal = ({
  isOpen,
  onClose,
  tipoConfiguracao,
  valorTotal,
  descontoAplicado,
  configuracaoTecnica
}: CriarPropostaModalProps) => {
  const { vms, descontos } = useCalculadoraStore();
  const { criarProposta, responsaveisTecnicos } = usePropostasStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      nomeEmpresa: '',
      nomeProjeto: 'Infraestrutura Cloud',
      prazoValidade: 30,
      condicoesPagamento: 'mensal',
      observacoesComerciais: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const propostaId = criarProposta({
        nomeEmpresa: data.nomeEmpresa,
        nomeProjeto: data.nomeProjeto,
        responsavelComercial: 'Usuário Atual', // TODO: Pegar do contexto de autenticação
        responsavelTecnico: data.responsavelTecnico,
        valorTotal,
        descontoAplicado,
        prazoValidade: data.prazoValidade,
        condicoesPagamento: data.condicoesPagamento,
        observacoesComerciais: data.observacoesComerciais,
        tipoConfiguração: tipoConfiguracao,
        configuracaoTecnica: {
          vms: tipoConfiguracao === 'vm' ? vms : undefined,
          poolRecursos: tipoConfiguracao === 'pool' ? configuracaoTecnica : undefined,
          upgrades: tipoConfiguracao === 'upgrades' ? configuracaoTecnica : undefined,
          descontos
        }
      });

      // TODO: Mostrar toast de sucesso
      console.log('Proposta criada com sucesso:', propostaId);
      
      onClose();
      form.reset();
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      // TODO: Mostrar toast de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  const precisaAprovacaoDesconto = descontoAplicado > 20; // Limite exemplo

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-blue-600" />
            Criar Nova Proposta
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para gerar uma proposta comercial com a configuração atual
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário - 2/3 da tela */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Seção 1 - Identificação do Projeto */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Identificação do Projeto</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="nomeEmpresa"
                    rules={{ required: 'Nome da empresa é obrigatório' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Empresa *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Empresa ABC Ltda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nomeProjeto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Projeto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Migração para Cloud" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Seção 2 - Responsabilidades */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Responsabilidades</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="responsavelTecnico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável Técnico</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um responsável técnico" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {responsaveisTecnicos.filter(r => r.ativo).map(responsavel => (
                              <SelectItem key={responsavel.id} value={responsavel.id}>
                                {responsavel.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {precisaAprovacaoDesconto && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          Atenção
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-800">
                        Desconto aplicado ({descontoAplicado}%) requer aprovação de gerência.
                        A proposta será enviada para aprovação antes da finalização.
                      </p>
                    </div>
                  )}
                </div>

                {/* Seção 3 - Condições Comerciais */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Condições Comerciais</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="prazoValidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prazo de Validade</FormLabel>
                          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 dias</SelectItem>
                              <SelectItem value="30">30 dias</SelectItem>
                              <SelectItem value="45">45 dias</SelectItem>
                              <SelectItem value="60">60 dias</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condicoesPagamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condições de Pagamento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mensal">Mensal</SelectItem>
                              <SelectItem value="anual">Anual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="observacoesComerciais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações Comerciais</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Informações adicionais sobre a proposta, condições especiais, etc."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>

          {/* Resumo - 1/3 da tela */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4 sticky top-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-300">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Resumo da Proposta</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Tipo de Configuração</span>
                  <div className="font-medium">
                    {tipoConfiguracao === 'vm' ? 'Cotação por VM' :
                     tipoConfiguracao === 'pool' ? 'Pool de Recursos' : 'Upgrades'}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Valor Total</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(valorTotal)}
                  </div>
                  <div className="text-sm text-gray-500">por mês</div>
                </div>

                {descontoAplicado > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Desconto Aplicado</span>
                    <div className="font-medium text-green-600">
                      {descontoAplicado}%
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-sm text-gray-600">Itens Configurados</span>
                  <div className="font-medium">
                    {tipoConfiguracao === 'vm' ? `${vms.length} VM${vms.length !== 1 ? 's' : ''}` :
                     tipoConfiguracao === 'pool' ? 'Pool personalizado' : 
                     'Itens avulsos'}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <div className="text-sm text-gray-600 mb-2">TCO Anual</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(valorTotal * 12)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Criando...' : 'Criar Proposta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CriarPropostaModal;
