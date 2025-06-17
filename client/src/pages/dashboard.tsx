import React from 'react';
import { GetServerSideProps } from 'next';
import { AdminHeader } from '@/components/AdminHeader';
import { Footer } from '@/components/Footer';
import StatsCard from '../components/StatsCard';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import OrdersTable from '../components/OrdersTable';
import { BanknoteArrowUp, Package } from 'lucide-react';

const Dashboard = ({ stats }: any) => {
  if (!stats) return <p className="text-white">Erro ao carregar dados do dashboard.</p>;

  return (
    <div className="min-h-screen bg-[#130F0E]">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
        </div>
      </header>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 py-12">
          <StatsCard
            title="Vendas da Semana"
            value={stats.vendasSemana.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
            percentage={stats.pctVendasSemana}
            isPositive={stats.pctVendasSemana >= 0}
            icon={<BanknoteArrowUp />}
          />

          <StatsCard
            title="Pedidos da Semana"
            value={stats.pedidosSemana.toLocaleString('pt-BR')}
            percentage={stats.pctPedidosSemana}
            isPositive={stats.pctPedidosSemana >= 0}
            icon={<Package />}
          />

          <StatsCard
            title="Vendas do Mês"
            value={stats.vendasMes.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
            percentage={stats.pctVendasMes}
            isPositive={stats.pctVendasMes >= 0}
            icon={<BanknoteArrowUp />}
          />

          <StatsCard
            title="Pedidos do Mês"
            value={stats.pedidosMes.toLocaleString('pt-BR')}
            percentage={stats.pctPedidosMes}
            isPositive={stats.pctPedidosMes >= 0}
            icon={<Package />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8 py-4">
          <LineChart />
          <PieChart />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <OrdersTable /> {/* Preciso da lógica de pedidos pronta */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const protocolo = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = context.req.headers.host;
  const url = `${protocolo}://${host}/api/dashboard/estatisticas`;

  console.log('🔍 Buscando estatísticas do dashboard na URL:', url);

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log('📦 Dados recebidos:', data);

    if (!res.ok) {
      throw new Error(`Status ${res.status} - ${data.message}`);
    }

    return {
      props: {
        stats: data ?? null,
      },
    };
  } catch (error) {
    console.error('❌ Erro no getServerSideProps:', error);
    return { props: { stats: null } };
  }
}

export default Dashboard;
