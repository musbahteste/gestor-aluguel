"use client";

import React, { useEffect, useState } from 'react';
import PageWrapper from '@/app/components/PageWrapper';
import { RefreshCw } from 'lucide-react';

type BoletoRow = {
  id: number;
  mpPaymentId: string;
  vencimento: string | null;
  url: string;
  valor: number;
  payerFirstName: string;
  payerLastName: string;
  barcode?: string | null;
  createdAt: string;
  mpStatus?: string | null;
};

export default function BoletosPage() {
  const [boletos, setBoletos] = useState<BoletoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/boleto/list');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erro ao carregar');
      const data = (json.data ?? []) as any[];
      setBoletos(
        data.map((d) => ({
          id: d.id,
          mpPaymentId: d.mpPaymentId,
          vencimento: d.vencimento ?? null,
          url: d.url,
          valor: d.valor,
          payerFirstName: d.payerFirstName,
          payerLastName: d.payerLastName,
          barcode: d.barcode,
          createdAt: d.createdAt,
          mpStatus: d.mpStatus ?? null,
        }))
      );
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function getStatusBadge(status: string | null) {
    if (!status) return <span className="inline-block px-3 py-1 rounded-full bg-gray-400 text-white text-sm font-medium">-</span>;
    if (status === 'approved') return <span className="inline-block px-3 py-1 rounded-full bg-green-600 text-white text-sm font-medium">✅ PAGAMENTO APROVADO!</span>;
    if (status === 'pending') return <span className="inline-block px-3 py-1 rounded-full bg-yellow-500 text-white text-sm font-medium">⏳ Ainda em aberto.</span>;
    if (status === 'rejected') return <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium">❌ Rejeitado/Cancelado.</span>;
    return <span className="inline-block px-3 py-1 rounded-full bg-gray-500 text-white text-sm font-medium">{status}</span>;
  }

  return (
    <PageWrapper
      title="Boletos Gerados"
      actionButton={
        <button 
          onClick={load} 
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <RefreshCw size={18} />
          <span>{loading ? 'Carregando...' : 'Atualizar'}</span>
        </button>
      }
    >
      {error && <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">MP ID</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Nome</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Valor (R$)</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Vencimento</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {boletos.map((b, idx) => (
              <tr key={b.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 text-sm border-b border-gray-200">{b.id}</td>
                <td className="p-3 text-sm border-b border-gray-200">{b.mpPaymentId}</td>
                <td className="p-3 text-sm border-b border-gray-200">{`${b.payerFirstName} ${b.payerLastName}`}</td>
                <td className="p-3 text-sm border-b border-gray-200">{Number(b.valor).toFixed(2)}</td>
                <td className="p-3 text-sm border-b border-gray-200">{b.vencimento ? new Date(b.vencimento).toLocaleString() : '-'}</td>
                <td className="p-3 text-sm border-b border-gray-200">{getStatusBadge(b.mpStatus ?? null)}</td>
                <td className="p-3 text-sm border-b border-gray-200">
                  <a href={b.url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Ver boleto</a>
                </td>
              </tr>
            ))}
            {boletos.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Nenhum boleto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
