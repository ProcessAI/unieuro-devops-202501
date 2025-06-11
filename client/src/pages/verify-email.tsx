import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useToast } from '@/components/ToastContext';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query as { token?: string };
  const { showToast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setStatus('error');
      setErrorMessage('Token ausente.');
      return;
    }

    fetch(`/api/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          showToast(data.message, { duration: 5000 });
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'Erro na validação.');
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMessage('Falha de rede. Tente novamente.');
      });
  }, [router.isReady, token]);

  const handleResend = async () => {
    if (!email.trim()) {
      showToast('Por favor, preencha seu e-mail antes de reenviar.', { duration: 5000 });
      return;
    }
    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
      } else if (data.message?.includes('Conta já validada')) {
        showToast('E-mail já validado! Faça login e seja muito bem vindo.', { duration: 10000 });
        router.push('/login');
      } else {
        showToast(data.message || 'Erro ao reenviar e-mail.', { duration: 10000 });
      }
    } catch {
      showToast('Erro de rede ao reenviar e-mail.', { duration: 10000 });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0705]">
      <div className="w-full max-w-md bg-[#1a1615] p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
        {status === 'loading' && <p className="text-white">Verificando seu e-mail…</p>}

        {status === 'success' && (
          <>
            <IconCheck size={48} className="text-[#DF9829] mb-4" />
            <h1 className="text-[#DF9829] text-lg font-semibold mb-2">
              E-mail verificado com sucesso!
            </h1>
            <Link
              href="/login"
              className="bg-[#DF9829] hover:bg-[#C77714] text-white font-semibold py-3 px-6 rounded-md mt-4"
            >
              Ir para Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <IconX size={48} className="text-red-500 mb-4" />
            <h1 className="text-red-500 text-lg font-semibold mb-2">{errorMessage}</h1>
            <p className="text-gray-400 mb-4">Para reenviar, informe seu e-mail:</p>
            <input
              id="email"
              type="email"
              placeholder="seu e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input mb-4"
            />
            <button
              onClick={handleResend}
              className="bg-[#DF9829] hover:bg-[#C77714] text-white font-semibold py-3 px-6 rounded-md cursor-pointer"
            >
              Reenviar e-mail
            </button>
          </>
        )}
      </div>
    </main>
  );
}
