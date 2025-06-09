
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
      <header className="w-full mobile-hide">
        {/* Linha amarela fina no topo */}
        <div className="h-1 bg-[#C7D82B]"></div>
        
        {/* Header preto */}
        <div className="bg-gray-950 py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Opticloud</h1>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#C7D82B] rounded-full"></div>
                <div className="w-2 h-2 bg-[#C7D82B] rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Cloud computing: Infraestrutura em nuvem de alta performance
            </p>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button className="bg-[#C7D82B] text-black font-semibold hover:bg-[#B5C525]">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 mobile-show safe-top">
        {/* Linha amarela fina no topo */}
        <div className="h-1 bg-[#C7D82B]"></div>
        
        {/* Header preto */}
        <div className="bg-gray-950 flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#C7D82B]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Opticloud
              </h1>
              <p className="text-xs text-gray-400">Calculadora Cloud</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="touch-target text-white hover:bg-gray-800"
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
          <div className="bg-gray-950 border-t border-gray-800 animate-slide-down">
            <div className="p-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button 
                className="w-full bg-[#C7D82B] text-black font-semibold hover:bg-[#B5C525]"
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
