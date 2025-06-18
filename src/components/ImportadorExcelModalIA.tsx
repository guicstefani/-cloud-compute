
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bot } from 'lucide-react';
import ImportadorExcelIA from './ImportadorExcelIA';

interface ImportadorExcelModalIAProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportadorExcelModalIA = ({ open, onOpenChange }: ImportadorExcelModalIAProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            🤖 Importador Excel com IA
          </DialogTitle>
        </DialogHeader>
        <ImportadorExcelIA onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ImportadorExcelModalIA;
