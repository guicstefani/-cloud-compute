
import React, { useState } from 'react';
import { useContratosStore } from '@/store/contratos';
import { formatCurrency } from '@/utils/calculadora';
import { X, Building, User, Calendar, DollarSign, Percent, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ModalNovoContratoProps {
  open: boolean;
  onClose: () => void;
}

const ModalNovoContrato = ({ open, onClose }: ModalNovoContratoProps) => {
  const { addContrato, addCliente } = useContratosStore();
  
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

  const calcularValorFinal = () => {
    const base = parseFloat(valorBase) || 0;
    if (tipoDesconto === 'antigo') {
      const desconto = parseFloat(descontoTotal) || 0;
      return base * (1 - desconto / 100);
    } else {
      const descontoSW = parseFloat(descontoSoftware) || 0;
      const descontoInf = parseFloat(descontoInfra) || 0;
      // Média ponderada: 30% software, 70% infra
      const descontoMedio = (descontoSW * 0.3) + (descontoInf * 0.7);
      return base * (1 - descontoMedio / 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!nomeCliente || !empresa || !vendedor || !dataFechamento || !dataPrimeiraFatura || !valorBase) {
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

    // Buscar o cliente recém-criado pelo nome/empresa
    const clienteId = crypto.randomUUID(); // Simplificado para o MVP

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

    // Reset form e fechar modal
    resetForm();
    onClose();
  };

  const resetForm = () => {
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

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gold flex items-center gap-2">
            <Building className="w-6 h-6" />
            Novo Contrato Fechado
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Cadastre um contrato já fechado para tracking de MRR
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <div className="premium-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              Dados do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeCliente" className="text-gray-300">Nome do Cliente *</Label>
                <Input
                  id="nomeCliente"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="João Silva"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="empresa" className="text-gray-300">Empresa *</Label>
                <Input
                  id="empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Empresa Ltda"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="telefone" className="text-gray-300">Telefone</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Dados do Contrato */}
          <div className="premium-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Dados do Contrato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendedor" className="text-gray-300">Vendedor Responsável *</Label>
                <Input
                  id="vendedor"
                  value={vendedor}
                  onChange={(e) => setVendedor(e.target.value)}
                  placeholder="Maria Santos"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="valorBase" className="text-gray-300">Valor Base Mensal *</Label>
                <Input
                  id="valorBase"
                  type="number"
                  step="0.01"
                  value={valorBase}
                  onChange={(e) => setValorBase(e.target.value)}
                  placeholder="5000.00"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataFechamento" className="text-gray-300">Data de Fechamento *</Label>
                <Input
                  id="dataFechamento"
                  type="date"
                  value={dataFechamento}
                  onChange={(e) => setDataFechamento(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataPrimeiraFatura" className="text-gray-300">Data Primeira Fatura *</Label>
                <Input
                  id="dataPrimeiraFatura"
                  type="date"
                  value={dataPrimeiraFatura}
                  onChange={(e) => setDataPrimeiraFatura(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Descontos */}
          <div className="premium-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-gold" />
              Descontos Aplicados
            </h3>
            
            <div className="mb-4">
              <Label className="text-gray-300">Tipo de Desconto</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="radio"
                    value="antigo"
                    checked={tipoDesconto === 'antigo'}
                    onChange={(e) => setTipoDesconto(e.target.value as 'antigo')}
                    className="text-gold"
                  />
                  Modelo Antigo (2024) - Desconto único
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="radio"
                    value="novo"
                    checked={tipoDesconto === 'novo'}
                    onChange={(e) => setTipoDesconto(e.target.value as 'novo')}
                    className="text-gold"
                  />
                  Modelo Novo (2025) - Separado
                </label>
              </div>
            </div>

            {tipoDesconto === 'antigo' ? (
              <div>
                <Label htmlFor="descontoTotal" className="text-gray-300">Desconto Total (%)</Label>
                <Input
                  id="descontoTotal"
                  type="number"
                  step="0.1"
                  value={descontoTotal}
                  onChange={(e) => setDescontoTotal(e.target.value)}
                  placeholder="15.0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="descontoSoftware" className="text-gray-300">Desconto Software (%)</Label>
                  <Input
                    id="descontoSoftware"
                    type="number"
                    step="0.1"
                    value={descontoSoftware}
                    onChange={(e) => setDescontoSoftware(e.target.value)}
                    placeholder="10.0"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="descontoInfra" className="text-gray-300">Desconto Infraestrutura (%)</Label>
                  <Input
                    id="descontoInfra"
                    type="number"
                    step="0.1"
                    value={descontoInfra}
                    onChange={(e) => setDescontoInfra(e.target.value)}
                    placeholder="5.0"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
            )}

            {/* Preview do Valor Final */}
            {valorBase && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gold/30">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Valor Final Mensal:</span>
                  <span className="text-2xl font-bold text-gold">
                    {formatCurrency(calcularValorFinal())}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="premium-card p-4">
            <Label htmlFor="observacoes" className="text-gray-300">Observações</Label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações adicionais sobre o contrato..."
              rows={3}
              className="w-full mt-2 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
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
            <Button
              type="submit"
              className="premium-btn"
            >
              <Save className="w-5 h-5" />
              Salvar Contrato
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNovoContrato;
