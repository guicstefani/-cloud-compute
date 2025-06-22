
import React from 'react';
import { useIsMobile } from '@/hooks/useMobile';

interface CompactLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  summary: React.ReactNode;
}

export const CompactLayout: React.FC<CompactLayoutProps> = ({
  sidebar,
  main,
  summary
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        {sidebar}
        <div className="flex-1 overflow-auto">
          {main}
          <div className="p-4 bg-gray-50 dark:bg-gray-900">
            {summary}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar compacta */}
      <div className="w-64 flex-shrink-0">
        {sidebar}
      </div>
      
      {/* Layout em 3 colunas para desktop */}
      <div className="flex-1 flex">
        {/* Coluna principal - 60% */}
        <div className="flex-1 max-w-[60%] overflow-auto p-6">
          {main}
        </div>
        
        {/* Coluna do resumo - 40% */}
        <div className="w-[40%] min-w-[320px] max-w-[400px] bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-auto p-6">
          {summary}
        </div>
      </div>
    </div>
  );
};
