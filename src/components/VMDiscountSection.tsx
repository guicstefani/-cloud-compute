
import { VM } from '@/types';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/utils/calculadora';
import { Tag, Info } from 'lucide-react';

interface VMDiscountSectionProps {
  vm: VM;
  totalInfra: number;
  onUpdate: (updates: Partial<VM>) => void;
}

const VMDiscountSection = ({ vm, totalInfra, onUpdate }: VMDiscountSectionProps) => {
  const descontoIndividual = vm.descontoIndividual || 0;
  const valorDesconto = totalInfra * descontoIndividual / 100;
  const totalComDesconto = totalInfra - valorDesconto;

  return (
    <Card className="p-6 border-blue-200 bg-blue-50/50">
      <div className="flex items-center space-x-2 mb-4">
        <Tag className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">
          Desconto Exclusivo para esta VM
        </h3>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <Slider
              value={[descontoIndividual]}
              onValueChange={([value]) => onUpdate({ descontoIndividual: value })}
              max={50}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium">{descontoIndividual}%</span>
              <span>50%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={descontoIndividual}
              onChange={(e) => onUpdate({ descontoIndividual: Number(e.target.value) })}
              min={0}
              max={50}
              className="w-16 text-center"
            />
            <span className="text-sm font-medium">%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-blue-700 mb-3">
          <Info className="w-3 h-3" />
          <span>Aplicado apenas em infraestrutura. Licenças não têm desconto.</span>
        </div>

        {/* Preview do impacto */}
        {descontoIndividual > 0 && (
          <div className="space-y-2 pt-3 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Infraestrutura original:</span>
              <span className="line-through text-gray-400">{formatCurrency(totalInfra)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Com desconto ({descontoIndividual}%):</span>
              <span className="text-green-600 font-semibold">{formatCurrency(totalComDesconto)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-green-600">Economia mensal:</span>
              <span className="text-green-600">{formatCurrency(valorDesconto)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-green-600">Economia anual:</span>
              <span className="text-green-600">{formatCurrency(valorDesconto * 12)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VMDiscountSection;
