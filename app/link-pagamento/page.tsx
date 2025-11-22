"use client";

import React, { useEffect, useState } from 'react';
import PageWrapper from '@/app/components/PageWrapper';
import { RefreshCw, Copy, ExternalLink, Info } from 'lucide-react';

type LinkItem = {
  id: number;
  preferenceId: string;
  firstName: string;
  lastName: string;
  valor: number;
  link: string;
  createdAt?: string | null;
  mpStatus?: string | null;
  mpData?: any;
  mpPaymentId?: string | null;
  mpPaymentType?: string | null;
  mpStatusLabel?: string | null;
  mpStatusEmoji?: string | null;
  mpStatusMessage?: string | null;
};

export default function LinkPagamentoList() {
  const [items, setItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/link-pagamento/list');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar links:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const copyLink = async (link?: string) => {
    if (!link) return alert('Link não disponível');
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copiado');
    } catch (err) {
      console.error('Erro copiando link:', err);
      alert('Falha ao copiar link');
    }
  };

  function renderStatus(s?: string | null) {
    if (!s) return <span className="text-gray-400">—</span>;
    if (s === 'approved') return <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">✅ APROVADO</span>;
    if (s === 'pending') return <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">⏳ PENDENTE</span>;
    if (s === 'rejected') return <span className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">❌ REJEITADO</span>;
    if (s.startsWith('error:')) return <span className="text-red-600 text-xs">Erro</span>;
    return <span className="text-gray-600 text-xs">{s}</span>;
  }

  return (
    <PageWrapper
      title="Listagem de Links de Pagamento"
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
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Preference ID</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Nome</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-700">Valor</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Criado em</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Nenhum link encontrado.
                </td>
              </tr>
            )}

            {items.map((it) => (
              <tr key={it.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-sm">{it.id}</td>
                <td className="p-3 text-sm font-mono text-xs text-gray-600">{it.preferenceId}</td>
                <td className="p-3 text-sm">{`${it.firstName} ${it.lastName}`}</td>
                <td className="p-3 text-sm text-right">{`R$ ${Number(it.valor).toFixed(2)}`}</td>
                <td className="p-3 text-sm">{it.createdAt ? new Date(it.createdAt).toLocaleString() : '—'}</td>
                <td className="p-3 text-sm">
                  {it.mpData?._mapped ? (
                    <div>
                      <div className="font-semibold text-sm">{it.mpData._mapped.statusEmoji} {it.mpData._mapped.statusLabel?.toUpperCase()}</div>
                      <div className="text-xs text-gray-600">{it.mpData._mapped.statusMessage}</div>
                    </div>
                  ) : (
                    renderStatus(it.mpStatus)
                  )}
                </td>
                <td className="p-3 text-sm">
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => copyLink(it.link)}
                      className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      <Copy size={12} />
                      <span>Link</span>
                    </button>
                    <a 
                      href={it.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>Abrir</span>
                    </a>
                    {it.mpData && (
                      <button 
                        onClick={() => alert(JSON.stringify(it.mpData, null, 2))}
                        className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                      >
                        <Info size={12} />
                        <span>Dados</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
