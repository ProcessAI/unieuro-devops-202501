// client/src/pages/product/[id].tsx
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface Avaliacao {
  id: number;
  nome: string;
  nota: number;
  texto: string;
}

interface Midia {
  link: string;
}

interface ProdutoPageProps {
  produto: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    precoOriginal: number;
    frete: number;
    modelo: string;
    quantidadeVarejo: number;
    Midias: Midia[];
    avaliacoes: Avaliacao[];
  };
}

export default function Produto({ produto }: ProdutoPageProps) {
  const primeiraImagem = produto.Midias[0]?.link || '/placeholder.png';

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = cart.findIndex((item: any) => item.id === produto.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        id: produto.id,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

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
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src={primeiraImagem}
              alt={produto.nome}
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col">
            <div>
              <h1 className="text-3xl font-bold mb-4">{produto.nome}</h1>

              <div className="mb-4">
                <span className="text-2xl font-semibold text-green-400">
                  R$ {produto.preco.toFixed(2)}
                </span>
                {produto.preco < produto.precoOriginal && (
                  <span className="ml-2 text-sm line-through text-gray-400">
                    R$ {produto.precoOriginal.toFixed(2)}
                  </span>
                )}
              </div>

              {produto.preco < produto.precoOriginal && (
                <div className="mb-6">
                  <span className="text-sm text-yellow-400">
                    Promoção válida na compra de {produto.quantidadeVarejo} unidades ou mais
                  </span>
                </div>
              )}

              <p className="text-gray-300 text-sm mb-6">
                Modelo: {produto.modelo} • Frete: R$ {produto.frete.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-[#DF9829] hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg cursor-pointer transition duration-300"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-6">Descrição do produto</h3>
          <p className="text-lg text-gray-300 leading-relaxed">{produto.descricao}</p>

          <hr className="my-10 border-t border-gray-700" />

          <h3 className="text-2xl font-bold mb-6">Avaliações</h3>
          <div className="space-y-6">
            {produto.avaliacoes.length === 0 ? (
              <p className="text-gray-400">Nenhuma avaliação para este produto.</p>
            ) : (
              produto.avaliacoes.map((a) => (
                <div key={a.id} className="bg-[#1A1514] p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{a.nome}</span>
                    <span className="text-yellow-400">{'★'.repeat(a.nota)}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{a.texto}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const protocolo = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = context.req.headers.host;
  const urlAPI = `${protocolo}://${host}/api/produto/${id}`;

  try {
    const res = await fetch(urlAPI);
    if (!res.ok) {
      return { notFound: true };
    }

    const produto = await res.json();

    return {
      props: {
        produto,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar produto em getServerSideProps:', error);
    return { notFound: true };
  }
};
