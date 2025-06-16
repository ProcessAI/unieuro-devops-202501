import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { OrderStatusModal } from '@/components/OrderStatusModal';

type Pedido = {
  id: number;
  valor: number;
  status: 'APROVADO' | '';
};

type Cliente = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  pedidos: Pedido[];
};

const mockClientes: Cliente[] = [
  {
    id: 1,
    nome: 'Lorrana',
    email: 'lorrana@example.com',
    cpf: '111.111.111-11',
    pedidos: [
      { id: 101, valor: 150.0, status: '' },
      { id: 102, valor: 200.0, status: 'APROVADO' },
    ],
  },
  {
    id: 2,
    nome: 'Esdras',
    email: 'esdras@example.com',
    cpf: '222.222.222-22',
    pedidos: [
      { id: 101, valor: 150.0, status: '' },
      { id: 102, valor: 200.0, status: 'APROVADO' },
    ],
  },
  {
    id: 3,
    nome: 'Cliente Atacadista Aprovado',
    email: 'aprovado@example.com',
    cpf: '333.333.333-33',
    pedidos: [{ id: 103, valor: 1250.0, status: 'APROVADO' }],
  },
  {
    id: 4,
    nome: 'Victor',
    email: 'victor@example.com',
    cpf: '444.444.444-44',
    pedidos: [{ id: 104, valor: 80.0, status: 'APROVADO' }],
  },
  {
    id: 5,
    nome: 'Enzo',
    email: 'enzo@example.com',
    cpf: '555.555.555-55',
    pedidos: [{ id: 105, valor: 107.0, status: 'APROVADO' }],
  },
];

export default function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState({
    steps: [
      { label: 'Pagamento Aprovado', timestamp: '15/06/2025 09:12' },
      { label: 'Preparando', timestamp: '15/06/2025 10:00' },
      { label: 'Separado', timestamp: '15/06/2025 10:30' },
      { label: 'Enviado', timestamp: '15/06/2025 11:45' },
      { label: 'Entregue', timestamp: '—' },
    ],
    current: 'Separado',
  });

  useEffect(() => {
    setTimeout(() => {
      setClientes(mockClientes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = async (clienteId: number, pedidoId: number) => {
    try {
      showToast('Simulando aprovação...', { duration: 2000 });
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === clienteId
            ? {
                ...cliente,
                pedidos: cliente.pedidos.map((pedido) =>
                  pedido.id === pedidoId
                    ? { ...pedido, status: 'APROVADO' }
                    : pedido
                ),
              }
            : cliente
        )
      );
    } catch {
      showToast('Falha de rede na simulação.', { duration: 5000 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#130F0E]">
        <header className="bg-[#130F0E] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
            <Navbar />
          </div>
        </header>
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Carregando pedidos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#130F0E]">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <Navbar />
        </div>
      </header>
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-6 text-[#DF9829]">
          Gerenciamento de pedidos pendentes
        </h1>
        <div className="bg-[#1A1615] rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 bg-[#130F0E]">
                <th className="p-4">Nome</th>
                <th className="p-4">Email</th>
                <th className="p-4">ID Pedido</th>
                <th className="p-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {clientes.flatMap((cliente) =>
                cliente.pedidos.map((pedido) => (
                  <tr
                    key={`${cliente.id}-${pedido.id}`}
                    className="border-b border-gray-800 hover:bg-[#1F1A19] transition-colors"
                  >
                    <td className="p-4">{cliente.nome}</td>
                    <td className="p-4">{cliente.email}</td>
                    <td className="p-4">{pedido.id}</td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() =>
                          handleApprove(cliente.id, pedido.id)
                        }
                        disabled={pedido.status === 'APROVADO'}
                        className="bg-[#DF9829] text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#C77714] transition"
                      >
                        {pedido.status === 'APROVADO' ? 'Aprovado' : 'Aprovar'}
                      </button>
                      <button
                        onClick={() => {
                          setModalStatus({
                            steps: [
                              { label: 'Pagamento Aprovado', timestamp: '15/06/2025 09:12' },
                              { label: 'Preparando', timestamp: '15/06/2025 10:00' },
                              { label: 'Separado', timestamp: '15/06/2025 10:30' },
                              { label: 'Enviado', timestamp: '15/06/2025 11:45' },
                              { label: 'Entregue', timestamp: '—' },
                            ],
                            current: 'Separado',
                          });
                          setModalOpen(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded text-sm"
                      >
                        Ver Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <OrderStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        statusSteps={modalStatus.steps}
        currentStep={modalStatus.current}
      />
    </div>
  );
}
