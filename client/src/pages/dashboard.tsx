import React from 'react';
import { GetServerSideProps } from 'next';
import StatsCard from '../components/StatsCard';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import OrdersTable from '../components/OrdersTable';
import { BanknoteArrowUp, Package } from 'lucide-react';

const Dashboard = ({ stats }) => {
  if (!stats) return <p className="text-white">Erro ao carregar dados do dashboard.</p>;

  return (
    <div className="min-h-screen bg-[#130F0E] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-3xl font-light mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Vendas da Semana"
            value={stats.vendasSemana.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
            percentage="↑ 15% essa semana"
            isPositive={true}
            icon={<BanknoteArrowUp />}
          />

          <StatsCard
            title="Pedidos da Semana"
            value={stats.pedidosSemana.toString()}
            percentage="↑ 5% essa semana"
            isPositive={true}
            icon={<Package />}
          />

          <StatsCard
            title="Vendas do Mês"
            value={stats.vendasMes.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
            percentage="↑ 2% esse mês"
            isPositive={true}
            icon={<BanknoteArrowUp />}
          />

          <StatsCard
            title="Pedidos do Mês"
            value={stats.pedidosMes.toString()}
            percentage="↑ 7% esse mês"
            isPositive={true}
            icon={<Package />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart />
          <PieChart />
        </div>

        <OrdersTable />
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
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
