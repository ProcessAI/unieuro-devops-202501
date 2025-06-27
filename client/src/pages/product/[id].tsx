import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/components/ToastContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconTrash, IconPlus, IconMinus } from '@tabler/icons-react';

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
  const { showToast } = useToast();
  const primeiraImagem = produto.Midias[0]?.link || '/placeholder.png';
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCart = () => {
    const existing = cart.find((item: any) => item.id === produto.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: produto.id, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setCart([...cart]);
    setShowModal(true);
    showToast('Produto adicionado ao carrinho!');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChangeQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((item: any) => (item.id === id ? { ...item, quantity } : item));
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  };

  const handleRemoveItem = (id: number) => {
    const updated = cart.filter((item: any) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
    setShowModal(false);
  };

  const cartItemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  const currentItem = cart.find((item: any) => item.id === produto.id);
  const currentQuantity = currentItem ? currentItem.quantity : 0;

  const hasDiscount = currentQuantity >= produto.quantidadeVarejo;
  const finalPrice = hasDiscount ? produto.preco : produto.precoOriginal;

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
            <h1 className="text-3xl font-bold mb-4">{produto.nome}</h1>
            <div className="mb-4">
              <span className="text-2xl font-semibold text-green-400">
                R$ {finalPrice.toFixed(2)}
              </span>

              {hasDiscount && (
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
            <button
              onClick={handleAddToCart}
              className="bg-[#DF9829] hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition"
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
                  <div className="flex justify-between mb-2">
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

      {showModal && currentItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#1A1615] p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Produto adicionado ao carrinho</h2>
              <button onClick={closeModal} className="text-white text-xl font-bold">
                &times;
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Image
                src={primeiraImagem}
                alt={produto.nome}
                width={120}
                height={120}
                className="object-cover rounded"
              />
              <div className="flex-1 flex flex-col">
                <span className="text-white font-semibold">{produto.nome}</span>
                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      R$ {produto.precoOriginal.toFixed(2)}
                    </span>
                  )}
                  <span
                    className={`text-2xl font-semibold ${hasDiscount ? 'text-green-400' : 'text-gray-400'}`}
                  >
                    R$ {finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => handleChangeQuantity(produto.id, currentQuantity - 1)}
                className="p-1 bg-[#DF9829] text-black rounded hover:opacity-80"
              >
                <IconMinus size={16} />
              </button>
              <span className="px-2">{currentQuantity}</span>
              <button
                onClick={() => handleChangeQuantity(produto.id, currentQuantity + 1)}
                className="p-1 bg-[#DF9829] text-black rounded hover:opacity-80"
              >
                <IconPlus size={16} />
              </button>
              <button
                onClick={() => handleRemoveItem(produto.id)}
                className="p-1 ml-2 bg-red-600 text-white rounded hover:opacity-80"
              >
                <IconTrash size={16} />
              </button>
            </div>

            <p className="text-gray-400 text-center mb-6">
              Você tem {cartItemCount} item(s) no carrinho.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/cart">
                <button className="bg-[#DF9829] text-black font-semibold py-2 px-6 rounded-lg">
                  Ver o meu carrinho ({cartItemCount})
                </button>
              </Link>
              <Link href="/">
                <button
                  onClick={closeModal}
                  className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Continuar comprando
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
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
    if (!res.ok) return { notFound: true };
    const produto = await res.json();
    return { props: { produto } };
  } catch {
    return { notFound: true };
  }
};
