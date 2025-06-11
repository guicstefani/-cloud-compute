
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/calculadora';
import { gerarPDFProposta } from '@/utils/pdfGenerator';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Shield, 
  Database, 
  Users,
  Globe,
  Monitor,
  TrendingUp,
  Plus,
  Minus,
  Calculator,
  FileText,
  Download,
  Save,
  Zap,
  Headphones
} from 'lucide-react';

interface ItemUpgrade {
  id: string;
  categoria: 'recursos' | 'licencas' | 'servicos';
  nome: string;
  descricao: string;
  preco: number;
  unidade: string;
  quantidade: number;
  icon: React.ReactNode;
}

const UpgradeModule = () => {
  const [itensUpgrade, setItensUpgrade] = useState<ItemUpgrade[]>([]);

  const CATALOGO_UPGRADES = {
    recursos: [
      {
        id: 'vcpu',
        nome: 'vCPU Adicional',
        descricao: 'Processamento adicional',
        preco: 24.984,
        unidade: 'vCPU/mês',
        icon: <Cpu className="w-4 h-4 text-blue-500" />
      },
      {
        id: 'ram',
        nome: 'RAM Adicional',
        descricao: 'Memória adicional',
        preco: 20.016,
        unidade: 'GB/mês',
        icon: <MemoryStick className="w-4 h-4 text-green-500" />
      },
      {
        id: 'ssd',
        nome: 'Storage SSD',
        descricao: 'Armazenamento SSD adicional',
        preco: 0.55,
        unidade: 'GB/mês',
        icon: <HardDrive className="w-4 h-4 text-orange-500" />
      },
      {
        id: 'fcm',
        nome: 'Storage FCM',
        descricao: 'Armazenamento FCM adicional',
        preco: 0.75,
        unidade: 'GB/mês',
        icon: <HardDrive className="w-4 h-4 text-purple-500" />
      }
    ],
    licencas: [
      {
        id: 'windows',
        nome: 'Windows Server',
        descricao: 'Licença (2 vCPUs)',
        preco: 55,
        unidade: 'licença/mês',
        icon: <Monitor className="w-4 h-4 text-blue-600" />
      },
      {
        id: 'sql-standard',
        nome: 'SQL Server Standard',
        descricao: 'Licença (2 vCPUs)',
        preco: 800,
        unidade: 'licença/mês',
        icon: <Database className="w-4 h-4 text-red-600" />
      },
      {
        id: 'antivirus',
        nome: 'Antivírus',
        descricao: 'Proteção por VM',
        preco: 55,
        unidade: 'VM/mês',
        icon: <Shield className="w-4 h-4 text-green-600" />
      },
      {
        id: 'tsplus-5',
        nome: 'TSPlus (5 usuários)',
        descricao: 'Terminal Services',
        preco: 180,
        unidade: 'licença/mês',
        icon: <Users className="w-4 h-4 text-purple-600" />
      }
    ],
    servicos: [
      {
        id: 'ip-adicional',
        nome: 'IP Adicional',
        descricao: 'IP público dedicado',
        preco: 70,
        unidade: 'IP/mês',
        icon: <Globe className="w-4 h-4 text-indigo-600" />
      },
      {
        id: 'monitoramento',
        nome: 'Monitoramento',
        descricao: 'Monitoramento por VM',
        preco: 100,
        unidade: 'VM/mês',
        icon: <Monitor className="w-4 h-4 text-orange-600" />
      },
      {
        id: 'waf-pro',
        nome: 'WAF Pro',
        descricao: 'Web Application Firewall',
        preco: 200,
        unidade: 'instância/mês',
        icon: <Shield className="w-4 h-4 text-red-500" />
      },
      {
        id: 'waf-business',
        nome: 'WAF Business',
        descricao: 'WAF com recursos avançados',
        preco: 1600,
        unidade: 'instância/mês',
        icon: <Shield className="w-4 h-4 text-blue-500" />
      }
    ]
  };

  const adicionarItem = (catalogoItem: any, categoria: string) => {
    const novoItem: ItemUpgrade = {
      id: `${catalogoItem.id}-${Date.now()}`,
      categoria: categoria as any,
      nome: catalogoItem.nome,
      descricao: catalogoItem.descricao,
      preco: catalogoItem.preco,
      unidade: catalogoItem.unidade,
      quantidade: 1,
      icon: catalogoItem.icon
    };
    
    setItensUpgrade(prev => [...prev, novoItem]);
  };

  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      setItensUpgrade(prev => prev.filter(item => item.id !== id));
    } else {
      setItensUpgrade(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantidade } : item
        )
      );
    }
  };

  const removerItem = (id: string) => {
    setItensUpgrade(prev => prev.filter(item => item.id !== id));
  };

  const totalUpgrade = itensUpgrade.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  const handleGerarPDF = () => {
    gerarPDFProposta({
      tipo: 'upgrades',
      upgrades: itensUpgrade,
      total: totalUpgrade
    });
  };

  const renderCatalogo = (categoria: keyof typeof CATALOGO_UPGRADES, titulo: string) => (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {categoria === 'recursos' && <Cpu className="w-5 h-5 text-blue-600" />}
        {categoria === 'licencas' && <Database className="w-5 h-5 text-red-600" />}
        {categoria === 'servicos' && <Globe className="w-5 h-5 text-green-600" />}
        {titulo}
      </h3>
      <div className="space-y-3">
        {CATALOGO_UPGRADES[categoria].map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                {item.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.nome}</h4>
                <p className="text-sm text-gray-600">{item.descricao}</p>
                <p className="text-xs text-gray-500">{formatCurrency(item.preco)} por {item.unidade}</p>
              </div>
            </div>
            <Button
              onClick={() => adicionarItem(item, categoria)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Catálogo de Upgrades - Left/Center */}
      <div className="lg:col-span-9">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            Catálogo de Upgrades
          </h2>
          <p className="text-gray-600">Selecione itens e serviços avulsos para adicionar à sua infraestrutura</p>
        </div>

        {renderCatalogo('recursos', 'Recursos Computacionais')}
        {renderCatalogo('licencas', 'Licenças Avulsas')}
        {renderCatalogo('servicos', 'Serviços Adicionais')}
      </div>

      {/* Resumo do Upgrade - Right Column */}
      <div className="lg:col-span-3">
        <div className="sticky top-6 space-y-6">
          {/* Resumo Principal */}
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white rounded-2xl shadow-2xl p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">Total Upgrades</span>
                <Calculator className="w-5 h-5 text-blue-300" />
              </div>
              <div className="text-4xl font-bold mb-1">
                {formatCurrency(totalUpgrade)}
              </div>
              <div className="text-blue-200 text-sm">
                {itensUpgrade.length} item{itensUpgrade.length !== 1 ? 'ns' : ''} selecionado{itensUpgrade.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Lista de Itens Selecionados */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Itens Selecionados</h3>
            </div>
            
            {itensUpgrade.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum upgrade selecionado</p>
                <p className="text-sm">Escolha itens do catálogo</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {itensUpgrade.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 flex-1">
                      {item.icon}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{item.nome}</div>
                        <div className="text-xs text-gray-600">{formatCurrency(item.preco)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value) || 0)}
                        className="w-12 h-8 text-center text-sm"
                        min="0"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleGerarPDF}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              disabled={itensUpgrade.length === 0}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Gerar PDF do Upgrade
            </Button>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              disabled={itensUpgrade.length === 0}
            >
              <Download className="w-5 h-5 inline mr-2" />
              Exportar Excel
            </Button>
            <Button 
              className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-md"
              disabled={itensUpgrade.length === 0}
            >
              <Save className="w-5 h-5 inline mr-2" />
              Salvar Configuração
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">Por que Optidata?</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Segurança</p>
                <p className="text-xs text-gray-500">Enterprise</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Performance</p>
                <p className="text-xs text-gray-500">Otimizada</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Headphones className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Suporte</p>
                <p className="text-xs text-gray-500">24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModule;
