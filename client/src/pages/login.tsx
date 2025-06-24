import Link from 'next/link';
import { useState } from 'react';
import { login } from '../services/auth';
import { useRouter } from 'next/router';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useToast } from '@/components/ToastContext';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      const { accessToken, refreshToken, message } = data;
      if (!accessToken || !refreshToken) {
        const msg = message ?? 'Erro ao fazer login';
        handleErrorMessage(msg);
        return;
      }
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao fazer login';
      handleErrorMessage(msg);
    }
  };

  // helper para distinguir “não validada” de outros
  function handleErrorMessage(msg: string) {
    if (msg.includes('Conta não validada')) {
      const resend = async () => {
        try {
          await fetch('/api/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          showToast('E-mail de verificação reenviado!', { duration: Infinity });
        } catch {
          showToast('Falha ao reenviar e-mail.');
        }
      };

      showToast(
        <div className="flex items-center space-x-4">
          <span>E-mail não verificado! Por favor, valide sua conta antes de entrar.</span>
          <button
            onClick={resend}
            className="bg-black hover:bg-[#333333] text-[#DF9829] font-semibold px-4 py-1 rounded-md cursor-pointer"
          >
            Reenviar
          </button>
        </div>,
        { duration: Infinity }
      );
    } else {
      showToast(msg);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0705]">
      <div className="w-full max-w-md bg-[#1a1615] p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <Link href="/">
          <Image
            src="/logoAtacanetHorizontal.svg"
            alt="AtacaNet Logo"
            width={500}
            height={500}
            className="h-15 w-auto mt-8 mb-12"
          />
        </Link>
        <h1 className="text-[#DF9829] text-center text-lg font-semibold mb-8">
          Bem vindo ao AtacaNet!
        </h1>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            id="email"
            type="email"
            placeholder="e-mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
            required
          />

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
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
            className="bg-[#DF9829] hover:bg-[#C77714] transition text-white font-semibold py-3 rounded-md cursor-pointer"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Ainda não tem uma conta?{' '}
          <Link href="/register" className="text-[#DF9829] font-medium hover:underline">
            Crie uma conta
          </Link>
        </p>
      </div>
    </main>
  );
}
