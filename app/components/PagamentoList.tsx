'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

interface Pagamento {
  id: number;
  imovelId: number;
  valor: number;
  dataPagamento: string;
  dataVencimento?: string;
  descricao?: string;
  metodo: string;
  status: string;
  imovel: {
    id: number;
    titulo: string;
    locador: { nome: string };
  };
}

export default function PagamentoList({ refresh }: { refresh?: boolean }) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'recebido' | 'pendente' | 'atrasado'>('todos');
  const [selectedImovel, setSelectedImovel] = useState<string>('');

  useEffect(() => {
    fetchPagamentos();
  }, [refresh, filter, selectedImovel]);

  const fetchPagamentos = async () => {
    setLoading(true);
    try {
      let url = '/api/pagamentos';
      const params = new URLSearchParams();
      
      if (selectedImovel) {
        params.append('imovelId', selectedImovel);
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const res = await fetch(url);
      let data = await res.json();

      if (filter !== 'todos') {
        data = data.filter((p: Pagamento) => p.status === filter);
      }

      setPagamentos(data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este pagamento?')) {
      return;
    }

    try {
      const res = await fetch(`/api/pagamentos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPagamentos(pagamentos.filter(p => p.id !== id));
        alert('Pagamento deletado com sucesso!');
      } else {
        alert('Erro ao deletar pagamento');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar pagamento');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-4">Listagem de Pagamentos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="todos">Todos</option>
              <option value="recebido">Recebido</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>
        </div>
      </div>

      {pagamentos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum pagamento encontrado
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Imóvel
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Locador
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Data Pagamento
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pagamentos.map(pagamento => (
                <tr key={pagamento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{pagamento.imovel.titulo}</td>
                  <td className="px-6 py-4 text-sm">{pagamento.imovel.locador?.nome ?? ``}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatCurrency(pagamento.valor)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {formatDate(pagamento.dataPagamento)}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{pagamento.metodo}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pagamento.status)}`}>
                      {getStatusLabel(pagamento.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(pagamento.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
