import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { formatCpfCnpj, validateCPF } from '../utils/cpfCnpj';
import { formatDate, toISODate, validateDate } from '../utils/dateUtils';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import Image from 'next/image';
import { useToast } from '@/components/ToastContext';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    dataNascimento: '',
    cpf: '',
  });

  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const cpfRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const disabled = loading || Object.values(errors).some((msg) => !!msg);
  const { showToast } = useToast();
  const router = useRouter();

  function setFieldError(field: string, msg = '') {
    setErrors((prev) => ({ ...prev, [field]: msg }));
  }

  function clearFieldError(field: string) {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, selectionStart } = e.target;

    let formatted = value;
    let inputRef: any | null = null;

    if (name === 'dataNascimento') {
      formatted = formatDate(value);
      inputRef = dateRef;
    } else if (name === 'cpf') {
      formatted = formatCpfCnpj(value);
      inputRef = cpfRef;
    }

    const diff = formatted.length - value.length;

    setFormData((prev) => ({ ...prev, [name]: formatted }));
    clearFieldError(name);

    if (inputRef?.current && selectionStart != null) {
      const newPos = selectionStart + diff;
      requestAnimationFrame(() => {
        inputRef!.current!.setSelectionRange(newPos, newPos);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.dataNascimento.length < 10) {
      return setError('Preencha a data completa.');
    }
    if (!validateDate(formData.dataNascimento)) {
      return setError('Data de nascimento inválida.');
    }

    const rawCpf = formData.cpf.replace(/\D/g, '');
    if (rawCpf.length < 11) {
      return setError('Preencha o CPF completo.');
    }
    if (!validateCPF(rawCpf)) {
      return setError('CPF inválido.');
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cpf: rawCpf,
          dataNascimento: toISODate(formData.dataNascimento),
        }),
      });

      const response = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        showToast(response.mensage ?? 'Por favor tente novamente mais tarde.');
      }
    } catch {
      setError('Erro de rede, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex justify-center bg-[#0D0705] overflow-y-auto py-6 sm:items-center">
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
        <h1 className="text-[#DF9829] text-center text-lg font-semibold mb-8">Cadastro</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Nome..."
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

          {/* Data de nascimento */}
          <input
            ref={dateRef}
            type="text"
            name="dataNascimento"
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            value={formData.dataNascimento}
            onChange={handleChange}
            onBlur={() => {
              const msg =
                formData.dataNascimento.length < 10
                  ? 'Data incompleta.'
                  : !validateDate(formData.dataNascimento)
                    ? 'Data inválida.'
                    : '';
              setFieldError('dataNascimento', msg);
            }}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />
          {errors.dataNascimento && (
            <div className="text-red-500 text-sm">{errors.dataNascimento}</div>
          )}

          {/* Telefone */}
          <input
            type="tel"
            name="telefone"
            placeholder="Telefone..."
            value={formData.telefone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="E-mail..."
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

          {/* Senha com toggle de visibilidade */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="senha"
              placeholder="Senha..."
              value={formData.senha}
              onChange={handleChange}
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

          <input
            ref={cpfRef}
            type="text"
            name="cpf"
            placeholder="CPF..."
            maxLength={14}
            value={formData.cpf}
            onChange={handleChange}
            onBlur={() => {
              const raw = formData.cpf.replace(/\D/g, '');
              const msg =
                raw.length < 11 ? 'CPF incompleto.' : !validateCPF(raw) ? 'CPF inválido.' : '';
              setFieldError('cpf', msg);
            }}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

          {errors.cpf && (
            <div className="text-red-500 text-sm">{errors.cpf}</div>
          )}
          <button
            type="submit"
            disabled={disabled}
            className={`bg-[#DF9829] text-white font-semibold py-3 rounded-md ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#c67d1c]'} cursor-pointer`}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-[#DF9829] font-medium hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}
