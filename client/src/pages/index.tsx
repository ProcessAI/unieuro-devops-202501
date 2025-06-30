import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Package, Smartphone, Shirt, Heart, House, Tag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { HeroCarousel } from '@/components/Hero';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';

type Produto = {
  id: number;
  nome: string;
  preco: number;
  precoOriginal: number;
  imagem: string | null;
};

type Categoria = {
  id: number;
  nome: string;
};

export default function Home() {
  const router = useRouter();
  const { categoriaId, q } = router.query;
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoriaId) params.set('categoriaId', String(categoriaId));
    if (q) params.set('q', String(q));

    fetch(`http://localhost:3333/produtos?${params}`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => setProdutos(data.produtos || []))
      .catch(console.error);
  }, [categoriaId, q]);

  useEffect(() => {
    fetch('http://localhost:3333/categorias', {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => setCategorias(data || []))
      .catch(console.error);
  }, []);

  const isActive = (catId?: string, value?: number) => catId === String(value);

  const selectedCategory = categoriaId
    ? categorias.find((cat) => String(cat.id) === String(categoriaId))
    : undefined;

  const displayCategoryName = selectedCategory
    ? selectedCategory.nome === 'Casa e Decoração'
      ? 'Casa & Deco'
      : selectedCategory.nome
    : null;

  const iconMap: Record<string, JSX.Element> = {
    Eletrônicos: <Smartphone />,
    Moda: <Shirt />,
    'Casa & Deco': <House />,
    Beleza: <Heart />,
  };

  return (
    <div className="min-h-screen bg-[#130F0E] text-white">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <Header />
          <Navbar />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
        <HeroCarousel />
      </main>

      <section className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between flex-wrap gap-8">
          <Link href="/" passHref>
            <button className="flex-shrink-0 w-44 h-full">
              <CategoryCard icon={<Tag />} title="Todos" active={!categoriaId && !q} />
            </button>
          </Link>

          {categorias.map((cat) => (
            <Link href={`/?categoriaId=${cat.id}`} passHref key={cat.id}>
              <button className="flex-shrink-0 w-44 h-full">
                <CategoryCard
                  icon={
                    cat.nome === 'Casa e Decoração' ? <House /> : (iconMap[cat.nome] ?? <Package />)
                  }
                  title={cat.nome === 'Casa e Decoração' ? 'Casa & Deco' : cat.nome}
                  active={isActive(categoriaId as string, cat.id)}
                />
              </button>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {displayCategoryName
              ? `Pordutos de ${displayCategoryName}`
              : q
                ? `Pordutos de "${q}"`
                : 'Todos os Produtos'}
          </h2>

          {(categoriaId || q) && (
            <button
              onClick={() => router.push('/')}
              className="text-[#DF9829] hover:text-yellow-400 cursor-pointer"
            >
              Limpar filtro
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {produtos.length > 0 ? (
            produtos.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} passHref>
                <ProductCard
                  image={p.imagem || 'https://via.placeholder.com/150'}
                  price={p.preco.toFixed(2).replace('.', ',')}
                  originalPrice={p.precoOriginal.toFixed(2).replace('.', ',')}
                  discount={Math.round(((p.precoOriginal - p.preco) / p.precoOriginal) * 100)}
                  minQuantity={1}
                />
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full">Nenhum produto encontrado.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
