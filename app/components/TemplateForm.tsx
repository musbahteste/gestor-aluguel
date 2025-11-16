'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Building, User, Home, Calendar, Save } from 'lucide-react';

const templateVariables = {
  'Locador': {
    icon: Building,
    color: 'bg-blue-100 text-blue-800',
    items: [
      { label: 'Nome', value: '{{locador.nome}}' },
      { label: 'CPF', value: '{{locador.cpf}}' },
      { label: 'Email', value: '{{locador.email}}' },
      { label: 'Telefone', value: '{{locador.telefone}}' },
    ],
  },
  'Locatário': {
    icon: User,
    color: 'bg-teal-100 text-teal-800',
    items: [
      { label: 'Nome', value: '{{locatario.nome}}' },
      { label: 'CPF', value: '{{locatario.cpf}}' },
      { label: 'Email', value: '{{locatario.email}}' },
      { label: 'Telefone', value: '{{locatario.telefone}}' },
    ],
  },
  'Imóvel': {
    icon: Home,
    color: 'bg-indigo-100 text-indigo-800',
    items: [
      { label: 'Título', value: '{{imovel.titulo}}' },
      { label: 'Endereço', value: '{{imovel.endereco}}' },
      { label: 'Cidade', value: '{{imovel.cidade}}' },
      { label: 'Bairro', value: '{{imovel.bairro}}' },
      { label: 'CEP', value: '{{imovel.cep}}' },
      { label: 'Valor Aluguel', value: '{{imovel.valorAluguel}}' },
    ],
  },
  'Contrato': {
    icon: Calendar,
    color: 'bg-gray-100 text-gray-800',
    items: [
      { label: 'Data de Geração', value: '{{contrato.dataGeracao}}' },
    ],
  },
};

export default function TemplateForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    conteudo: ''
  });
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleInsertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + ` ${variable} ` + text.substring(end);

    setForm(prev => ({ ...prev, conteudo: newText }));

    // Agenda a atualização da posição do cursor para depois da renderização
    setCursorPosition(start + variable.length + 2);
  };

  useEffect(() => {
    if (cursorPosition !== null && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      setCursorPosition(null); // Reseta a posição para não re-executar desnecessariamente
    }
  }, [cursorPosition]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setLoading(false);
    router.push('/templates');
    router.refresh(); // Força a atualização da lista de templates na página anterior
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome do Template *</label>
          <input id="nome" name="nome" placeholder="Ex: Contrato Residencial Padrão" value={form.nome} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div>
          <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-1">Conteúdo do Template *</label>
          <div className="p-4 border rounded-lg bg-gray-50 mb-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Variáveis Disponíveis (clique para inserir)</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(templateVariables).map(([category, { icon: Icon, color, items }]) => (
                <div key={category}>
                  <h5 className="text-xs font-bold text-gray-500 mb-2 flex items-center"><Icon size={14} className="mr-1.5" /> {category}</h5>
                  <div className="flex flex-wrap gap-2">
                    {items.map(variable => (
                      <button type="button" key={variable.value} onClick={() => handleInsertVariable(variable.value)} className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${color} hover:ring-2 hover:ring-offset-1`}>
                        {variable.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <textarea ref={textareaRef} id="conteudo" name="conteudo" placeholder="Escreva o texto do seu contrato aqui e insira as variáveis clicando nos botões acima..." value={form.conteudo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" rows={15} required />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? 'Salvando...' : 'Salvar Template'}
          </button>
        </div>
      </form>
    </div>
  );
}
