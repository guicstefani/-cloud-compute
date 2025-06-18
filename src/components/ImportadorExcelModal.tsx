
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import ImportadorExcel from './ImportadorExcel';

interface ImportadorExcelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportadorExcelModal = ({ open, onOpenChange }: ImportadorExcelModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importador de Excel
          </DialogTitle>
        </DialogHeader>
        <ImportadorExcel onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ImportadorExcelModal;
