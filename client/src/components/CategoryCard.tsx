import { ReactNode } from 'react';
import { useRouter } from 'next/router';

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  categoriaId: string;
}

export function CategoryCard({ icon, title, categoriaId }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/category-page?query=${encodeURIComponent(categoriaId)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center p-6 bg-[#1A1615] rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="text-[#DF9829] mb-3">{icon}</div>
      <span className="text-sm text-white">{title}</span>
    </div>
  );
}
