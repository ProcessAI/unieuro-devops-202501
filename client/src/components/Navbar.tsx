import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu } from 'lucide-react';

type Categoria = {
  id: number;
  nome: string;
};

export function Navbar() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const router = useRouter();
  const { categoriaId } = router.query;

  useEffect(() => {
    fetch('http://localhost:3333/categorias', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data: Categoria[]) => setCategorias(data))
      .catch(console.error);
  }, []);

  const isActive = (id: number) => String(id) === String(categoriaId);

  return (
    <nav className="flex items-center space-x-6 h-12 text-sm overflow-x-auto">
      <Link href="/" passHref>
        <button
          className={`flex items-center space-x-2 px-3 py-1 cursor-pointer ${
            !categoriaId ? 'text-[#C77714]' : 'text-white hover:text-[#C77714]'
          }`}
        >
          <Menu size={20} />
          <span>Todos os Departamentos</span>
        </button>
      </Link>

      {categorias.map((cat) => (
        <Link key={cat.id} href={`/?categoriaId=${cat.id}`} passHref>
          <button
            className={`px-3 py-1 cursor-pointer whitespace-nowrap ${
              isActive(cat.id) ? 'text-[#C77714]' : 'text-white hover:text-[#C77714]'
            }`}
          >
            {cat.nome}
          </button>
        </Link>
      ))}

      <div className="flex-1" />
      {/* <a href="#" className="text-blue-600 hover:text-blue-700">Vender no Atacanet</a> */}
    </nav>
  );
}
