// server/src/routes/usuarios.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/usuarios - Lista todos os usuários
export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    // Busca todos os clientes com informações relevantes
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
        // Inclui dados das empresas relacionadas (se houver)
        empresas: {
          select: {
            id: true,
            nomeFantasia: true,
            razaoSocial: true,
          }
        },
        // Conta quantos pedidos o cliente fez
        _count: {
          select: {
            pedidos: true,
            avaliacoes: true,
          }
        }
      },
      orderBy: {
        dataRegistro: 'desc' // Mais recentes primeiro
      }
    });

    // Formatar dados para o frontend
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

    res.status(200).json({
      success: true,
      usuarios: usuariosFormatados,
      total: usuariosFormatados.length
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
};

// GET /api/usuarios/:id - Detalhes de um usuário
export const obterUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID do usuário inválido' });
  }

  try {
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
          take: 10 // Últimos 10 pedidos
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
          take: 5 // Últimas 5 avaliações
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
  } catch (error: unknown) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  } finally {
    await prisma.$disconnect();
  }
};

// PUT /api/usuarios/:id - Editar usuário
export const editarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);
  const { nome, email, telefone, ativo } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID do usuário inválido' });
  }

  try {
    // Validações básicas
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
  } catch (error: unknown) {
    console.error('Erro ao editar usuário:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if ((error as any).code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso por outro usuário'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  } finally {
    await prisma.$disconnect();
  }
};

// DELETE /api/usuarios/:id - Desativar usuário
export const desativarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID do usuário inválido' });
  }

  try {
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
  } catch (error: unknown) {
    console.error('Erro ao desativar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  } finally {
    await prisma.$disconnect();
  }
};

// PUT /api/usuarios/reativar/:id - Reativar usuário
export const reativarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID do usuário inválido' });
  }

  try {
    // Verificar se usuário existe
    const usuarioExiste = await prisma.cliente.findUnique({
      where: { id: userId },
      select: { id: true, nome: true, email: true, ativo: true }
    });

    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (usuarioExiste.ativo) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já está ativo'
      });
    }

    // Reativar usuário
    const usuarioReativado = await prisma.cliente.update({
      where: { id: userId },
      data: { ativo: true }
    });

    res.status(200).json({
      success: true,
      message: 'Usuário reativado com sucesso',
      usuario: {
        id: usuarioReativado.id,
        nome: usuarioReativado.nome,
        email: usuarioReativado.email,
        ativo: usuarioReativado.ativo,
        dataReativacao: new Date().toISOString()
      }
    });
  } catch (error: unknown) {
    console.error('Erro ao reativar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  } finally {
    await prisma.$disconnect();
  }
};