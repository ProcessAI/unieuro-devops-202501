import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// NOVO: Define o tipo para um Pedido (simplificado)
type Pedido = {
  id: number;
  valor: number;
  status: 'CONCLUIDO' | 'PENDENTE';
};

// ALTERADO: Cliente agora pode ter uma lista de pedidos
type Cliente = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  tipoConta: 'VAREJO' | 'ATACADO';
  pedidos: Pedido[]; // Adicionado para simular os pedidos
};

// NOVO: Dados de exemplo (mock) para simular a resposta do backend
// Alguns clientes têm pedidos, outros não.
const mockClientes: Cliente[] = [
  {
    id: 1,
    nome: 'Lorrana',
    email: 'lorrana@example.com',
    cpf: '111.111.111-11',
    tipoConta: 'VAREJO',
    pedidos: [
      { id: 101, valor: 150.0, status: 'CONCLUIDO' },
      { id: 102, valor: 200.0, status: 'CONCLUIDO' },
    ],
  },
  {
    id: 2,
    nome: 'Esdras',
    email: 'esdras@example.com',
    cpf: '222.222.222-22',
    tipoConta: 'VAREJO',
    pedidos: [], // Este cliente ainda não tem pedidos
  },
  {
    id: 3,
    nome: 'Cliente Atacadista Aprovado',
    email: 'aprovado@example.com',
    cpf: '333.333.333-33',
    tipoConta: 'ATACADO',
    pedidos: [{ id: 103, valor: 1250.0, status: 'CONCLUIDO' }],
  },
    {
    id: 4,
    nome: 'Victor',
    email: 'victor@example.com',
    cpf: '444.444.444-44',
    tipoConta: 'VAREJO',
    pedidos: [{ id: 104, valor: 80.0, status: 'CONCLUIDO' }],
  },
];

export default function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // ALTERADO: Efeito para buscar os dados. Agora usa os dados mockados.
  useEffect(() => {
    // Simula o carregamento da rede
    setTimeout(() => {
      setClientes(mockClientes);
      setLoading(false);
    }, 1000);

    /* // O fetch original foi comentado para usar os dados mockados.
      // Quando seu backend estiver pronto para enviar os pedidos junto com os clientes,
      // você pode remover o setTimeout acima e descomentar este bloco.

      fetch('/api/admin/clientes')
       .then((res) => {
         if (!res.ok) {
           throw new Error('Falha ao buscar clientes.');
         }
         return res.json();
       })
       .then((data) => {
         setClientes(data.clientes);
       })
       .catch((error) => {
         showToast(error.message, { duration: 6000 });
       })
       .finally(() => {
         setLoading(false);
       });
    */
  }, []);

  const handleApprove = async (clienteId: number) => {
    try {
      // A lógica de request continua a mesma, mas a UI é atualizada otimisticamente.
      showToast('Simulando aprovação...', { duration: 2000 });
      
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === clienteId ? { ...cliente, tipoConta: 'ATACADO' } : cliente
        )
      );
      // Em um cenário real, você faria o fetch aqui e trataria a resposta.
      // const res = await fetch(`/api/admin/clientes/${clienteId}/aprovar-atacado`, { method: 'PATCH' });
      // ...
    } catch {
      showToast('Falha de rede na simulação.', { duration: 5000 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0705] text-white flex justify-center items-center">
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0705] text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-6 text-[#DF9829]">Gerenciamento de Clientes</h1>
        
        <div className="bg-[#1A1615] rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 bg-[#130F0E]">
                <th className="p-4">Nome</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status da Conta</th>
                <th className="p-4 text-center">Pedidos Realizados</th> {/* NOVO: Coluna de pedidos */}
                <th className="p-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-800 hover:bg-[#1F1A19] transition-colors">
                  <td className="p-4">{cliente.nome}</td>
                  <td className="p-4">{cliente.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cliente.tipoConta === 'ATACADO'
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {cliente.tipoConta}
                    </span>
                  </td>
                  {/* NOVO: Célula que mostra a contagem de pedidos */}
                  <td className="p-4 text-center">{cliente.pedidos.length}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleApprove(cliente.id)}
                      // ALTERADO: Lógica de desativação do botão
                      disabled={cliente.tipoConta === 'ATACADO' || cliente.pedidos.length === 0}
                      className="bg-[#DF9829] text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#C77714] transition"
                    >
                      {cliente.tipoConta === 'ATACADO' ? 'Aprovado' : 'Aprovar p/ Atacado'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> 
        </div> 
      </main>
      <Footer />
    </div>
  );
}