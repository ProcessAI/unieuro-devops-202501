import { useState } from 'react';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';

export default function ProductSearchPage() {
  const [loading, setLoading] = useState(false);

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
          <p className="text-white text-l sm:text-2xl lg:text-3xl ">Carregando...</p>
        ) : (
          <>
            {/* Título separado dos cards */}
            <div className="mb-15">
              <p className="text-white text-l sm:text-2xl lg:text-3xl font-bold ">
                Produto Buscado
              </p>
            </div>

            {/* Grid dos cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ProductCard
                image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                price="799,99"
                originalPrice="999,99"
                discount={20}
                minQuantity={3}
              />
              <ProductCard
                image="https://images.unsplash.com/photo-1546868871-7041f2a55e12"
                price="1599,99"
                originalPrice="1899,99"
                discount={15}
                minQuantity={2}
              />
              <ProductCard
                image="https://images.unsplash.com/photo-1585123334904-845d60e97b29"
                price="1999,99"
                originalPrice="2499,99"
                discount={20}
                minQuantity={1}
              />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
