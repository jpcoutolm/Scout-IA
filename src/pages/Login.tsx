// src/pages/Login.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Se já estiver logado, redireciona
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const traduzErro = (msg: string) => {
    const m = msg.toLowerCase();
    if (m.includes('invalid login credentials')) return 'Credenciais inválidas';
    if (m.includes('missing email') || m.includes('missing phone')) return 'Informe o e‑mail';
    if (m.includes('email not confirmed')) return 'E‑mail ainda não confirmado';
    if (m.includes('rate limit')) return 'Muitas tentativas. Tente novamente em instantes.';
    return `Erro ao entrar: ${msg}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setCarregando(false);
    if (error) {
      setErro(traduzErro(error.message));
      return;
    }
    navigate('/');
  };

  const enviarRecuperacao = async () => {
    setErro(null);
    if (!email) {
      setErro('Digite seu e‑mail para receber o link de recuperação.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/Scout-IA', // ajuste se necessário
    });
    if (error) setErro(traduzErro(error.message));
    else alert('Enviamos um e‑mail com instruções para redefinir sua senha.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Scout IA</h1>
          <p className="text-muted-foreground">Faça login para continuar</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm">E‑mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e‑mail"
              className="
                w-full rounded-md border border-input bg-background px-3 py-2
                text-black placeholder:text-gray-500
                dark:text-white dark:placeholder:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              "
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="
                w-full rounded-md border border-input bg-background px-3 py-2
                text-black placeholder:text-gray-500
                dark:text-white dark:placeholder:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              "
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="
              w-full rounded-md bg-emerald-500 px-4 py-2 font-medium text-white
              hover:bg-emerald-600 disabled:opacity-60
            "
          >
            {carregando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="text-center text-sm space-y-2">
          <button
            type="button"
            onClick={enviarRecuperacao}
            className="text-muted-foreground hover:underline"
          >
            Esqueceu sua senha?
          </button>
          <div className="text-muted-foreground">
            Não tem uma conta?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Fluxo de cadastro pode ser implementado aqui (signUp).');
              }}
              className="underline"
            >
              Cadastre‑se
            </a>
          </div>
        </div>

        {erro && (
          <div className="rounded-md border border-red-300 bg-red-100 px-3 py-2 text-red-700 text-sm">
            {erro}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
