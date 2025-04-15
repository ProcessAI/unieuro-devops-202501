import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Produto() {
  return (
    <div className="min-h-screen bg-[#130F0E] text-white">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <Navbar />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            alt="Produto"
            className="rounded-lg w-full h-auto object-cover shadow-lg"
          />

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">Fone de douvido</h1>
              <p className="text-lg text-gray-300 mb-6">
                Descrição detalhada do produto, abordando suas principais características e funcionalidades.
              </p>

              <div className="mb-4">
                <span className="text-2xl font-semibold text-green-400">
                  R$ 799,99
                </span>
                <span className="ml-2 text-sm line-through text-gray-400">
                  R$ 999,99
                </span>
              </div>

              <div className="mb-6">
                <span className="text-sm text-yellow-400">
                  Promoção válida na compra de 3 unidades ou mais
                </span>
              </div>
            </div>

            <button className="bg-[#DF9829] hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition duration-300">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
