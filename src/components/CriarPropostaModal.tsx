
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { Proposta } from '@/types/proposta';

interface CriarPropostaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculadora: CalculadoraCloud;
}

const CriarPropostaModal = ({ open, onOpenChange, calculadora }: CriarPropostaModalProps) => {
  const { vms, descontos } = useCalculadoraStore();
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [responsavelComercial, setResponsavelComercial] = useState('');
  const [responsavelTecnico, setResponsavelTecnico] = useState('');

  const handleSalvar = () => {
    if (!nomeEmpresa || !nomeProjeto || !responsavelComercial || !responsavelTecnico) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const resultado = calculadora.calcularTotalGeral(vms, descontos);
    
    const novaProposta: Proposta = {
      id: Date.now().toString(),
      nomeEmpresa,
      nomeProjeto,
      responsavelComercial,
      responsavelTecnico,
      dataCriacao: new Date().toISOString(),
      configuracao: {
        vms: vms,
        descontos: descontos,
        valorTotal: resultado.totalComDesconto
      }
    };

    // Salvar no localStorage
    const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
    propostas.push(novaProposta);
    localStorage.setItem('propostas', JSON.stringify(propostas));

    // Limpar campos e fechar modal
    setNomeEmpresa('');
    setNomeProjeto('');
    setResponsavelComercial('');
    setResponsavelTecnico('');
    onOpenChange(false);
    
    alert('Proposta salva com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">📋 Nova Proposta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
            <Input
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              placeholder="Digite o nome da empresa"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Projeto</label>
            <Input
              value={nomeProjeto}
              onChange={(e) => setNomeProjeto(e.target.value)}
              placeholder="Digite o nome do projeto"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Responsável Comercial</label>
            <Input
              value={responsavelComercial}
              onChange={(e) => setResponsavelComercial(e.target.value)}
              placeholder="Digite o nome do responsável comercial"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Responsável Técnico</label>
            <Input
              value={responsavelTecnico}
              onChange={(e) => setResponsavelTecnico(e.target.value)}
              placeholder="Digite o nome do responsável técnico"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} className="bg-[#0066CC] hover:bg-[#0052A3]">
            Salvar Proposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CriarPropostaModal;
