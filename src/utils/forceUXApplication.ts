
/**
 * Sistema de força total para aplicação das melhorias UX
 * Este sistema força a aplicação das melhorias mesmo contra estilos inline
 */

export function forceUXApplication() {
  console.log('🎨 Iniciando aplicação forçada das melhorias UX...');

  const applyForceStyles = () => {
    // 1. FORÇA FUNDO ESCURO EM TUDO
    document.querySelectorAll('*').forEach((element) => {
      const el = element as HTMLElement;
      
      // Skip elementos que não devem ser modificados
      if (
        el.tagName === 'SVG' ||
        el.tagName === 'PATH' ||
        el.classList.contains('lucide') ||
        el.classList.contains('icon')
      ) return;

      const computed = window.getComputedStyle(el);
      
      // Detectar fundos brancos/claros
      if (
        computed.backgroundColor === 'rgb(255, 255, 255)' ||
        computed.backgroundColor === 'white' ||
        computed.backgroundColor.includes('249, 250, 251') ||
        computed.backgroundColor.includes('243, 244, 246')
      ) {
        el.style.setProperty('background', 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 'important');
        el.style.setProperty('color', '#ffffff', 'important');
        el.style.setProperty('border', '1px solid rgba(212, 175, 55, 0.2)', 'important');
        el.style.setProperty('border-radius', '12px', 'important');
        
        console.log('🔄 Convertido fundo claro para escuro:', el);
      }
    });

    // 2. FORÇA BOTÕES DOURADOS
    document.querySelectorAll('button, [role="button"]').forEach((button) => {
      const el = button as HTMLElement;
      
      el.style.setProperty('background', 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)', 'important');
      el.style.setProperty('color', '#000000', 'important');
      el.style.setProperty('border', '2px solid rgba(212, 175, 55, 0.3)', 'important');
      el.style.setProperty('border-radius', '10px', 'important');
      el.style.setProperty('padding', '12px 24px', 'important');
      el.style.setProperty('font-weight', '600', 'important');
      el.style.setProperty('transition', 'all 0.2s ease', 'important');
      el.style.setProperty('cursor', 'pointer', 'important');
      
      console.log('🟡 Botão convertido para dourado:', el);
    });

    // 3. FORÇA SLIDERS DOURADOS
    document.querySelectorAll('input[type="range"]').forEach((slider) => {
      const el = slider as HTMLInputElement;
      el.style.setProperty('accent-color', '#D4AF37', 'important');
      
      console.log('🎚️ Slider convertido para dourado:', el);
    });

    // 4. FORÇA INPUTS ESCUROS
    document.querySelectorAll('input:not([type="range"]), select, textarea').forEach((input) => {
      const el = input as HTMLElement;
      
      el.style.setProperty('background', 'rgba(255, 255, 255, 0.05)', 'important');
      el.style.setProperty('border', '2px solid rgba(212, 175, 55, 0.2)', 'important');
      el.style.setProperty('border-radius', '8px', 'important');
      el.style.setProperty('color', '#ffffff', 'important');
      
      console.log('📝 Input convertido para escuro:', el);
    });

    // 5. FORÇA VALORES MONETÁRIOS DOURADOS
    document.querySelectorAll('span, div').forEach((element) => {
      const el = element as HTMLElement;
      const text = el.textContent || '';
      
      // Detectar valores monetários
      if (
        text.includes('R$') ||
        text.includes('$') ||
        text.includes('Total') ||
        text.includes('Preço') ||
        /^\d+[.,]\d+$/.test(text.trim())
      ) {
        el.style.setProperty('color', '#D4AF37', 'important');
        el.style.setProperty('font-weight', '600', 'important');
        el.style.setProperty('text-shadow', '0 0 15px rgba(212, 175, 55, 0.5)', 'important');
        
        console.log('💰 Valor monetário destacado:', el);
      }
    });

    // 6. FORÇA SIDEBAR
    document.querySelectorAll('aside, nav, [class*="sidebar"]').forEach((sidebar) => {
      const el = sidebar as HTMLElement;
      
      el.style.setProperty('background', 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)', 'important');
      el.style.setProperty('border-right', '2px solid rgba(212, 175, 55, 0.3)', 'important');
      el.style.setProperty('box-shadow', '4px 0 30px rgba(0, 0, 0, 0.5)', 'important');
      
      console.log('📋 Sidebar convertida:', el);
    });

    console.log('✅ Aplicação forçada das melhorias UX concluída!');
  };

  // Aplicar imediatamente
  applyForceStyles();

  // Observar mudanças no DOM
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        shouldReapply = true;
      }
    });
    
    if (shouldReapply) {
      setTimeout(applyForceStyles, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Reaplicar periodicamente para garantir
  const interval = setInterval(applyForceStyles, 2000);

  // Função de limpeza
  return () => {
    observer.disconnect();
    clearInterval(interval);
  };
}

// Auto-inicializar quando o DOM estiver pronto
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceUXApplication);
  } else {
    forceUXApplication();
  }
}
