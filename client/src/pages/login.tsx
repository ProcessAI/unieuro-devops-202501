import Link from 'next/link';
import { useState } from 'react';
import { login } from '../services/auth';
import { useRouter } from 'next/router';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const { accessToken, refreshToken } = await login(email, password);
      if (!accessToken || !refreshToken) {
        alert('Erro ao fazer login');
        return;
      }
      router.push('/');
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0705]">
      <div className="w-full max-w-md bg-[#1a1615] p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <h1 className="text-[#DF9829] text-center text-lg font-semibold mb-4">
          Bem vindo ao AtacaNet!
        </h1>

        <a href="/">
          <img src="/logoAtacanet.svg" alt="AtacaNet Logo" className="h-24 w-24 mb-6" />
        </a>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="e-mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-[#DF9829] text-sm hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-[#DF9829] hover:bg-[#C77714] transition text-white font-semibold py-3 rounded-md"
          >
            Entrar
          </button>
        </form>

        <Link
          href="/register"
          className="text-[#DF9829] text-sm font-medium mt-6 hover:underline flex items-center gap-1"
        >
          Criar uma nova conta <span>→</span>
        </Link>
      </div>
    </main>
  );
}
