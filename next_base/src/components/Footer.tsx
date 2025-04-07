import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1615] border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C77714]">Institucional</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-[#C77714]">Sobre nós</a></li>
              <li><a href="#" className="text-white hover:text-[#C77714]">Carreiras</a></li>
              <li><a href="#" className="text-white hover:text-[#C77714]">Termos de uso</a></li>
              <li><a href="#" className="text-white hover:text-[#C77714]">Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-[#C77714]">Central de ajuda</a></li>
              <li><a href="#" className="text-white hover:text-[#C77714]">Como comprar</a></li>
              <li><a href="#" className="text-white hover:text-[#C77714]">Pagamentos</a></li>
              <li><a href="#" className="text-white hover:text-[#C77714]">Entregas</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-white" />
                <span className="white">contato@atacanet.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="white" />
                <span className="white">0800 123 4567</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#C77714]"><Facebook size={24} /></a>
              <a href="#" className="text-white hover:text-[#C77714]"><Instagram size={24} /></a>
              <a href="#" className="text-white hover:text-[#C77714]"><Twitter size={24} /></a>
              <a href="#" className="text-white hover:text-[#C77714]"><Youtube size={24} /></a>
            </div>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-[#DF9829]">
          <p>© 2024 Atacanet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}