import { useState } from 'react';
import { useToast } from '@/components/ToastContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, { duration: 5000 });
      } else {
        showToast(data.message || 'Erro ao solicitar reset.', { duration: 5000 });
      }
    } catch {
      showToast('Falha de rede.', { duration: 5000 });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0705]">
      <div className="w-full max-w-md bg-[#1A1615] p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <Link href="/">
          <Image
            src="/logoAtacanetHorizontal.svg"
            alt="AtacaNet Logo"
            width={500}
            height={500}
            className="h-15 w-auto mt-8 mb-12"
          />
        </Link>
        <h1 className="text-[#DF9829] text-lg font-semibold mb-8">Esqueci minha senha</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            id="email"
            type="email"
            placeholder="seu e-mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />
          <button
            type="submit"
            className="bg-[#DF9829] hover:bg-[#C77714] text-white font-semibold py-3 rounded-md cursor-pointer"
          >
            Enviar link
          </button>
          <p className="mt-6 text-sm text-center text-gray-400">
            Lembrou a senha?{' '}
            <Link href="/login" className="text-[#DF9829] font-medium hover:underline">
              Voltar ao login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
