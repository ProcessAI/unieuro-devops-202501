import { useState } from 'react';
import { IconTrash, IconPlus, IconMinus } from '@tabler/icons-react';
import { IconQrcode, IconCreditCard, IconBarcode } from '@tabler/icons-react';

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      image: 'https://http2.mlstatic.com/D_NQ_NP_871755-MLU74346911353_022024-O.webp',
      name: 'Miniatura W14 Mercedes AMG Petronas F1 2023',
      price: 999.9,
      quantity: 1,
    },
    {
      id: 2,
      image:
        'https://baggiocafe.com.br/cdn/shop/files/KitEscritorio_Graos__2kg.png?v=1741954451&width=900',
      name: 'Kit Café Baggio Modo 2kg',
      price: 50.0,
      quantity: 3,
    },
    {
      id: 3,
      image: 'https://m.media-amazon.com/images/I/61lSXM4RsqL._AC_SX569_.jpg',
      name: 'Mochila Reforçada com Carregador Etsiny',
      price: 300.0,
      quantity: 1,
    },
    {
      id: 4,
      image: 'https://m.media-amazon.com/images/I/710sK2W6R3L._AC_SX522_.jpg',
      name: 'Caneta Premium de Bambu Planalto LeQualité',
      price: 110.5,
      quantity: 1,
    },
  ]);

  const handleIncreaseQuantity = (id: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity + 1 } : product
      )
    );
  };

  const handleDecreaseQuantity = (id: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      })
    );
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const total = products.reduce((acc, product) => {
    const unitPrice = product.quantity >= 3 ? product.price * 0.9 : product.price;
    return acc + unitPrice * product.quantity;
  }, 0);

  return (
    <main className="bg-[#000000] w-full h-screen text-white p-8">
      <div className="w-full h-full rounded-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-extralight">Resumo do Pedido</h1>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 justify-center">
            <ul className="p-4 space-y-4" aria-label="Lista de itens do carrinho">
              {products.map((product) => {
                const hasDiscount = product.quantity >= 3;
                const discountPrice = product.price * 0.9;
                return (
                  <li
                    key={product.id}
                    className="flex justify-between items-center bg-[#1A1615] py-6 px-10"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
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
                            <span className="text-[#DF9829]">R$ {discountPrice.toFixed(2)}</span>
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
          </div>
          <footer className="mt-8 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
            <a href="#" className="text-white underline hover:text-gray-300">
              &larr; Voltar à loja
            </a>
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
                <div
                  className="w-6 h-6 bg-transparent border-2 border-[#DF9829] rounded-full 
                    peer-checked:bg-[#DF9829] transition duration-300 ease-in-out"
                ></div>
                <IconQrcode size={30} className="ml-2 text-[#DF9829]" />
                <span className="ml-2 text-white">Pix</span>
              </label>
              <label
                htmlFor="card"
                className="relative flex items-center bg-black p-6 mb-4 cursor-pointer"
              >
                <input type="radio" name="payment" id="card" className="sr-only peer" />
                <div
                  className="w-6 h-6 bg-transparent border-2 border-[#DF9829] rounded-full 
                    peer-checked:bg-[#DF9829] transition duration-300 ease-in-out"
                ></div>
                <IconCreditCard size={30} className="ml-2 text-[#DF9829]" />
                <span className="ml-2 text-white">Cartão</span>
              </label>
              <label
                htmlFor="boleto"
                className="relative flex items-center bg-black p-6 mb-4 cursor-pointer"
              >
                <input type="radio" name="payment" id="boleto" className="sr-only peer" />
                <div
                  className="w-6 h-6 bg-transparent border-2 border-[#DF9829] rounded-full 
                    peer-checked:bg-[#DF9829] transition duration-300 ease-in-out"
                ></div>
                <IconBarcode size={30} className="ml-2 text-[#DF9829]" />
                <span className="ml-2 text-white">Boleto</span>
              </label>
            </form>
          </div>
          <button
            type="button"
            className="mt-6 bg-[#DF9829] text-black font-semibold py-3 w-full rounded hover:opacity-90"
          >
            Finalizar Compra
          </button>
        </aside>
      </div>
    </main>
  );
}
