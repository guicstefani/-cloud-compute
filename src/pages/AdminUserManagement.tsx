
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Users, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  role: string;
  created_at: string;
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    
    let query = supabase.from('profiles').select('*');
    
    if (filter !== 'all') {
      query = query.eq('role', filter);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const updateUserStatus = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          approved_at: newRole === 'user' ? new Date().toISOString() : null,
          approved_by: newRole === 'user' ? user?.id : null
        })
        .eq('id', userId);

      if (error) throw error;

      loadUsers();
      toast.success(`Usuário ${newRole === 'user' ? 'aprovado' : 'rejeitado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar status do usuário');
      console.error(error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'user':
        return <Badge className="text-green-700 border-green-300 bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'admin':
        return <Badge className="text-blue-700 border-blue-300 bg-blue-100"><Users className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Calculadora
          </Button>
          
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Aprovar ou rejeitar solicitações de acesso</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === 'user' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('user')}
          >
            Aprovados
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
          >
            Rejeitados
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
        </div>

        <div className="grid gap-4">
          {users.map(user => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.full_name || 'Sem nome'}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      Empresa: {user.company_name || 'Não informada'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Telefone: {user.phone || 'Não informado'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cadastrado em: {format(new Date(user.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>

                  {user.role === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateUserStatus(user.id, 'user')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateUserStatus(user.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
