import dotenv from 'dotenv';

import express, { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import cookieParser from 'cookie-parser';

import cors from 'cors';

import crypto from 'crypto';

import nodemailer from 'nodemailer';

import bcrypt from 'bcrypt';

import { PrismaClient, Prisma } from '@prisma/client';

import axios from 'axios';



dotenv.config();



const app = express();

const PORT = 3333;

const prisma = new PrismaClient();



const billingTypeMap: Record<string, string> = {

  pix: 'PIX',

  card: 'CREDIT_CARD',

  boleto: 'BOLETO',

};



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

    from: {

      name: 'Atacanet',

      address: process.env.SMTP_FROM!,

    },

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

    from: {

      name: 'Atacanet',

      address: process.env.SMTP_FROM!,

    },

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

    origin: ['http://localhost:3000', 'https://atacanet.com.br'],

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

    //   return res.sendError('Acesso negado. Permissões insuficientes.', 403);

    // }



    // If you store admin users in a separate table and want to verify against it:

    // const adminUser = await prisma.admin_users.findUnique({ where: { id: decoded.id } });

    // if (!adminUser) {

    //    return res.sendError('Usuário administrador não encontrado.', 403);

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

      .filter((p: any) => p.preco < p.precoOriginal)

      .map((p: any) => ({

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



    const produtosFormatados = produtosCarrossel.map((produto: any) => ({

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

  console.log('IDs recebidos:', req.query.ids); // Aqui você vai acessar os IDs através de req.query.ids



  try {

    const idsParam = req.query.ids as string; // Pegando os IDs da query string

    if (!idsParam) {

      return res.sendError("Parâmetro 'ids' não informado.", 400);

    }



    const ids = idsParam

      .split(',') // Divida os IDs que são passados como uma string separada por vírgulas

      .map((item) => Number(item))

      .filter((id) => !isNaN(id));



    if (ids.length === 0) {

      return res.sendError('Nenhum id válido informado.', 400);

    }



    const produtos = await prisma.produto.findMany({

      where: {

        id: { in: ids },

      },

      include: {

        Midias: { take: 1 },

      },

    });



    const produtosComDetalhes = produtos.map((produto) => ({

      id: produto.id,

      nome: produto.nome,

      preco: produto.preco,

      precoOriginal: produto.precoOriginal,

      descricao: produto.descricao,

      quantidadeVarejo: produto.quantidadeVarejo,

      imageUrl: produto.Midias[0]?.link || 'default-image-url.jpg',

    }));



    return res.sendSuccess({ products: produtosComDetalhes });

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



app.post('/create-payment-link', async (req: Request, res: Response) => {

  let pedidoId: number | null = null;

  try {

    let token = '';

    const authHeader = String(req.headers.authorization || '');

    if (authHeader.startsWith('Bearer ')) {

      token = authHeader.replace(/^Bearer\s+/, '').trim();

    } else if (req.cookies?.accessToken) {

      token = String(req.cookies.accessToken);

    } else {

      return res.sendError('Token de autenticação não fornecido.', 401);

    }

    let payload: any;

    try {

      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    } catch {

      return res.sendError('Token inválido ou expirado.', 401);

    }

    const userId = Number(payload.id);

    if (!userId) {

      return res.sendError('Token não contém ID de usuário.', 401);

    }



    const { products, paymentMethod } = req.body as {

      products: { id: number; quantity: number }[];

      paymentMethod: 'pix' | 'card' | 'boleto';

    };

    if (!Array.isArray(products) || products.length === 0) {

      return res.sendError('Envie um array de produtos (id + quantity).', 400);

    }

    if (!billingTypeMap[paymentMethod]) {

      return res.sendError('paymentMethod inválido. Use "pix", "card" ou "boleto".', 400);

    }



    const productIds = products.map((p) => p.id);

    const produtosDoBanco = await prisma.produto.findMany({

      where: { id: { in: productIds } },

      select: { id: true, nome: true, preco: true, precoOriginal: true, quantidadeVarejo: true },

    });

    if (produtosDoBanco.length === 0) {

      return res.sendError('Nenhum produto válido encontrado pelo ID.', 400);

    }

    const mapa = new Map<number, { nome: string; preco: number }>();

    produtosDoBanco.forEach((p) =>

      mapa.set(p.id, { nome: p.nome, preco: Number(p.preco.toString()) })

    );



    let valorTotal = 0;

    const descricaoItens: string[] = [];

    for (const item of products) {

      const info = mapa.get(item.id);

      if (!info) {

        return res.sendError(`Produto de ID ${item.id} não encontrado.`, 400);

      }

      let unitPrice = info.preco;

      if (item.quantity >= 3) unitPrice *= 0.9;

      const subTotal = unitPrice * item.quantity;

      valorTotal += subTotal;

      descricaoItens.push(`${info.nome} (x${item.quantity}) → R$ ${subTotal.toFixed(2)}`);

    }

    const valorTotalStr = valorTotal.toFixed(2);



    const novoPedido = await prisma.pedido.create({

      data: {

        clienteId: userId,

        quantidade: products.reduce((sum, i) => sum + i.quantity, 0),

        formaPagamento: paymentMethod,

        status: 'PENDENTE',

        valorPago: 0,

        dataCompra: new Date(),

        produtoId: productIds[0],

      },

    });

    const pedidoId = novoPedido.id;



    const payloadAsaas: any = {

      name: `AtacaNet – Pedido #${pedidoId}`,

      description: `Pedido #${pedidoId}\n${descricaoItens.join('\n')}`,

      value: Number(valorTotalStr),

      billingType: billingTypeMap[paymentMethod],

      chargeType: 'DETACHED',

      callback: {

        successUrl: `${process.env.FRONTEND_URL}/order-confirmation`,

        autoRedirect: true,

      },

    };



    if (paymentMethod === 'boleto') {

      payloadAsaas.dueDateLimitDays = 5;

    }



    const resposta = await axios.post('https://api.asaas.com/v3/paymentLinks', payloadAsaas, {

      headers: {

        'Content-Type': 'application/json',

        access_token: process.env.ASAAS_API_KEY!,

      },

    });



    const asaasLinkId = resposta.data.id.toString();

    await prisma.pedido.update({

      where: { id: pedidoId },

      data: { asaasLinkId },

    });



    return res.sendSuccess({ paymentLinkUrl: resposta.data.paymentLinkUrl });

  } catch (err: any) {

    console.error('Erro em /create-payment-link:', err.response?.data || err);



    if (pedidoId) {

      try {

        await prisma.pedido.update({

          where: { id: pedidoId },

          data: { status: 'CANCELADO' },

        });

        console.log(`Pedido ${pedidoId} cancelado por erro na criação do link.`);

      } catch (updErr) {

        console.error(`Falha ao cancelar pedido ${pedidoId}:`, updErr);

      }

    }



    const message =

      err.response?.data?.errors?.[0]?.description ||

      err.response?.data?.message ||

      'Erro interno ao criar payment link.';

    return res.sendError(message, 500);

  }

});



app.post('/webhook', async (req: any, res: any) => {

  try {

    if (process.env.ASAAS_WEBHOOK_TOKEN) {

      console.warn(

        `[WEBHOOK] Token ausente ou inválido. ASAAS_WEBHOOK_TOKEN: '${process.env.ASAAS_WEBHOOK_TOKEN}'`

      );

      return res.sendStatus(401);

    }



    const event = req.body as any;



    if (

      event.object === 'payment' &&

      (event.event === 'PAYMENT_RECEIVED' || event.event === 'PAYMENT_CONFIRMED')

    ) {

      const pagamento = event.payment;

      const asaasCustomerId = pagamento.customer;

      const externalRef = pagamento.externalReference;

      const valorPago = pagamento.value;

      const dueDate = pagamento.dueDate;



      const pedidoId = parseInt(externalRef, 10);

      if (isNaN(pedidoId)) {

        console.warn('[WEBHOOK] externalReference inválido:', externalRef);

        return res.sendStatus(200);

      }

      const pedidoRegistro = await prisma.pedido.findUnique({

        where: { id: pedidoId },

        include: { Cliente: true },

      });

      if (!pedidoRegistro) {

        console.warn('[WEBHOOK] Pedido não encontrado para externalReference:', externalRef);

        return res.sendStatus(200);

      }



      await prisma.pedido.update({

        where: { id: pedidoRegistro.id },

        data: {

          status: 'pago',

          valorPago: new Prisma.Decimal(valorPago),

          dataCompra: new Date(),

        },

      });



      const invoicePayload = {

        customer: asaasCustomerId,

        billingType: 'INVOICE',

        description: `Nota fiscal para o pedido ${externalRef}`,

        dueDate,

        value: valorPago.toString(),

        externalReference: externalRef,

      };



      const invoiceResponse = await axios.post(

        'https://api.asaas.com/v3/invoices',

        // 'https://api-sandbox.asaas.com/api/v3/invoices',

        invoicePayload,

        {

          headers: {

            'Content-Type': 'application/json',

            access_token: process.env.ASAAS_API_KEY!,

          },

        }

      );

      const invoiceData = invoiceResponse.data;

      const invoicePdfUrl = invoiceData.pdf || invoiceData.invoiceUrl;



      const clienteEmail = pedidoRegistro.Cliente.email;

      const mailOptions = {

        from: {

          name: 'Atacanet',

          address: process.env.SMTP_FROM!,

        },

        to: clienteEmail,

        subject: `Sua nota fiscal - Pedido ${externalRef}`,

        html: `

          <p>Olá ${pedidoRegistro.Cliente.nome},</p>

          <p>Recebemos o pagamento do seu pedido <strong>${externalRef}</strong> (valor R$ ${valorPago.toFixed(

            2

          )}).</p>

          <p>Aqui está a sua nota fiscal:</p>

          <p><a href="${invoicePdfUrl}" target="_blank">Clique para baixar a nota fiscal</a></p>

          <p>Obrigado pela preferência!</p>

        `,

      };

      await transporter.sendMail(mailOptions);

      console.log(`[WEBHOOK] Nota fiscal enviada para ${clienteEmail} (pedido ${externalRef})`);

      return res.sendStatus(200);

    }



    return res.sendStatus(200);

  } catch (err: any) {

    console.error('Erro em /webhook:', err);

    return res.sendStatus(500);

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



/*

app.post('/refresh-token', async (req: Request, res: Response) => {

  try {

    const { refreshToken } = req.cookies as { refreshToken?: string };

    if (!refreshToken) {

      return res.sendError('Refresh token não fornecido.', 401);

    }



    let payload: any;

    try {

      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    } catch {

      return res.sendError('Refresh token inválido ou expirado.', 401);

    }



    const userId = Number(payload.id);

    if (!userId) {

      return res.sendError('Payload de refreshToken inválido.', 401);

    }



    const usuario = await prisma.cliente.findUnique({

      where: { id: userId },

      select: { id: true, email: true },

    });

    if (!usuario) {

      return res.sendError('Usuário não existe.', 401);

    }



    const newAccessToken = jwt.sign(

      { id: usuario.id, email: usuario.email },

      process.env.ACCESS_TOKEN_SECRET!,

      { expiresIn: '2m' }

    );



    res.cookie('accessToken', newAccessToken, {

      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax',

      maxAge: 2 * 60 * 1000, // 2 minutos em milissegundos

    });



    return res.sendSuccess('Token de acesso renovado!');

  } catch (err: any) {

    console.error('Erro em /refresh-token:', err);

    return res.sendError('Erro interno ao renovar token.', 500);

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

*/



app.get('/usuarios', async (req: Request, res: Response) => {

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

          },

        },

        _count: {

          select: {

            pedidos: true,

            avaliacoes: true,

          },

        },

      },

      orderBy: {

        dataRegistro: 'desc',

      },

    });



    const usuariosFormatados = clientes.map((cliente: any) => ({

      id: cliente.id,

      nome: cliente.nome,

      email: cliente.email,

      telefone: cliente.telefone,

      cpf: cliente.cpf,

      cargo: cliente.empresas.length > 0 ? cliente.empresas[0]?.nomeFantasia : null,

      status: cliente.ativo ? ('Ativo' as const) : ('Inativo' as const),

      verificado: cliente.verificado,

      dataJuncao: new Date(cliente.dataRegistro).toLocaleDateString('pt-BR', {

        day: '2-digit',

        month: 'short',

        year: 'numeric',

        hour: '2-digit',

        minute: '2-digit',

      }),

      dataNascimento: new Date(cliente.dataNascimento).toLocaleDateString('pt-BR'),

      totalPedidos: cliente._count.pedidos,

      totalAvaliacoes: cliente._count.avaliacoes,

      temEmpresa: cliente.empresas.length > 0,

      empresa:

        cliente.empresas.length > 0

          ? {

              id: cliente.empresas[0]?.id || 0,

              nome: cliente.empresas[0]?.nomeFantasia || '',

              razaoSocial: cliente.empresas[0]?.razaoSocial || '',

            }

          : null,

    }));



    // ✅ USAR sendSuccess em vez de res.status().json()

    return res.sendSuccess({

      success: true,

      usuarios: usuariosFormatados,

      total: usuariosFormatados.length,

    });

  } catch (error) {

    console.error('Erro ao buscar usuários:', error);

    // ✅ USAR sendError em vez de res.status().json()

    return res.sendError('Erro interno do servidor', 500);

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

    await prisma.$transaction(async (tx: any) => {

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





app.get('/admin/pedidos-status', isAdminAuthenticated, async (req: Request, res: Response) => {

  try {

    const pedidos = await prisma.pedido.findMany({

      where: { status: { in: ['pago', 'cancelado'] } },

      orderBy: { dataCompra: 'asc' },

      select: {

        id: true,

        quantidade: true,

        formaPagamento: true,

        status: true,

        valorPago: true,

        dataCompra: true,

        // Incluindo o nome do Cliente na resposta

        Cliente: {

          select: { nome: true }

        }

      },

    });

    // Note que a sua página de frontend vai precisar usar `pedido.Cliente.nome` agora

    return res.sendSuccess({ pedidos });

  } catch (error) {

    console.error('Erro ao buscar pedidos:', error);

    return res.sendError('Erro ao buscar pedidos.', 500);

  }

});



app.get('/admin/pedidos/:id', isAdminAuthenticated, async (req: Request, res: Response) => {

  const pedidoId = parseInt(req.params.id, 10);

  if (isNaN(pedidoId)) {

    return res.sendError('O ID do pedido deve ser um número.', 400);

  }

  try {

    const pedido = await prisma.pedido.findUnique({

      where: { id: pedidoId },

      include: {

        Cliente: { // Inclui os dados do usuário

          select: {

            nome: true,

            email: true,

          },

        },

      },

    });

    if (!pedido) {

      return res.sendError(`Pedido com ID #${pedidoId} não encontrado.`, 404);

    }

    return res.sendSuccess(pedido);

  } catch (error) {

    console.error(`Erro ao buscar detalhes do pedido #${pedidoId}:`, error);

    return res.sendError('Erro interno ao buscar detalhes do pedido.', 500);

  }

});



app.get('/produto/:id', async (req: Request, res: Response) => {

  const id = Number(req.params.id);



  if (isNaN(id)) {

    return res.sendError('ID inválido.', 400);

  }



  try {

    const produto = await prisma.produto.findUnique({

      where: { id },

      include: {

        Midias: { take: 1 },

        avaliacoes: {

          select: {

            id: true,

            nome: true,

            nota: true,

            texto: true,

          },

        },

      },

    });



    if (!produto) {

      return res.sendError('Produto não encontrado.', 404);

    }



    res.sendSuccess({

      id: produto.id,

      nome: produto.nome,

      descricao: produto.descricao,

      preco: Number(produto.preco),

      precoOriginal: Number(produto.precoOriginal),

      frete: Number(produto.frete),

      modelo: produto.modelo,

      quantidadeVarejo: produto.quantidadeVarejo,

      Midias: produto.Midias,

      avaliacoes: produto.avaliacoes,

    });

  } catch (err) {

    console.error(err);

    return res.sendError('Erro ao buscar produto.', 500);

  }

});



// [R]EAD - Obter todos os produtos

app.get('/admin/produtos', isAdminAuthenticated, async (req: Request, res: Response) => {

  try {

    const produtos = await prisma.produto.findMany({ orderBy: { id: 'asc' } });

    res.sendSuccess(produtos);

  } catch (err: any) {

    console.error('Erro ao buscar produtos:', err);

    res.sendError(`Erro de Base de Dados: ${err.message}`);

  }

});



// [C]REATE - Criar um novo produto

app.post('/admin/produtos', isAdminAuthenticated, async (req: Request, res: Response) => {

  try {

    const { nome, preco, quantidade, ...data } = req.body;

    if (!nome || !preco || !quantidade) {

      return res.sendError('Campos obrigatórios (Nome, Preço, Quantidade) estão faltando.', 400);

    }

    const novoProduto = await prisma.produto.create({ data });

    res.status(201).sendSuccess(novoProduto);

  } catch (err: any) {

    console.error("Erro ao criar produto:", err);

    res.sendError(`Erro de Base de Dados ao criar: ${err.message}`);

  }

});



// [U]PDATE - Atualizar um produto existente

app.put('/admin/produtos/:id', isAdminAuthenticated, async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const produtoAtualizado = await prisma.produto.update({

            where: { id: parseInt(id) },

            data: req.body,

        });

        res.sendSuccess(produtoAtualizado);

      } catch (error: any) {

        console.error(`Erro ao atualizar produto ${id}:`, error);

        if (error.code === 'P2025') {

          return res.sendError(`Produto com ID ${id} não encontrado.`, 404);

        }

        res.sendError(`Erro de Base de Dados ao atualizar: ${error.message}`);

    }

});



// [D]ELETE - Deletar um produto

app.delete('/admin/produtos/:id', isAdminAuthenticated, async (req: Request, res: Response) => {

    const { id } = req.params;

      try {

        await prisma.produto.delete({ where: { id: parseInt(id) } });

        res.status(204).send();

      } catch (error: any) {

        console.error(`Erro ao deletar produto ${id}:`, error);

        if (error.code === 'P2025') {

          return res.sendError(`Produto com ID ${id} não encontrado.`, 404);

        }

        res.sendError(`Erro de Base de Dados ao deletar: ${error.message}`);

    }

});



// server.ts

app.get('/dashboard/estatisticas', async (req: Request, res: Response) => {

  try {

    const hoje = new Date();



    // --- Períodos de comparação -------------------------------------------

    const inicioSemanaAtual   = new Date(hoje); inicioSemanaAtual.setDate(hoje.getDate() - 6);   // 7 dias

    const inicioSemanaPassada = new Date(hoje); inicioSemanaPassada.setDate(hoje.getDate() - 13); // 14 dias

    const inicioMesAtual      = new Date(hoje); inicioMesAtual.setDate(1);                       // dia 1 do mês

    const fimMesPassado       = new Date(inicioMesAtual); fimMesPassado.setDate(0);              // último dia mês-1

    const inicioMesPassado    = new Date(fimMesPassado);  inicioMesPassado.setDate(1);



    // --- Query helpers -----------------------------------------------------

    const sumValorPago = prisma.pedido.aggregate({

      _sum: { valorPago: true }, where: {}    // será sobrescrito

    });

    const countPedidos = prisma.pedido.count({ where: {} });



    // --- Leituras ----------------------------------------------------------

    const [

      somaSemanaAtual,   // vendasSemana

      somaSemanaPassada,

      pedidosSemanaAtual,

      pedidosSemanaPassada,

      somaMesAtual,      // vendasMes

      somaMesPassado,

      pedidosMesAtual,

      pedidosMesPassado,

    ] = await Promise.all([

      prisma.pedido.aggregate({                 // vendas da semana atual

        _sum: { valorPago: true },

        where: { dataCompra: { gte: inicioSemanaAtual, lte: hoje } },

      }),

      prisma.pedido.aggregate({                 // vendas da semana passada

        _sum: { valorPago: true },

        where: { dataCompra: { gte: inicioSemanaPassada, lt: inicioSemanaAtual } },

      }),

      prisma.pedido.count({                     // pedidos da semana atual

        where: { dataCompra: { gte: inicioSemanaAtual, lte: hoje } },

      }),

      prisma.pedido.count({                     // pedidos da semana passada

        where: { dataCompra: { gte: inicioSemanaPassada, lt: inicioSemanaAtual } },

      }),

      prisma.pedido.aggregate({                 // vendas do mês atual

        _sum: { valorPago: true },

        where: { dataCompra: { gte: inicioMesAtual, lte: hoje } },

      }),

      prisma.pedido.aggregate({                 // vendas do mês passado

        _sum: { valorPago: true },

        where: { dataCompra: { gte: inicioMesPassado, lte: fimMesPassado } },

      }),

      prisma.pedido.count({                     // pedidos do mês atual

        where: { dataCompra: { gte: inicioMesAtual, lte: hoje } },

      }),

      prisma.pedido.count({                     // pedidos do mês passado

        where: { dataCompra: { gte: inicioMesPassado, lte: fimMesPassado } },

      }),

    ]);



    // --- Função de % -------------------------------------------------------

    const calcPct = (atual: number, anterior: number) =>

      anterior === 0 ? (atual === 0 ? 0 : 100) : ((atual - anterior) / anterior) * 100;



    // --- Payload -----------------------------------------------------------

    res.sendSuccess({

      vendasSemana:  Number(somaSemanaAtual._sum.valorPago || 0),

      pedidosSemana: pedidosSemanaAtual,

      vendasMes:     Number(somaMesAtual._sum.valorPago || 0),

      pedidosMes:    pedidosMesAtual,



      pctVendasSemana:  calcPct(Number(somaSemanaAtual._sum.valorPago || 0),

                               Number(somaSemanaPassada._sum.valorPago || 0)),

      pctPedidosSemana: calcPct(pedidosSemanaAtual, pedidosSemanaPassada),

      pctVendasMes:    calcPct(Number(somaMesAtual._sum.valorPago || 0),

                               Number(somaMesPassado._sum.valorPago || 0)),

      pctPedidosMes:   calcPct(pedidosMesAtual, pedidosMesPassado),

    });

  } catch (err) {

    console.error(err);

    res.sendError('Erro ao carregar estatísticas do dashboard.', 500);

  }

});





app.get('/dashboard/vendas-mensais', async (req, res) => {

  const agora = new Date();

  const anoAtual = agora.getFullYear();



  try {

    const pedidos = await prisma.pedido.findMany({

      where: {

        dataCompra: {

          gte: new Date(`${anoAtual}-01-01T00:00:00Z`),

          lte: new Date(`${anoAtual}-12-31T23:59:59Z`),

        },

      },

      select: {

        dataCompra: true,

        valorPago: true,

      },

    });



    const vendasPorMes = Array.from({ length: 12 }, (_, i) => ({

      month: new Date(anoAtual, i).toLocaleString('pt-BR', { month: 'short' }),

      value: 0,

    }));



    for (const pedido of pedidos) {

      const mes = new Date(pedido.dataCompra).getMonth();

      vendasPorMes[mes].value += Number(pedido.valorPago);

    }



    res.status(200).json({ vendas: vendasPorMes });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: 'Erro ao carregar vendas mensais.' });

  }

});



app.get('/dashboard/categorias-vendas', async (req, res) => {

  const filtro = (req.query.filtro as string) ?? 'mes';

  const agora   = new Date();

  let inicio: Date;

  let fim   : Date;



  switch (filtro) {

    case 'dia': {             // hoje

      inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0);

      fim    = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59);

      break;

    }

    case 'semana': {          // segunda-feira 00:00 → domingo 23:59

      // getDay(): 0=domingo … 6=sábado  → converte para ISO (segunda=0)

      const diaSemana = (agora.getDay() + 6) % 7;         // 0-6

      inicio = new Date(agora);

      inicio.setDate(agora.getDate() - diaSemana);        // volta até segunda

      inicio.setHours(0, 0, 0, 0);



      fim = new Date(inicio);

      fim.setDate(inicio.getDate() + 6);                  // domingo

      fim.setHours(23, 59, 59, 999);

      break;

    }

    case 'ano': {            // primeiro → último dia do ano

      inicio = new Date(agora.getFullYear(), 0, 1, 0, 0, 0);

      fim    = new Date(agora.getFullYear(), 11, 31, 23, 59, 59);

      break;

    }

    default: {               // 'mes' (padrão)

      inicio = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0);

      fim    = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);

    }

  }



  try {

    const agrupado = await prisma.pedido.groupBy({

      where: { dataCompra: { gte: inicio, lte: fim } },

      by   : ['produtoId'],

      _sum : { quantidade: true },

    });



    const produtos = await prisma.produto.findMany({

      where  : { id: { in: agrupado.map((v) => v.produtoId) } },

      include: { Categoria: { select: { nome: true } } },

    });



    const somaPorCategoria = new Map<string, number>();



    for (const venda of agrupado) {

      const produto       = produtos.find((p) => p.id === venda.produtoId);

      const categoriaNome = produto?.Categoria?.nome;

      if (!categoriaNome) continue;



      const atual = somaPorCategoria.get(categoriaNome) || 0;

      somaPorCategoria.set(categoriaNome, atual + (venda._sum.quantidade || 0));

    }



    const resultado = Array.from(somaPorCategoria, ([name, value]) => ({ name, value }));



    res.status(200).json(resultado);

  } catch (err) {

    console.error('Erro ao buscar categorias mais vendidas:', err);

    res.status(500).json({ message: 'Erro ao buscar categorias mais vendidas.' });

  }

});



app.listen(PORT, () => {

  console.log(`Servidor rodando na porta ${PORT}`);

});