'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContratoGenerator() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [locadores, setLocadores] = useState<any[]>([]);
  const [locatarios, setLocatarios] = useState<any[]>([]);
  const [form, setForm] = useState({
    templateId: '',
    imovelId: '',
    locadorId: '',
    locatarioId: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/templates').then(res => res.json()).then(setTemplates);
    fetch('/api/imoveis').then(res => res.json()).then(setImoveis);
    fetch('/api/locadores').then(res => res.json()).then(setLocadores);
    fetch('/api/locatarios').then(res => res.json()).then(setLocatarios);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/contratos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: parseInt(form.templateId),
        imovelId: parseInt(form.imovelId),
        locadorId: parseInt(form.locadorId),
        locatarioId: parseInt(form.locatarioId)
      })
    });
    router.push('/contratos');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <select name="templateId" value={form.templateId} onChange={handleChange} className="border p-2 w-full" required>
        <option value="">Selecione o template</option>
        {templates.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
      </select>
      <select name="imovelId" value={form.imovelId} onChange={handleChange} className="border p-2 w-full" required>
        <option value="">Selecione o imóvel</option>
        {imoveis.map(i => <option key={i.id} value={i.id}>{i.titulo}</option>)}
      </select>
      <select name="locadorId" value={form.locadorId} onChange={handleChange} className="border p-2 w-full" required>
        <option value="">Selecione o locador</option>
        {locadores.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
      </select>
      <select name="locatarioId" value={form.locatarioId} onChange={handleChange} className="border p-2 w-full" required>
        <option value="">Selecione o locatário</option>
        {locatarios.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Gerar Contrato</button>
    </form>
  );
}
