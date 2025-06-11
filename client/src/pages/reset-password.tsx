import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastContext';
import Image from 'next/image';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query as { token?: string };
  const { showToast } = useToast();

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [senha, setSenha] = useState('');
  const [senhaRepetida, setSenhaRepetida] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      showToast('Token ausente.', { duration: 5000 });
      router.replace('/forgot-password');
      return;
    }

    fetch(`/api/validate-reset-token?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setTokenValid(true);
        } else {
          showToast(data.message || 'Link inválido ou expirado.', { duration: 5000 });
          router.replace('/forgot-password');
        }
      })
      .catch(() => {
        showToast('Erro de rede ao validar link.', { duration: 5000 });
        router.replace('/forgot-password');
      });
  }, [router.isReady, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== senhaRepetida) {
      showToast('As senhas não coincidem.', { duration: 5000 });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: senha }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, { duration: 5000 });
        router.replace('/login');
        return;
      } else {
        showToast(data.message || 'Erro ao redefinir senha.', { duration: 5000 });
      }
    } catch {
      showToast('Falha de rede.', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0705]">
        <p className="text-white">Verificando link…</p>
      </main>
    );
  }

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
        <h1 className="text-[#DF9829] text-lg font-semibold mb-8">Criar Nova Senha</h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua nova senha..."
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Repita a nova senha..."
              value={senhaRepetida}
              onChange={(e) => setSenhaRepetida(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
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
            disabled={loading}
            className="bg-[#DF9829] hover:bg-[#C77714] transition text-white font-semibold py-3 rounded-md"
          >
            {loading ? 'Aguarde...' : 'Redefinir Senha'}
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
