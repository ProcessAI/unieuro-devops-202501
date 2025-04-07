import Link from "next/link";
import {
  Package,
  Smartphone,
  Shirt,
  Heart,
  Percent,
  House,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#130F0E]">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <Navbar />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroCarousel />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-6 gap-8">
          <CategoryCard icon={<Package />} title="Todos" />
          <CategoryCard icon={<Smartphone />} title="Eletrônicos" />
          <CategoryCard icon={<Shirt />} title="Moda" />
          <CategoryCard icon={<House />} title="Casa & Deco" />
          <CategoryCard icon={<Heart />} title="Beleza" />
          <CategoryCard icon={<Percent />} title="Ofertas" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Ofertas do dia</h2>
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Ver todas
          </a>
        </div>
        <div className="grid grid-cols-5 gap-6">
          <ProductCard
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            price="799.99"
            originalPrice="999.99"
            discount={20}
            minQuantity={3}
          />
          <ProductCard
            image="https://images.unsplash.com/photo-1546868871-7041f2a55e12"
            price="1599.99"
            originalPrice="1899.99"
            discount={15}
            minQuantity={2}
          />
          <ProductCard
            image="https://images.unsplash.com/photo-1585123334904-845d60e97b29"
            price="1999.99"
            originalPrice="2499.99"
            discount={20}
            minQuantity={1}
          />
          <ProductCard
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            price="149.99"
            originalPrice="199.99"
            discount={25}
            minQuantity={5}
          />
          <ProductCard
            image="https://images.unsplash.com/photo-1572635196237-14b3f281503f"
            price="999.99"
            originalPrice="1299.99"
            discount={23}
            minQuantity={2}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
