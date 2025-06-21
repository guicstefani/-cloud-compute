
export function initPremiumEnhancements() {
  // Adicionar efeito de movimento ao background
  const createFloatingOrbs = () => {
    const orbsContainer = document.createElement('div');
    orbsContainer.className = 'floating-orbs';
    orbsContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    `;
    
    // Criar orbs flutuantes
    for (let i = 0; i < 5; i++) {
      const orb = document.createElement('div');
      orb.style.cssText = `
        position: absolute;
        width: ${Math.random() * 400 + 200}px;
        height: ${Math.random() * 400 + 200}px;
        background: radial-gradient(circle, rgba(220, 174, 29, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
        animation: float ${20 + Math.random() * 10}s ease-in-out infinite;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        transform: translate(-50%, -50%);
      `;
      orbsContainer.appendChild(orb);
    }
    
    document.body.appendChild(orbsContainer);
    
    // CSS para animação
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
        }
        33% {
          transform: translate(-30%, -70%) scale(1.1);
        }
        66% {
          transform: translate(-70%, -30%) scale(0.9);
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Corrigir bugs específicos de cores
  const fixColorBugs = () => {
    // Fix para Market Intelligence
    const marketIntelligence = document.querySelectorAll('[class*="Market"], [class*="Intelligence"]');
    marketIntelligence.forEach(el => {
      const element = el as HTMLElement;
      element.style.background = 'rgba(30, 30, 30, 0.8)';
      element.style.backdropFilter = 'blur(15px)';
      element.style.border = '1px solid rgba(220, 174, 29, 0.1)';
    });

    // Fix para box de desconto
    document.querySelectorAll('*').forEach(element => {
      const el = element as HTMLElement;
      if (el.textContent?.includes('Desconto Exclusivo') && el.children.length < 5) {
        el.style.background = 'linear-gradient(135deg, rgba(220, 174, 29, 0.05), rgba(220, 174, 29, 0.02))';
        el.style.border = '1px solid rgba(220, 174, 29, 0.2)';
        el.style.backdropFilter = 'blur(10px)';
      }
    });

    // Fix para sliders - tornar dourados
    document.querySelectorAll('input[type="range"]').forEach((slider, index) => {
      const el = slider as HTMLInputElement;
      const percentage = ((parseInt(el.value) - parseInt(el.min)) / (parseInt(el.max) - parseInt(el.min))) * 100;
      el.style.setProperty('--value', `${percentage}%`);
      
      // Atualizar ao mover
      el.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const percentage = ((parseInt(target.value) - parseInt(target.min)) / (parseInt(target.max) - parseInt(target.min))) * 100;
        target.style.setProperty('--value', `${percentage}%`);
      });
    });

    // Fix para cards do pool
    const poolCards = document.querySelectorAll('[class*="pool"] [class*="card"], [class*="Pool"] [class*="rounded"]');
    poolCards.forEach(card => {
      const el = card as HTMLElement;
      el.style.background = 'rgba(26, 26, 26, 0.6)';
      el.style.border = '1px solid rgba(255, 255, 255, 0.05)';
      el.style.backdropFilter = 'blur(10px)';
    });

    // Remover qualquer fundo branco restante
    document.querySelectorAll('*').forEach(element => {
      const el = element as HTMLElement;
      const computed = window.getComputedStyle(el);
      
      if (computed.backgroundColor === 'rgb(255, 255, 255)' || 
          computed.backgroundColor === 'white' ||
          el.style.backgroundColor === 'white') {
        
        // Se for um card/container
        if (el.className.includes('rounded') || el.className.includes('card')) {
          el.style.background = 'rgba(30, 30, 30, 0.6)';
          el.style.backdropFilter = 'blur(20px)';
          el.style.border = '1px solid rgba(255, 255, 255, 0.05)';
        } else {
          el.style.backgroundColor = 'transparent';
        }
      }
    });
  };

  // Adicionar efeitos hover premium
  const addPremiumInteractions = () => {
    // Efeito de cursor glow
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(220, 174, 29, 0.05) 0%, transparent 50%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    // Smooth cursor follow
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Efeito ripple em botões
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // CSS para ripple
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Inicializar tudo
  setTimeout(() => {
    createFloatingOrbs();
    fixColorBugs();
    addPremiumInteractions();
  }, 100);

  // Re-aplicar fixes quando o DOM mudar
  const observer = new MutationObserver(() => {
    fixColorBugs();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  return () => observer.disconnect();
}
