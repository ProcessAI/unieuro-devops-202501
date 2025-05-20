import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface CarrosselItem {
  id: number;
  nome: string;
  preco: number;
  imagem: string | null;
  descricao?: string | null;
}

export function HeroCarousel() {
  const [carrosselItens, setCarrosselItens] = useState<CarrosselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarImagensCarrossel = async () => {
      try {
        const response = await fetch('/carrossel');
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados do carrossel: ${response.status}`);
        }
        const data: CarrosselItem[] = await response.json();
        setCarrosselItens(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    buscarImagensCarrossel();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20">Carregando destaques...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-20">Erro ao carregar os destaques: {error}</div>;
  }

  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} emulateTouch>
      {carrosselItens.map((item, index) => (
        <div
          key={item.id || index}
          className={`bg-green-50 py-16 flex items-center`}
          style={{ minHeight: '450px' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center flex-col md:flex-row">
            <div className="text-left md:w-1/2">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{item.nome}</h1>
              <p className="text-lg mb-6 text-gray-700 whitespace-pre-line">{item.descricao}</p>
              <button className="cursor-pointer px-6 py-3 bg-[#DF9829] text-white rounded-lg hover:bg-[#C77714] transition">
                Ver detalhes →
              </button>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
              {item.imagem && (
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="object-contain w-full max-w-sm"
                  style={{ maxHeight: '300px' }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}