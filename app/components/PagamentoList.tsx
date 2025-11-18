'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, MoreVertical, Building, Calendar, DollarSign, User } from 'lucide-react';

interface Pagamento {
  id: number;
  valor: number;
  dataVencimento: string;
  status: string;
  imovel: {
    titulo: string;
    locatario: { nome: string } | null;
  };
}

const statusColors: { [key: string]: string } = {
  PAGO: 'bg-green-100 text-green-800',
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  ATRASADO: 'bg-red-100 text-red-800',
};

export default function PagamentoList() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPagamentos() {
      const res = await fetch('/api/pagamentos');
      const data = await res.json();
      setPagamentos(data);
    }
    fetchPagamentos();
  }, []); // A lista será atualizada via router.refresh()

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este pagamento?')) {
      await fetch(`/api/pagamentos/${id}`, { method: 'DELETE' });
      router.refresh();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Pagamentos Agendados</h2>
      </div>

      {/* Layout de Cards para Mobile */}
      <div className="md:hidden">
        <div className="space-y-4 p-4">
          {pagamentos.map(p => (
            <div key={p.id} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex justify-between items-start">
                <div className="font-bold text-gray-800">{p.imovel.titulo}</div>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[p.status] || 'bg-gray-100 text-gray-800'}`}>
                  {p.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p className="flex items-center"><DollarSign size={14} className="mr-2" /> {formatCurrency(p.valor)}</p>
                <p className="flex items-center"><Calendar size={14} className="mr-2" /> Vence em: {formatDate(p.dataVencimento)}</p>
                {p.imovel.locatario && <p className="flex items-center"><User size={14} className="mr-2" /> {p.imovel.locatario.nome}</p>}
              </div>
              <div className="flex justify-end gap-2 mt-3">
                 <button onClick={() => router.push(`/pagamentos/editar/${p.id}`)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                 <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout de Tabela para Desktop */}
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-600">Imóvel</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Locatário</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Vencimento</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Valor</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pagamentos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-800">{p.imovel.titulo}</td>
                <td className="p-4 text-sm text-gray-600">{p.imovel.locatario?.nome || 'N/A'}</td>
                <td className="p-4 text-sm text-gray-600">{formatDate(p.dataVencimento)}</td>
                <td className="p-4 text-sm text-gray-800 font-medium">{formatCurrency(p.valor)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[p.status] || 'bg-gray-100 text-gray-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => router.push(`/pagamentos/editar/${p.id}`)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}