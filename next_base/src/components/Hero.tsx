import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    title: "Xbox Consoles",
    description:
      "Economize até 50% em jogos selecionados para Xbox. Receba 3 meses do PC Game Pass por R$10.",
    buttonText: "Compre agora →",
    imageUrl:
      "https://cms-assets.xboxservices.com/assets/bf/b0/bfb06f23-4c87-4c58-b4d9-ed25d3a739b9.png?n=389964_Hero-Gallery-0_A1_857x676.png",
    bgColor: "bg-gray-100",
  },
  {
    title: "Promoção em Smartphones",
    description:
      "Aproveite descontos exclusivos em celulares das melhores marcas. Oferta por tempo limitado!",
    buttonText: "Ver celulares →",
    imageUrl:
      "https://phone-hub.in/cdn/shop/files/WE.png?crop=center&height=1200&v=1739377841&width=1200",
    bgColor: "bg-blue-50",
  },
  {
    title: "Moda com 40% OFF",
    description:
      "Ofertas imperdíveis em roupas e acessórios. Aproveite e renove seu estoque!",
    buttonText: "Conferir →",
    imageUrl:
      "https://www.pngplay.com/wp-content/uploads/12/Handbag-Transparent-Images.png",
    bgColor: "bg-green-50",
  },
];

export function HeroCarousel() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      emulateTouch
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${slide.bgColor} py-16 flex items-center`}
          style={{ minHeight: "450px" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center flex-col md:flex-row">
            <div className="text-left md:w-1/2">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                {slide.title}
              </h1>
              <p className="text-lg mb-6 text-gray-700 whitespace-pre-line">
                {slide.description}
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                {slide.buttonText}
              </button>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="object-contain w-full max-w-sm"
                style={{ maxHeight: "300px" }}
              />
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
