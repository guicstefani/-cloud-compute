
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { forcePremiumColors } from "@/utils/forcePremiumColors";
import { initPremiumEnhancements } from "@/utils/premiumEnhancements";
import { ConditionalLayout } from "@/shared/layouts/ConditionalLayout";
import { CleanDashboard } from "@/modules/clean-dashboard";
import { safeSupabase } from "@/shared/services/SafeSupabase";
import { TesteNovoSistema } from "./test-novo-sistema";

// Injeta CSS variables globais
import { cssVariables } from "@/shared/ui/theme/tokens";

const queryClient = new QueryClient();

// Injeta variáveis CSS no DOM
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = cssVariables;
  document.head.appendChild(style);
}

const App = () => {
  useEffect(() => {
    try {
      // Inicializa Supabase de forma segura
      safeSupabase.initialize();
      
      // Mantém funcionalidades premium existentes
      const cleanup = forcePremiumColors();
      
      setTimeout(() => {
        forcePremiumColors();
      }, 500);
      
      const enhancementsCleanup = initPremiumEnhancements();
      
      return () => {
        cleanup();
        enhancementsCleanup();
      };
    } catch (error) {
      console.log('Erro ao carregar enhancements:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ConditionalLayout>
            <Routes>
              {/* Página principal - código legado com layout condicional */}
              <Route path="/" element={<Index />} />
              
              {/* Novo dashboard limpo */}
              <Route path="/dashboard" element={<CleanDashboard />} />
              
              {/* Rota de teste isolado - NOVO */}
              <Route path="/teste-novo" element={<TesteNovoSistema />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ConditionalLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
