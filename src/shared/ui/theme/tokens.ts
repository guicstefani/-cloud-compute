
/**
 * Design Tokens - Fonte única de verdade para design
 * Isso resolve o problema dos estilos conflitantes
 */

export const tokens = {
  colors: {
    // Cores da marca Optidata
    primary: {
      50: '#fef5e7',
      100: '#fde6c4',
      500: '#f5a623',  // Dourado principal
      600: '#d68910',  // Dourado escuro
      900: '#7d5410',
    },
    
    // Backgrounds
    background: {
      primary: '#0a0a0a',    // Fundo principal
      secondary: '#1a1a1a',  // Cards e superfícies
      tertiary: '#2a2a2a',   // Elementos elevados
    },
    
    // Textos
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      muted: '#666666',
    },
    
    // Estados
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    
    // Borders
    border: {
      default: '#333333',
      focus: '#f5a623',
      error: '#ef4444',
    },
  },
  
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem', 
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgb(245 166 35 / 0.3)',
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Exporta CSS variables para usar em qualquer lugar
export const cssVariables = `
  :root {
    --color-primary: ${tokens.colors.primary[500]};
    --color-primary-dark: ${tokens.colors.primary[600]};
    --color-bg-primary: ${tokens.colors.background.primary};
    --color-bg-secondary: ${tokens.colors.background.secondary};
    --color-text-primary: ${tokens.colors.text.primary};
    --color-text-secondary: ${tokens.colors.text.secondary};
    --radius-md: ${tokens.borderRadius.md};
    --shadow-glow: ${tokens.shadow.glow};
    --transition: ${tokens.animation.duration.normal} ${tokens.animation.easing};
  }
`;
