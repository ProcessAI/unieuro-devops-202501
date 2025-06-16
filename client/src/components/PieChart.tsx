import React, { useEffect, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const cores = ['#8B5CF6', '#3B82F6', '#EC4899', '#F59E0B', '#10B981'];

const PieChart: React.FC = () => {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([]);
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes' | 'ano'>('semana');

  useEffect(() => {
    const protocolo = window.location.protocol;
    const host = window.location.host;
    const url = `${protocolo}//${host}/api/dashboard/categorias-vendas?filtro=${filtro}`;

    console.log('🔗 URL da API:', url);
    fetch(url)
      .then(async (res) => {
        const text = await res.text();
        console.log('🧾 Resposta bruta:', text);
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
          setData(parsed);
        } else if (Array.isArray(parsed?.data)) {
          setData(parsed.data);
        } else {
          console.error('❌ Formato de dados inesperado:', parsed);
          setData([]);
        }
      })
      .catch((err) => console.error('❌ Erro ao buscar dados do gráfico de pizza:', err));
  }, [filtro]);

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-[#1A1615] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-gray-400 text-sm font-medium mb-2">CATEGORIAS MAIS VENDIDAS</div>
          <div className="text-blue-400 text-2xl font-bold mb-1">{total} itens</div>
          <div className="text-gray-400 text-sm">{data.length} categorias</div>
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as 'dia' | 'mes' | 'ano')}
          className="bg-transparent text-gray-400 text-sm border border-gray-600 rounded px-2 py-1"
        >
          <option value="dia">Hoje</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mês</option>
          <option value="ano">Este ano</option>
        </select>
      </div>

      <div className="flex items-center gap-8">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cores[index % cores.length] }}
              ></div>
              <span className="text-gray-300 text-sm">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
