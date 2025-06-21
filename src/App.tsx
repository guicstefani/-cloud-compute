
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

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    try {
      // Forçar cores premium quando o app carregar
      const cleanup = forcePremiumColors();
      
      // Aplicar também após um pequeno delay para garantir que tudo carregou
      setTimeout(() => {
        forcePremiumColors();
      }, 500);
      
      // Inicializar enhancements visuais cinematográficos
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
