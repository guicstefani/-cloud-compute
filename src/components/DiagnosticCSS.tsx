
import React, { useEffect, useState } from 'react';

export const DiagnosticCSS = () => {
  const [cssLoaded, setCssLoaded] = useState(false);
  const [appliedStyles, setAppliedStyles] = useState<string[]>([]);

  useEffect(() => {
    // Verifica se o CSS foi carregado
    const stylesheets = Array.from(document.styleSheets);
    const visualUpgrade = stylesheets.find(sheet => 
      sheet.href?.includes('visual-upgrade') || 
      Array.from(sheet.cssRules || []).some(rule => 
        rule.cssText?.includes('VISUAL-UPGRADE')
      )
    );
    
    setCssLoaded(!!visualUpgrade);

    // Verifica estilos aplicados no elemento de teste
    const testElement = document.querySelector('.diagnostic-value');
    if (testElement) {
      const computedStyles = window.getComputedStyle(testElement);
      const styles = [
        `font-size: ${computedStyles.fontSize}`,
        `font-weight: ${computedStyles.fontWeight}`,
        `color: ${computedStyles.color}`,
        `background: ${computedStyles.background}`,
      ];
      setAppliedStyles(styles);
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h4 className="font-bold mb-2">🔍 Diagnóstico CSS</h4>
      <p className={cssLoaded ? 'text-green-400' : 'text-red-400'}>
        CSS carregado: {cssLoaded ? '✓' : '✗'}
      </p>
      
      <div className="mt-2">
        <div className="diagnostic-value text-4xl">R$ 1.234,56</div>
        <div className="text-xs mt-1">
          <p>Estilos aplicados:</p>
          {appliedStyles.map((style, i) => (
            <p key={i} className="text-gray-400">{style}</p>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => {
          const element = document.querySelector('.diagnostic-value');
          if (element) {
            console.log('Computed styles:', window.getComputedStyle(element));
            console.log('Applied rules:', element.getClientRects());
          }
        }}
        className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs"
      >
        Console Log
      </button>
    </div>
  );
};
