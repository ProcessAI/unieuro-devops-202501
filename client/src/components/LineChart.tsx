import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 20 },
  { month: 'Feb', value: 35 },
  { month: 'Mar', value: 25 },
  { month: 'Apr', value: 45 },
  { month: 'Mai', value: 30 },
  { month: 'Jun', value: 50 },
];

const LineChart: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="mb-6">
        <div className="text-gray-400 text-sm font-medium mb-2">CHART TITLE</div>
        <div className="text-blue-400 text-2xl font-bold mb-1">5.000,00</div>
        <div className="text-gray-400 text-sm">50 Orders</div>
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
              domain={[-80, 80]}
              ticks={[-80, -20, 20, 80]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
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
      
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-gray-400 text-sm">Faturamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-400 text-sm">Meta</span>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
