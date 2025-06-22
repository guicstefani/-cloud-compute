
import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UpgradeCard } from './upgrades/UpgradeCard';
import { CarrinhoResumo } from './upgrades/CarrinhoResumo';
import { EstadoVazio } from './upgrades/EstadoVazio';
import { recursos } from './upgrades/catalogData';
import { categorias, type UpgradeItem, type CarrinhoItem } from './upgrades/types';
import { gerarResumo } from './upgrades/utils';
import { gerarPDFUpgrades } from './upgrades/pdfGenerator';

const UpgradeModule = () => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const adicionarItem = (recurso: UpgradeItem, quantidade: number = 1) => {
    const itemExistente = carrinho.find(item => item.id === recurso.id);
    
    if (itemExistente) {
      const novaQuantidade = Math.min(itemExistente.quantidade + quantidade, recurso.maximo || 999);
      setCarrinho(prev => prev.map(item => 
        item.id === recurso.id 
          ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * recurso.preco }
          : item
      ));
      
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

  const copiarResumo = async () => {
    try {
      await navigator.clipboard.writeText(gerarResumo(carrinho));
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
      const nomeArquivo = await gerarPDFUpgrades(carrinho);
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
                {recursosCategoria.map(recurso => (
                  <UpgradeCard
                    key={recurso.id}
                    recurso={recurso}
                    carrinho={carrinho}
                    onAdicionarItem={adicionarItem}
                    onRemoverItem={removerItem}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Carrinho de Compras */}
      <CarrinhoResumo
        carrinho={carrinho}
        onGerarPDF={gerarPDF}
        isGeneratingPDF={isGeneratingPDF}
      />

      {/* Estado Vazio */}
      {carrinho.length === 0 && <EstadoVazio />}
    </div>
  );
};

export default UpgradeModule;
