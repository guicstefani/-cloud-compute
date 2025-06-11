
import React, { useState } from 'react';
import { Calculator, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobile';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Desktop Header - Compacto e Técnico */}
      <header className="bg-slate-50 border-b border-slate-200 mobile-hide">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-800">
                  Optidata Cloud Calculator
                </h1>
                <p className="text-xs text-slate-500">
                  Ferramenta Interna v2.1
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                <Settings className="w-4 h-4 mr-2" />
                Config
              </Button>
              <Button variant="default" size="sm" className="bg-slate-800 hover:bg-slate-900 text-white">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Simplificado */}
      <header className="sticky top-0 z-50 bg-slate-50 border-b border-slate-200 mobile-show safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800">
                Cloud Calculator
              </h1>
              <p className="text-xs text-slate-500">Optidata</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>
    </>
  );
};

export default Header;
