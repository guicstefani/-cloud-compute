
/**
 * ConditionalLayout - Layout inteligente que resolve o problema do header
 * O header só aparece onde faz sentido
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  forceHeader?: boolean;
  hideHeader?: boolean;
}

export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({
  children,
  forceHeader,
  hideHeader,
}) => {
  const location = useLocation();
  
  // Define onde o header deve aparecer
  const routesWithHeader = [
    '/',
    '/reports',
    '/settings'
  ];
  
  // Define onde o header NÃO deve aparecer
  const routesWithoutHeader = [
    '/login',
    '/login-novo'
  ];
  
  const shouldHideHeader = routesWithoutHeader.some(route => 
    location.pathname.startsWith(route)
  );
  
  const shouldShowHeader = forceHeader || (
    !hideHeader && 
    !shouldHideHeader &&
    routesWithHeader.some(route => location.pathname.startsWith(route))
  );
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {shouldShowHeader && <Header />}
      <main className={cn(
        'flex-1',
        {
          'pt-0': !shouldShowHeader,  // Remove padding se não tem header
        }
      )}>
        {children}
      </main>
    </div>
  );
};

// Hook para controlar header em componentes específicos
export const useHeaderControl = () => {
  const [headerConfig, setHeaderConfig] = React.useState({
    show: true,
    title: '',
    actions: null as React.ReactNode,
  });
  
  const hideHeader = () => setHeaderConfig(prev => ({ ...prev, show: false }));
  const showHeader = (title?: string, actions?: React.ReactNode) => 
    setHeaderConfig({ show: true, title: title || '', actions });
    
  return { headerConfig, hideHeader, showHeader };
};
