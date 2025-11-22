"use client";

import React, { useEffect, useState } from 'react';
import PageWrapper from '@/app/components/PageWrapper';
import { RefreshCw, Copy, Download } from 'lucide-react';

type PixItem = {
  id: number;
  mpPaymentId?: string | null;
  payerFirstName?: string | null;
  payerLastName?: string | null;
  valor?: number | null;
  createdAt?: string | null;
  qrCodeText?: string | null;
  qrCodeBase64?: string | null;
  mpData?: any;
  mpStatus?: string | null;
};

function CopyQrButton({ item }: { item: PixItem }) {
  const getQr = () => {
    return (
      item.qrCodeText ||
      item.mpData?.point_of_interaction?.transaction_data?.qr_code ||
      item.mpData?.qr_code ||
      null
    );
  };

  const handleCopy = async () => {
    const qr = getQr();
    if (!qr) {
      alert('QR não disponível para este registro.');
      return;
    }

    try {
      await navigator.clipboard.writeText(qr);
      alert('Código QR copiado para a área de transferência.');
    } catch (err) {
      console.error('Erro ao copiar QR:', err);
      alert('Falha ao copiar o código QR.');
    }
  };

  const hasQr = !!getQr();

  return (
    <div className="flex gap-2 flex-wrap">
      <button 
        onClick={handleCopy} 
        disabled={!hasQr}
        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Copy size={14} />
        <span>Copiar QR</span>
      </button>
      {item.qrCodeBase64 && (
        <a
          href={`data:image/png;base64,${item.qrCodeBase64}`}
          download={`pix-${item.id}.png`}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          <Download size={14} />
          <span>Imagem</span>
        </a>
      )}
    </div>
  );
}

export default function PixListPage() {
  const [items, setItems] = useState<PixItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/pix/list');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro carregando listagem de Pix:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function renderStatus(s?: string | null) {
    if (!s) return <span className="text-gray-400">—</span>;
    if (s === 'approved') return <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">✅ APROVADO</span>;
    if (s === 'pending') return <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">⏳ PENDENTE</span>;
    if (s === 'rejected') return <span className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">❌ REJEITADO</span>;
    if (s.startsWith('error:')) return <span className="text-red-600 text-xs">Erro na consulta</span>;
    return <span className="text-gray-600 text-xs">{s}</span>;
  }

  return (
    <PageWrapper
      title="Listagem de PIX"
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
              <th className="text-left p-3 text-sm font-semibold text-gray-700">MP Payment ID</th>
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
                  Nenhum PIX encontrado.
                </td>
              </tr>
            )}

            {items.map((it) => (
              <tr key={it.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-sm">{it.id}</td>
                <td className="p-3 text-sm">{it.mpPaymentId ?? '—'}</td>
                <td className="p-3 text-sm">{`${it.payerFirstName ?? ''} ${it.payerLastName ?? ''}`.trim() || '—'}</td>
                <td className="p-3 text-sm text-right">{it.valor != null ? `R$ ${Number(it.valor).toFixed(2)}` : '—'}</td>
                <td className="p-3 text-sm">{it.createdAt ? new Date(it.createdAt).toLocaleString() : '—'}</td>
                <td className="p-3 text-sm">{renderStatus(it.mpStatus)}</td>
                <td className="p-3 text-sm">
                  <CopyQrButton item={it} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
