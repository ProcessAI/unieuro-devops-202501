// pages/api/usuarios/reativar/[id].tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = parseInt(id as string);

  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      success: false,
      message: 'Método não permitido. Use PUT para reativar usuário.' 
    });
  }

  if (isNaN(userId)) {
    return res.status(400).json({ 
      success: false,
      message: 'ID do usuário inválido' 
    });
  }

  try {
    // Primeiro verifica se o usuário existe
    const usuarioExiste = await prisma.cliente.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true
      }
    });

    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verifica se o usuário já está ativo
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

  } catch (error) {
    console.error('Erro ao reativar usuário:', error);
    
    // Tratamento de erros específicos do Prisma
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
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