import Link from "next/link";

export default function Register() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0705]">
      <div className="w-full max-w-md bg-[#1A1615] p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <h1 className="text-[#DF9829] text-center text-lg font-semibold mb-4">
          Cadastro
        </h1>

        <img
          src="/logoAtacanet.svg"
          alt="AtacaNet Logo"
          className="h-24 w-24 mb-6"
        />

        <form className="w-full flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            placeholder="nome..."
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
          />

          <input
            type="text"
            name="sobrenome"
            placeholder="sobrenome..."
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
          />

          <input
            type="tel"
            name="telefone"
            placeholder="Telefone...."
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="e-mail..."
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
          />

          <input
            type="password"
            name="senha"
            placeholder="senha..."
            required
            className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-[#DF9829] hover:bg-[#c67d1c] transition text-white font-semibold py-3 rounded-md"
          >
            Cadastrar
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-[#DF9829] font-medium hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}