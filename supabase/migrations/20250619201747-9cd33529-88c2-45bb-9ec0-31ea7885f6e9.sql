
-- Criar tabela de perfis de usuário estendida
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Função para evitar recursão em RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Política para usuários verem seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para admins verem todos os perfis
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Política para admins atualizarem perfis
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Política para inserir perfil (apenas trigger)
CREATE POLICY "Enable insert for service role" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Criar tabela de cotações salvas
CREATE TABLE public.saved_quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  vms JSONB NOT NULL,
  total_monthly DECIMAL(10,2) NOT NULL,
  total_vcpus INTEGER NOT NULL,
  total_ram INTEGER NOT NULL,
  total_storage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para cotações
ALTER TABLE public.saved_quotations ENABLE ROW LEVEL SECURITY;

-- Políticas para cotações
CREATE POLICY "Users can manage own quotations" ON public.saved_quotations
  FOR ALL USING (auth.uid() = user_id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'pending');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
