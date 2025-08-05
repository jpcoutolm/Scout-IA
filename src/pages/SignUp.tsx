import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const traduzErro = (msg: string) => {
    const m = msg.toLowerCase();
    if (m.includes('password should be at least')) return 'A senha deve conter no mínimo 6 caracteres.';
    if (m.includes('user already registered')) return 'Este e‑mail já está cadastrado.';
    if (m.includes('invalid email')) return 'E‑mail inválido.';
    return `Erro ao cadastrar: ${msg}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro(traduzErro(error.message));
    } else {
      alert('Cadastro realizado! Verifique seu e-mail para confirmar.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-muted-foreground">Preencha os campos para se cadastrar</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm">E‑mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e‑mail"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-md bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {carregando ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </form>

        {erro && (
          <div className="rounded-md border border-red-300 bg-red-100 px-3 py-2 text-red-700 text-sm">
            {erro}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
