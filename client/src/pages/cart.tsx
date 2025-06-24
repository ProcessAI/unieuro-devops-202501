import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  IconTrash,
  IconPlus,
  IconMinus,
  IconArrowLeft,
  IconQrcode,
  IconCreditCard,
  IconBarcode,
} from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ToastContext';
import { apiFetch } from '@/utils/apiClient';

type Product = {
  id: number;
  nome: string;
  imageUrl: string;
  preco: number;
  precoOriginal: number;
  frete: number;
  quantidadeVarejo: number;
  quantity: number;
};

export default function CartPage() {
  const { showToast } = useToast();
  const [isLogged, setIsLogged] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (Cookies.get('refreshToken')) {
      setIsLogged(true);
    }
  }, []);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartItems.length > 0) {
      fetchProducts(cartItems);
    }
  }, []);

  const fetchProducts = async (cartItems: { id: number; quantity: number }[]) => {
    try {
      const ids = cartItems.map((it) => it.id).join(',');
      const response = await fetch(`/api/cart?ids=${ids}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        showToast('Erro ao buscar produtos do carrinho.');
        return;
      }
      const data = await response.json();

      const updatedProducts: Product[] = data.products.map((p: any) => {
        const cartItem = cartItems.find((ci) => ci.id === p.id);
        return {
          id: p.id,
          nome: p.nome,
          imageUrl: p.imageUrl || p.Midias[0]?.link || '/default-image.jpg',
          preco: Number(p.preco),
          precoOriginal: Number(p.precoOriginal),
          frete: Number(p.frete),
          quantidadeVarejo: p.quantidadeVarejo,
          quantity: cartItem?.quantity || 1,
        };
      });
      setProducts(updatedProducts);
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar os produtos do carrinho.');
    }
  };

  const handleIncreaseQuantity = (id: number) => {
    setProducts((prev) => {
      const updated = prev.map((prod) =>
        prod.id === id ? { ...prod, quantity: prod.quantity + 1 } : prod
      );
      updateLocalStorage(updated);
      return updated;
    });
  };

  const handleDecreaseQuantity = (id: number) => {
    setProducts((prev) => {
      const updated = prev.map((prod) =>
        prod.id === id && prod.quantity > 1 ? { ...prod, quantity: prod.quantity - 1 } : prod
      );
      updateLocalStorage(updated);
      return updated;
    });
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => {
      const updated = prev.filter((prod) => prod.id !== id);
      updateLocalStorage(updated);
      return updated;
    });
  };

  const handleClearCart = () => {
    setProducts([]);
    localStorage.removeItem('cart');
  };

  const updateLocalStorage = (updatedProducts: Product[]) => {
    const cart = updatedProducts.map((p) => ({ id: p.id, quantity: p.quantity }));
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const subtotalProdutos = products.reduce((acc, prod) => {
    const unitPrice = prod.quantity >= prod.quantidadeVarejo ? prod.preco : prod.precoOriginal;
    return acc + unitPrice * prod.quantity;
  }, 0);

  const totalFrete = products.reduce((acc, prod) => acc + prod.frete * prod.quantity, 0);

  const total = subtotalProdutos + totalFrete;

  const getSelectedPaymentMethod = (): 'pix' | 'card' | 'boleto' => {
    const checked = document.querySelector(
      'input[name="payment"]:checked'
    ) as HTMLInputElement | null;
    return (checked?.id as 'pix' | 'card' | 'boleto') || 'pix';
  };

  const handleCheckout = async () => {
    if (products.length === 0) {
      showToast('Seu carrinho está vazio.');
      return;
    }
    const payload = {
      products: products.map((p) => ({ id: p.id, quantity: p.quantity })),
      paymentMethod: getSelectedPaymentMethod(),
    };
    try {
      const response = await apiFetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        showToast('Erro ao criar link de pagamento: ' + err.message);
        return;
      }
      const data = (await response.json()) as { paymentLinkUrl: string };
      window.location.href = data.paymentLinkUrl;
    } catch {
      showToast('Ocorreu um erro inesperado.');
    }
  };

  return (
    <main className="bg-black w-full h-screen text-white p-8">
      <div className="w-full h-full rounded-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-extralight">Resumo do Pedido</h1>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {products.length > 0 ? (
              <ul className="p-4 space-y-4" aria-label="Lista de itens do carrinho">
                {products.map((prod) => {
                  const hasDiscount = prod.quantity >= prod.quantidadeVarejo;
                  const unitPrice = hasDiscount ? prod.preco : prod.precoOriginal;
                  return (
                    <li
                      key={prod.id}
                      className="flex justify-between items-center bg-[#1A1615] p-6 px-10"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={prod.imageUrl}
                          alt={prod.nome}
                          className="w-20 h-20 rounded-full object-cover bg-black"
                        />
                        <div className="flex flex-col">
                          <strong className="font-semibold">{prod.nome}</strong>
                          <div className="flex items-center gap-2">
                            {hasDiscount && (
                              <span className="line-through text-gray-400">
                                R$ {prod.precoOriginal.toFixed(2)}
                              </span>
                            )}
                            <span className={hasDiscount ? 'text-[#DF9829]' : 'text-gray-400'}>
                              R$ {unitPrice.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            Frete por item: R$ {prod.frete.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(prod.id)}
                            className="p-1 bg-[#DF9829] text-black rounded hover:opacity-80"
                          >
                            <IconMinus size={16} />
                          </button>
                          <span>{prod.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(prod.id)}
                            className="p-1 bg-[#DF9829] text-black rounded hover:opacity-80"
                          >
                            <IconPlus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(prod.id)}
                          className="text-white hover:text-red-500"
                        >
                          <IconTrash size={20} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex justify-center items-center h-64">
                <Link href="/">
                  <Image
                    src="/logoAtacanetVertical.svg"
                    width={160}
                    height={160}
                    alt="Carrinho vazio"
                  />
                </Link>
                <div className="ml-6 text-center">
                  <h2 className="text-2xl font-semibold">Seu carrinho está vazio</h2>
                  <p className="text-gray-500">Compre itens no melhor preço</p>
                  <div className="mt-4">
                    {!isLogged ? (
                      <>
                        <Link
                          href="/login"
                          className="bg-yellow-400 text-black px-6 py-2 rounded-lg mr-2"
                        >
                          Fazer login
                        </Link>
                        <Link
                          href="/register"
                          className="border border-gray-600 px-6 py-2 rounded-lg"
                        >
                          Criar conta
                        </Link>
                      </>
                    ) : (
                      <Link href="/" className="bg-yellow-400 text-black px-6 py-3 rounded-lg">
                        Voltar às compras
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <footer className="mt-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-1 underline hover:text-gray-300">
              <IconArrowLeft size={20} />
              <span>Voltar à loja</span>
            </Link>
            <div className="text-right">
              <p className="text-lg">Subtotal: R$ {subtotalProdutos.toFixed(2)}</p>
              <p className="text-lg">Frete: R$ {totalFrete.toFixed(2)}</p>
              <p className="text-2xl font-semibold text-[#DF9829]">Total: R$ {total.toFixed(2)}</p>
            </div>
          </footer>
        </section>

        <aside className="p-8 bg-[#1A1615] rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-[#DF9829] text-xl font-extralight mb-4">
              Selecione o método de pagamento
            </h2>
            <form className="flex flex-col gap-4">
              {[
                { id: 'pix', icon: <IconQrcode size={30} />, label: 'Pix' },
                { id: 'card', icon: <IconCreditCard size={30} />, label: 'Cartão' },
                { id: 'boleto', icon: <IconBarcode size={30} />, label: 'Boleto' },
              ].map((m) => (
                <label
                  key={m.id}
                  htmlFor={m.id}
                  className="flex items-center bg-black p-6 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    id={m.id}
                    className="sr-only peer"
                    defaultChecked={m.id === 'pix'}
                  />
                  <div className="w-6 h-6 border-2 border-[#DF9829] rounded-full peer-checked:bg-[#DF9829] transition" />
                  <span className="ml-3 text-[#DF9829]">{m.icon}</span>
                  <span className="ml-2">{m.label}</span>
                </label>
              ))}
            </form>
          </div>
          <div className="flex flex-col w-full">
            <button
              onClick={handleCheckout}
              className="mt-6 bg-[#DF9829] text-black font-semibold py-3 rounded hover:opacity-90 w-full"
            >
              Finalizar Compra
            </button>
            <button
              onClick={handleClearCart}
              className="mt-4 bg-red-500 text-black font-semibold py-3 rounded hover:opacity-90 w-full"
            >
              Zerar Carrinho
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
