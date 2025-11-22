"use client";

import React, { useState } from 'react';
import PageWrapper from '../../components/PageWrapper';

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
    <PageWrapper title="Gerar PIX">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
          <input 
            type="text"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input 
              type="text"
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
            <input 
              type="text"
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
          <input 
            type="text"
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Gerando...' : 'Gerar PIX'}
          </button>
        </div>
        {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-lg w-96 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">PIX Gerado</h3>
            {qrBase64 ? (
              <img src={`data:image/png;base64,${qrBase64}`} alt="QR" className="w-full max-w-sm mx-auto" />
            ) : (
              <div className="p-3 bg-gray-100 rounded">QR não disponível</div>
            )}
            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              <button 
                onClick={copyQrText} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Copiar Código
              </button>
              <button 
                onClick={downloadQr} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Baixar Imagem
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Fechar
              </button>
            </div>
            {qrText && (
              <pre className="mt-4 text-left bg-gray-50 p-3 rounded text-xs overflow-x-auto">{qrText}</pre>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
