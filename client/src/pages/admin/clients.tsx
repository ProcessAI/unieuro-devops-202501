import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  IconPackage,
  IconTruck,
  IconCircleCheck,
  IconCircleX,
  IconReceipt,
} from '@tabler/icons-react';

// NOVO: Define os possíveis status de um pedido com base no fluxo da imagem
type StatusPedido =
  | 'Pedido Realizado'
  | 'Pgto Aprovado'
  | 'Pgto Recusado'
  | 'Pgto Confirmado'
  | 'Em separação'
  | 'Separado Embalado'
  | 'Aguardando coleta'
  | 'Pedido coletado'
  | 'Pedido Entregue'
  | 'Pedido Devolvido'
  | 'Pagamento Estornado';

// NOVO: Define a estrutura de dados para um Pedido
type Pedido = {
  id: number;
  dataPedido: Date;
  nomeCliente: string;
  qtdProdutos: number;
  precoTotal: number;
  formaPagamento: 'PIX' | 'Cartão' | 'Boleto';
  dataStatus: Date;
  status: StatusPedido;
};

// NOVO: Dados de exemplo para simular a resposta do backend
const mockPedidos: Pedido[] = [
  {
    id: 202501,
    dataPedido: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
    nomeCliente: 'Lorrana',
    qtdProdutos: 3,
    precoTotal: 259.9,
    formaPagamento: 'Cartão',
    dataStatus: new Date(),
    status: 'Pgto Aprovado',
  },
  {
    id: 202502,
    dataPedido: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 1 dia atrás
    nomeCliente: 'Esdras',
    qtdProdutos: 1,
    precoTotal: 89.9,
    formaPagamento: 'PIX',
    dataStatus: new Date(),
    status: 'Em separação',
  },
  {
    id: 202503,
    dataPedido: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    nomeCliente: 'Victor',
    qtdProdutos: 5,
    precoTotal: 540.5,
    formaPagamento: 'Boleto',
    dataStatus: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    status: 'Pedido Entregue',
  },
  {
    id: 202504,
    dataPedido: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutos atrás
    nomeCliente: 'Caio Martins',
    qtdProdutos: 2,
    precoTotal: 150.0,
    formaPagamento: 'Cartão',
    dataStatus: new Date(),
    status: 'Pgto Recusado',
  },
  {
    id: 202505,
    dataPedido: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000),
    nomeCliente: 'Lucas Moreira',
    qtdProdutos: 1,
    precoTotal: 1299.9,
    formaPagamento: 'PIX',
    dataStatus: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    status: 'Pedido Devolvido',
  },
];

// NOVO: Função para formatar o tempo relativo (ex: "há 5 minutos")
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `há ${Math.floor(interval)} anos`;
  interval = seconds / 2592000;
  if (interval > 1) return `há ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `há ${Math.floor(interval)} dias`;
  interval = seconds / 3600;
  if (interval > 1) return `há ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `há ${Math.floor(interval)} minutos`;
  return `há ${Math.floor(seconds)} segundos`;
};

// NOVO: Função para estilizar o status do pedido
const getStatusStyle = (status: StatusPedido) => {
  switch (status) {
    case 'Pedido Entregue':
      return {
        icon: <IconCircleCheck size={16} />,
        className: 'bg-green-600 text-white',
      };
    case 'Pgto Recusado':
    case 'Pedido Devolvido':
    case 'Pagamento Estornado':
      return {
        icon: <IconCircleX size={16} />,
        className: 'bg-red-600 text-white',
      };
    case 'Em separação':
    case 'Separado Embalado':
      return {
        icon: <IconPackage size={16} />,
        className: 'bg-yellow-500 text-black',
      };
    case 'Aguardando coleta':
    case 'Pedido coletado':
      return {
        icon: <IconTruck size={16} />,
        className: 'bg-blue-500 text-white',
      };
    default:
      return {
        icon: <IconReceipt size={16} />,
        className: 'bg-gray-500 text-white',
      };
  }
};

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPedidos(mockPedidos);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVerDetalhes = (pedidoId: number) => {
    alert(`Lógica para ver detalhes do pedido #${pedidoId} ainda não implementada.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0705] text-white flex justify-center items-center">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#130F0E]">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </header>
      <main className="bg-[#130F0E] flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-2xl font-bold mb-6 text-[#DF9829]">Gerenciamento de Pedidos</h1>

        <div className="bg-[#1A1615] rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-700 bg-[#130F0E]">
                <th className="p-4">Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4 text-center">Itens</th>
                <th className="p-4">Valor Total</th>
                <th className="p-4">Pagamento</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => {
                const statusStyle = getStatusStyle(pedido.status);
                return (
                  <tr
                    key={pedido.id}
                    className="border-b border-gray-800 hover:bg-[#1F1A19] transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold">#{pedido.id}</div>
                      <div className="text-xs text-gray-400">
                        {formatTimeAgo(pedido.dataPedido)}
                      </div>
                    </td>
                    <td className="p-4">{pedido.nomeCliente}</td>
                    <td className="p-4 text-center">{pedido.qtdProdutos}</td>
                    <td className="p-4 font-mono">
                      {pedido.precoTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="p-4">{pedido.formaPagamento}</td>
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusStyle.className}`}
                      >
                        {statusStyle.icon}
                        <span>{pedido.status}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {pedido.dataStatus.toLocaleDateString('pt-BR')} às{' '}
                        {pedido.dataStatus.toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleVerDetalhes(pedido.id)}
                        className="bg-[#DF9829] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#C77714] transition"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}