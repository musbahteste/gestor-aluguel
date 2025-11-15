'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImovelForm() {
  const [form, setForm] = useState({
    titulo: '',
    endereco: '',
    valorAluguel: '',
    locadorId: ''
  });
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/imoveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        valorAluguel: parseFloat(form.valorAluguel),
        locadorId: parseInt(form.locadorId)
      })
    });
    router.push('/imoveis');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} className="border p-2 w-full" required />
      <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} className="border p-2 w-full" required />
      <input name="valorAluguel" placeholder="Valor do Aluguel" value={form.valorAluguel} onChange={handleChange} className="border p-2 w-full" required type="number" />
      <input name="locadorId" placeholder="ID do Locador" value={form.locadorId} onChange={handleChange} className="border p-2 w-full" required type="number" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
}
