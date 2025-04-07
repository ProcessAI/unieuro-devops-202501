import { Search } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-[#DF9829]">Atacanet</span>
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
        <input
          type="text"
          placeholder="Busque produtos, marcas e muito mais..."
          className="w-full h-10 px-3 py-2 pr-10 text-base md:text-sm rounded-md border-none bg-[#1A1615] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-[#DF9829] text-white rounded-lg hover:bg-[#C77714] transition">
          Entrar
        </button>
      </div>
    </div>
  );
}
