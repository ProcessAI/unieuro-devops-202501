import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, percentage, isPositive, icon }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <div className="text-orange-500">
          {icon}
        </div>
      </div>
      <div className="text-white text-2xl font-bold mb-1">{value}</div>
      <div className={`text-sm ${isPositive ? 'text-orange-500' : 'text-red-500'}`}>
        {percentage}
      </div>
    </div>
  );
};

export default StatsCard;
