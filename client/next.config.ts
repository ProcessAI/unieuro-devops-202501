// client/next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Para rotas específicas sem o prefixo /api
      {
        source: '/carrossel',
        destination: 'http://localhost:3333/carrossel',
      },
      {
        source: '/ofertas',
        destination: 'http://localhost:3333/ofertas',
      },
      // 🆕 NOVA ROTA ADICIONADA - Usuários (específica antes da genérica)
      {
        source: '/api/usuarios/:path*',
        destination: 'http://localhost:3333/usuarios/:path*',
      },
      // Rota genérica - MANTIDA COMO ESTAVA
      // Se você tem outras rotas no backend que o frontend acessa
      // e quer usar um prefixo /api para elas via axios, por exemplo:
      {
        source: '/api/:path*',
        destination: 'http://localhost:3333/:path*',
      },
      // Ou se suas rotas de autenticação já estão diretamente no backend sem /api
      // e você quer acessá-las no frontend com /login, /register etc., via axios com baseURL /
      // precisaria de reescritas para elas também se o backend não estiver sob /api
      // Exemplo se auth.ts tivesse baseURL: '/' e chamasse API.post('/login', ...)
      // {
      //   source: '/login',
      //   destination: 'http://localhost:3333/login',
      // },
      // {
      //   source: '/register',
      //   destination: 'http://localhost:3333/register',
      // },
      // ... e assim por diante para todas as rotas do backend
    ];
  },
};

export default nextConfig;