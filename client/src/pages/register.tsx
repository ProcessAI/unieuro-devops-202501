import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import Image from 'next/image';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Função para lidar com a mudança dos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função para enviar os dados do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Enviar os dados para a rota de registro no backend
      const response = await fetch('http://localhost:3333/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirecionar o usuário após o cadastro bem-sucedido
        router.push('/login'); // Ou para uma página de login, por exemplo
      } else {
        // Exibir erro caso algo tenha dado errado
        setError(result.message || 'Erro ao cadastrar usuário.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de rede, tente novamente mais tarde.');
    } finally {
      setLoading(false);
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
        <h1 className="text-[#DF9829] text-center text-lg font-semibold mb-8">Cadastro</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome..."
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

          <input
            type="tel"
            name="telefone"
            placeholder="Telefone..."
            value={formData.telefone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

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

          <div className="relative">
            <input
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
            type="text"
            name="cpf"
            placeholder="CPF..."
            value={formData.cpf}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none correct-input"
          />

          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#DF9829] hover:bg-[#c67d1c] transition text-white font-semibold py-3 rounded-md"
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
