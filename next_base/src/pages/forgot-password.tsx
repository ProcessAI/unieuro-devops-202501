import Link from "next/link";

export default function ForgotPassword() {
  return (
    <main className="min-h-screen flex justify-center items-center bg-[#111]">
      <div className="flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden w-[70%] max-w-4xl">
        <div className="bg-[#4268f6] text-white flex flex-col justify-center p-12 w-1/2">
          <h1 className="text-4xl font-bold leading-tight">Recupere sua senha</h1>
          <p className="mt-4 text-lg opacity-90">
            Informe seu e-mail para receber as instruções de recuperação.
          </p>
        </div>

        <div className="p-12 flex flex-col justify-center bg-[#1a1a1a] text-white w-1/2">
          <h2 className="text-[#4268f6] text-3xl font-bold text-center">
            Esqueci a Senha
          </h2>

          <form className="mt-6 flex flex-col gap-5">
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              required
              autoComplete="email"
              className="w-full p-4 bg-[#222] border border-gray-600 rounded-md transition"
            />

            <button className="mt-2 bg-[#4268f6] text-white py-3 rounded-md font-semibold hover:bg-[#3654c9] transition">
              Enviar link de recuperação
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-gray-400">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-[#4268f6] font-bold hover:underline">
              Voltar para login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
