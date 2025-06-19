
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, ArrowLeft } from 'lucide-react';

export function PendingApproval() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">Conta Criada com Sucesso!</h2>
          <p className="text-gray-600 mb-6">
            Sua solicitação de acesso foi enviada e está aguardando aprovação do administrador.
          </p>
          
          <Alert className="mb-6">
            <AlertDescription>
              Você receberá um email assim que sua conta for aprovada. 
              Isso geralmente leva até 24 horas úteis.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={() => navigate('/login')} 
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
