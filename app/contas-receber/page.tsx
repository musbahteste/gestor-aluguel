"use client";

import { useState, useEffect } from 'react';
import PageWrapper from '@/app/components/PageWrapper';

interface ContaReceber {
  id: number;
  contratoId: number;
  dataVencimento: string;
  valor: number;
  status: string;
}

export default function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const res = await fetch('/api/contas-receber');
        if (!res.ok) throw new Error('Erro ao carregar contas a receber.');
        const data: ContaReceber[] = await res.json();
        setContas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContas();
  }, []);

  const marcarComoRecebido = async (id: number, metodo: string) => {
    try {
      const res = await fetch('/api/contas-receber', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, metodo }),
      });

      if (!res.ok) throw new Error('Erro ao marcar como recebido.');

      setContas((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'recebido' } : c)));
    } catch (error) {
      console.error(error);
      alert('Erro ao marcar conta como recebida.');
    }
  };

  if (loading) return <PageWrapper title="Contas a Receber"><div className="text-center py-8 text-gray-500">Carregando contas a receber...</div></PageWrapper>;

  return (
    <PageWrapper title="Contas a Receber">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contas.map((conta) => (
          <div key={conta.id} className="p-6 bg-white border rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500">Contrato #{conta.contratoId}</p>
              <p className="text-lg font-semibold text-gray-800">R$ {conta.valor.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Vencimento: {new Date(conta.dataVencimento).toLocaleDateString()}</p>
              <p className={`text-sm font-medium mt-1 ${conta.status === 'pendente' ? 'text-yellow-600' : 'text-green-600'}`}>
                {conta.status === 'pendente' ? 'Pendente' : 'Recebido'}
              </p>
            </div>
            {conta.status === 'pendente' && (
              <div className="mt-4">
                <label htmlFor={`metodo-${conta.id}`} className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
                <select
                  id={`metodo-${conta.id}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => marcarComoRecebido(conta.id, e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="pix">Pix</option>
                  <option value="boleto">Boleto</option>
                  <option value="transferencia">Transferência</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}