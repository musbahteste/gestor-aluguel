'use client';

import { useState, useEffect } from 'react';

interface Imovel {
  id: number;
  titulo: string;
  valorAluguel: number;
  locador: { nome: string };
}

export default function PagamentoForm({ onSave }: { onSave?: () => void }) {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imovelId: '',
    valor: '',
    dataPagamento: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    descricao: '',
    metodo: 'transferencia',
    status: 'recebido',
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
      const res = await fetch('/api/pagamentos', {
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
          valor: '',
          dataPagamento: new Date().toISOString().split('T')[0],
          dataVencimento: '',
          descricao: '',
          metodo: 'transferencia',
          status: 'recebido',
        });
        alert('Pagamento lançado com sucesso!');
        onSave?.();
      } else {
        alert('Erro ao lançar pagamento');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao lançar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Lançar Novo Pagamento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$) *
            </label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do Pagamento *
            </label>
            <input
              type="date"
              name="dataPagamento"
              value={formData.dataPagamento}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Vencimento
            </label>
            <input
              type="date"
              name="dataVencimento"
              value={formData.dataVencimento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pagamento *
            </label>
            <select
              name="metodo"
              value={formData.metodo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="cheque">Cheque</option>
              <option value="transferencia">Transferência</option>
              <option value="pix">PIX</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recebido">Recebido</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observações sobre o pagamento"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {loading ? 'Salvando...' : 'Lançar Pagamento'}
        </button>
      </form>
    </div>
  );
}
