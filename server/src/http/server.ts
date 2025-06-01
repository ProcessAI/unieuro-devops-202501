import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = 3333;
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Minha Loja" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Valide seu e-mail',
    html: `
      <p>Olá!</p>
      <p>Clique no link abaixo para validar sua conta:</p>
      <a href="${verifyUrl}">Clique aqui para validar</a>
      <p>Esse link expira em 24 horas.</p>
    `,
  });
}

async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Minha Loja" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Redefinição de senha',
    html: `
      <p>Olá!</p>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}">Redefinir senha</a>
      <p>Esse link expira em 1 hora.</p>
    `,
  });
}

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendSuccess = (data: any) => {
    res.status(200).json(data);
  };
  res.sendError = (message: string, status: number = 500) => {
    res.status(status).json({ message });
  };
  next();
});


const isAdminAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken; // Or however you pass the admin token

  if (!token) {
    return res.sendError('Acesso não autorizado.', 401);
  }

  try {
    // Ensure you're using the correct secret for admin tokens
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    
    // Add a check for admin role/level if it's part of your JWT payload
    // For example, if your admin JWT payload includes 'nivel' or 'role':
    // if (decoded.nivel !== 'administrador' && decoded.role !== 'admin') {
    //   return res.sendError('Acesso negado. Permissões insuficientes.', 403);
    // }
    
    // If you store admin users in a separate table and want to verify against it:
    // const adminUser = await prisma.admin_users.findUnique({ where: { id: decoded.id } });
    // if (!adminUser) {
    //    return res.sendError('Usuário administrador não encontrado.', 403);
    // }

    // req.user = decoded; // Attach user info to request if needed later
    next();
  } catch (error) {
    return res.sendError('Token inválido ou expirado.', 403);
  }
};

// rota pedido aprovado
app.get('/admin/pedido-aprovado', isAdminAuthenticated, async (req: Request, res: Response) => {
  const { pedidoId } = req.body;

  if (!pedidoId) {
    return res.sendError('ID do pedido não informado.', 400);
  }

  try {
    const pedido = await prisma.pedido.update({
      where: { id: pedidoId },
      data: { status: 'APROVADO' },
    });

    return res.sendSuccess({ message: 'Pedido aprovado com sucesso.', pedido });
  } catch (error) {
    console.error(error);
    return res.sendError('Erro ao aprovar o pedido.', 500);
  }
});
// rota pedido aprovado

// ✅ NOVA ROTA: Ofertas do Dia
app.get('/ofertas', async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        ativo: true,
      },
      include: {
        Midias: {
          take: 1,
        },
      },
    });

    const ofertas = produtos
      .filter((p) => p.preco < p.precoOriginal)
      .map((p) => ({
        id: p.id,
        nome: p.nome,
        preco: Number(p.preco),
        precoOriginal: Number(p.precoOriginal),
        desconto: Math.round(
          ((Number(p.precoOriginal) - Number(p.preco)) / Number(p.precoOriginal)) * 100
        ),
        minQuantity: p.quantidadeVarejo,
        image: p.Midias[0]?.link || null,
      }));

    return res.sendSuccess({ produtos: ofertas });
  } catch (err) {
    console.error(err);
    return res.sendError('Erro ao buscar ofertas do dia.', 500);
  }
});

app.get('/carrossel', async (req: Request, res: Response) => {
  try {
    const produtosCarrossel = await prisma.produto.findMany({
      where: {
        ativo: true,
      },
      include: {
        Midias: {
          take: 1,
        },
      },
    });

    const produtosFormatados = produtosCarrossel.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.Midias[0]?.link || null,
      descricao: produto.descricao || null,
    }));

    res.json(produtosFormatados);
  } catch (error: any) {
    console.error('Erro ao buscar produtos para o carrossel:', error);
    res.status(500).json({ error: 'Erro ao buscar os produtos.' });
  } finally {
    await prisma.$disconnect();
  }
});

// 🛒 Carrinho (mantido como estava)
app.get('/cart', async (req: Request, res: Response) => {
  try {
    const idsParam = req.body.ids as string;
    if (!idsParam) {
      return res.sendError("Parâmetro 'ids' não informado.", 400);
    }

    const ids = idsParam
      .split(',')
      .map((item) => Number(item))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return res.sendError('Nenhum id válido informado.', 400);
    }

    const dummyProducts = ids.map((id) => ({
      id,
      nome: `Produto ${id}`,
      quantidade: Math.floor(Math.random() * 10) + 1,
      preco: Number((Math.random() * 100).toFixed(2)),
      imageUrl: `https://picsum.photos/seed/${id}/200/200`,
    }));

    return res.sendSuccess({ products: dummyProducts });
  } catch (err) {
    console.error(err);
    return res.sendError('Erro interno no servidor ao listar os produtos.', 500);
  }
});

// 🧾 Checkout (mantido como estava)
app.post('/checkout', async (req: Request, res: Response) => {
  const { products, paymentMethod } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.sendError('Payload inválido. Envie um array de produtos.', 400);
  }

  if (!paymentMethod) {
    return res.sendError('Forma de pagamento não informada ou inválida.', 400);
  }

  const allowedPaymentMethods = ['pix', 'card', 'boleto'];
  if (!allowedPaymentMethods.includes(paymentMethod.toLowerCase())) {
    return res.sendError(
      'Forma de pagamento inválida. Opções disponíveis: pix, card, boleto.',
      400
    );
  }

  return res.sendSuccess({
    message: 'Carrinho recebido com sucesso.',
    products,
    paymentMethod,
  });
});

app.post('/login', async (req: any, res: any) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const cliente = await prisma.cliente.findUnique({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ message: 'E-mail não cadastrado.' });
    }

    if (!cliente.verificado) {
      return res.status(401).json({
        message: 'Conta não validada. Verifique seu e-mail antes de entrar.',
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const accessToken = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '365d' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no login.' });
  }
});

//login administrativo
app.post('/admin/login', async (req: any, res: any) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // Busca o administrador no banco de dados
    const admin = await prisma.admin_users.findUnique({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin não cadastrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, nivel: admin.nivel_acesso },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, email: admin.email, nivel: admin.nivel_acesso },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '365d' }
    );

    return res.status(200).json({
      message: 'Login administrativo realizado com sucesso.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no login administrativo.' });
  }
});

// 🧍 Cadastro (mantido como estava)
app.post('/register', async (req: any, res: any) => {
  const { nome, email, senha, telefone, dataNascimento, cpf } = req.body;

  // 1) Validação de campos obrigatórios
  if (!nome || !email || !senha || !telefone || !dataNascimento || !cpf) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // 2) Transação: tudo aqui dentro é atômico
    await prisma.$transaction(async (tx) => {
      // 2.1) Checar duplicatas
      const [existsEmail, existsCpf] = await Promise.all([
        tx.cliente.findUnique({ where: { email } }),
        tx.cliente.findUnique({ where: { cpf } }),
      ]);

      if (existsEmail) {
        // lanço pra cair no catch e voltar 400
        throw new Error('E-mail já cadastrado.');
      }
      if (existsCpf) {
        throw new Error('CPF já cadastrado.');
      }

      // 2.2) Hash de senha e criação do cliente
      const senhaHash = await bcrypt.hash(senha, 10);
      const novoCliente = await tx.cliente.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          telefone,
          dataNascimento: new Date(`${dataNascimento}T00:00:00`),
          cpf,
          ativo: true,
          dataRegistro: new Date(),
        },
      });

      // 2.3) Gerar token e atualizar no cliente
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24h
      await tx.cliente.update({
        where: { id: novoCliente.id },
        data: {
          tokenVerificacao: token,
          tokenExpiracao: expires,
        },
      });

      // 2.4) Enviar e-mail de verificação
      // Se isso der erro, lança e faz rollback de tudo acima
      await sendVerificationEmail(novoCliente.email, token);
    });

    // 3) Se chegou aqui, tudo deu certo
    return res.status(201).json({
      message: 'Conta criada! Verifique seu e-mail para ativar a conta.',
    });
  } catch (err: any) {
    console.error('Erro no /register:', err);

    // Se foi erro de "já cadastrado", devolvo 400; senão 500
    const isClientError =
      err.message === 'E-mail já cadastrado.' || err.message === 'CPF já cadastrado.';
    return res
      .status(isClientError ? 400 : 500)
      .json({ message: err.message || 'Erro ao criar conta.' });
  }
});

app.get('/verify-email', async (req, res) => {
  const { token } = req.query as { token?: string };
  if (!token) return res.sendError('Token ausente.', 400);

  const cliente = await prisma.cliente.findFirst({
    where: {
      tokenVerificacao: token,
      tokenExpiracao: { gte: new Date() }, // ainda não expirou
    },
  });
  if (!cliente) return res.sendError('Link inválido ou expirado.', 400);

  await prisma.cliente.update({
    where: { id: cliente.id },
    data: {
      verificado: true,
      tokenVerificacao: null,
      tokenExpiracao: null,
    },
  });

  // Aqui você pode redirecionar para uma página de confirmação no frontend
  return res.sendSuccess({ message: 'E-mail verificado com sucesso!' });
});

app.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.sendError('E-mail é obrigatório.', 400);

  const cliente = await prisma.cliente.findUnique({ where: { email } });
  if (!cliente) return res.sendError('E-mail não cadastrado.', 404);
  if (cliente.verificado) return res.sendError('Conta já validada.', 400);

  // gera novo token
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.cliente.update({
    where: { id: cliente.id },
    data: { tokenVerificacao: token, tokenExpiracao: expires },
  });

  await sendVerificationEmail(email, token);
  return res.sendSuccess({
    message: 'Novo e-mail de verificação enviado.',
  });
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.sendError('E-mail obrigatório.', 400);

  const cliente = await prisma.cliente.findUnique({ where: { email } });
  if (!cliente) return res.sendError('E-mail não cadastrado.', 404);

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.cliente.update({
    where: { id: cliente.id },
    data: {
      tokenRedefinicao: token,
      tokenRedefinicaoExpira: expires,
    },
  });

  await sendResetPasswordEmail(email, token);
  return res.sendSuccess({ message: 'E-mail de redefinição enviado.' });
});

app.get('/validate-reset-token', async (req, res) => {
  const { token } = req.query as { token?: string };
  if (!token) return res.sendError('Token ausente.', 400);

  const cliente = await prisma.cliente.findFirst({
    where: {
      tokenRedefinicao: token,
      tokenRedefinicaoExpira: { gte: new Date() },
    },
  });

  if (!cliente) {
    return res.sendError('Link inválido ou expirado.', 400);
  }

  return res.sendSuccess({ message: 'Token válido.' });
});

app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.sendError('Token e senha são obrigatórios.', 400);

  const cliente = await prisma.cliente.findFirst({
    where: {
      tokenRedefinicao: token,
      tokenRedefinicaoExpira: { gte: new Date() },
    },
  });
  if (!cliente) return res.sendError('Token inválido ou expirado.', 400);

  const senhaHash = await bcrypt.hash(password, 10);
  await prisma.cliente.update({
    where: { id: cliente.id },
    data: {
      senha: senhaHash,
      tokenRedefinicao: null,
      tokenRedefinicaoExpira: null,
    },
  });

  return res.sendSuccess({ message: 'Senha redefinida com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
