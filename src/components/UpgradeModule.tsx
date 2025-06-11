
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/calculadora';
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
  CheckCircle,
  ArrowRight
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
  const custoAtual = 8500; // Simulado

  const CATALOGO_UPGRADES = {
    recursos: [
      {
        id: 'vcpu',
        nome: 'vCPU Adicional',
        descricao: 'Processamento adicional',
        preco: 24.984,
        unidade: 'vCPU',
        icon: <Cpu className="w-4 h-4" />
      },
      {
        id: 'ram',
        nome: 'RAM Adicional',
        descricao: 'Memória adicional',
        preco: 20.016,
        unidade: 'GB',
        icon: <MemoryStick className="w-4 h-4" />
      },
      {
        id: 'ssd',
        nome: 'Storage SSD',
        descricao: 'Armazenamento SSD',
        preco: 0.55,
        unidade: 'GB',
        icon: <HardDrive className="w-4 h-4 text-orange-500" />
      }
    ],
    licencas: [
      {
        id: 'antivirus',
        nome: 'Antivírus',
        descricao: 'Proteção por VM',
        preco: 55,
        unidade: 'VM',
        icon: <Shield className="w-4 h-4" />
      },
      {
        id: 'windows',
        nome: 'Windows Server',
        descricao: 'Licença (2 vCPUs)',
        preco: 55,
        unidade: 'Licença',
        icon: <Monitor className="w-4 h-4" />
      },
      {
        id: 'sql-standard',
        nome: 'SQL Server Standard',
        descricao: 'Licença (2 vCPUs)',
        preco: 800,
        unidade: 'Licença',
        icon: <Database className="w-4 h-4" />
      }
    ],
    servicos: [
      {
        id: 'ip-adicional',
        nome: 'IP Adicional',
        descricao: 'IP público dedicado',
        preco: 70,
        unidade: 'IP',
        icon: <Globe className="w-4 h-4" />
      },
      {
        id: 'monitoramento',
        nome: 'Monitoramento',
        descricao: 'Por VM',
        preco: 100,
        unidade: 'VM',
        icon: <Monitor className="w-4 h-4" />
      },
      {
        id: 'tsplus-5',
        nome: 'TSPlus (5 usuários)',
        descricao: 'Terminal Services',
        preco: 180,
        unidade: 'Licença',
        icon: <Users className="w-4 h-4" />
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

  const totalUpgrade = itensUpgrade.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  const novoTotal = custoAtual + totalUpgrade;
  const percentualAumento = custoAtual > 0 ? ((totalUpgrade / custoAtual) * 100) : 0;

  const renderCatalogo = (categoria: keyof typeof CATALOGO_UPGRADES) => (
    <div className="space-y-3">
      {CATALOGO_UPGRADES[categoria].map(item => (
        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {item.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.nome}</h4>
                <p className="text-sm text-gray-600">{item.descricao}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {formatCurrency(item.preco)}
              </div>
              <div className="text-xs text-gray-500">por {item.unidade}</div>
              <Button
                onClick={() => adicionarItem(item, categoria)}
                size="sm"
                className="mt-2"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Catálogo de Upgrades */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Catálogo de Upgrades</h2>
          </div>
          
          <Tabs defaultValue="recursos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recursos">Recursos</TabsTrigger>
              <TabsTrigger value="licencas">Licenças</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recursos" className="mt-6">
              {renderCatalogo('recursos')}
            </TabsContent>
            
            <TabsContent value="licencas" className="mt-6">
              {renderCatalogo('licencas')}
            </TabsContent>
            
            <TabsContent value="servicos" className="mt-6">
              {renderCatalogo('servicos')}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Resumo do Upgrade */}
      <div className="space-y-6">
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
            <div className="space-y-3">
              {itensUpgrade.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <div>
                      <div className="font-medium text-sm">{item.nome}</div>
                      <div className="text-xs text-gray-600">{formatCurrency(item.preco)}/{item.unidade}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantidade}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Comparativo Before/After */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Resumo do Upgrade</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Custo Atual:</span>
              <span className="font-semibold">{formatCurrency(custoAtual)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Itens de Upgrade:</span>
              <span className="font-semibold text-blue-600">+{formatCurrency(totalUpgrade)}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Novo Total:</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(novoTotal)}</span>
              </div>
              
              {percentualAumento > 0 && (
                <div className="text-sm text-gray-600 text-right">
                  (+{percentualAumento.toFixed(1)}%)
                </div>
              )}
            </div>
          </div>

          {totalUpgrade > 0 && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Benefícios do Upgrade:
              </h4>
              <div className="space-y-1 text-sm text-green-700">
                {itensUpgrade.some(item => item.categoria === 'recursos') && (
                  <div>✅ Melhor performance e capacidade</div>
                )}
                {itensUpgrade.some(item => item.categoria === 'licencas') && (
                  <div>✅ Recursos de software avançados</div>
                )}
                {itensUpgrade.some(item => item.categoria === 'servicos') && (
                  <div>✅ Serviços adicionais de infraestrutura</div>
                )}
              </div>
            </div>
          )}

          {totalUpgrade > 0 && (
            <div className="mt-4 space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Gerar Proposta de Upgrade
              </Button>
              <Button variant="outline" className="w-full">
                Exportar para Excel
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UpgradeModule;
