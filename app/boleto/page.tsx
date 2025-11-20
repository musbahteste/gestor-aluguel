"use client";

import React, { useEffect, useState } from 'react';

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
    if (!status) return <span style={badgeStyle('#999')}>-</span>;
    if (status === 'approved') return <span style={badgeStyle('#16a34a')}>✅ PAGAMENTO APROVADO!</span>;
    if (status === 'pending') return <span style={badgeStyle('#f59e0b')}>⏳ Ainda em aberto.</span>;
    if (status === 'rejected') return <span style={badgeStyle('#dc2626')}>❌ Rejeitado/Cancelado.</span>;
    return <span style={badgeStyle('#6b7280')}>{status}</span>;
  }

  const containerStyle: React.CSSProperties = { padding: 24, fontFamily: 'Inter, system-ui, Arial, sans-serif' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 };
  const cardStyle: React.CSSProperties = { background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
  const tableHeaderStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 8px', color: '#374151', fontSize: 14 };

  function badgeStyle(bg: string) {
    return {
      display: 'inline-block',
      padding: '6px 10px',
      borderRadius: 9999,
      background: bg,
      color: '#fff',
      fontWeight: 600,
      fontSize: 13,
    } as React.CSSProperties;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0 }}>Boletos Gerados</h1>
        <div>
          <button onClick={load} disabled={loading} style={{ padding: '8px 12px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none' }}>
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>MP ID</th>
                <th style={tableHeaderStyle}>Nome</th>
                <th style={tableHeaderStyle}>Valor (R$)</th>
                <th style={tableHeaderStyle}>Vencimento</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {boletos.map((b, idx) => (
                <tr key={b.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#fbfdff' }}>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>{b.id}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>{b.mpPaymentId}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>{`${b.payerFirstName} ${b.payerLastName}`}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>{Number(b.valor).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>{b.vencimento ? new Date(b.vencimento).toLocaleString() : '-'}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>{getStatusBadge(b.mpStatus ?? null)}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>
                    <a href={b.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600 }}>Ver boleto</a>
                  </td>
                </tr>
              ))}
              {boletos.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>
                    Nenhum boleto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
