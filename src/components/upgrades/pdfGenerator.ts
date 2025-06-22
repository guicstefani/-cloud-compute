
import { formatCurrency } from '@/utils/calculadora';
import { CarrinhoItem } from './types';
import { calcularDesconto } from './utils';

export const gerarPDFUpgrades = async (carrinho: CarrinhoItem[]) => {
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
  const total = carrinho.reduce((total, item) => total + item.subtotal, 0);
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

  return nomeArquivo;
};
