'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Imovel {
  id: number;
  titulo: string;
  valorAluguel: number;
  locador: { nome: string };
}

const TIPOS_GASTO = [
  'pintura',
  'iptu',
  'manutencao',
  'limpeza',
  'reparos',
  'outro'
];

export default function GastoForm({ onSave }: { onSave?: () => void }) {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imovelId: '',
    tipo: 'manutencao',
    descricao: '',
    valor: '',
    dataGasto: new Date().toISOString().split('T')[0],
    arquivo: '',
  });

  useEffect(() => {
    fetchImoveis();
  }, []);

  const fetchImoveis = async () => {
    try {
      const res = await fetch('/api/imoveis');
      const data = await res.json();
      setImoveis(data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imovelId: formData.imovelId ? parseInt(formData.imovelId) : null,
          valor: parseFloat(formData.valor),
        }),
      });

      if (res.ok) {
        setFormData({
          imovelId: '',
          tipo: 'manutencao',
          descricao: '',
          valor: '',
          dataGasto: new Date().toISOString().split('T')[0],
          arquivo: '',
        });
        alert('Gasto lançado com sucesso!');
        onSave?.();
      } else {
        alert('Erro ao lançar gasto');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao lançar gasto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Lançar Novo Gasto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imóvel *
            </label>
            <select
              name="imovelId"
              value={formData.imovelId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um imóvel</option>
              {imoveis.map(imovel => (
                <option key={imovel.id} value={imovel.id}>
                  {imovel.titulo} - {imovel.locador.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Gasto *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TIPOS_GASTO.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor *
            </label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data do Gasto *
            </label>
            <input
              type="date"
              name="dataGasto"
              value={formData.dataGasto}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição detalhada do gasto..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL do Arquivo/Comprovante
          </label>
          <input
            type="text"
            name="arquivo"
            value={formData.arquivo}
            onChange={handleChange}
            placeholder="Link ou caminho do arquivo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Lançar Gasto'}
        </button>
      </form>
    </div>
  );
}
