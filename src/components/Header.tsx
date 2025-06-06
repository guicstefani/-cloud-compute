
import React, { useState } from 'react';
import { Calculator, Menu, X, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobile';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm mobile-hide">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0066CC] to-[#004499] rounded-xl flex items-center justify-center">
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
              <Button variant="outline" size="sm" className="border-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button className="bg-[#0066CC] hover:bg-[#0052A3] text-white">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm mobile-show safe-top">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066CC] to-[#004499] rounded-lg flex items-center justify-center">
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
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button 
                className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
