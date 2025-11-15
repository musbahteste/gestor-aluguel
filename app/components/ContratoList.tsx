'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function downloadPDF(contratoId: number, setError: (msg: string) => void) {
  fetch('/api/contratos/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contratoId })
  })
    .then(async res => {
      if (res.headers.get('content-type')?.includes('application/pdf')) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrato-${contratoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setError('');
      } else {
        const error = await res.json();
        setError(error.error || 'Falha ao gerar PDF.');
      }
    })
    .catch(() => setError('Falha ao gerar PDF.'));
}

export default function ContratoList() {
  const { data, error } = useSWR('/api/contratos', fetcher);
  const [pdfError, setPdfError] = useState('');

  if (error) return <div>Erro ao carregar contratos.</div>;
  if (!data) return <div>Carregando...</div>;

  return (
    <ul className="space-y-2">
      {data.map((contrato: any) => (
        <li key={contrato.id} className="card">
          <strong>Contrato #{contrato.id}</strong>
          <div>Imóvel: {contrato.imovel?.titulo}</div>
          <div>Locador: {contrato.locador?.nome}</div>
          <div>Locatário: {contrato.locatario?.nome}</div>
          <pre className="bg-gray-100 p-2 mt-2">{contrato.conteudoGerado}</pre>
          <button style={{ marginTop: 16 }} onClick={() => downloadPDF(contrato.id, setPdfError)}>
            Gerar PDF
          </button>
          {pdfError && <div style={{ color: 'red', marginTop: 8 }}>{pdfError}</div>}
        </li>
      ))}
    </ul>
  );
}
