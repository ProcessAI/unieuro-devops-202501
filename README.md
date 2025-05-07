
<h1 align="center">THE PROJECT unieuro-devops-202501 </h1>
<br>
<br>

# 🔹 Descrição do Projeto

<p align="center">
Aplicação full-stack dividida em três módulos principais: 

- `client` (frontend com Next.js), 
- `server` (backend com Express + Prisma) 
- `doc` (documentação técnica). <br>
O objetivo do projeto é simular um ambiente real de e-commerce com autenticação, carrinho de compras e checkout.</p>

---

# 📁 Estrutura de Pastas

```
unieuro-devops-202501/
│
├── client/                     # Frontend com Next.js
│   ├── public/                 # Imagens públicas (logo)
│   ├── src/                    # Código-fonte principal
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── pages/              # Páginas do app (Next.js)
│   │   ├── services/           # Serviços de API
│   │   ├── styles/             # Estilos globais
│   │   └── middleware.ts       # Middleware personalizado
│   ├── package.json            # Dependências do frontend
│   ├── .gitignore              # Arquivos ignorados
│   ├── tsconfig.json           # Configuração TypeScript
│   └── next.config.js          # Configurações do Next.js
│
├── server/                     # Backend com Express e Prisma
│   ├── prisma/                 # Schema do Prisma e migrations
│   │   └── schema.prisma
│   ├── src/
│   │   └── http/               # Lógica principal da API
│   │       └── server.ts
│   ├── docker-compose.yml      # Docker para backend + banco
│   ├── package.json            # Dependências do backend
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── doc/                        # Documentação técnica
│   ├── equipes/                # Arquivos com informações das equipes
│   ├── requisitos/             # Requisitos funcionais e não-funcionais
│   └── extensions/             # Extensões necessárias para o projeto
│
├── .prettierignore
└── .prettierrc
```

---

# 🧠 Tecnologias utilizadas

| Tecnologia       | Função                                        |
|------------------|-----------------------------------------------|
| React / Next.js  | Frontend Web                                  |
| Express.js       | Backend API REST                              |
| TypeScript       | Tipagem estática em todo o projeto            |
| Prisma ORM       | Acesso ao banco de dados PostgreSQL           |
| Docker / Compose | Containerização de backend e banco de dados   |
| PostgreSQL       | Banco de dados relacional                     |
| Git / GitHub     | Versionamento de código                       |

---



# ⚙️ Como rodar o projeto localmente

## Requisitos
- Docker e Docker Compose instalados
- Node.js e npm instalados
- Instalar as extensões (principalmente  Prettier - Code Formatter, Docker, Git Grafic)

## 1. Clonar o repositório

```bash
git clone https://github.com/ProcessAI/unieuro-devops-202501.git
cd unieuro-devops-202501
```

## 2. Subir o backend com Docker

dentro de /server arquivo .env add 
```bash 
DATABASE_URL="postgresql://postgres:docker@localhost:15432/localhost?schema=public"
```

```bash
cd server
npm install
npx prisma generate
# abra o docker na sua maquina para evitar erros
docker-compose up -d  # inicia PostgreSQL
npm run dev
```

A API estará disponível em: `http://localhost:3333`

## 3. Instalar e rodar o frontend

```bash
cd client
npm install
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

## 3. Formatação padrão

Foi configurado o Prettier para padronizar o código, tanto no frontend quanto no backend. <br>
- A formatação pode ser executada com o comando:
<p align="center">⚠️ Esse comando deve ser executado a partir da pasta correta (ou seja, no diretório correspondente ao frontend(client) ou backend(server)).</p>

```bash
npm run format
```

---

# 🐳 Comandos Docker úteis

```bash
# Subir os serviços em segundo plano
docker-compose up -d

# Parar os containers
docker-compose down

# Ver logs do backend
docker-compose logs -f server

# Acessar banco de dados PostgreSQL
docker exec -it unieuro-db psql -U postgres
```

---

# 🧬 Comandos Prisma úteis

```bash
# Instalar o cliente Prisma (caso necessário)
npm install @prisma/client

# Gerar os arquivos do Prisma
npx prisma generate

# Aplicar migrações
npx prisma migrate dev --name init

# Acessar painel visual do banco de dados
npx prisma studio

# Validar conexão e schema
npx prisma validate
```

---

# 📝 Observações Finais

- A lógica de persistência e checkout com validação será implementada futuramente com Prisma.
- Certifique-se de que o banco de dados esteja rodando antes de executar as migrações.

---
<p align="center">
A melhor turma que esta faculdade já teve e terá. SI-2025</p>