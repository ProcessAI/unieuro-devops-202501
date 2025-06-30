import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { Footer } from '@/components/Footer';
import { Search, Download, UserPlus, Edit, Eye, Trash2 } from 'lucide-react';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  status: 'Ativo' | 'Inativo';
  verificado: boolean;
  dataJuncao: string;
  totalPedidos: number;
  totalAvaliacoes: number;
  empresa?: { id: number; nome: string; razaoSocial: string } | null;
};

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtered, setFiltered] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos');
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch('/api/usuarios', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUsuarios(data.usuarios);
          setFiltered(data.usuarios);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let f = [...usuarios];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      f = f.filter(
        (u) =>
          u.nome.toLowerCase().includes(t) ||
          u.email.toLowerCase().includes(t) ||
          u.cpf.includes(t) ||
          u.telefone.includes(t)
      );
    }
    if (statusFilter !== 'Todos') {
      f = f.filter((u) => u.status === statusFilter);
    }
    setFiltered(f);
  }, [searchTerm, statusFilter, usuarios]);

  const handleSave = async (updated: Usuario) => {
    try {
      const res = await fetch(`/api/admin/usuarios/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw await res.json();
      setUsuarios((us) => us.map((u) => (u.id === updated.id ? updated : u)));
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar usuário');
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/usuarios/${id}/status`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setUsuarios((us) =>
        us.map((u) => (u.id === id ? { ...u, status: data.ativo ? 'Ativo' : 'Inativo' } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status');
    }
  };

  const removeUser = async (id: number) => {
    if (!confirm('Confirma exclusão?')) return;
    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw await res.json();
      setUsuarios((us) => us.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir usuário');
    }
  };

  return (
    <div className="min-h-screen bg-[#130F0E] text-white flex flex-col">
      <header className="bg-[#130F0E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <AdminHeader />
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#2a2520] border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DF9829]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#2a2520] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#DF9829]"
            >
              <option>Todos</option>
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </div>
        </div>

        <div className="bg-[#1a1715] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#2a2520] border-b border-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-300">Nome e CPF</th>
                  <th className="py-4 px-6 text-left text-gray-300">Email / Verif.</th>
                  <th className="py-4 px-6 text-left text-gray-300">Telefone</th>
                  <th className="py-4 px-6 text-left text-gray-300">Empresa</th>
                  <th className="py-4 px-6 text-left text-gray-300">Status</th>
                  <th className="py-4 px-6 text-left text-gray-300">Entrada</th>
                  <th className="py-4 px-6 text-left text-gray-300">Pedidos / Aval.</th>
                  <th className="py-4 px-6 text-left text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[#2a2520]">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DF9829] to-[#c8851f] flex items-center justify-center text-black font-semibold">
                          {u.nome
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{u.nome}</div>
                          <div className="text-xs text-gray-400">CPF: {u.cpf}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div>{u.email}</div>
                        <div
                          className={`text-xs ${u.verificado ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {u.verificado ? '✓ Verificado' : 'Não verificado'}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{u.telefone}</td>
                    <td className="py-4 px-6">
                      {u.empresa ? (
                        <>
                          <div>{u.empresa.nome}</div>
                          <div className="text-xs text-gray-500">{u.empresa.razaoSocial}</div>
                        </>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.status === 'Ativo'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        ● {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">{u.dataJuncao}</td>
                    <td className="py-4 px-6">
                      <div>
                        <div>{u.totalPedidos} pedidos</div>
                        <div className="text-xs text-gray-500">{u.totalAvaliacoes} avaliações</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1 hover:bg-[#3a332e] rounded"
                        >
                          <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>

                        <button
                          onClick={() => toggleStatus(u.id)}
                          className="p-1 hover:bg-[#3a332e] rounded"
                        >
                          <Eye
                            className={`w-4 h-4 ${
                              u.status === 'Ativo'
                                ? 'text-red-400 hover:text-red-600'
                                : 'text-green-400 hover:text-green-600'
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => removeUser(u.id)}
                          disabled={u.totalPedidos > 0 || u.totalAvaliacoes > 0}
                          className="p-1 hover:bg-[#3a332e] rounded disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function EditUserModal({
  user,
  onClose,
  onSave,
}: {
  user: Usuario;
  onClose: () => void;
  onSave: (u: Usuario) => void;
}) {
  const [form, setForm] = useState(user);

  const handleChange = (k: keyof Usuario, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1A1615] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-[#DF9829] mb-4">Editar Usuário #{user.id}</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Nome</label>
            <input
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full bg-[#2a2520] border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full bg-[#2a2520] border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Telefone</label>
            <input
              value={form.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              className="w-full bg-[#2a2520] border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">CPF</label>
            <input
              value={form.cpf}
              onChange={(e) => handleChange('cpf', e.target.value)}
              className="w-full bg-[#2a2520] border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#DF9829] text-black rounded hover:bg-[#c8851f]"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
