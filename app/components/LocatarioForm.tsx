'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LocatarioForm() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: ''
  });
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/locatarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="border p-2 w-full" required />
      <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} className="border p-2 w-full" />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
      <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
}
