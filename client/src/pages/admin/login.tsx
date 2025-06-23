import Link from 'next/link';
import { useState } from 'react';
import { adminLogin } from '../../services/auth';
import { useRouter } from 'next/router';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useToast } from '@/components/ToastContext';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await adminLogin(email, password);
      const { accessToken, refreshToken, message } = data;
      
      if (!accessToken || !refreshToken) {
        handleErrorMessage(message ?? 'Erro ao fazer login');
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro inesperado ao fazer login';
      handleErrorMessage(msg);
    }
  };

  function handleErrorMessage(msg: string) {
    showToast(msg, { duration: 5000 });
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
          Área Administrativa - AtacaNet
        </h1>

        <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-4">
          <input
            id="email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
            required
          />

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
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

          <button
            type="submit"
            className="bg-[#DF9829] hover:bg-[#C77714] transition text-white font-semibold py-3 rounded-md cursor-pointer"
          >
            Acesse
          </button>
        </form>
      </div>
    </main>
  );
}
