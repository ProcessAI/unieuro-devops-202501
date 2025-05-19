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

app.get('/cart', (req: Request, res: Response) => {
  try {
    const idsParam = req.body.ids as string;
    if (!idsParam) {
      return res.sendError("Parâmetro 'ids' não informado.", 400);
    }

    // Exemplo de requisição: GET /cart?ids=1,2,3,4

    // Converte a string para um array de números
    const ids = idsParam
      .split(',')
      .map((item) => Number(item))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return res.sendError('Nenhum id válido informado.', 400);
    }

    // TODO: Integração com Prisma para buscar os produtos reais do banco de dados.
    // const products = await prisma.produto.findMany({
    //   where: {
    //     id: { in: idArray },
    //     ativo: true,
    //   },
    //   select: {
    //     id: true,
    //     nome: true,
    //     quantidade: true,
    //     preco: true,
    //     // A primeira imagem da tabela mídia será utilizada como imagem principal.
    //     Midias: {
    //       select: { link: true },
    //       take: 1,
    //     },
    //   },
    // });

    // Dados fictícios para simulação.
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

app.post('/checkout', async (req: Request, res: Response) => {
  try {
    // Espera receber no body um objeto contendo a propriedade "products"
    // que é um array de objetos com { id, quantity }
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

    // Exemplo de payload esperado(em json):
    // {
    //   "products": [
    //     { "id": 1, "quantity": 2 },
    //     { "id": 2, "quantity": 3 },
    //     { "id": 3, "quantity": 1 },
    //     { "id": 4, "quantity": 6 }
    //   ],
    //   "paymentMethod": "card"
    // }

    // TODO: Validação de cada item no banco de dados,
    // verificando estoque, calculando o total, etc.
    //
    // let totalOrder = 0;
    // for (const item of products) {
    //   const product = await prisma.product.findUnique({ where: { id: item.id } });
    //   if (!product) {
    //     return res.sendError(`Produto com ID ${item.id} não encontrado.`, 404);
    //   }
    //   // TODO: Verificação de quantidade disponível de cada item:
    //   if (product.quantidade < item.quantity) {
    //     return res.sendError(`Quantidade solicitada para o produto ${product.nome} não está disponível.`, 400);
    //   }
    //   // TODO: No futuro calculo do preço total, e aplicação de descontos.
    //   totalOrder += Number(product.preco) * item.quantity;
    // }
    //
    // TODO: Como ainda não vamos criar a lógica completa de fechamento de compra (isto é, não vamos
    // inserir registros na tabela Pedido ou chamar a API de pagamento do Assas),
    // retorno apenas uma mensagem de sucesso com os dados recebidos.
    //

    return res.sendSuccess({
      message: 'Carrinho recebido com sucesso.',
      products,
      paymentMethod,
      // total: totalOrder //TODO: Futuramente, calculo do valor total.
    });
  } catch (err) {
    console.error(err);
    return res.sendError('Erro interno no servidor.', 500);
  }
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

    // Gerar o accessToken (token JWT de curta duração)
    const accessToken = jwt.sign(
      { id: cliente.id, email: cliente.email }, // Dados que você quer incluir no token
      process.env.ACCESS_TOKEN_SECRET!, // Chave secreta do seu JWT (deve ser armazenada em uma variável de ambiente)
      { expiresIn: '1h' } // Defina o tempo de expiração do access token
    );

    // Gerar o refreshToken (token de longa duração)
    const refreshToken = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.REFRESH_TOKEN_SECRET!, // Outra chave secreta para o refresh token
      { expiresIn: '365d' } // Defina o tempo de expiração do refresh token
    );

    // Retornar os tokens gerados
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
