import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = 3333;

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

    return res.status(200).json({ message: 'Login realizado com sucesso.', clienteId: cliente.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no login.' });
  }
});

<<<<<<< HEAD
=======
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


>>>>>>> 607253f (Implementação carrossel dinâmico com dados da API)
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
