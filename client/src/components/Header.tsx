import { IconHeart, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { Search } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    router.push('/product-search');
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setIsLogged(false);
    router.push('/');
  };

  useEffect(() => {
    if (Cookies.get('refreshToken')) {
      setIsLogged(true);
    }
  }, []);

  return (
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center">
        <img
          src="/logoAtacanetHorizontalSimples.svg"
          alt="Atacanet Logo"
          className="h-8 w-auto mr-2"
        />
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Busque produtos, marcas e muito mais..."
            className="w-full h-10 px-3 py-2 pr-10 text-base md:text-sm rounded-md border-none bg-[#1A1615] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button onClick={handleSearch} className="cursor-pointer">
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        {/* Botão Coração */}
        <Link
          href=""
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconHeart size={20} />
        </Link>

        {/* Botão Carrinho */}
        <Link
          href="/cart"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconShoppingCart size={20} />
        </Link>

        {/* Botão Usuário */}
        <Link
          href=""
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconUser size={20} />
        </Link>

        {/* Botão Entrar */}
        {!isLogged ? (
          <Link
            href="/login"
            className="cursor-pointer px-4 py-2 bg-[#DF9829] text-white rounded-lg hover:bg-[#C77714] transition"
          >
            Entrar
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Desconectar
          </button>
        )}
      </div>
    </div>
  );
}
