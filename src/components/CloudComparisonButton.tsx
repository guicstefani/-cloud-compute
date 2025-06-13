
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { BarChart3, Settings } from 'lucide-react';
import { CloudComparisonModal } from './CloudComparisonModal';

interface CloudComparisonButtonProps {
  optidataCost: number;
  vms: any[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const CloudComparisonButton: React.FC<CloudComparisonButtonProps> = ({
  optidataCost,
  vms,
  variant = 'outline',
  size = 'default',
  showIcon = true,
  className
}) => {
  const [open, setOpen] = useState(false);

  const canCompare = vms.length > 0 && vms.some(vm => vm.vcpu > 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant}
          size={size}
          disabled={!canCompare}
          className={`flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 ${className || ''}`}
        >
          {showIcon && <BarChart3 className="w-4 h-4" />}
          Comparar Clouds
          <Settings className="w-3 h-3 opacity-60" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Comparativo de Preços - Market Intelligence
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <CloudComparisonModal 
            optidataCost={optidataCost}
            vms={vms}
            onClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
