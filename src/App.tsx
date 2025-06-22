
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LoginV2 from "./components/auth/LoginV2";
import NotFound from "./pages/NotFound";
import { forcePremiumColors } from "@/utils/forcePremiumColors";
import { initPremiumEnhancements } from "@/utils/premiumEnhancements";
import { ConditionalLayout } from "@/shared/layouts/ConditionalLayout";
import { safeSupabase } from "@/shared/services/SafeSupabase";

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
              {/* Página principal - sistema de calculadora completo */}
              <Route path="/" element={<Index />} />
              
              {/* Sistema de Login Original */}
              <Route path="/login" element={<Login />} />
              
              {/* LoginV2 - Versão melhorada mantida */}
              <Route path="/login-novo" element={<LoginV2 />} />
              
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
