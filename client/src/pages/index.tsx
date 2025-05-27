import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Smartphone, Shirt, Heart, Percent, House } from 'lucide-react';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { HeroCarousel } from '@/components/Hero';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';

type ProdutoOferta = {
  id: number;
  nome: string;
  preco: number;
  precoOriginal: number;
  desconto: number;
  minQuantity: number;
  image: string | null;
};

export default function Home() {
  const [ofertas, setOfertas] = useState<ProdutoOferta[]>([]);

  useEffect(() => {
    fetch('/api/ofertas')
      .then((res) => res.json())
      .then((data) => {
        if (data.produtos) {
          setOfertas(data.produtos);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar ofertas:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#130F0E]">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <Navbar />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroCarousel />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-6 gap-8">
          <CategoryCard icon={<Package />} title="Todos" />
          <CategoryCard icon={<Smartphone />} title="Eletrônicos" />
          <CategoryCard icon={<Shirt />} title="Moda" />
          <CategoryCard icon={<House />} title="Casa & Deco" />
          <CategoryCard icon={<Heart />} title="Beleza" />
          <CategoryCard icon={<Percent />} title="Ofertas" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Ofertas do dia</h2>
          <a href="#" className="text-[#DF9829] hover:text-blue-700">
            Ver todas
          </a>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {ofertas.length > 0 ? (
            ofertas.map((produto) => (
              <ProductCard
                key={produto.id}
                image={produto.image || 'https://via.placeholder.com/150'}
                price={produto.preco.toFixed(2).replace('.', ',')}
                originalPrice={produto.precoOriginal.toFixed(2).replace('.', ',')}
                discount={produto.desconto}
                minQuantity={produto.minQuantity}
              />
            ))
          ) : (
            <p className="text-white col-span-5 text-center">Nenhuma oferta disponível no momento.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
