import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Eletrônicos', value: 35, color: '#8B5CF6' },
  { name: 'Roupas', value: 30, color: '#3B82F6' },
  { name: 'Casa e Jardim', value: 35, color: '#EC4899' },
];

const PieChart: React.FC = () => {
  return (
    <div className="bg-[#1A1615] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-gray-400 text-sm font-medium mb-2">CHART TITLE</div>
          <div className="text-blue-400 text-2xl font-bold mb-1">5.000,00</div>
          <div className="text-gray-400 text-sm">50 Orders</div>
        </div>
        <div className="text-gray-400 text-sm">This Week ▼</div>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-300 text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
