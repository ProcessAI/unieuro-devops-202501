import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { Footer } from '@/components/Footer';
import {
  IconCircleCheck,
  IconCircleX,
  IconReceipt,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

// Configuração do Day.js para usar o idioma português
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

const transicoesStatus: Record<string, string[]> = {
  'Pedido Realizado': ['Pgto Aprovado', 'Pgto Recusado'],
  'Pgto Recusado': ['Aviso enviado'],
  'Aviso enviado': ['Arquivado sem sucesso'],
  'Pgto Aprovado': ['Pgto Confirmado'],
  'Pgto Confirmado': ['Em separação'],
  'Em separação': ['Separado Embalado'],
  'Separado Embalado': ['Aguardando coleta'],
  'Aguardando coleta': ['Pedido coletado'],
  'Pedido coletado': ['Pedido Entregue', 'Pedido Devolvido'],
  'Pedido Entregue': ['Arquivado com sucesso'],
  'Pedido Devolvido': ['Pedido em correção'],
  'Pedido em correção': ['Pagamento Estornado'],
  'Pagamento Estornado': ['Arquivado sem sucesso'],
};

const getProximoStatus = (statusAtual: string): string | null => {
  const proximos = transicoesStatus[statusAtual];
  return proximos && proximos.length > 0 ? proximos[0] : null;
};

// --- TIPOS DE DADOS ---
type StatusPedido = 'pago' | 'cancelado' | string;

type PedidoDaLista = {
  id: number;
  quantidade: number;
  formaPagamento: string;
  status: StatusPedido;
  valorPago: string;
  dataCompra: string;
  Cliente: {
    nome: string;
  };
};

type DetalhesPedido = {
  id: number;
  status: StatusPedido;
  dataCompra: string;
  Cliente: {
    nome: string;
    email: string;
  };
};

function ModalDetalhesPedido({
  dados,
  onClose,
}: {
  dados: DetalhesPedido;
  onClose: () => void;
}) {
  const avancarStatus = async () => {
    const novoStatus = getProximoStatus(dados.status);
    if (!novoStatus) return alert('Este status não pode ser avançado.');

    try {
      await fetch(`/api/admin/pedidos/${dados.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novoStatus }),
      });
      alert(`Status atualizado para: ${novoStatus}`);
      onClose();
      location.reload();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar o status.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-[#1A1615] p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-[#DF9829] mb-4">
          Detalhes do Pedido #{dados.id}
        </h2>
        <div className="space-y-2 text-white">
          <p><strong>Usuário:</strong> {dados.Cliente.nome} ({dados.Cliente.email})</p>
          <p><strong>Status:</strong> <span className="font-semibold uppercase">{dados.status}</span></p>
          <p><strong>Data/Hora:</strong> {dayjs(dados.dataCompra).format('DD/MM/YYYY HH:mm')}</p>
        </div>
        <button
          onClick={avancarStatus}
          className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition w-full"
        >
          Avançar Status
        </button>
        <button
          onClick={onClose}
          className="mt-2 bg-[#DF9829] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#C77714] transition w-full"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState<PedidoDaLista[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dadosModal, setDadosModal] = useState<DetalhesPedido | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/admin/pedidos-status', {
          credentials: 'include',
        });
        const data = await response.json();
        setPedidos(data.pedidos || []);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const getStatusStyle = (status: StatusPedido) => {
    switch (status) {
      case 'pago': return { icon: <IconCircleCheck size={16} />, className: 'bg-green-600 text-white', label: 'Pago' };
      case 'cancelado': return { icon: <IconCircleX size={16} />, className: 'bg-red-600 text-white', label: 'Cancelado' };
      default: return { icon: <IconReceipt size={16} />, className: 'bg-gray-500 text-white', label: status };
    }
  };

  const handleVerDetalhes = async (pedidoId: number) => {
    try {
      const response = await fetch(`/api/admin/pedidos/${pedidoId}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Falha ao buscar detalhes do pedido.');
      const data: DetalhesPedido = await response.json();
      setDadosModal(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('Não foi possível carregar os detalhes do pedido.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0705] text-white flex justify-center items-center">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#130F0E] text-white flex flex-col">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
        </div>
      </header>
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
                  <tr key={pedido.id} className="border-b border-gray-800 hover:bg-[#1F1A19] transition-colors">
                    <td className="p-4 font-bold">
                      <div>#{pedido.id}</div>
                      <div className="text-xs text-gray-400">{dayjs(pedido.dataCompra).fromNow()}</div>
                    </td>
                    <td className="p-4">{pedido.Cliente.nome}</td>
                    <td className="p-4 text-center">{pedido.quantidade}</td>
                    <td className="p-4 font-mono">{Number(pedido.valorPago).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="p-4">{pedido.formaPagamento.toUpperCase()}</td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusStyle.className}`}>
                        {statusStyle.icon}
                        <span>{statusStyle.label}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleVerDetalhes(pedido.id)} className="bg-[#DF9829] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#C77714] transition">Ver Detalhes</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
      {isModalOpen && dadosModal && (
        <ModalDetalhesPedido dados={dadosModal} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
