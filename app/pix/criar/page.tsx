"use client";

import React, { useState } from 'react';

export default function CriarPixPage() {
  const [amount, setAmount] = useState('75.90');
  const [firstName, setFirstName] = useState('Cliente');
  const [lastName, setLastName] = useState('Pix');
  const [email, setEmail] = useState('cliente_pix@teste.com');
  const [cpf, setCpf] = useState('11111111111');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [qrText, setQrText] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      transaction_amount: parseFloat(amount),
      description: `Cobrança PIX - ${firstName} ${lastName}`,
      payer: {
        email,
        first_name: firstName,
        last_name: lastName,
        identification: { type: 'CPF', number: cpf },
      },
    };

    try {
      const res = await fetch('/api/pix/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erro ao gerar PIX');

      const d = json?.data;
      setQrBase64(d?.qrBase64 ?? null);
      setQrText(d?.qrText ?? null);
      setShowModal(true);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function copyQrText() {
    if (!qrText) return;
    navigator.clipboard.writeText(qrText);
    alert('Código PIX copiado para a área de transferência');
  }

  function downloadQr() {
    if (!qrBase64) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrBase64}`;
    link.download = `pix_qr.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Gerar PIX</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Valor (R$)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label>Nome</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label>Sobrenome</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label>E-mail</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>CPF</label>
          <input value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? 'Gerando...' : 'Gerar PIX'}</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', padding: 16, borderRadius: 8, width: 420, textAlign: 'center' }}>
            <h3>PIX Gerado</h3>
            {qrBase64 ? <img src={`data:image/png;base64,${qrBase64}`} alt="QR" style={{ maxWidth: '100%' }} /> : <div style={{ padding: 12, background: '#f5f5f5' }}>QR não disponível</div>}
            <div style={{ marginTop: 12 }}>
              <button onClick={copyQrText} style={{ marginRight: 8 }}>Copiar Código</button>
              <button onClick={downloadQr} style={{ marginRight: 8 }}>Baixar Imagem</button>
              <button onClick={() => setShowModal(false)}>Fechar</button>
            </div>
            {qrText && <pre style={{ textAlign: 'left', marginTop: 12, background: '#fafafa', padding: 8, borderRadius: 4, overflowX: 'auto' }}>{qrText}</pre>}
          </div>
        </div>
      )}
    </div>
  );
}
