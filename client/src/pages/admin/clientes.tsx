import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastContext'; //
import { Header } from '@/components/Header'; //
import { Footer } from '@/components/Footer'; //

// Define o tipo de dados para um cliente, com base no schema do Prisma
type Cliente = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  tipoConta: 'VAREJO' | 'ATACADO';
};

export default function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Efeito para buscar os dados dos clientes assim que a página carregar
  useEffect(() => {
    // A rota '/api/admin/clientes' será redirecionada pelo next.config.ts para o backend
    fetch('/api/admin/clientes') //
      .then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao buscar clientes. Verifique se o backend está rodando.');
        }
        return res.json();
      })
      .then((data) => {
        setClientes(data.clientes);
      })
      .catch((error) => {
        showToast(error.message || 'Erro de rede ao carregar clientes.', { duration: 6000 });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Função para lidar com o clique no botão de aprovação
  const handleApprove = async (clienteId: number) => {
    try {
      const res = await fetch(`/api/admin/clientes/${clienteId}/aprovar-atacado`, {
        method: 'PATCH',
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message);
        // Atualiza o estado local para refletir a mudança sem recarregar a página
        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.id === clienteId ? { ...cliente, tipoConta: 'ATACADO' } : cliente
          )
        );
      } else {
        showToast(data.message || 'Ocorreu um erro ao aprovar o cliente.', { duration: 5000 });
      }
    } catch {
      showToast('Falha de rede. Não foi possível aprovar o cliente.', { duration: 5000 });
    }
  };

  // Renderiza um estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0705] text-white flex justify-center items-center">
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0705] text-white">
      {/* Layout principal */}
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-6 text-[#DF9829]">Gerenciamento de Clientes</h1>
        
        {/* Container da tabela */}
        <div className="bg-[#1A1615] rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 bg-[#130F0E]">
                <th className="p-4">Nome</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-800 hover:bg-[#1F1A19] transition-colors">
                  <td className="p-4">{cliente.nome}</td>
                  <td className="p-4">{cliente.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cliente.tipoConta === 'ATACADO'
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {cliente.tipoConta}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleApprove(cliente.id)}
                      disabled={cliente.tipoConta === 'ATACADO'}
                      className="bg-[#DF9829] text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#C77714] transition"
                    >
                      {cliente.tipoConta === 'ATACADO' ? 'Aprovado' : 'Aprovar p/ Atacado'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> 
        </div> 
      </main>
      <Footer />
    </div>
  );
}