'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

interface Locador {
  id: number;
  nome: string;
}

export default function ImovelForm() {
  const [loading, setLoading] = useState(false);
  const [locadores, setLocadores] = useState<Locador[]>([]);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    endereco: '',
    cidade: '',
    bairro: '',
    cep: '',
    valorAluguel: '',
    area: '',
    quartos: '',
    banheiros: '',
    garagem: false,
    locadorId: '', // Começa como string vazia
  });
  const router = useRouter();

  useEffect(() => {
    // Busca a lista de locadores para popular o select
    const fetchLocadores = async () => {
      const res = await fetch('/api/locadores');
      const data = await res.json();
      setLocadores(data);
    };
    fetchLocadores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      router.push('/imoveis');
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar imóvel", error);
      alert("Não foi possível criar o imóvel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da Esquerda */}
          <div className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título do Imóvel *</label>
              <input id="titulo" name="titulo" value={form.titulo} onChange={handleChange} className="w-full input-style" required />
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} className="w-full input-style" rows={4} />
            </div>
            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo *</label>
              <input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} className="w-full input-style" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input id="cidade" name="cidade" value={form.cidade} onChange={handleChange} className="w-full input-style" />
              </div>
              <div>
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} className="w-full input-style" />
              </div>
            </div>
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input id="cep" name="cep" value={form.cep} onChange={handleChange} className="w-full input-style" />
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="space-y-6">
            <div>
              <label htmlFor="valorAluguel" className="block text-sm font-medium text-gray-700 mb-1">Valor do Aluguel (R$) *</label>
              <input id="valorAluguel" name="valorAluguel" type="number" step="0.01" value={form.valorAluguel} onChange={handleChange} className="w-full input-style" required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input id="area" name="area" type="number" value={form.area} onChange={handleChange} className="w-full input-style" />
              </div>
              <div>
                <label htmlFor="quartos" className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                <input id="quartos" name="quartos" type="number" value={form.quartos} onChange={handleChange} className="w-full input-style" />
              </div>
              <div>
                <label htmlFor="banheiros" className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                <input id="banheiros" name="banheiros" type="number" value={form.banheiros} onChange={handleChange} className="w-full input-style" />
              </div>
            </div>
            <div className="flex items-center">
              <input id="garagem" name="garagem" type="checkbox" checked={form.garagem} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="garagem" className="ml-2 block text-sm text-gray-900">Possui Garagem</label>
            </div>
            <div>
              <label htmlFor="locadorId" className="block text-sm font-medium text-gray-700 mb-1">Locador (Proprietário)</label>
              <select id="locadorId" name="locadorId" value={form.locadorId} onChange={handleChange} className="w-full input-style">
                <option value="">Não associar agora</option>
                {locadores.map(locador => (
                  <option key={locador.id} value={locador.id}>{locador.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            <Save size={18} />
            {loading ? 'Salvando...' : 'Salvar Imóvel'}
          </button>
        </div>
      </form>
    </div>
  );
}

