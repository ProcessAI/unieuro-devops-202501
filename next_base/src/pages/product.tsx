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
              <h1 className="text-3xl font-bold mb-4">Fone de ouvido</h1>

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

            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Selecione o tamanho:</h3>
              <div className="flex gap-3">
                {["P", "M", "G", "GG"].map((size) => (
                  <button
                    key={size}
                    className="border border-gray-400 rounded-md px-4 py-2 hover:bg-yellow-600 hover:text-black transition duration-200"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>


            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Quantidade:</h3>
              <input
                type="number"
                min={1}
                defaultValue={1}
                className="w-20 px-3 py-2 border border-gray-500 rounded-md bg-[#1F1A19] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Calcular frete:</h3>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  placeholder="Digite seu CEP"
                  className="w-40 px-3 py-2 border border-gray-500 rounded-md bg-[#1F1A19] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
                  Calcular
                </button>
              </div>
              {/* Exibição simulada do resultado */}
              <p className="text-sm text-green-400 mt-2">Frete: R$ 19,90 – Entrega estimada em 3 dias úteis</p>
            </div>


            <button className="bg-[#DF9829] hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition duration-300">
              Adicionar ao carrinho
            </button>

          </div>
        </div>

        <div className="mt-10">

              <h3 className="text-2xl font-bold mb-6">Descrição do produto</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Aqui entra o conteúdo completo e detalhado do produto. Pode ser um texto longo
                que descreva benefícios, especificações técnicas, diferenciais, uso recomendado, etc.
              </p>

              <hr className="my-10 border-t border-gray-700" />

              <h3 className="text-2xl font-bold mb-6">Avaliações</h3>

              <div className="space-y-6">
                {/* Avaliação 1 */}
                <div className="bg-[#1A1514] p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Enzo Unieuro</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Produto excelente, chegou no prazo e com ótima qualidade. Recomendo!
                  </p>
                </div>

                {/* Avaliação 2 */}
                <div className="bg-[#1A1514] p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Rafael Unieuro</span>
                    <span className="text-yellow-400">★★★★☆</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Gostei bastante, mas achei a embalagem um pouco frágil.
                  </p>
                </div>
              </div>
            </div>

      </main>

      <Footer />
    </div>
  );
}
