
import React, { useState } from 'react';
import { Calculator, Menu, X, Download, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobile';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Desktop Header */}
      <header className="w-full mobile-hide bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Optidata Cloud</h1>
                  <p className="text-xs text-gray-500">Calculadora Enterprise</p>
                </div>
              </div>
              <span className="ml-4 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                Professional
              </span>
            </div>

            {/* Tagline */}
            <div className="hidden xl:block">
              <p className="text-sm text-gray-600">
                Infraestrutura em nuvem de alta performance • SLA 99.99% • Suporte 24/7
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Proposta
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 mobile-show safe-top bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Optidata Cloud
              </h1>
              <p className="text-xs text-gray-500">Calculadora Pro</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="touch-target text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
          <div className="bg-white border-t border-gray-200 animate-slide-down">
            <div className="p-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerar Proposta
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
