
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, Database, Headphones, UserPlus, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import './LoginV2.css';

const LoginV2: React.FC = () => {
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
    <div className="login-v2-container">
      {/* Background com partículas animadas */}
      <div className="login-v2-particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's',
              animationDuration: (10 + Math.random() * 20) + 's'
            }}
          />
        ))}
      </div>

      {/* Lado Esquerdo - Branding */}
      <div className="login-v2-left">
        <div className="login-v2-brand">
          <div className="brand-logo">
            <div className="logo-icon">
              <span>O</span>
            </div>
            <h1 className="brand-title">Optidata Cloud</h1>
            <p className="brand-subtitle">Calculadora Premium de Infraestrutura</p>
          </div>
          
          <div className="brand-features">
            <div className="feature-item">
              <Shield className="feature-icon" />
              <span>Seguro & Confiável</span>
            </div>
            <div className="feature-item">
              <Database className="feature-icon" />
              <span>Cálculos Precisos</span>
            </div>
            <div className="feature-item">
              <Headphones className="feature-icon" />
              <span>Suporte Especializado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="login-v2-right">
        <div className="login-v2-form-container">
          <div className="form-header">
            <h2 className="form-title">
              {isSignUp ? 'Criar Conta' : 'Acesso ao Sistema'}
            </h2>
            <p className="form-subtitle">
              {isSignUp ? 'Configure sua conta para começar' : 'Entre com suas credenciais corporativas'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="login-form">
            {/* Campo Email */}
            <div className="input-group">
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`login-v2-input ${errors.email ? 'error' : emailValid === true ? 'valid' : ''}`}
                  placeholder="Digite seu email corporativo"
                  disabled={isLoading || isBlocked}
                />
                {emailValid === true && (
                  <div className="validation-check">✓</div>
                )}
                <label className={`floating-label ${email ? 'active' : ''}`}>
                  Email Corporativo
                </label>
              </div>
              {errors.email && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Campo Senha */}
            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`login-v2-input ${errors.password ? 'error' : ''}`}
                  placeholder="Digite sua senha"
                  disabled={isLoading || isBlocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <label className={`floating-label ${password ? 'active' : ''}`}>
                  Senha de Acesso
                </label>
              </div>
              {errors.password && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Campo Confirmar Senha (apenas no signup) */}
            {isSignUp && (
              <div className="input-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`login-v2-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirme sua senha"
                    disabled={isLoading || isBlocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <label className={`floating-label ${confirmPassword ? 'active' : ''}`}>
                    Confirmar Senha
                  </label>
                </div>
                {errors.confirmPassword && (
                  <div className="error-message">
                    <span className="error-icon">⚠</span>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            )}

            {/* Indicadores de Tentativa */}
            {attemptCount > 0 && !isBlocked && !isSignUp && (
              <div className="attempt-warning">
                <div className="warning-content">
                  {attemptCount === 1 && (
                    <>
                      <span className="warning-icon">⚠</span>
                      Primeira tentativa incorreta. Verifique suas credenciais.
                    </>
                  )}
                  {attemptCount === 2 && (
                    <>
                      <span className="warning-icon">🚨</span>
                      Segunda tentativa incorreta. Mais uma tentativa antes do bloqueio.
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Timer de Bloqueio */}
            {isBlocked && (
              <div className="blocked-warning">
                <div className="blocked-content">
                  <span className="blocked-icon">🔒</span>
                  <div className="blocked-text">
                    <strong>Conta bloqueada por segurança</strong>
                    <p>Desbloqueio em: {Math.floor(blockTimeLeft / 60)}:{(blockTimeLeft % 60).toString().padStart(2, '0')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão Principal */}
            <button
              type="submit"
              disabled={isBlocked || !emailValid || !password || (isSignUp && password !== confirmPassword) || isLoading}
              className="login-v2-button"
            >
              {isLoading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <span>Processando...</span>
                </div>
              ) : (
                <div className="button-content">
                  <span>{isBlocked ? 'Sistema Bloqueado' : isSignUp ? 'Criar Conta' : 'Acessar Sistema'}</span>
                  <ArrowRight className="button-icon" size={20} />
                </div>
              )}
            </button>

            {/* Link para alternar entre login/signup */}
            <div className="form-switch">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setConfirmPassword('');
                }}
                className="switch-button"
                disabled={isLoading}
              >
                <UserPlus size={16} />
                <span>
                  {isSignUp ? 'Já possui conta? Fazer login' : 'Não possui conta? Criar uma'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer com informação do sistema */}
        <div className="login-footer">
          <p>© 2024 Optidata Cloud Calculator • Sistema Premium</p>
        </div>
      </div>
    </div>
  );
};

export default LoginV2;
