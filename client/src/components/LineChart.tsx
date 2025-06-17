import React, { useEffect, useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const LineChart: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard/vendas-mensais')
      .then((res) => res.json())
      .then((json) => setData(json.vendas || []))
      .catch((err) => console.error('Erro ao carregar vendas mensais:', err));
  }, []);

  const totalVendas = data.reduce((acc, curr:any) => acc + curr.value, 0);
  const totalPedidos = data.length;

  return (
    <div className="bg-[#1A1615] p-6 rounded-lg">
      <div className="mb-6">
        <div className="text-gray-400 text-sm font-medium mb-2">VENDAS DO ANO</div>
        <div className="text-blue-400 text-2xl font-bold mb-1">
          {totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <div className="text-gray-400 text-sm">{totalPedidos} Meses</div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
