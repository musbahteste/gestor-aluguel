'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';

interface LocadorFormProps {
  locadorId?: number;
}

export default function LocadorForm({ locadorId }: LocadorFormProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Se tem locadorId, está em modo de edição
    if (locadorId) {
      setIsEditing(true);
      const fetchLocador = async () => {
        try {
          const res = await fetch(`/api/locadores/${locadorId}`);
          const data = await res.json();
          setForm({
            nome: data.nome || '',
            cpf: data.cpf || '',
            email: data.email || '',
            telefone: data.telefone || ''
          });
        } catch (error) {
          console.error("Erro ao buscar locador", error);
          alert("Não foi possível carregar os dados do locador.");
        }
      };
      fetchLocador();
    }
  }, [locadorId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/locadores/${locadorId}` : '/api/locadores';
      
      await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      router.push('/locadores');
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar locador", error);
      alert("Não foi possível salvar o locador.");
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input id="nome" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="w-full input-style" required />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input id="cpf" name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} className="w-full input-style" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" name="email" type="email" placeholder="email@exemplo.com" value={form.email} onChange={handleChange} className="w-full input-style" />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input id="telefone" name="telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={handleChange} className="w-full input-style" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={handleCancel} className="flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-gray-500 transition-colors">
            <X size={18} />
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            <Save size={18} />
            {loading ? 'Salvando...' : isEditing ? 'Atualizar Locador' : 'Salvar Locador'}
          </button>
        </div>
      </form>
    </div>
  );
}
