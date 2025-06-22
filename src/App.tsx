
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

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    try {
      // Inicializa Supabase de forma segura
      safeSupabase.initialize();
      
      // Aplica cores premium
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
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-novo" element={<LoginV2 />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ConditionalLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
