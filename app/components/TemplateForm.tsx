'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TemplateForm() {
  const [form, setForm] = useState({
    nome: '',
    conteudo: ''
  });
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    router.push('/templates');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input name="nome" placeholder="Nome do Template" value={form.nome} onChange={handleChange} className="border p-2 w-full" required />
      <textarea name="conteudo" placeholder="Conteúdo do Template" value={form.conteudo} onChange={handleChange} className="border p-2 w-full" rows={6} required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
}
