import Link from "next/link";

export default function RestaurantMenu() {
  const pizzaItems = [
    {
      titulo: "Pizza Marguerita",
      descricao: "Molho de tomate, queijo, manjericão e orégano.",
      url: "/pedido/pizza-marguerita",
      urlImagem: "/pizza-marguerita.jpg",
      preco: "R$ 39,90",
    },
    {
      titulo: "Pizza Calabresa",
      descricao: "Calabresa fatiada, cebola e azeitonas pretas.",
      url: "/pedido/pizza-calabresa",
      urlImagem: "/pizza-calabresa.jpg",
      preco: "R$ 42,90",
    },
    {
      titulo: "Pizza Quatro Queijos",
      descricao: "Mussarela, gorgonzola, parmesão e provolone.",
      url: "/pedido/pizza-quatro-queijos",
      urlImagem: "/pizza-quatro-queijos.jpg",
      preco: "R$ 45,90",
    },
    {
      titulo: "Pizza Frango com Catupiry",
      descricao: "Frango desfiado, catupiry original e orégano.",
      url: "/pedido/pizza-frango-catupiry",
      urlImagem: "/pizza-frango-catupiry.jpg",
      preco: "R$ 44,90",
    },
    {
      titulo: "Pizza Portuguesa",
      descricao: "Presunto, ovo, cebola, azeitonas e ervilhas.",
      url: "/pedido/pizza-portuguesa",
      urlImagem: "/pizza-portuguesa.jpg",
      preco: "R$ 46,90",
    },
    {
      titulo: "Pizza Pepperoni",
      descricao: "Pepperoni especial e muito queijo derretido.",
      url: "/pedido/pizza-pepperoni",
      urlImagem: "/pizza-pepperoni.jpg",
      preco: "R$ 48,90",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center p-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Cardápio de Pizzas 🍕</h1>
        <p className="text-gray-400 mt-2">
          Escolha sua pizza favorita e faça seu pedido!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full max-w-6xl">
        {pizzaItems.map((pizza, index) => (
          <div
            key={index}
            className="bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg hover:scale-110 transition flex flex-col"
          >
            <img
              src={pizza.urlImagem}
              alt={pizza.titulo}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-2xl font-bold mt-4">{pizza.titulo}</h2>
            <p className="text-gray-400 mt-2 flex-grow">{pizza.descricao}</p>
            <p className="text-2xl font-bold my-3">{pizza.preco}</p>
            <Link
              href={pizza.url}
              className="mt-auto block w-full bg-[#4268f6] py-2 rounded-md font-semibold text-center hover:bg-[#3654c9] transition"
            >
              Pedir Agora
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
