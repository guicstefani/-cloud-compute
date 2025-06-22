
import React, { useState } from 'react';
import { Cpu, Database, HardDrive, Shield, Globe, Monitor, Plus, Minus, ShoppingCart, FileText, Copy, Upload, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/calculadora';
import { useToast } from '@/hooks/use-toast';

interface UpgradeItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  unidade: string;
  categoria: string;
  icon: React.ReactNode;
  minimo?: number;
  maximo?: number;
}

interface CarrinhoItem extends UpgradeItem {
  quantidade: number;
  subtotal: number;
}

const UpgradeModule = () => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  // Catálogo de recursos com limites seguros
  const recursos: UpgradeItem[] = [
    // RECURSOS COMPUTACIONAIS
    {
      id: 'vcpu',
      nome: 'vCPU Adicional',
      descricao: 'Poder de processamento extra para suas aplicações',
      preco: 24.96,
      unidade: '/mês por unidade',
      categoria: 'computacional',
      icon: <Cpu className="w-5 h-5" />,
      minimo: 1,
      maximo: 500
    },
    {
      id: 'ram',
      nome: 'RAM Adicional',
      descricao: 'Memória para melhor performance e multitasking',
      preco: 20.02,
      unidade: '/mês por GB',
      categoria: 'computacional',
      icon: <Database className="w-5 h-5" />,
      minimo: 1,
      maximo: 1000
    },
    
    // ARMAZENAMENTO
    {
      id: 'ssd',
      nome: 'Storage SSD',
      descricao: 'Armazenamento rápido e confiável para dados críticos',
      preco: 0.55,
      unidade: '/GB/mês',
      categoria: 'storage',
      icon: <HardDrive className="w-5 h-5" />,
      minimo: 10,
      maximo: 50000
    },
    {
      id: 'fcm',
      nome: 'Storage FCM',
      descricao: 'Armazenamento econômico para dados frios',
      preco: 0.75,
      unidade: '/GB/mês',
      categoria: 'storage',
      icon: <HardDrive className="w-5 h-5" />,
      minimo: 10,
      maximo: 50000
    },
    
    // SEGURANÇA E REDE
    {
      id: 'ip',
      nome: 'IP Adicional',
      descricao: 'Endereço IP dedicado para seus serviços',
      preco: 70.00,
      unidade: '/mês',
      categoria: 'rede',
      icon: <Globe className="w-5 h-5" />,
      minimo: 1,
      maximo: 50
    },
    {
      id: 'waf',
      nome: 'WAF Pro',
      descricao: 'Proteção avançada contra ataques web',
      preco: 200.00,
      unidade: '/mês',
      categoria: 'seguranca',
      icon: <Shield className="w-5 h-5" />,
      minimo: 1,
      maximo: 10
    },
    
    // LICENÇAS
    {
      id: 'windows',
      nome: 'Windows Server',
      descricao: 'Licença Microsoft para 2 vCPUs',
      preco: 220.00,
      unidade: '/mês por licença',
      categoria: 'licenca',
      icon: <Monitor className="w-5 h-5" />,
      minimo: 1,
      maximo: 100
    }
  ];

  const categorias = {
    computacional: { nome: '💻 Recursos Computacionais', cor: 'from-blue-500 to-cyan-500' },
    storage: { nome: '💾 Armazenamento', cor: 'from-green-500 to-emerald-500' },
    rede: { nome: '🌐 Rede & Conectividade', cor: 'from-purple-500 to-violet-500' },
    seguranca: { nome: '🛡️ Segurança', cor: 'from-red-500 to-orange-500' },
    licenca: { nome: '🪟 Licenças', cor: 'from-yellow-500 to-orange-500' }
  };

  const adicionarItem = (recurso: UpgradeItem, quantidade: number = 1) => {
    const itemExistente = carrinho.find(item => item.id === recurso.id);
    
    if (itemExistente) {
      const novaQuantidade = Math.min(itemExistente.quantidade + quantidade, recurso.maximo || 999);
      setCarrinho(prev => prev.map(item => 
        item.id === recurso.id 
          ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * recurso.preco }
          : item
      ));
      
      // Feedback visual
      if (novaQuantidade >= (recurso.maximo || 999)) {
        toast({
          title: "Limite atingido",
          description: `Máximo de ${recurso.maximo} unidades para ${recurso.nome}`,
          variant: "destructive"
        });
      }
    } else {
      const novoItem: CarrinhoItem = {
        ...recurso,
        quantidade,
        subtotal: quantidade * recurso.preco
      };
      setCarrinho(prev => [...prev, novoItem]);
      
      toast({
        title: "Item adicionado",
        description: `${recurso.nome} foi adicionado à cotação`,
        className: "toast-gold"
      });
    }
  };

  const removerItem = (recursoId: string) => {
    const item = carrinho.find(item => item.id === recursoId);
    if (!item) return;

    if (item.quantidade > 1) {
      const novaQuantidade = item.quantidade - 1;
      setCarrinho(prev => prev.map(item => 
        item.id === recursoId 
          ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * item.preco }
          : item
      ));
    } else {
      setCarrinho(prev => prev.filter(item => item.id !== recursoId));
      toast({
        title: "Item removido",
        description: `${item.nome} foi removido da cotação`
      });
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.subtotal, 0);
  };

  const calcularDesconto = (total: number) => {
    if (total > 10000) return 0.10; // 10% para pedidos acima de R$ 10.000
    if (total > 5000) return 0.05; // 5% para pedidos acima de R$ 5.000
    if (total > 2000) return 0.03; // 3% para pedidos acima de R$ 2.000
    return 0;
  };

  const gerarResumo = () => {
    const total = calcularTotal();
    const desconto = calcularDesconto(total);
    const totalComDesconto = total * (1 - desconto);
    
    let resumo = "📋 *COTAÇÃO DE UPGRADES OPTIDATA*\n\n";
    resumo += `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    resumo += `⏰ Válida até: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}\n\n`;
    
    carrinho.forEach(item => {
      resumo += `• ${item.nome}: ${item.quantidade}x - ${formatCurrency(item.subtotal)}\n`;
      resumo += `  ${item.descricao}\n`;
    });
    
    resumo += `\n💰 *Subtotal:* ${formatCurrency(total)}`;
    
    if (desconto > 0) {
      resumo += `\n🎉 *Desconto (${(desconto * 100).toFixed(0)}%):* -${formatCurrency(total * desconto)}`;
      resumo += `\n✨ *Total Final:* ${formatCurrency(totalComDesconto)}`;
    }
    
    resumo += `\n\n📞 Entre em contato para finalizar!`;
    resumo += `\n🌐 www.optidata.com.br`;
    
    return resumo;
  };

  const copiarResumo = async () => {
    try {
      await navigator.clipboard.writeText(gerarResumo());
      toast({
        title: "Resumo copiado!",
        description: "O resumo foi copiado para sua área de transferência",
        className: "toast-gold"
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o resumo",
        variant: "destructive"
      });
    }
  };

  const gerarPDF = async () => {
    if (carrinho.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Adicione itens à cotação antes de gerar o PDF",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Importar jsPDF dinamicamente
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let yPosition = 30;

      // Header da empresa
      pdf.setFontSize(20);
      pdf.setTextColor(220, 174, 29); // Dourado Optidata
      pdf.text('OPTIDATA', margin, yPosition);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Cloud Computing Solutions', margin, yPosition + 8);

      // Linha separadora
      pdf.setDrawColor(220, 174, 29);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition + 15, pageWidth - margin, yPosition + 15);

      yPosition += 30;

      // Título da proposta
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('COTAÇÃO DE UPGRADES E RECURSOS', margin, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
      pdf.text(`Válida até: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`, pageWidth - margin - 80, yPosition);

      yPosition += 20;

      // Itens da cotação
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('ITENS SOLICITADOS', margin, yPosition);
      yPosition += 15;

      carrinho.forEach((item, index) => {
        if (yPosition > pdf.internal.pageSize.height - 60) {
          pdf.addPage();
          yPosition = 30;
        }

        // Nome do item
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${item.nome}`, margin, yPosition);
        yPosition += 6;

        // Descrição
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`   ${item.descricao}`, margin, yPosition);
        yPosition += 6;

        // Quantidade e preço
        pdf.setTextColor(0, 102, 204);
        pdf.text(`   Quantidade: ${item.quantidade} | Preço unitário: ${formatCurrency(item.preco)}`, margin, yPosition);
        yPosition += 4;
        
        pdf.setTextColor(220, 174, 29);
        pdf.text(`   Subtotal: ${formatCurrency(item.subtotal)}`, margin, yPosition);
        yPosition += 12;
      });

      // Totais
      const total = calcularTotal();
      const desconto = calcularDesconto(total);
      const totalFinal = total * (1 - desconto);

      yPosition += 10;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Subtotal: ${formatCurrency(total)}`, margin, yPosition);
      
      if (desconto > 0) {
        yPosition += 8;
        pdf.setTextColor(0, 150, 0);
        pdf.text(`Desconto (${(desconto * 100).toFixed(0)}%): -${formatCurrency(total * desconto)}`, margin, yPosition);
      }
      
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setTextColor(220, 174, 29);
      pdf.text(`TOTAL FINAL: ${formatCurrency(totalFinal)}`, margin, yPosition);

      // Rodapé
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Cotação gerada em ${dataAtual}`, margin, pdf.internal.pageSize.height - 20);
      pdf.text('Optidata Cloud Computing - www.optidata.com.br', pageWidth - margin - 100, pdf.internal.pageSize.height - 20);

      // Download do PDF
      const nomeArquivo = `Cotacao_Upgrades_Optidata_${dataAtual.replace(/\//g, '-')}.pdf`;
      pdf.save(nomeArquivo);

      toast({
        title: "PDF gerado com sucesso!",
        description: `Arquivo ${nomeArquivo} foi baixado`,
        className: "toast-gold"
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos da cotação"
    });
  };

  const total = calcularTotal();
  const desconto = calcularDesconto(total);
  const totalFinal = total * (1 - desconto);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🛒 Catálogo de Upgrades
          </h2>
          <p className="text-gray-400">Adicione recursos individuais e veja o preço em tempo real</p>
        </div>
        
        {carrinho.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={copiarResumo}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copiar Resumo
            </button>
            <button
              onClick={limparCarrinho}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Limpar Tudo
            </button>
          </div>
        )}
      </div>

      {/* Catálogo de Recursos */}
      <div className="space-y-8">
        {Object.entries(categorias).map(([categoria, config]) => {
          const recursosCategoria = recursos.filter(r => r.categoria === categoria);
          
          return (
            <div key={categoria} className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.cor}`} />
                {config.nome}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recursosCategoria.map(recurso => {
                  const itemNoCarrinho = carrinho.find(item => item.id === recurso.id);
                  const quantidade = itemNoCarrinho?.quantidade || 0;
                  const isNearLimit = quantidade >= (recurso.maximo || 999) * 0.9;
                  
                  return (
                    <div 
                      key={recurso.id}
                      className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-black">
                            {recurso.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{recurso.nome}</h4>
                            <p className="text-sm text-gray-400">{recurso.descricao}</p>
                          </div>
                        </div>
                        {isNearLimit && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {formatCurrency(recurso.preco)}
                          </div>
                          <div className="text-xs text-gray-500">{recurso.unidade}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Limite: {recurso.maximo || 999} unidades
                          </div>
                        </div>
                        
                        {quantidade > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => removerItem(recurso.id)}
                                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <span className="text-xl font-bold text-white min-w-[3ch] text-center">
                                {quantidade}
                              </span>
                              
                              <button
                                onClick={() => adicionarItem(recurso)}
                                disabled={quantidade >= (recurso.maximo || 999)}
                                className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Subtotal:</div>
                              <div className="text-lg font-semibold text-green-400">
                                {formatCurrency(quantidade * recurso.preco)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => adicionarItem(recurso)}
                            className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all transform hover:scale-105"
                          >
                            Adicionar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Carrinho de Compras */}
      {carrinho.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Resumo da Cotação</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            {carrinho.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-black">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-white font-medium">{item.nome}</div>
                    <div className="text-sm text-gray-400">{item.quantidade}x {formatCurrency(item.preco)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-600 pt-4 space-y-2">
            <div className="flex justify-between text-lg">
              <span className="text-gray-300">Subtotal:</span>
              <span className="text-white font-semibold">{formatCurrency(total)}</span>
            </div>
            
            {desconto > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Desconto ({(desconto * 100).toFixed(0)}%):</span>
                <span>-{formatCurrency(total * desconto)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-2xl font-bold pt-2 border-t border-gray-600">
              <span className="text-white">Total Final:</span>
              <span className="text-yellow-400">{formatCurrency(totalFinal)}</span>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button 
              onClick={gerarPDF}
              disabled={isGeneratingPDF}
              className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileText className="w-5 h-5" />
              {isGeneratingPDF ? 'Gerando PDF...' : 'Gerar Cotação PDF'}
            </button>
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {carrinho.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            Nenhum upgrade selecionado
          </h3>
          <p className="text-gray-500">
            Selecione os recursos que deseja adicionar à sua cotação
          </p>
          <div className="mt-4 text-sm text-gray-600">
            💡 Dica: Use Enter para adicionar +1, Shift+Enter para +10
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradeModule;
