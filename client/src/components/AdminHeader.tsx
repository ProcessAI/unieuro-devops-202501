import { IconRosetteDiscount, IconArchive, IconPackage, IconChartPie2 } from '@tabler/icons-react';
import { Search } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function AdminHeader() {
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
        <Link href="/">
          <img
            src="/logoAtacanetHorizontalSimples.svg"
            alt="Atacanet Logo"
            className="h-8 w-auto mr-2"
          />
        </Link>
      </div>


      <div className="flex items-center gap-1 sm:gap-3">
        <Link
          href=""
          title="Ofertas"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconRosetteDiscount size={20} />
        </Link>

        <Link
          href=""
          title="Produtos"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconArchive size={20} />
        </Link>

        <Link
          href="/admin/clients" //Caminho para pedidos
          title="Pedidos"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconPackage size={20} />
        </Link>

        <Link
          href="/dashboard"
          title="Dashboard"
          className="cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-[#DF9829] hover:bg-[#1a1615] hover:text-accent-foreground h-10 w-10"
        >
          <IconChartPie2 size={20} />
        </Link>

        <button
          onClick={handleLogout}
          className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Desconectar
        </button>
      </div>
    </div>
  );
}
