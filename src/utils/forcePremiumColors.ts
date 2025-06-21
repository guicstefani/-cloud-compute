
export function forcePremiumColors() {
  // Função que força cores premium em TODOS os elementos
  const applyPremiumColors = () => {
    // 1. FORÇAR FUNDOS PRETOS
    document.querySelectorAll('*').forEach((element) => {
      const el = element as HTMLElement;
      const computed = window.getComputedStyle(el);
      
      // Detectar e substituir fundos brancos
      if (
        computed.backgroundColor === 'rgb(255, 255, 255)' ||
        computed.backgroundColor === 'white' ||
        el.style.backgroundColor === 'white' ||
        el.style.backgroundColor === '#ffffff' ||
        el.style.backgroundColor === 'rgb(255, 255, 255)'
      ) {
        // Cards e containers
        if (el.classList.toString().includes('card') || 
            el.classList.toString().includes('modal') ||
            el.classList.toString().includes('dialog')) {
          el.style.setProperty('background-color', '#1e1e1e', 'important');
        } else {
          el.style.setProperty('background-color', '#0a0a0a', 'important');
        }
        el.style.setProperty('color', '#ffffff', 'important');
      }
      
      // Detectar fundos cinza claro
      if (
        computed.backgroundColor.includes('249, 250, 251') || // gray-50
        computed.backgroundColor.includes('243, 244, 246') || // gray-100
        computed.backgroundColor.includes('229, 231, 235')    // gray-200
      ) {
        el.style.setProperty('background-color', '#1a1a1a', 'important');
        el.style.setProperty('color', '#ffffff', 'important');
      }
    });

    // 2. FORÇAR CORES DOURADAS EM ELEMENTOS AZUIS
    document.querySelectorAll('*').forEach((element) => {
      const el = element as HTMLElement;
      const computed = window.getComputedStyle(el);
      
      // Detectar textos azuis
      if (
        computed.color.includes('59, 130, 246') || // blue-500
        computed.color.includes('37, 99, 235') ||  // blue-600
        computed.color.includes('29, 78, 216')     // blue-700
      ) {
        el.style.setProperty('color', '#DCAE1D', 'important');
      }
      
      // Detectar backgrounds azuis (botões)
      if (
        computed.backgroundColor.includes('59, 130, 246') ||
        computed.backgroundColor.includes('37, 99, 235')
      ) {
        el.style.setProperty('background', 'linear-gradient(135deg, #DCAE1D, #F4C430)', 'important');
        el.style.setProperty('color', '#000000', 'important');
      }
    });

    // 3. FORÇAR SLIDERS DOURADOS
    document.querySelectorAll('input[type="range"]').forEach((slider) => {
      const el = slider as HTMLInputElement;
      el.style.setProperty('accent-color', '#DCAE1D', 'important');
      
      // Criar estilo inline para o thumb
      const id = `slider-${Math.random().toString(36).substr(2, 9)}`;
      el.id = id;
      
      const style = document.createElement('style');
      style.textContent = `
        #${id}::-webkit-slider-thumb {
          background: #DCAE1D !important;
          border: none !important;
          box-shadow: 0 0 10px rgba(220, 174, 29, 0.5) !important;
        }
        #${id}::-moz-range-thumb {
          background: #DCAE1D !important;
          border: none !important;
        }
        #${id}::-webkit-slider-runnable-track {
          background: #2a2a2a !important;
        }
      `;
      document.head.appendChild(style);
    });

    // 4. FORÇAR INPUTS ESCUROS
    document.querySelectorAll('input:not([type="range"]), select, textarea').forEach((input) => {
      const el = input as HTMLElement;
      el.style.setProperty('background-color', '#141414', 'important');
      el.style.setProperty('border-color', '#2a2a2a', 'important');
      el.style.setProperty('color', '#ffffff', 'important');
    });

    // 5. FORÇAR BORDAS E SOMBRAS
    document.querySelectorAll('[class*="border"]').forEach((element) => {
      const el = element as HTMLElement;
      const computed = window.getComputedStyle(el);
      
      if (computed.borderColor.includes('229, 231, 235')) { // gray-200
        el.style.setProperty('border-color', '#2a2a2a', 'important');
      }
    });

    // 6. REMOVER CLASSES PROBLEMÁTICAS
    document.querySelectorAll('[class*="bg-white"]').forEach((element) => {
      const el = element as HTMLElement;
      // Remover classes bg-white
      el.className = el.className.replace(/bg-white/g, '');
      el.style.setProperty('background-color', '#1e1e1e', 'important');
    });

    // 7. FORÇAR MODAIS E DIALOGS
    document.querySelectorAll('[role="dialog"], [data-radix-collection-item]').forEach((dialog) => {
      const el = dialog as HTMLElement;
      el.style.setProperty('background-color', '#1a1a1a', 'important');
      el.style.setProperty('color', '#ffffff', 'important');
    });

    // 8. MARKET INTELLIGENCE BOX
    document.querySelectorAll('*').forEach((element) => {
      const el = element as HTMLElement;
      if (el.textContent?.includes('Market Intelligence') && el.children.length < 3) {
        const parent = el.closest('div');
        if (parent) {
          parent.style.setProperty('background-color', '#1e1e1e', 'important');
          parent.style.setProperty('border', '1px solid #2a2a2a', 'important');
        }
      }
    });
  };

  // Aplicar imediatamente
  applyPremiumColors();

  // Reaplicar após mudanças no DOM
  const observer = new MutationObserver(() => {
    applyPremiumColors();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Reaplicar em intervalos para garantir
  const interval = setInterval(applyPremiumColors, 1000);

  // Retornar função de cleanup
  return () => {
    observer.disconnect();
    clearInterval(interval);
  };
}

// Função auxiliar para debug
export function debugWhiteElements() {
  console.log('=== ELEMENTOS BRANCOS DETECTADOS ===');
  document.querySelectorAll('*').forEach((element) => {
    const el = element as HTMLElement;
    const computed = window.getComputedStyle(el);
    
    if (computed.backgroundColor === 'rgb(255, 255, 255)' || 
        computed.backgroundColor === 'white') {
      console.log('Elemento branco:', {
        element: el,
        classes: el.className,
        id: el.id,
        tag: el.tagName,
        style: el.style.cssText
      });
    }
  });
}
