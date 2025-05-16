import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export async function getOfertas(req: Request, res: Response) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        ativo: true,
        preco: {
          lt: prisma.$decimal('precoOriginal'), // apenas precaução, será sobrescrito abaixo
        },
      },
      include: {
        Midias: {
          take: 1, // pega a primeira imagem
        },
      },
    });

    // Filtrar produtos que realmente têm desconto
    const produtosComDesconto = produtos
      .filter(p => p.preco < p.precoOriginal)
      .map(p => ({
        id: p.id,
        nome: p.nome,
        preco: p.preco,
        precoOriginal: p.precoOriginal,
        desconto: Math.round(((p.precoOriginal - p.preco) / p.precoOriginal) * 100),
        minQuantity: p.quantidadeVarejo,
        image: p.Midias[0]?.link || null,
      }));

    res.json(produtosComDesconto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar ofertas do dia' });
  }
}
