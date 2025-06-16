import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  IconCircleCheck,
  IconCircleX,
  IconReceipt,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

type StatusPedido = 'pago' | 'cancelado';

type PedidoAPI = {
  id: number;
  quantidade: number;
  formaPagamento: string;
  status: StatusPedido;
  valorPago: string;
  assinado: string;
  dataCompra: string;
};

type RespostaPedidos = {
  pedidos: PedidoAPI[];
};

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('http://localhost:3333/admin/pedidos-status', {
          credentials: 'include',
        });
        const data: RespostaPedidos = await response.json();

        if (!Array.isArray(data.pedidos)) {
          throw new Error("Formato inesperado da resposta da API.");
        }

        setPedidos(data.pedidos);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const getStatusStyle = (status: StatusPedido) => {
    switch (status) {
      case 'pago':
        return {
          icon: <IconCircleCheck size={16} />,
          className: 'bg-green-600 text-white',
          label: 'Pago',
        };
      case 'cancelado':
        return {
          icon: <IconCircleX size={16} />,
          className: 'bg-red-600 text-white',
          label: 'Cancelado',
        };
      default:
        return {
          icon: <IconReceipt size={16} />,
          className: 'bg-gray-500 text-white',
          label: 'Desconhecido',
        };
    }
  };

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
    <div className="min-h-screen bg-[#0D0705] text-white flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-2xl font-bold mb-6 text-[#DF9829]">Gerenciamento de Pedidos</h1>

        <div className="bg-[#1A1615] rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
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
                    <td className="p-4 font-bold">
                      <div>#{pedido.id}</div>
                      <div className="text-xs text-gray-400">
                        {dayjs(pedido.dataCompra).fromNow()}
                      </div>
                    </td>
                    <td className="p-4">{pedido.assinado}</td>
                    <td className="p-4 text-center">{pedido.quantidade}</td>
                    <td className="p-4 font-mono">
                      {Number(pedido.valorPago).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="p-4">
                      {pedido.formaPagamento.toUpperCase()}
                    </td>
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusStyle.className}`}
                      >
                        {statusStyle.icon}
                        <span>{statusStyle.label}</span>
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
