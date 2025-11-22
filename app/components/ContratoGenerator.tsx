'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

// Tipos para os dados que virão da API
interface SelectOption {
  id: number;
  nome: string;
}

interface ImovelOption {
  id: number;
  titulo: string;
}

export default function ContratoGenerator() {
  const [templates, setTemplates] = useState<SelectOption[]>([]);
  const [imoveis, setImoveis] = useState<ImovelOption[]>([]);
  const [locadores, setLocadores] = useState<SelectOption[]>([]);
  const [locatarios, setLocatarios] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    templateId: '',
    imovelId: '',
    locadorId: '',
    locatarioId: '',
    dataVencimento: '',
    valorReceber: '',
    tempoContrato: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usando Promise.all para buscar todos os dados em paralelo
        const [templatesRes, imoveisRes, locadoresRes, locatariosRes] = await Promise.all([
          fetch('/api/templates'),
          fetch('/api/imoveis'),
          fetch('/api/locadores'),
          fetch('/api/locatarios'),
        ]);

        // Verificando se todas as respostas foram bem-sucedidas
        if (!templatesRes.ok || !imoveisRes.ok || !locadoresRes.ok || !locatariosRes.ok) {
          throw new Error('Falha ao buscar dados iniciais para o formulário.');
        }

        const templatesData = await templatesRes.json();
        const imoveisData = await imoveisRes.json();
        const locadoresData = await locadoresRes.json();
        const locatariosData = await locatariosRes.json();

        // Garantindo que os dados são arrays antes de definir o estado
        setTemplates(Array.isArray(templatesData) ? templatesData : []);
        setImoveis(Array.isArray(imoveisData) ? imoveisData : []);
        setLocadores(Array.isArray(locadoresData) ? locadoresData : []);
        setLocatarios(Array.isArray(locatariosData) ? locatariosData : []);

      } catch (error) {
        console.error(error);
        // Em caso de erro, definimos os estados como arrays vazios para evitar que a UI quebre
        setTemplates([]);
        setImoveis([]);
        setLocadores([]);
        setLocatarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: parseInt(form.templateId),
          imovelId: parseInt(form.imovelId),
          locadorId: parseInt(form.locadorId),
          locatarioId: parseInt(form.locatarioId),
          dataVencimento: form.dataVencimento,
          valorReceber: parseFloat(form.valorReceber),
          tempoContrato: parseInt(form.tempoContrato)
        })
      });

      if (res.ok) {
        router.push('/contratos');
        router.refresh();
      } else {
        alert('Erro ao gerar contrato.');
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      alert('Erro ao gerar contrato.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = "w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="templateId" className="block text-sm font-medium text-gray-700 mb-1">Template do Contrato *</label>
          <select id="templateId" name="templateId" value={form.templateId} onChange={handleChange} className={inputStyle} required>
            <option value="">Selecione o template</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="imovelId" className="block text-sm font-medium text-gray-700 mb-1">Imóvel *</label>
          <select id="imovelId" name="imovelId" value={form.imovelId} onChange={handleChange} className={inputStyle} required>
            <option value="">Selecione o imóvel</option>
            {imoveis.map(i => <option key={i.id} value={i.id}>{i.titulo}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="locadorId" className="block text-sm font-medium text-gray-700 mb-1">Locador (Proprietário) *</label>
          <select id="locadorId" name="locadorId" value={form.locadorId} onChange={handleChange} className={inputStyle} required>
            <option value="">Selecione o locador</option>
            {locadores.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="locatarioId" className="block text-sm font-medium text-gray-700 mb-1">Locatário (Inquilino) *</label>
          <select id="locatarioId" name="locatarioId" value={form.locatarioId} onChange={handleChange} className={inputStyle} required>
            <option value="">Selecione o locatário</option>
            {locatarios.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
          <input
            type="date"
            id="dataVencimento"
            name="dataVencimento"
            value={form.dataVencimento}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="valorReceber" className="block text-sm font-medium text-gray-700 mb-1">Valor a Receber *</label>
          <input
            type="number"
            step="0.01"
            id="valorReceber"
            name="valorReceber"
            value={form.valorReceber}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="tempoContrato" className="block text-sm font-medium text-gray-700 mb-1">Tempo de Contrato (meses) *</label>
          <input
            type="number"
            id="tempoContrato"
            name="tempoContrato"
            value={form.tempoContrato}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? 'Gerando...' : 'Gerar Contrato'}
          </button>
        </div>
      </form>
    </div>
  );
}
