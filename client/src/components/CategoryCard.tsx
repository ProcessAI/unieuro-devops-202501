import { ReactNode } from 'react';

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  active?: boolean;
}

export function CategoryCard({ icon, title, active = false }: CategoryCardProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center p-6 rounded-lg transition cursor-pointer',
        active
          ? 'border-2 border-yellow-400 bg-yellow-900 text-white'
          : 'border border-transparent hover:border-gray-600 bg-[#1A1615] text-gray-300',
      ].join(' ')}
      style={{ width: '100%', height: '100%' }}
    >
      {icon}
      <span className="mt-2">{title}</span>
    </div>
  );
}
