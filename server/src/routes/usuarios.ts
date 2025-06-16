// server/src/usuarios.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handleUsuarios = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        ativo: true,
        verificado: true,
        dataRegistro: true,
        dataNascimento: true,
        empresas: {
          select: {
            id: true,
            nomeFantasia: true,
            razaoSocial: true,
          }
        },
        _count: {
          select: {
            pedidos: true,
            avaliacoes: true,
          }
        }
      },
      orderBy: {
        dataRegistro: 'desc'
      }
    });

    const usuariosFormatados = clientes.map((cliente: any) => ({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
      cargo: cliente.empresas.length > 0 ? cliente.empresas[0]?.nomeFantasia : null,
      status: cliente.ativo ? 'Ativo' as const : 'Inativo' as const,
      verificado: cliente.verificado,
      dataJuncao: new Date(cliente.dataRegistro).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      dataNascimento: new Date(cliente.dataNascimento).toLocaleDateString('pt-BR'),
      totalPedidos: cliente._count.pedidos,
      totalAvaliacoes: cliente._count.avaliacoes,
      temEmpresa: cliente.empresas.length > 0,
      empresa: cliente.empresas.length > 0 ? {
        id: cliente.empresas[0]?.id || 0,
        nome: cliente.empresas[0]?.nomeFantasia || '',
        razaoSocial: cliente.empresas[0]?.razaoSocial || '',
      } : null
    }));

    res.json({
      success: true,
      usuarios: usuariosFormatados,
      total: usuariosFormatados.length
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};