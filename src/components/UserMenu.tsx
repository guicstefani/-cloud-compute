
import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const UserMenu = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se há usuário logado
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleChangePassword = () => {
    // Por enquanto, apenas um alerta - pode ser expandido para um modal
    alert('Funcionalidade de alterar senha em desenvolvimento. Em breve será possível alterar a senha diretamente aqui.');
  };

  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    
    // Tenta pegar o nome dos metadados do usuário
    const fullName = user.user_metadata?.full_name;
    const firstName = user.user_metadata?.first_name;
    
    if (fullName) return fullName;
    if (firstName) return firstName;
    
    // Se não tem nome, usa a primeira parte do email
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Minha Conta';
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/login')}
        className="border-gray-300"
      >
        <User className="w-4 h-4 mr-2" />
        Entrar
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gray-300 hover:border-[#DCAE1D] hover:text-[#DCAE1D] transition-colors"
        >
          <User className="w-4 h-4 mr-2" />
          {getUserDisplayName()}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getUserDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleChangePassword}>
          <Settings className="w-4 h-4 mr-2" />
          Alterar Senha
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
