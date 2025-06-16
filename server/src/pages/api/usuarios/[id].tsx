// pages/api/usuarios/[id].tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = parseInt(id as string);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID do usuário inválido' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const usuario = await prisma.cliente.findUnique({
          where: { id: userId },
          include: {
            empresas: true,
            enderecos: true,
            pedidos: {
              include: {
                Produto: {
                  select: {
                    nome: true,
                    preco: true
                  }
                }
              },
              orderBy: { dataCompra: 'desc' },
              take: 10
            },
            avaliacoes: {
              include: {
                Produto: {
                  select: {
                    nome: true
                  }
                }
              },
              orderBy: { dataAvaliacao: 'desc' },
              take: 5
            }
          }
        });

        if (!usuario) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({
          success: true,
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            cpf: usuario.cpf,
            dataNascimento: usuario.dataNascimento,
            dataRegistro: usuario.dataRegistro,
            ativo: usuario.ativo,
            verificado: usuario.verificado,
            empresas: usuario.empresas,
            enderecos: usuario.enderecos,
            pedidosRecentes: usuario.pedidos,
            avaliacoesRecentes: usuario.avaliacoes,
            estatisticas: {
              totalPedidos: usuario.pedidos.length,
              valorTotalGasto: usuario.pedidos.reduce((total: number, pedido: any) => {
                return total + (pedido.valorPago ? Number(pedido.valorPago) : 0);
              }, 0),
              totalAvaliacoes: usuario.avaliacoes.length
            }
          }
        });
        break;

      case 'PUT':
        const { nome, email, telefone, ativo } = req.body;

        if (email && !email.includes('@')) {
          return res.status(400).json({
            success: false,
            message: 'Email inválido'
          });
        }

        const usuarioAtualizado = await prisma.cliente.update({
          where: { id: userId },
          data: {
            ...(nome && { nome }),
            ...(email && { email }),
            ...(telefone && { telefone }),
            ...(typeof ativo === 'boolean' && { ativo })
          }
        });

        res.status(200).json({
          success: true,
          message: 'Usuário atualizado com sucesso',
          usuario: {
            id: usuarioAtualizado.id,
            nome: usuarioAtualizado.nome,
            email: usuarioAtualizado.email,
            telefone: usuarioAtualizado.telefone,
            ativo: usuarioAtualizado.ativo
          }
        });
        break;

      case 'DELETE':
        const usuarioDesativado = await prisma.cliente.update({
          where: { id: userId },
          data: { ativo: false }
        });

        res.status(200).json({
          success: true,
          message: 'Usuário desativado com sucesso',
          usuario: {
            id: usuarioDesativado.id,
            nome: usuarioDesativado.nome,
            ativo: usuarioDesativado.ativo
          }
        });
        break;

      default:
        res.status(405).json({ message: 'Método não permitido' });
    }

  } catch (error) {
    console.error('Erro na operação com usuário:', error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'Email já está em uso por outro usuário'
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}