"use client";

import React, { useEffect, useState } from 'react';

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
    // convenience mapped fields (from API)
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
    if (!s) return '—';
    if (s === 'approved') return '✅ APROVADO';
    if (s === 'pending') return '⏳ PENDENTE';
    if (s === 'rejected') return '❌ REJEITADO';
    if (s.startsWith('error:')) return `Erro (${s.replace('error:', '')})`;
    return s;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Listagem de Links de Pagamento</h1>
        <div>
          <button onClick={load} disabled={loading}>{loading ? 'Carregando...' : 'Atualizar'}</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Preference ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Nome</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Valor</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Criado em</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 12 }}>Nenhum link encontrado.</td>
              </tr>
            )}

            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{it.id}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{it.preferenceId}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{`${it.firstName} ${it.lastName}`}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0', textAlign: 'right' }}>{`R$ ${Number(it.valor).toFixed(2)}`}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{it.createdAt ? new Date(it.createdAt).toLocaleString() : '—'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  {it.mpData?._mapped ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>{it.mpData._mapped.statusEmoji} {it.mpData._mapped.statusLabel?.toUpperCase()}</div>
                      <div style={{ fontSize: 12 }}>{it.mpData._mapped.statusMessage}</div>
                    </div>
                  ) : (
                    renderStatus(it.mpStatus)
                  )}
                </td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => copyLink(it.link)}>Copiar link</button>
                    <a href={it.link} target="_blank" rel="noreferrer"><button>Abrir</button></a>
                    {it.mpData && (
                      <button onClick={() => alert(JSON.stringify(it.mpData, null, 2))}>Ver MP data</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
