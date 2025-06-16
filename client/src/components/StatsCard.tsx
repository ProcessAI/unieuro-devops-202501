import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  percentage: number;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title, value, percentage, isPositive, icon,
}) => (
  <div className="bg-[#1A1615] p-6 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm font-medium">{title}</span>
      <div className="text-[#DF9829]">{icon}</div>
    </div>

    <div className="text-white text-2xl font-bold mb-1">{value}</div>

    <div className={`text-sm ${isPositive ? 'text-[#DF9829]' : 'text-red-500'}`}>
      {isPositive ? '↑' : '↓'} {percentage.toFixed(1).replace('.', ',')}%
    </div>
  </div>
);

export default StatsCard;