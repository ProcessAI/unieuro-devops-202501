import { useState, FC, FormEvent, ChangeEvent, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

// DEFINIÇÕES DE TIPOS
interface Categoria {
    id: number;
    nome: string;
}

interface Marca {
    id: number;
    nome: string;
}

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    precoOriginal: number;
    frete: number;
    ativo: boolean;
    categoriaId: number | null;
    marcaId: number | null;
    modelo: string;
    numeroModelo: string;
    condicao: string;
    dimensoes: string;
    garantia: string;
    voltagem: string;
    localizacaoProduto: string;
    quantidade: number;
    quantidadeVarejo: number;
    categoria?: Categoria; 
    marca?: Marca;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/admin';

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const AdminProdutosPage: FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [produtosRes, categoriasRes, marcasRes] = await Promise.all([
                    fetch(`${API_URL}/produtos`),
                    fetch(`${API_URL}/categorias`),
                    fetch(`${API_URL}/marcas`),
                ]);

                if (!produtosRes.ok || !categoriasRes.ok || !marcasRes.ok) {
                    throw new Error('Falha ao buscar dados!');
                }

                const [produtosData, categoriasData, marcasData] = await Promise.all([
                    produtosRes.json(),
                    categoriasRes.json(),
                    marcasRes.json(),
                ]);

                setProdutos(produtosData);
                setCategorias(categoriasData);
                setMarcas(marcasData);

            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // O array vazio [] garante que isso rode apenas uma vez, quando o componente montar.


    // Funções para abrir/fechar o modal
    const abrirModal = (produto: Produto | null = null) => {
        setProdutoEmEdicao(produto);
        setIsModalOpen(true);
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setProdutoEmEdicao(null);
    };

    // Função para salvar (criar ou atualizar) um produto
    const handleSave = async (produtoData: Omit<Produto, 'id' | 'categoria' | 'marca'>) => {
        try {
            const method = produtoEmEdicao ? 'PUT' : 'POST';
            const url = produtoEmEdicao ? `${API_URL}/produtos/${produtoEmEdicao.id}` : `${API_URL}/produtos`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoData),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || 'Falha ao salvar o produto.');
            }

            const produtoSalvo: Produto = await response.json();
            
            if (produtoEmEdicao) {
                setProdutos(produtos.map(p => p.id === produtoSalvo.id ? produtoSalvo : p));
            } else {
                setProdutos([...produtos, produtoSalvo]);
            }
            fecharModal();
            setError(null);
        } catch (err) {
            console.error("Erro ao salvar produto:", err);
            setError((err as Error).message);
        }
    };

    // Função para deletar um produto
    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                const response = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.error || 'Falha ao deletar o produto.');
                }
                setProdutos(produtos.filter(p => p.id !== id));
                setError(null);
            } catch (err) {
                console.error("Erro ao deletar produto:", err);
                setError((err as Error).message);
            }
        }
    };
    
    // RENDERIZAÇÃO
    return (
        <div className="bg-[#130F0E] min-h-screen font-sans text-[#FFFFFF]">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#FFFFFF]">Painel de Produtos</h1>
                        <p className="text-gray-400 mt-1">Gerencie os produtos da Atacanet</p>
                    </div>
                    <button
                        onClick={() => abrirModal()}
                        className="mt-4 sm:mt-0 flex items-center bg-[#DF9829] text-black font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-400 transition duration-300"
                    >
                        <Plus size={20} className="mr-2" />
                        Adicionar Produto
                    </button>
                </header>
                
                {/* Lógica de exibição de Loading/Erro/Conteúdo */}
                {isLoading ? (
                    <div className="text-center text-gray-400 py-10">Carregando produtos...</div>
                ) : error ? (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>
                ) : (
                    <TabelaProdutos 
                        produtos={produtos} 
                        onEdit={abrirModal} 
                        onDelete={handleDelete} 
                    />
                )}


                {isModalOpen && (
                    <Modal onClose={fecharModal}>
                        <FormProduto 
                            produtoInicial={produtoEmEdicao}
                            categorias={categorias}
                            marcas={marcas}
                            onSave={handleSave}
                            onCancel={fecharModal}
                        />
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default AdminProdutosPage;

// COMPONENTES FILHOS

interface TabelaProdutosProps {
    produtos: Produto[];
    onEdit: (produto: Produto) => void;
    onDelete: (id: number) => void;
}
const TabelaProdutos: FC<TabelaProdutosProps> = ({ produtos, onEdit, onDelete }) => {
    if (produtos.length === 0) {
        return <p className="text-center text-gray-400 py-10 bg-[#1A1615] rounded-xl shadow-lg">Nenhum produto cadastrado ainda.</p>;
    }
    
    return (
        <div className="bg-[#1A1615] rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">Categoria</th>
                            <th scope="col" className="px-6 py-3">Preço</th>
                            <th scope="col" className="px-6 py-3">Qtd</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto) => (
                            <tr key={produto.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-white">{produto.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{produto.nome}</td>
                                <td className="px-6 py-4">{produto.categoria?.nome || 'N/A'}</td>
                                <td className="px-6 py-4">R$ {Number(produto.preco).toFixed(2)}</td>
                                <td className="px-6 py-4">{produto.quantidade}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        produto.ativo ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {produto.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onEdit(produto)} className="text-[#DF9829] hover:text-orange-400 mr-4">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => onDelete(produto.id)} className="text-red-500 hover:text-red-400">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface FormProdutoProps {
    produtoInicial: Produto | null;
    categorias: Categoria[];
    marcas: Marca[];
    onSave: (data: Omit<Produto, 'id' | 'categoria' | 'marca'>) => void;
    onCancel: () => void;
}
const FormProduto: FC<FormProdutoProps> = ({ produtoInicial, categorias, marcas, onSave, onCancel }) => {
    const initialState = {
        nome: '', descricao: '', preco: 0, precoOriginal: 0, frete: 0, ativo: true,
        categoriaId: null, marcaId: null, modelo: '', numeroModelo: '', condicao: 'Novo',
        dimensoes: '', garantia: '', voltagem: '', localizacaoProduto: '',
        quantidade: 0, quantidadeVarejo: 0,
        ...produtoInicial
    };
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { id, categoria, marca, ...dataToSave } = formData;
        onSave(dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-6">{produtoInicial ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="nome" label="Nome do Produto" value={formData.nome} onChange={handleChange} required />
                <Input name="modelo" label="Modelo" value={formData.modelo} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <textarea id="descricao" name="descricao" rows={3} value={formData.descricao} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:ring-orange-500 focus:border-orange-500" required></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="categoriaId" label="Categoria" value={formData.categoriaId ?? ''} onChange={handleChange} options={categorias} />
                <Select name="marcaId" label="Marca" value={formData.marcaId ?? ''} onChange={handleChange} options={marcas} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Input name="preco" label="Preço de Venda" type="number" step="0.01" value={formData.preco} onChange={handleChange} required />
                 <Input name="precoOriginal" label="Preço Original" type="number" step="0.01" value={formData.precoOriginal} onChange={handleChange} required />
                 <Input name="frete" label="Frete" type="number" step="0.01" value={formData.frete} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input name="quantidade" label="Quantidade (Atacado)" type="number" value={formData.quantidade} onChange={handleChange} required />
                 <Input name="quantidadeVarejo" label="Quantidade (Varejo)" type="number" value={formData.quantidadeVarejo} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="numeroModelo" label="Número do Modelo" value={formData.numeroModelo} onChange={handleChange} required />
                <Input name="dimensoes" label="Dimensões (Ex: 10x20x30cm)" value={formData.dimensoes} onChange={handleChange} required />
                <Input name="voltagem" label="Voltagem" value={formData.voltagem} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="garantia" label="Garantia (Ex: 12 meses)" value={formData.garantia} onChange={handleChange} required />
                <Input name="localizacaoProduto" label="Localização no Estoque" value={formData.localizacaoProduto} onChange={handleChange} required />
                <Select name="condicao" label="Condição" value={formData.condicao} onChange={handleChange} options={[{id: 'Novo', nome: 'Novo'}, {id: 'Usado', nome: 'Usado'}, {id: 'Recondicionado', nome: 'Recondicionado'}]} required />
            </div>
            <div className="flex items-center">
                <input id="ativo" name="ativo" type="checkbox" checked={formData.ativo} onChange={handleChange} className="h-4 w-4 text-[#DF9829] bg-gray-700 border-gray-600 rounded focus:ring-[#DF9829]" />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-300">Produto Ativo</label>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300">Cancelar</button>
                <button type="submit" className="bg-[#DF9829] text-black font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-400 transition duration-300">Salvar Produto</button>
            </div>
        </form>
    );
};

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}
const Modal: FC<ModalProps> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
        <div className="bg-[#1A1615] rounded-xl shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto border border-gray-700">
            <div className="p-6 sm:p-8 relative">
               <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
               {children}
            </div>
        </div>
    </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; }
const Input: FC<InputProps> = ({ name, label, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input id={name} name={name} {...props} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:ring-orange-500 focus:border-orange-500" />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { id: string | number; nome: string }[];
}
const Select: FC<SelectProps> = ({ name, label, options, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select id={name} name={name} {...props} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:ring-orange-500 focus:border-orange-500">
            <option value="">Selecione...</option>
            {options.map(option => (
                <option key={option.id} value={option.id}>{option.nome}</option>
            ))}
        </select>
    </div>
);