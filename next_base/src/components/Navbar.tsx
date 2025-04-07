import { Menu } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="flex items-center space-x-6 h-12 text-sm">
      <button className="flex items-center space-x-2 text-white hover:text-[#C77714]">
        <Menu size={20} />
        <span>Todos os Departamentos</span>
      </button>
      <a href="#" className="text-white hover:text-[#C77714]">Ofertas do Dia</a>
      <a href="#" className="text-white hover:text-[#C77714]">Eletrônicos</a>
      <a href="#" className="text-white hover:text-[#C77714]">Casa e Decoração</a>
      <a href="#" className="text-white hover:text-[#C77714]">Moda</a>
      <a href="#" className="text-white hover:text-[#C77714]">Supermercado</a>
      <div className="flex-1"></div>
      {/* <a href="#" className="text-blue-600 hover:text-blue-700">Vender no Atacanet</a> */}
    </nav>
  );
}