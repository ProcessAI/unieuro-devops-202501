// pages/admin/usuarios.tsx
import { useEffect, useState } from 'react';
import { Search, Filter, Download, UserPlus, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cargo?: string;
  status: 'Ativo' | 'Inativo';
  verificado: boolean;
  dataJuncao: string;
  dataNascimento: string;
  totalPedidos: number;
  totalAvaliacoes: number;
  temEmpresa: boolean;
  empresa?: {
    id: number;
    nome: string;
    razaoSocial: string;
  } | null;
};

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [cargoFilter, setCargoFilter] = useState('Todos');

  // Busca usuários do banco de dados
  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const response = await fetch('/api/usuarios');
        const data = await response.json();
        
        if (data.success && data.usuarios) {
          setUsuarios(data.usuarios);
          setFilteredUsuarios(data.usuarios);
        } else {
          console.error('Erro na resposta da API:', data.message);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    buscarUsuarios();
  }, []);

  // Filtros
  useEffect(() => {
    let filtered = usuarios;

    if (searchTerm) {
      filtered = filtered.filter(usuario =>
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.cpf.includes(searchTerm) ||
        usuario.telefone.includes(searchTerm) ||
        (usuario.empresa?.nome && usuario.empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'Todos') {
      filtered = filtered.filter(usuario => usuario.status === statusFilter);
    }

    if (cargoFilter !== 'Todos') {
      filtered = filtered.filter(usuario => 
        usuario.empresa?.nome === cargoFilter || usuario.cargo === cargoFilter
      );
    }

    setFilteredUsuarios(filtered);
  }, [searchTerm, statusFilter, cargoFilter, usuarios]);

  const cargosUnicos = [...new Set(usuarios.map(u => u.empresa?.nome || u.cargo).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#130F0E] text-white">
      {/* Header */}
      <div className="bg-[#1a1715] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Gerenciamento de usuários</h1>
              <p className="text-gray-400 mt-1">Gerencie os membros da sua equipe e suas permissões de conta aqui.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-white">Desfazer</button>
              <button className="text-gray-400 hover:text-white">Ver perfil</button>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#2a2520] border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DF9829] focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#2a2520] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#DF9829]"
            >
              <option value="Todos">Todos os status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <select
              value={cargoFilter}
              onChange={(e) => setCargoFilter(e.target.value)}
              className="bg-[#2a2520] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#DF9829]"
            >
              <option value="Todos">Todos os cargos</option>
              {cargosUnicos.map(cargo => (
                <option key={cargo} value={cargo}>{cargo}</option>
              ))}
            </select>

            <button className="flex items-center gap-2 bg-[#2a2520] border border-gray-600 rounded-lg px-4 py-2 text-white hover:bg-[#3a332e] transition-colors">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#2a2520] border border-gray-600 rounded-lg px-4 py-2 text-white hover:bg-[#3a332e] transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button className="flex items-center gap-2 bg-[#DF9829] text-black rounded-lg px-4 py-2 font-semibold hover:bg-[#c8851f] transition-colors">
              <UserPlus className="w-4 h-4" />
              Adicionar usuário
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-[#1a1715] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2a2520] border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Nome completo</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Email</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Telefone</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Empresa</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Cadastro</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Pedidos</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-[#2a2520] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#DF9829] to-[#c8851f] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                          {usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{usuario.nome}</span>
                          <span className="text-xs text-gray-400">CPF: {usuario.cpf}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-300">{usuario.email}</span>
                        {usuario.verificado ? (
                          <span className="text-xs text-green-400">✓ Verificado</span>
                        ) : (
                          <span className="text-xs text-red-400">Não verificado</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{usuario.telefone}</td>
                    <td className="py-4 px-6">
                      {usuario.empresa ? (
                        <div className="flex flex-col">
                          <span className="text-gray-300">{usuario.empresa.nome}</span>
                          <span className="text-xs text-gray-500">{usuario.empresa.razaoSocial}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Cliente PF</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.status === 'Ativo' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-red-900 text-red-300'
                      }`}>
                        ● {usuario.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{usuario.dataJuncao}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-300">{usuario.totalPedidos} pedidos</span>
                        <span className="text-xs text-gray-500">{usuario.totalAvaliacoes} avaliações</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-[#3a332e] rounded text-gray-400 hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-[#3a332e] rounded text-gray-400 hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-[#3a332e] rounded text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsuarios.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Nenhum usuário encontrado com os filtros aplicados.</p>
          </div>
        )}

        {/* Paginação */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-gray-400">
            Mostrando {filteredUsuarios.length} de {usuarios.length} usuários
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-[#2a2520] border border-gray-600 rounded text-gray-300 hover:bg-[#3a332e] transition-colors">
              Anterior
            </button>
            <button className="px-3 py-2 bg-[#DF9829] text-black rounded font-semibold">
              1
            </button>
            <button className="px-3 py-2 bg-[#2a2520] border border-gray-600 rounded text-gray-300 hover:bg-[#3a332e] transition-colors">
              2
            </button>
            <button className="px-3 py-2 bg-[#2a2520] border border-gray-600 rounded text-gray-300 hover:bg-[#3a332e] transition-colors">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}