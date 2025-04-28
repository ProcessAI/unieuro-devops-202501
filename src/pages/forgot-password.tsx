import Link from "next/link";

export default function ForgotPassword() {
  return (
    <main className="min-h-screen flex justify-center items-center bg-[#0D0705]">
      <div className="w-full max-w-2xl flex rounded-xl overflow-hidden shadow-lg">
        {/* Lado esquerdo com logo e texto */}
        <div className="w-1/2 bg-[#1A1615] flex flex-col items-center justify-center p-6 text-white text-center">
          <img
            src="/logoAtacanet.svg"
            alt="Logo AtacaNet"
            className="h-24 w-24 mb-6"
          />
          <p className="text-sm leading-relaxed px-4">
            Informe seu e-mail para receber as instruções de recuperação.
          </p>
        </div>

        {/* Lado direito com o formulário */}
        <div className="w-1/2 bg-[#171210] p-6 flex flex-col items-center justify-center text-white">
          <h2 className="text-[#DF9829] text-lg font-semibold mb-6">
            Esqueci a Senha!
          </h2>

          <form className="w-full px-4 flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="E-mail..."
              required
              className="w-full px-4 py-3 rounded-md bg-black text-white placeholder:text-gray-400 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-[#DF9829] hover:bg-[#c67d1c] transition text-white font-semibold py-3 rounded-md"
            >
              Recuperar Senha
            </button>
          </form>

          <Link
            href="/login"
            className="mt-6 text-sm text-[#DF9829] hover:underline"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </main>
  );
}
