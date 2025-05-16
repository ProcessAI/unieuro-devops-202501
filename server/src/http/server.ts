import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = 3333;
const prisma = new PrismaClient();

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
        desconto: Math.round(((Number(p.precoOriginal) - Number(p.preco)) / Number(p.precoOriginal)) * 100),
        minQuantity: p.quantidadeVarejo,
        image: p.Midias[0]?.link || null,
      }));

    return res.sendSuccess({ produtos: ofertas });
  } catch (err) {
    console.error(err);
    return res.sendError('Erro ao buscar ofertas do dia.', 500);
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

// 🔐 Login (mantido como estava)
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const cliente = await prisma.cliente.findUnique({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ message: 'E-mail não cadastrado.' });
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

// 🧍 Cadastro (mantido como estava)
app.post('/register', async (req: any, res: any) => {
  const { nome, email, senha, telefone, dataNascimento, cpf } = req.body;

  if (!nome || !email || !senha || !telefone || !dataNascimento || !cpf) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const clienteExistente = await prisma.cliente.findUnique({ where: { email } });
    if (clienteExistente) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const cpfExistente = await prisma.cliente.findUnique({ where: { cpf } });
    if (cpfExistente) {
      return res.status(400).json({ message: 'CPF já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone,
        dataNascimento: new Date(dataNascimento),
        cpf,
        ativo: true,
        dataRegistro: new Date(),
      },
    });

    return res.status(201).json({
      message: 'Conta criada com sucesso.',
      cliente: {
        id: novoCliente.id,
        nome: novoCliente.nome,
        email: novoCliente.email,
        telefone: novoCliente.telefone,
        cpf: novoCliente.cpf,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar conta.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
