
import React, { useState } from 'react';
import { Calculator, Menu, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobile';
import { useCalculadoraStore } from '@/store/calculadora';
import { CalculadoraCloud } from '@/utils/calculadora';
import { LegacyBridge } from '@/shared/services/LegacyBridge';
import { exportToExcel, exportToCSV } from '@/utils/exportUtils';
import UserMenu from './UserMenu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { vms, descontos, precos } = useCalculadoraStore();
  const calculadora = new CalculadoraCloud(precos);
  const legacyBridge = LegacyBridge.getInstance();

  const handleExportPDF = async () => {
    if (vms.length === 0) {
      alert('Adicione pelo menos uma VM antes de exportar');
      return;
    }

    try {
      await legacyBridge.generatePDF({
        tipo: 'vm',
        vms,
        calculadora,
        descontos
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleExportExcel = () => {
    if (vms.length === 0) {
      alert('Adicione pelo menos uma VM antes de exportar');
      return;
    }

    try {
      const resultado = calculadora.calcularTotalGeral(vms, descontos);
      const exportData = {
        vms: resultado.vms,
        totalGeral: resultado.totalComDesconto,
        economia: resultado.economia,
        calculadora
      };
      
      exportToExcel(exportData);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('Erro ao exportar Excel. Tente novamente.');
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm mobile-hide">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0066CC] to-[#0052A3] rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Calculadora Cloud Privada
                </h1>
                <p className="text-sm text-gray-600">
                  Optidata - Soluções em Nuvem
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <UserMenu />
              <Button 
                className="bg-[#0066CC] hover:bg-[#0052A3] text-white"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm mobile-show safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066CC] to-[#0052A3] rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Calculadora Cloud
              </h1>
              <p className="text-xs text-gray-600">Optidata</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="touch-target"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white animate-slide-down">
            <div className="p-4 space-y-3">
              <div className="flex justify-center">
                <UserMenu />
              </div>
              <Button 
                className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white"
                onClick={() => {
                  handleExportPDF();
                  setIsMobileMenuOpen(false);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-gray-300"
                onClick={() => {
                  handleExportExcel();
                  setIsMobileMenuOpen(false);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
