import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal: number;
  quantidadeVarejo: number;
  imagemUrl: string;
  image: string;
  desconto: number;
  minQuantidade: number;
};

export default function CategoryPage() {
  const router = useRouter();
  const { query } = router.query;
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  const categoriaNome = query === '1'? 'Eletrônicos' : query === '2'? 'Moda' : query === '3'? 'Casae decoração' : query === '4'? 'Beleza': query === '5'? 'Ofertas' : 'Todos os Departamentos'

 useEffect(() => {
  if (typeof query !== 'string' || query.trim() === '') return;
  const idCat = query;

  async function fetchCategoryProducts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/category?query=${encodeURIComponent(idCat)}`);
      if (!res.ok) throw new Error('Erro ao buscar produtos da categoria');
      const data = await res.json();
      console.log('data category', data);
      setProdutos(data.produtos || []);
    } catch (err) {
      console.error('Erro ao buscar produtos da categoria:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOfertas() {
    setLoading(true);
    try {
      const res = await fetch('/api/ofertas');
      if (!res.ok) throw new Error('Erro ao buscar ofertas');
      const data = await res.json();
      console.log('data ofertas', data);
      setProdutos(data.produtos || []);
    } catch (err) {
      console.error('Erro ao buscar ofertas:', err);
    } finally {
      setLoading(false);
    }
  }

  if (idCat === '5' || idCat === '6') {
    fetchOfertas();
  } else {
    fetchCategoryProducts();
  }
}, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-[#130F0E]">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <Navbar />
        </div>
      </header>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-white text-l sm:text-2xl lg:text-3xl">Carregando...</p>
        ) : (
          <>
            <div className="mb-10">
              <p className="text-white text-l sm:text-2xl lg:text-3xl font-bold">{categoriaNome}</p>
            </div>

            <div className="grid grid-cols-5 gap-6">
              {produtos.length > 0 ? (
                produtos.map((produto) => (                
                <Link href={`/product/${produto.id}`}>
                <ProductCard
                  key={produto.id}
                  image={produto.imagemUrl || produto.image}
                  price={produto.preco.toFixed(2).replace('.', ',')}
                  originalPrice={produto.precoOriginal.toFixed(2).replace('.', ',')}
                  discount={produto.desconto}
                  minQuantity={produto.minQuantidade}
                />
              </Link> ))) : (
            <p className="text-white col-span-5 text-center">Nenhum produto encontrado.</p>
          )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}