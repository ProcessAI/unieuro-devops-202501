import { Menu } from 'lucide-react';
import { useRouter } from 'next/router';

export function Navbar() {
  const router = useRouter();

  const handleCategoryClick = (categoriaId: string) => {
    router.push(`/category-page?query=${encodeURIComponent(categoriaId)}`);
  };

  return (
    <nav className="flex items-center space-x-6 h-12 text-sm">
      <button
        className="flex items-center space-x-2 text-white hover:text-[#C77714] cursor-pointer"
        onClick={() => handleCategoryClick('6')}
      >
        <Menu size={20} />
        <span>Todos os Departamentos</span>
      </button>
      <button onClick={() => handleCategoryClick('5')} className="text-white hover:text-[#C77714] cursor-pointer">
        Ofertas do Dia
      </button>
      <button onClick={() => handleCategoryClick('1')} className="text-white hover:text-[#C77714] cursor-pointer">
        Eletrônicos
      </button>
      <button onClick={() => handleCategoryClick('2')} className="text-white hover:text-[#C77714] cursor-pointer">
        Moda
      </button>
      <button onClick={() => handleCategoryClick('3')} className="text-white hover:text-[#C77714] cursor-pointer">
        Casa e decoração
      </button>
      <button onClick={() => handleCategoryClick('4')} className="text-white hover:text-[#C77714] cursor-pointer">
        Beleza
      </button>
    </nav>
  );
}
