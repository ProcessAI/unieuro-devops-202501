import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cria algumas categorias para referência (se ainda não existir)
  const categoriaEletronicos = await prisma.categoria.upsert({
    where: { id: 1 },
    update: {},
    create: { nome: 'Eletrônicos' },
  });

  const marcaX = await prisma.marca.upsert({
    where: { id: 1 },
    update: {},
    create: { nome: 'MarcaX' },
  });

  // Produtos com precoOriginal > preco para simular oferta
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Fone Gamer XYZ',
        descricao: 'Fone com som surround',
        preco: 799.99,
        precoOriginal: 999.99,
        frete: 20,
        ativo: true,
        categoriaId: categoriaEletronicos.id,
        marcaId: marcaX.id,
        modelo: 'XYZ',
        numeroModelo: '1234',
        condicao: 'novo',
        dimensoes: '20x10x15 cm',
        garantia: '12 meses',
        voltagem: '110V',
        localizacaoProduto: 'SP',
        quantidade: 50,
        quantidadeVarejo: 2,
      },
      {
        nome: 'Smartphone ABC',
        descricao: 'Smartphone com câmera 108MP',
        preco: 1599.99,
        precoOriginal: 1899.99,
        frete: 25,
        ativo: true,
        categoriaId: categoriaEletronicos.id,
        marcaId: marcaX.id,
        modelo: 'ABC',
        numeroModelo: '5678',
        condicao: 'novo',
        dimensoes: '15x7x1 cm',
        garantia: '24 meses',
        voltagem: '110V',
        localizacaoProduto: 'RJ',
        quantidade: 30,
        quantidadeVarejo: 1,
      },
      // adicione mais produtos conforme quiser
    ],
  });

  // Inserir mídias (imagens) para os produtos (assumindo ids 1 e 2)
  await prisma.midia.createMany({
    data: [
      {
        link: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        produtoId: 1,
      },
      {
        link: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
        produtoId: 2,
      },
    ],
  });

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
