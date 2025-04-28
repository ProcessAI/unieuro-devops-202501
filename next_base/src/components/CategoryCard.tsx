import { ReactNode } from 'react';

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
}

export function CategoryCard({ icon, title }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#1A1615] rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
      <div className="text-[#DF9829] mb-3">{icon}</div>
      <span className="text-sm text-white">{title}</span>
    </div>
  );
}