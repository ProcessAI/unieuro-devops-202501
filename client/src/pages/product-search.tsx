import { useState } from 'react';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';

export default function ProductSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setLoading(true);

    try {
      const response = await fetch(`/api/products?search=${searchTerm}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#130F0E]">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <Navbar />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg text-black"
          />
          <button type="submit" className="bg-[#DF9829] text-white px-6 py-3 rounded-lg">
            Buscar
          </button>
        </form>

        {loading ? (
          <p className="text-white">Carregando...</p>
        ) : (
          <div className="grid grid-cols-5 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  minQuantity={product.minQuantity}
                />
              ))
            ) : (
              <p className="text-white">Nenhum produto encontrado.</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

