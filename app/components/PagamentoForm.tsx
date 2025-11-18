'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Upload } from 'lucide-react';

interface Imovel {
  id: number;
  titulo: string;
}

export default function PagamentoForm() {
  const [form, setForm] = useState({
    imovelId: '',
    valor: '',
    dataPagamento: new Date().toISOString().split('T')[0], // Default to today
    dataVencimento: '',
    descricao: '',
    status: 'PAGO',
    metodo: 'PIX',
    comprovante: '',
  });
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchImoveis() {
      const res = await fetch('/api/imoveis');
      const data = await res.json();
      setImoveis(data);
    }
    fetchImoveis();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // O resultado é uma string em base64
        setForm(prev => ({ ...prev, comprovante: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, comprovante: '' }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/pagamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          valor: parseFloat(form.valor),
          imovelId: parseInt(form.imovelId),
          // Garante que a data de vencimento seja nula se não for preenchida
          dataVencimento: form.dataVencimento ? new Date(form.dataVencimento) : null,
        }),
      });
      // Limpa o formulário e força a atualização da lista
      setForm({
        imovelId: '', valor: '',
        dataPagamento: new Date().toISOString().split('T')[0],
        dataVencimento: '', descricao: '',
        status: 'PAGO', metodo: 'PIX',
        comprovante: ''
      });
      (document.getElementById('comprovante') as HTMLInputElement).value = ''; // Limpa o input de arquivo
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      // Adicionar feedback de erro para o usuário aqui
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Novo Pagamento</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Imóvel */}
          <div>
            <label htmlFor="imovelId" className="block text-sm font-medium text-gray-700 mb-1">Imóvel *</label>
            <select id="imovelId" name="imovelId" value={form.imovelId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione um imóvel</option>
              {imoveis.map(imovel => (
                <option key={imovel.id} value={imovel.id}>{imovel.titulo}</option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
            <input type="number" id="valor" name="valor" step="0.01" placeholder="Ex: 1200.00" value={form.valor} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Data de Pagamento */}
          <div>
            <label htmlFor="dataPagamento" className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento *</label>
            <input type="date" id="dataPagamento" name="dataPagamento" value={form.dataPagamento} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Data de Vencimento */}
          <div>
            <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento (Opcional)</label>
            <input type="date" id="dataVencimento" name="dataVencimento" value={form.dataVencimento} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="PAGO">Pago</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
          </div>

          {/* Método de Pagamento */}
          <div>
            <label htmlFor="metodo" className="block text-sm font-medium text-gray-700 mb-1">Método *</label>
            <select id="metodo" name="metodo" value={form.metodo} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="PIX">PIX</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="TRANSFERENCIA">Transferência</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
            <input type="text" id="descricao" name="descricao" placeholder="Ex: Aluguel de Janeiro" value={form.descricao} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Comprovante */}
          <div className="md:col-span-1 lg:col-span-3">
            <label htmlFor="comprovante" className="block text-sm font-medium text-gray-700 mb-1">Comprovante (Opcional)</label>
            <input type="file" id="comprovante" name="comprovante" onChange={handleFileChange} accept="image/*,.pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? 'Adicionando...' : 'Adicionar Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
}