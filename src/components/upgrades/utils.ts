
export const calcularDesconto = (total: number) => {
  if (total > 10000) return 0.10; // 10% para pedidos acima de R$ 10.000
  if (total > 5000) return 0.05; // 5% para pedidos acima de R$ 5.000
  if (total > 2000) return 0.03; // 3% para pedidos acima de R$ 2.000
  return 0;
};

export const gerarResumo = (carrinho: any[]) => {
  const total = carrinho.reduce((total, item) => total + item.subtotal, 0);
  const desconto = calcularDesconto(total);
  const totalComDesconto = total * (1 - desconto);
  
  let resumo = "📋 *COTAÇÃO DE UPGRADES OPTIDATA*\n\n";
  resumo += `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
  resumo += `⏰ Válida até: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}\n\n`;
  
  carrinho.forEach(item => {
    resumo += `• ${item.nome}: ${item.quantidade}x - ${item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    resumo += `  ${item.descricao}\n`;
  });
  
  resumo += `\n💰 *Subtotal:* ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  
  if (desconto > 0) {
    resumo += `\n🎉 *Desconto (${(desconto * 100).toFixed(0)}%):* -${(total * desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    resumo += `\n✨ *Total Final:* ${totalComDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  }
  
  resumo += `\n\n📞 Entre em contato para finalizar!`;
  resumo += `\n🌐 www.optidata.com.br`;
  
  return resumo;
};
