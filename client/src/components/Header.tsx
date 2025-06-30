import { IconShoppingCart } from '@tabler/icons-react';
import { Search } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, KeyboardEvent } from 'react';

export function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get('refreshToken')) {
      setIsLogged(true);
    }
    const saved = localStorage.getItem('cartItemCount');
    if (saved) setCartItemCount(parseInt(saved, 10));
  }, []);

  const doSearch = () => {
    if (!searchTerm.trim()) return;

    router.push(`/?q=${encodeURIComponent(searchTerm)}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setIsLogged(false);
    router.push('/');
  };

  return (
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center">
        <Link href="/">
          <img
            src="/logoAtacanetHorizontalSimples.svg"
            alt="Atacanet Logo"
            className="h-8 w-auto mr-2"
          />
        </Link>
      </div>
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Busque produtos, marcas e muito mais..."
            className="w-full h-10 px-3 py-2 pr-10 text-base md:text-sm rounded-md border-none bg-[#1A1615] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            onClick={doSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        {/* Botão Coração */}
        {/* <Link
          href=""
          title="Favoritos"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconHeart size={20} />
        </Link> */}

        {/* Botão Carrinho */}
        <Link
          href="/cart"
          title="Carrinho"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconShoppingCart size={20} />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Botão Usuário */}
        {/* <Link
          href=""
          title="Perfil"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconUser size={20} />
        </Link> */}

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
