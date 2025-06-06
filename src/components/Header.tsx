
import { Calculator, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white border-b border-optidata-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-optidata-blue to-optidata-blue-light rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-optidata-gray-900">
                Calculadora Cloud Privada
              </h1>
              <p className="text-sm text-optidata-gray-600">
                Optidata - Soluções em Nuvem
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-optidata-blue border-optidata-blue hover:bg-optidata-blue hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
