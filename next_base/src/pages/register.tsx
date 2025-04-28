import Link from "next/link";

export default function Register() {
  return (
    <main className="min-h-screen flex justify-center items-center bg-[#111]">
      <div className="flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden w-[70%] max-w-4xl">
        <div className="bg-[#4268f6] text-white flex flex-col justify-center p-12 w-1/2">
          <h1 className="text-4xl font-bold leading-tight">Crie sua conta!</h1>
          <p className="mt-4 text-lg opacity-90">
            Registre-se para acessar todos os recursos da nossa plataforma.
          </p>
        </div>

        <div className="p-12 flex flex-col justify-center bg-[#1a1a1a] text-white w-1/2">
          <h2 className="text-[#4268f6] text-3xl font-bold text-center">
            Cadastro
          </h2>

          <form className="mt-6 flex flex-col gap-5">
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              required
              className="w-full p-4 bg-[#222] border border-gray-600 rounded-md transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Seu email"
              required
              autoComplete="email"
              className="w-full p-4 bg-[#222] border border-gray-600 rounded-md transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Crie uma senha"
              required
              className="w-full p-4 bg-[#222] border border-gray-600 rounded-md transition"
            />

            <button className="mt-2 bg-[#4268f6] text-white py-3 rounded-md font-semibold hover:bg-[#3654c9] transition">
              Cadastrar
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-gray-400">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-[#4268f6] font-bold hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
