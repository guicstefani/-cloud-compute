
export function initPremiumEnhancements() {
  // Função simples para corrigir cores
  const fixColorBugs = () => {
    try {
      // Fix para elementos brancos
      document.querySelectorAll('*').forEach(element => {
        const el = element as HTMLElement;
        const computed = window.getComputedStyle(el);
        
        if (computed.backgroundColor === 'rgb(255, 255, 255)' || 
            computed.backgroundColor === 'white' ||
            el.style.backgroundColor === 'white') {
          
          if (el.className.includes('rounded') || el.className.includes('card')) {
            el.style.background = 'rgba(30, 30, 30, 0.6)';
            el.style.border = '1px solid rgba(255, 255, 255, 0.05)';
          } else {
            el.style.backgroundColor = '#0a0a0a';
          }
          el.style.color = '#ffffff';
        }
      });

      // Fix para sliders
      document.querySelectorAll('input[type="range"]').forEach(slider => {
        const el = slider as HTMLInputElement;
        el.style.accentColor = '#DCAE1D';
      });
    } catch (error) {
      console.log('Erro no premium enhancement:', error);
    }
  };

  // Aplicar fixes
  setTimeout(fixColorBugs, 100);

  // Observer simples
  let observer: MutationObserver | null = null;
  try {
    observer = new MutationObserver(() => {
      fixColorBugs();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch (error) {
    console.log('Observer error:', error);
  }

  return () => {
    if (observer) {
      observer.disconnect();
    }
  };
}
