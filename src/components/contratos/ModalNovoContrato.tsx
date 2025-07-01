
import React, { useState, useEffect } from 'react';
import { useContratosStore } from '@/store/contratos';
import { formatCurrency } from '@/utils/calculadora';
import { Building, User, Calendar, DollarSign, Percent, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StepIndicator from './StepIndicator';
import PreviewCard from './PreviewCard';

interface ModalNovoContratoProps {
  open: boolean;
  onClose: () => void;
}

const ModalNovoContrato = ({ open, onClose }: ModalNovoContratoProps) => {
  const { addContrato, addCliente } = useContratosStore();
  
  // Controle de etapas
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Estados do formulário
  const [nomeCliente, setNomeCliente] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [dataFechamento, setDataFechamento] = useState('');
  const [dataPrimeiraFatura, setDataPrimeiraFatura] = useState('');
  const [valorBase, setValorBase] = useState('');
  const [tipoDesconto, setTipoDesconto] = useState<'antigo' | 'novo'>('novo');
  const [descontoTotal, setDescontoTotal] = useState('');
  const [descontoSoftware, setDescontoSoftware] = useState('');
  const [descontoInfra, setDescontoInfra] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const steps = [
    { id: 1, title: 'Cliente', description: 'Dados do cliente' },
    { id: 2, title: 'Contrato', description: 'Datas e valores' },
    { id: 3, title: 'Descontos', description: 'Configurar descontos' },
    { id: 4, title: 'Revisão', description: 'Confirmar dados' }
  ];

  const calcularValorFinal = () => {
    const base = parseFloat(valorBase) || 0;
    if (tipoDesconto === 'antigo') {
      const desconto = parseFloat(descontoTotal) || 0;
      return base * (1 - desconto / 100);
    } else {
      const descontoSW = parseFloat(descontoSoftware) || 0;
      const descontoInf = parseFloat(descontoInfra) || 0;
      const descontoMedio = (descontoSW * 0.3) + (descontoInf * 0.7);
      return base * (1 - descontoMedio / 100);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return nomeCliente.trim() !== '' && empresa.trim() !== '' && vendedor.trim() !== '';
      case 2:
        return dataFechamento !== '' && dataPrimeiraFatura !== '' && valorBase !== '' && parseFloat(valorBase) > 0;
      case 3:
        if (tipoDesconto === 'antigo') {
          return descontoTotal !== '';
        } else {
          return descontoSoftware !== '' && descontoInfra !== '';
        }
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= Math.max(...completedSteps, currentStep)) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Criar cliente primeiro
    addCliente({
      nome: nomeCliente,
      empresa: empresa,
      email: email,
      telefone: telefone
    });

    const clienteId = crypto.randomUUID();

    // Criar contrato
    addContrato({
      cliente_id: clienteId,
      data_fechamento: dataFechamento,
      data_primeira_fatura: dataPrimeiraFatura,
      valor_base: parseFloat(valorBase),
      desconto_total: tipoDesconto === 'antigo' ? parseFloat(descontoTotal) || 0 : 
        ((parseFloat(descontoSoftware) || 0) * 0.3) + ((parseFloat(descontoInfra) || 0) * 0.7),
      desconto_software: parseFloat(descontoSoftware) || 0,
      desconto_infra: parseFloat(descontoInfra) || 0,
      valor_final: calcularValorFinal(),
      status: 'ativo',
      vendedor: vendedor,
      observacoes: observacoes
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setNomeCliente('');
    setEmpresa('');
    setEmail('');
    setTelefone('');
    setVendedor('');
    setDataFechamento('');
    setDataPrimeiraFatura('');
    setValorBase('');
    setDescontoTotal('');
    setDescontoSoftware('');
    setDescontoInfra('');
    setObservacoes('');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Dados do Cliente</h3>
                <p className="text-gray-400 text-sm">Informações básicas do cliente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCliente" className="text-gray-300">Nome do Cliente *</Label>
                <Input
                  id="nomeCliente"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="João Silva"
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa" className="text-gray-300">Empresa *</Label>
                <Input
                  id="empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Empresa Ltda"
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-gray-300">Telefone</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="vendedor" className="text-gray-300">Vendedor Responsável *</Label>
                <Input
                  id="vendedor"
                  value={vendedor}
                  onChange={(e) => setVendedor(e.target.value)}
                  placeholder="Maria Santos"
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Dados do Contrato</h3>
                <p className="text-gray-400 text-sm">Datas e valor base do contrato</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataFechamento" className="text-gray-300">Data de Fechamento *</Label>
                <Input
                  id="dataFechamento"
                  type="date"
                  value={dataFechamento}
                  onChange={(e) => setDataFechamento(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataPrimeiraFatura" className="text-gray-300">Data Primeira Fatura *</Label>
                <Input
                  id="dataPrimeiraFatura"
                  type="date"
                  value={dataPrimeiraFatura}
                  onChange={(e) => setDataPrimeiraFatura(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="valorBase" className="text-gray-300">Valor Base Mensal *</Label>
                <Input
                  id="valorBase"
                  type="number"
                  step="0.01"
                  value={valorBase}
                  onChange={(e) => setValorBase(e.target.value)}
                  placeholder="5000.00"
                  className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Percent className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Descontos Aplicados</h3>
                <p className="text-gray-400 text-sm">Configure os descontos do contrato</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300 mb-3 block">Tipo de Desconto</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      value="antigo"
                      checked={tipoDesconto === 'antigo'}
                      onChange={(e) => setTipoDesconto(e.target.value as 'antigo')}
                      className="text-gold focus:ring-gold"
                    />
                    Modelo Antigo (2024) - Desconto único
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      value="novo"
                      checked={tipoDesconto === 'novo'}
                      onChange={(e) => setTipoDesconto(e.target.value as 'novo')}
                      className="text-gold focus:ring-gold"
                    />
                    Modelo Novo (2025) - Separado
                  </label>
                </div>
              </div>

              {tipoDesconto === 'antigo' ? (
                <div className="space-y-2">
                  <Label htmlFor="descontoTotal" className="text-gray-300">Desconto Total (%)</Label>
                  <Input
                    id="descontoTotal"
                    type="number"
                    step="0.1"
                    value={descontoTotal}
                    onChange={(e) => setDescontoTotal(e.target.value)}
                    placeholder="15.0"
                    className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="descontoSoftware" className="text-gray-300">Desconto Software (%)</Label>
                    <Input
                      id="descontoSoftware"
                      type="number"
                      step="0.1"
                      value={descontoSoftware}
                      onChange={(e) => setDescontoSoftware(e.target.value)}
                      placeholder="10.0"
                      className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descontoInfra" className="text-gray-300">Desconto Infraestrutura (%)</Label>
                    <Input
                      id="descontoInfra"
                      type="number"
                      step="0.1"
                      value={descontoInfra}
                      onChange={(e) => setDescontoInfra(e.target.value)}
                      placeholder="5.0"
                      className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Save className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Revisão Final</h3>
                <p className="text-gray-400 text-sm">Confirme os dados antes de salvar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="premium-card p-4">
                  <h4 className="font-semibold text-white mb-3">Dados do Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nome:</span>
                      <span className="text-white">{nomeCliente}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Empresa:</span>
                      <span className="text-white">{empresa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vendedor:</span>
                      <span className="text-white">{vendedor}</span>
                    </div>
                  </div>
                </div>

                <div className="premium-card p-4">
                  <h4 className="font-semibold text-white mb-3">Dados do Contrato</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fechamento:</span>
                      <span className="text-white">{new Date(dataFechamento).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Primeira Fatura:</span>
                      <span className="text-white">{new Date(dataPrimeiraFatura).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valor Base:</span>
                      <span className="text-white">{formatCurrency(parseFloat(valorBase) || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-gray-300">Observações</Label>
                  <textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Informações adicionais sobre o contrato..."
                    rows={3}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none resize-none"
                  />
                </div>
              </div>
              
              <div>
                <PreviewCard
                  valorBase={parseFloat(valorBase) || 0}
                  descontoTotal={parseFloat(descontoTotal) || 0}
                  descontoSoftware={parseFloat(descontoSoftware) || 0}
                  descontoInfra={parseFloat(descontoInfra) || 0}
                  tipoDesconto={tipoDesconto}
                  valorFinal={calcularValorFinal()}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gold flex items-center gap-2">
            <Building className="w-6 h-6" />
            Novo Contrato Fechado
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Cadastre um contrato já fechado para tracking de MRR
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />

          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navegação */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-gray-400 hover:text-white"
              >
                Cancelar
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="premium-btn"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="premium-btn"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Contrato
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNovoContrato;
