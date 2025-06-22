
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, Database, Headphones, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { LoginBackground } from '@/components/auth/LoginBackground';
import { LoginCard } from '@/components/auth/LoginCard';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { FloatingLabel } from '@/components/auth/FloatingLabel';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; confirmPassword?: string}>({});
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  // Verifica se já está logado
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  // Timer para desbloqueio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && blockTimeLeft > 0) {
      timer = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttemptCount(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBlocked, blockTimeLeft]);

  // Validação de email em tempo real
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      setEmailValid(isValid);
      
      if (!isValid && email.length > 3) {
        setErrors(prev => ({ ...prev, email: 'Email inválido' }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    } else {
      setEmailValid(null);
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [email]);

  // Validação da confirmação de senha
  useEffect(() => {
    if (isSignUp && confirmPassword) {
      if (password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Senhas não coincidem' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }
  }, [password, confirmPassword, isSignUp]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        variant: "destructive", 
        title: "Conta temporariamente bloqueada",
        description: `Tente novamente em ${blockTimeLeft} segundos.`
      });
      return;
    }

    if (!emailValid || !password || (isSignUp && password !== confirmPassword)) {
      setErrors({
        email: !emailValid ? 'Email obrigatório e válido' : undefined,
        password: !password ? 'Senha obrigatória' : undefined,
        confirmPassword: isSignUp && password !== confirmPassword ? 'Senhas não coincidem' : undefined
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Criar conta
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          let errorMessage = 'Erro ao criar conta';
          if (error.message.includes('User already registered')) {
            errorMessage = 'Este email já está registrado. Tente fazer login.';
          }
          
          toast({
            variant: "destructive",
            title: "Erro na criação da conta",
            description: errorMessage
          });
        } else {
          toast({
            title: "Conta criada com sucesso!",
            description: "Verifique seu email para confirmar a conta."
          });
          setIsSignUp(false);
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setAttemptCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              setIsBlocked(true);
              setBlockTimeLeft(300);
              toast({
                variant: "destructive",
                title: "Muitas tentativas",
                description: "Conta bloqueada por 5 minutos por segurança."
              });
            }
            return newCount;
          });

          let errorMessage = 'Credenciais inválidas';
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Email ou senha incorretos';
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
          }

          toast({
            variant: "destructive",
            title: "Erro no login",
            description: errorMessage
          });
        } else {
          setAttemptCount(0);
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo de volta! 👋`
          });
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast({
        variant: "destructive",
        title: "Erro interno",
        description: "Tente novamente em alguns instantes."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Lado Esquerdo - Background Visual */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <LoginBackground />
        
        {/* Conteúdo Visual Simplificado */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-white">
          <div className="animate-fade-in">
            <div className="w-48 h-24 bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] rounded-2xl flex items-center justify-center mb-8">
              <span className="text-black font-bold text-4xl">C</span>
            </div>
          </div>
          
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] bg-clip-text text-transparent">
              Calculadora Cloud
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Sistema interno para cotação de infraestrutura
            </p>
          </div>

          {/* Footer com ícones */}
          <div className="absolute bottom-8 flex space-x-8 text-gray-400">
            <div className="flex items-center space-x-2 hover:text-[#DCAE1D] transition-colors cursor-pointer">
              <Shield size={20} />
              <span className="text-sm">Seguro</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-[#DCAE1D] transition-colors cursor-pointer">
              <Database size={20} />
              <span className="text-sm">Confiável</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-[#DCAE1D] transition-colors cursor-pointer">
              <Headphones size={20} />
              <span className="text-sm">Suporte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
        <LoginCard>
          <div className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Criar Conta' : 'Bem-vindo'}
              </h2>
              <p className="text-gray-400">
                {isSignUp ? 'Crie sua conta para continuar' : 'Entre com suas credenciais'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {/* Campo Email */}
              <div className="relative">
                <FloatingLabel
                  label="Email"
                  value={email}
                  error={errors.email}
                  valid={emailValid}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-[#141414] border-2 border-[#2a2a2a] rounded-lg px-12 pr-12 text-white text-lg transition-all duration-300 focus:border-[#DCAE1D] focus:outline-none"
                    placeholder="Digite seu email"
                    disabled={isLoading || isBlocked}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  {emailValid === true && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 animate-scale-in">
                      ✓
                    </div>
                  )}
                </FloatingLabel>
              </div>

              {/* Campo Senha */}
              <div className="relative">
                <FloatingLabel
                  label="Senha"
                  value={password}
                  error={errors.password}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-[#141414] border-2 border-[#2a2a2a] rounded-lg px-12 pr-12 text-white text-lg transition-all duration-300 focus:border-[#DCAE1D] focus:outline-none"
                    placeholder="Digite sua senha"
                    disabled={isLoading || isBlocked}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#DCAE1D] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </FloatingLabel>
              </div>

              {/* Campo Confirmar Senha (apenas no signup) */}
              {isSignUp && (
                <div className="relative">
                  <FloatingLabel
                    label="Confirmar Senha"
                    value={confirmPassword}
                    error={errors.confirmPassword}
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-14 bg-[#141414] border-2 border-[#2a2a2a] rounded-lg px-12 pr-12 text-white text-lg transition-all duration-300 focus:border-[#DCAE1D] focus:outline-none"
                      placeholder="Confirme sua senha"
                      disabled={isLoading || isBlocked}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#DCAE1D] transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </FloatingLabel>
                </div>
              )}

              {/* Indicador de tentativas */}
              {attemptCount > 0 && !isBlocked && !isSignUp && (
                <div className="text-yellow-500 text-sm text-center">
                  {attemptCount === 1 && "Primeira tentativa incorreta. Verifique suas credenciais."}
                  {attemptCount === 2 && "Segunda tentativa incorreta. Mais uma tentativa antes do bloqueio."}
                </div>
              )}

              {/* Timer de bloqueio */}
              {isBlocked && (
                <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
                  Conta bloqueada por segurança. Desbloqueio em: {Math.floor(blockTimeLeft / 60)}:{(blockTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              )}

              {/* Botão Principal */}
              <LoadingButton
                isLoading={isLoading}
                disabled={isBlocked || !emailValid || !password || (isSignUp && password !== confirmPassword)}
                className="w-full h-14 bg-gradient-to-r from-[#DCAE1D] to-[#F4C430] hover:from-[#F4C430] hover:to-[#DCAE1D] text-black font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#DCAE1D]/20 hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBlocked ? 'Bloqueado' : isSignUp ? 'Criar Conta' : 'Entrar'}
              </LoadingButton>

              {/* Link para alternar entre login/signup */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                    setConfirmPassword('');
                  }}
                  className="text-[#DCAE1D] hover:text-[#F4C430] text-sm transition-colors relative group"
                  disabled={isLoading}
                >
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Já tem conta? Fazer login
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Não tem conta? Criar uma
                    </>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#DCAE1D] transition-all duration-300 group-hover:w-full" />
                </button>
              </div>
            </form>
          </div>
        </LoginCard>
      </div>
    </div>
  );
};

export default Login;
