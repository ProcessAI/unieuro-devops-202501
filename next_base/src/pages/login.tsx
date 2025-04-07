import Link from "next/link";
import { useState } from "react";
import { login } from "../services/auth";
import { useRouter } from "next/router";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const { accessToken, refreshToken } = await login(email, password);
  
      if (!accessToken || !refreshToken) {
        alert("Erro ao fazer login");
        return;
      }
  
      router.push("/");
    } catch (error) {
      alert("Erro ao fazer login");
    }
  };


  return (
    <main className="min-h-screen flex justify-center items-center bg-[#111]">
      <div className="flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden w-[70%] max-w-4xl">
        <div className="bg-[#4268f6] text-white flex flex-col justify-center p-12 w-1/2">
          <h1 className="text-4xl font-bold leading-tight">Bem-vindo!</h1>
          <p className="mt-4 text-lg opacity-90">
            Entre com sua conta e aproveite todos os nossos recursos.
          </p>
        </div>

        <div className="p-12 flex flex-col justify-center bg-[#1a1a1a] text-white w-1/2">
          <h2 className="text-[#4268f6] text-3xl font-bold text-center">
            Login
          </h2>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleLogin}>
            <input
              type="text"
              name="email"
              placeholder="Usuário ou email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-[#222] border border-gray-600 rounded-md transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Sua senha"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-[#222] border border-gray-600 rounded-md transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-gray-400 cursor-pointer"
              >
                {showPassword ? <IconEye /> : <IconEyeOff />}
              </button>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-[#4268f6] text-sm font-semibold hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button className="mt-2 bg-[#4268f6] text-white py-3 rounded-md font-semibold hover:bg-[#3654c9] transition">
              Entrar
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-gray-400">
            Ainda não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-[#4268f6] font-bold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
