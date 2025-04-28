interface ProductCardProps {
  image: string;
  price: string;
  originalPrice: string;
  discount: number;
  minQuantity: number;
}

export function ProductCard({
  image,
  price,
  originalPrice,
  discount,
  minQuantity,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative">
        <img src={image} alt="Product" className="w-full h-48 object-cover" />
        <span className="absolute top-2 left-2 bg-[#DF9829] text-white text-sm px-2 py-1 rounded">
          -{discount}%
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-baseline mb-2">
          <span className="text-2xl font-bold text-gray-900">R$ {price}</span>
        </div>
        <div className="text-sm text-gray-500 line-through mb-2">
          R$ {originalPrice}
        </div>
        <div className="text-sm text-gray-600">Min: {minQuantity} unid.</div>
      </div>
    </div>
  );
}
