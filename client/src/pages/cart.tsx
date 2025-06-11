import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { IconTrash, IconPlus, IconMinus, IconArrowLeft } from '@tabler/icons-react';
import { IconQrcode, IconCreditCard, IconBarcode } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ToastContext';
import { apiFetch } from '@/utils/apiClient';

type Product = {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  discountPrice: number;
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
      const ids = cartItems.map((item) => item.id).join(',');

      const response = await fetch(`/api/cart?ids=${ids}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Erro ao buscar produtos:', response);
        showToast('Erro ao buscar produtos do carrinho.');
        return;
      }

      const data = await response.json();

      const updatedProducts = data.products.map((product: any) => {
        const cartItem = cartItems.find((item: any) => item.id === product.id);

        const price = parseFloat(product.preco);
        const discountPrice = price * 0.9;

        return {
          ...product,
          price: price,
          quantity: cartItem?.quantity || 1,
          discountPrice: discountPrice,
          imageUrl: product.imageUrl || product.Midias[0]?.link,
        };
      });

      setProducts(updatedProducts);
    } catch (error) {
      console.error('Erro inesperado:', error);
      showToast('Erro ao carregar os produtos do carrinho.');
    }
  };

  const handleIncreaseQuantity = (id: number) => {
    setProducts((prev) => {
      const updatedProducts = prev.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity + 1 } : product
      );
      updateLocalStorage(updatedProducts);
      return updatedProducts;
    });
  };

  const handleDecreaseQuantity = (id: number) => {
    setProducts((prev) => {
      const updatedProducts = prev.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      );
      updateLocalStorage(updatedProducts);
      return updatedProducts;
    });
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => {
      const updatedProducts = prev.filter((product) => product.id !== id);
      updateLocalStorage(updatedProducts);
      return updatedProducts;
    });
  };

  const updateLocalStorage = (updatedProducts: Product[]) => {
    const updatedCart = updatedProducts.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = products.reduce((acc, product) => {
    const unitPrice = product.quantity >= 3 ? product.price * 0.9 : product.price;
    return acc + unitPrice * product.quantity;
  }, 0);

  const getSelectedPaymentMethod = (): 'pix' | 'card' | 'boleto' => {
    const checked = document.querySelector(
      'input[name="payment"]:checked'
    ) as HTMLInputElement | null;
    return (checked?.id as 'pix' | 'card' | 'boleto') || 'pix';
  };

  const handleCheckout = async () => {
    try {
      if (products.length === 0) {
        showToast('Seu carrinho está vazio.');
        return;
      }
      const payload = {
        products: products.map((p) => ({
          id: p.id,
          quantity: p.quantity,
        })),
        paymentMethod: getSelectedPaymentMethod(),
      };

      const response = await apiFetch('/api/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        showToast('Erro ao criar link de pagamento: ' + error.message);
        return;
      }

      const data = (await response.json()) as { paymentLinkUrl: string };
      window.location.href = data.paymentLinkUrl;
    } catch {
      showToast('Ocorreu um erro inesperado.');
    }
  };

  return (
    <main className="bg-[#000000] w-full h-screen text-white p-8">
      <div className="w-full h-full rounded-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-extralight">Resumo do Pedido</h1>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {products.length > 0 ? (
              <ul className="p-4 space-y-4" aria-label="Lista de itens do carrinho">
                {products.map((product) => {
                  const hasDiscount = product.quantity >= 3;
                  return (
                    <li
                      key={product.id}
                      className="flex justify-between items-center bg-[#1A1615] py-6 px-10"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-20 h-20 bg-black rounded-full"
                        />
                        <div className="flex flex-col">
                          <strong className="font-semibold">{product.name}</strong>
                          {hasDiscount ? (
                            <div className="flex items-center gap-2">
                              <span className="line-through text-gray-400">
                                R$ {product.price.toFixed(2)}
                              </span>
                              <span className="text-[#DF9829]">
                                R$ {product.discountPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">R$ {product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(product.id)}
                            className="p-1 bg-[#DF9829] text-black rounded hover:opacity-80"
                            aria-label="Diminuir quantidade"
                          >
                            <IconMinus size={16} />
                          </button>
                          <span>{product.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(product.id)}
                            className="p-1 bg-[#DF9829] text-black rounded hover:opacity-80"
                            aria-label="Aumentar quantidade"
                          >
                            <IconPlus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-white hover:text-red-500 ml-5"
                          aria-label="Remover item"
                        >
                          <IconTrash size={20} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="bg-[#1A1615] text-white rounded-lg py-10 flex flex-col md:flex-row justify-around md:items-start gap-8 w-full max-w-3xl">
                  <div>
                    <Image
                      src="/logoAtacanetVertical.svg"
                      width={500}
                      height={500}
                      alt="Carrinho vazio"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
                    <p className="text-zinc-500 mb-6">Compre itens no melhor preço</p>
                    {!isLogged ? (
                      <div className="flex flex-col sm:flex-row gap-4 font-semibold">
                        <Link
                          href="/login"
                          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg"
                        >
                          Faça login
                        </Link>
                        <Link
                          href="/register"
                          className="border border-zinc-600 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg"
                        >
                          Crie uma conta
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-end">
                        <Link
                          href="/"
                          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg"
                        >
                          Compre produtos aqui
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <footer className="mt-8 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
            <div className="flex flex-row">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-white underline hover:text-gray-300"
              >
                <IconArrowLeft size={20} />
                <span>Voltar à loja</span>
              </Link>
            </div>
            <p className="text-xl font-semibold">
              Total: <span className="text-[#DF9829]">R$ {total.toFixed(2)}</span>
            </p>
          </footer>
        </section>

        <aside className="p-8 bg-[#1A1615] rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-[#DF9829] text-xl font-extralight mb-4">
              Selecione o método de pagamento
            </h2>
            <form className="flex flex-col gap-4 p-4" aria-label="Formulário de pagamento">
              <label
                htmlFor="pix"
                className="relative flex items-center bg-black p-6 mb-4 cursor-pointer"
              >
                <input
                  type="radio"
                  name="payment"
                  id="pix"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-6 h-6 bg-transparent border-2 border-[#DF9829] rounded-full peer-checked:bg-[#DF9829] transition duration-300 ease-in-out"></div>
                <IconQrcode size={30} className="ml-2 text-[#DF9829]" />
                <span className="ml-2 text-white">Pix</span>
              </label>
              <label
                htmlFor="card"
                className="relative flex items-center bg-black p-6 mb-4 cursor-pointer"
              >
                <input type="radio" name="payment" id="card" className="sr-only peer" />
                <div className="w-6 h-6 bg-transparent border-2 border-[#DF9829] rounded-full peer-checked:bg-[#DF9829] transition duration-300 ease-in-out"></div>
                <IconCreditCard size={30} className="ml-2 text-[#DF9829]" />
                <span className="ml-2 text-white">Cartão</span>
              </label>
              <label
                htmlFor="boleto"
                className="relative flex items-center bg-black p-6 mb-4 cursor-pointer"
              >
                <input type="radio" name="payment" id="boleto" className="sr-only peer" />
                <div className="w-6 h-6 bg-transparent border-2 border-[#DF9829] rounded-full peer-checked:bg-[#DF9829] transition duration-300 ease-in-out"></div>
                <IconBarcode size={30} className="ml-2 text-[#DF9829]" />
                <span className="ml-2 text-white">Boleto</span>
              </label>
            </form>
          </div>
          <button
            type="button"
            className="mt-6 bg-[#DF9829] text-black font-semibold py-3 w-full rounded hover:opacity-90"
            onClick={handleCheckout}
          >
            Finalizar Compra
          </button>
        </aside>
      </div>
    </main>
  );
}
