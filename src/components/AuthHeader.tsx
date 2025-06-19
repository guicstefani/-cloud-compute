
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function AuthHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user || !profile) return null;

  return (
    <div className="flex justify-end p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {profile.full_name || profile.email}
            {profile.role === 'admin' && (
              <Badge variant="secondary" className="ml-1">Admin</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm text-gray-500">
            {profile.email}
            {profile.company_name && (
              <div className="text-xs">{profile.company_name}</div>
            )}
          </div>
          <DropdownMenuSeparator />
          
          {profile.role === 'admin' && (
            <>
              <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Usuários
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
