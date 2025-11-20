"use client";

import React, { useEffect, useState } from 'react';

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
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={handleCopy} disabled={!hasQr}>
        Copiar QR
      </button>
      {item.qrCodeBase64 && (
        <a
          href={`data:image/png;base64,${item.qrCodeBase64}`}
          download={`pix-${item.id}.png`}
          style={{ textDecoration: 'none' }}
        >
          <button>Baixar imagem</button>
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
    if (!s) return '—';
    if (s === 'approved') return '✅ PAGAMENTO APROVADO!';
    if (s === 'pending') return '⏳ Ainda em aberto.';
    if (s === 'rejected') return '❌ Rejeitado/Cancelado.';
    if (s.startsWith('error:')) return `Erro na consulta (${s.replace('error:', '')})`;
    return s;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Listagem de PIX</h1>
        <div>
          <button onClick={load} disabled={loading} style={{ marginRight: 8 }}>
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>MP Payment ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Nome</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Valor</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Criado em</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 12 }}>
                  Nenhum PIX encontrado.
                </td>
              </tr>
            )}

            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{it.id}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{it.mpPaymentId ?? '—'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{`${it.payerFirstName ?? ''} ${it.payerLastName ?? ''}`.trim() || '—'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0', textAlign: 'right' }}>{it.valor != null ? `R$ ${Number(it.valor).toFixed(2)}` : '—'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{it.createdAt ? new Date(it.createdAt).toLocaleString() : '—'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{renderStatus(it.mpStatus)}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  <CopyQrButton item={it} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
