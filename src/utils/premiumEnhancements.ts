
export function initPremiumEnhancements() {
  // Sofisticação através de micro-interações
  const initSophisticatedInteractions = () => {
    // Hover sutil em cards
    document.querySelectorAll('.premium-card, [class*="rounded-lg"]').forEach(card => {
      const element = card as HTMLElement;
      
      element.addEventListener('mouseenter', () => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.transform = 'translateY(-2px)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
      });
    });

    // Feedback tátil em botões
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button')!;
        button.style.transform = 'scale(0.98)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      }
    });

    // Smooth scroll global
    document.documentElement.style.scrollBehavior = 'smooth';
  };

  // Corrigir elementos específicos que ainda podem ter problemas
  const fixSpecificElements = () => {
    // Market Intelligence
    document.querySelectorAll('*').forEach(element => {
      const el = element as HTMLElement;
      if (el.textContent?.includes('Market Intelligence') && el.children.length < 5) {
        el.style.background = 'var(--surface-elevated)';
        el.style.border = '1px solid var(--border-subtle)';
        el.style.backdropFilter = 'blur(12px)';
      }
    });

    // Remover qualquer dourado excessivo
    document.querySelectorAll('*').forEach(element => {
      const el = element as HTMLElement;
      const computed = window.getComputedStyle(el);
      
      // Se tem cor dourada e não é um botão específico
      if (computed.backgroundColor.includes('220, 174, 29') && 
          !el.textContent?.includes('PDF') && 
          !el.textContent?.includes('Proposta') && 
          !el.textContent?.includes('Exportar')) {
        el.style.background = 'var(--surface-card)';
        el.style.backdropFilter = 'blur(12px)';
      }
    });

    // Ajustar sliders para azul
    document.querySelectorAll('input[type="range"]').forEach(slider => {
      const el = slider as HTMLInputElement;
      el.style.accentColor = 'var(--accent-primary)';
    });
  };

  // Adicionar classe de corpo para garantir que tudo funciona
  document.body.classList.add('sophisticated-theme');

  // Executar tudo
  setTimeout(() => {
    initSophisticatedInteractions();
    fixSpecificElements();
  }, 100);

  // Observer para mudanças no DOM
  const observer = new MutationObserver(() => {
    fixSpecificElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => observer.disconnect();
}
