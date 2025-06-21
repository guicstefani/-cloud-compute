
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useCalculadoraStore } from '@/store/calculadora';
import { VM } from '@/types';
import { X, Cpu, Database, HardDrive } from 'lucide-react';

interface PremiumVMModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vm?: VM;
}

const PremiumVMModal = ({ open, onOpenChange, vm }: PremiumVMModalProps) => {
  const { updateVM } = useCalculadoraStore();
  const [localVM, setLocalVM] = useState<VM | null>(vm || null);

  React.useEffect(() => {
    if (vm) {
      setLocalVM(vm);
    }
  }, [vm]);

  const handleSave = () => {
    if (localVM) {
      updateVM(localVM.id, localVM);
      onOpenChange(false);
    }
  };

  const updateField = (field: keyof VM, value: any) => {
    if (localVM) {
      setLocalVM({ ...localVM, [field]: value });
    }
  };

  if (!localVM) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-optidata-dark-card border-optidata-dark-light">
        <DialogHeader className="border-b border-optidata-dark-light pb-4">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-optidata-gold to-optidata-gold-light rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-optidata-dark" />
            </div>
            Configurar VM: {localVM.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 py-6">
          {/* Coluna Esquerda - Configurações Básicas */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Nome da VM
              </label>
              <Input
                value={localVM.nome}
                onChange={(e) => updateField('nome', e.target.value)}
                className="premium-input"
                placeholder="Digite o nome da VM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-optidata-gold" />
                vCPU: {localVM.vcpu}
              </label>
              <Slider
                value={[localVM.vcpu]}
                onValueChange={(value) => updateField('vcpu', value[0])}
                min={1}
                max={32}
                step={1}
                className="premium-slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span>
                <span>16</span>
                <span>32</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-optidata-gold" />
                RAM: {localVM.ram} GB
              </label>
              <Slider
                value={[localVM.ram]}
                onValueChange={(value) => updateField('ram', value[0])}
                min={1}
                max={128}
                step={1}
                className="premium-slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 GB</span>
                <span>64 GB</span>
                <span>128 GB</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-optidata-gold" />
                Storage SSD: {localVM.discoSSD} GB
              </label>
              <Slider
                value={[localVM.discoSSD]}
                onValueChange={(value) => updateField('discoSSD', value[0])}
                min={20}
                max={1000}
                step={10}
                className="premium-slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>20 GB</span>
                <span>500 GB</span>
                <span>1000 GB</span>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Configurações Avançadas */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Tipo de Backup
              </label>
              <div className="space-y-2">
                {[
                  { value: 'padrao', label: 'Padrão (1x)' },
                  { value: 'duplo', label: 'Duplo (2x)' },
                  { value: 'triplo', label: 'Triplo (3x)' }
                ].map(option => (
                  <label key={option.value} className="option-card">
                    <input
                      type="radio"
                      name="backup"
                      value={option.value}
                      checked={localVM.backupTipo === option.value}
                      onChange={(e) => updateField('backupTipo', e.target.value)}
                      className="sr-only"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Sistema Operacional
              </label>
              <select
                value={localVM.sistemaOperacional}
                onChange={(e) => updateField('sistemaOperacional', e.target.value)}
                className="premium-input w-full"
              >
                <option value="">Selecione um SO</option>
                <option value="windows-server-2019">Windows Server 2019</option>
                <option value="windows-server-2022">Windows Server 2022</option>
                <option value="ubuntu-20.04">Ubuntu 20.04 LTS</option>
                <option value="ubuntu-22.04">Ubuntu 22.04 LTS</option>
                <option value="centos-8">CentOS 8</option>
              </select>
            </div>

            <div>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={localVM.antivirus}
                  onChange={(e) => updateField('antivirus', e.target.checked)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Antivírus Premium</span>
                  <span className="text-sm text-optidata-gold">R$ 55/mês</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-optidata-dark-light">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-optidata-dark-light text-gray-300 hover:bg-optidata-dark-light"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="btn-optidata"
          >
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumVMModal;
