import React from 'react';
import StatsCard from '../components/StatsCard';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import OrdersTable from '../components/OrdersTable';
import { BanknoteArrowUp, Package, Users, Handshake } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#130F0E] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-white text-3xl font-light mb-8">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Vendas"
            value="15760,05"
            percentage="↑ 15% essa semana"
            isPositive={true}
            icon={<BanknoteArrowUp />}
          />
          
          <StatsCard
            title="Pedidos"
            value="1200"
            percentage="↑ 5% essa semana"
            isPositive={true}
            icon={<Package />}
          />
          
          <StatsCard
            title="Visitantes"
            value="11500"
            percentage="↑ 2% essa semana"
            isPositive={true}
            icon={<Users />}
          />
          
          <StatsCard
            title="Clientes"
            value="9700"
            percentage="↑ 7% essa semana"
            isPositive={true}
            icon={<Handshake />}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart />
          <PieChart />
        </div>
        
        {/* Orders Table */}
        <OrdersTable />
      </div>
    </div>
  );
};

export default Dashboard;
