'use client';

import { useState, useEffect } from 'react';
// Presumindo que você tenha essas funções de utilitários em algum lugar
// import { formatCurrency, formatDate } from '@/app/lib/utils';

// --- Funções de utilitários (adicionadas para o exemplo ser autônomo) ---
// Você pode remover isso se já tiver em @/app/lib/utils
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100); // Assumindo que o valor está em centavos
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
// --- Fim das funções de utilitários ---


interface Gasto {
  id: number;
  tipo: string;
  descricao?: string;
  valor: number;
  dataGasto: string;
  arquivo?: string;
  imovel: {
    titulo: string;
    locador: { nome: string };
  };
}

export default function GastoList() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gastos');
      const data = await res.json();

      // --- INÍCIO DA CORREÇÃO ---
      // Verificamos se 'data' é um array.
      if (Array.isArray(data)) {
        setGastos(data);
      }
      // Se não for, talvez o array esteja aninhado (ex: { gastos: [...] })
      // Adicione outras verificações aqui se necessário (ex: data.gastos)
      else {
        console.error('Erro: A API não retornou um array de gastos.', data);
        // Definimos como um array vazio para evitar a quebra da UI
        setGastos([]);
      }
      // --- FIM DA CORREÇÃO ---

    } catch (error) {
      console.error('Erro ao buscar gastos:', error);
      setGastos([]); // Garante que 'gastos' seja um array mesmo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // NOTA: 'confirm()' foi removido.
    // Você deve implementar um modal de confirmação aqui para melhor UX.
    // if (!confirm('Tem certeza que deseja deletar este gasto?')) return;

    try {
      const res = await fetch(`/api/gastos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGastos(gastos.filter(g => g.id !== id));
        console.log('Gasto deletado com sucesso!'); // 'alert()' removido
      } else {
        // Trata erros de resposta da API
        const errorData = await res.json();
        console.error('Erro ao deletar (API):', errorData.message || res.statusText);
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando gastos...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-2xl font-bold">Últimos Gastos</h2>
      </div>

      {/* A verificação 'gastos.length === 0' agora funciona
        porque garantimos que 'gastos' é sempre um array.
      */}
      {gastos.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Nenhum gasto registrado ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Imóvel
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Isso agora é seguro porque 'gastos' é garantido como um array.
              */}
              {gastos.map((gasto, index) => (
                <tr
                  key={gasto.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {gasto.tipo.charAt(0).toUpperCase() + gasto.tipo.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">
                      {gasto.imovel.titulo}
                    </div>
                    <div className="text-xs text-gray-500">
                      {gasto.imovel.locador.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600">
                    -{formatCurrency(gasto.valor)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {formatDate(gasto.dataGasto)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {gasto.descricao || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {gasto.arquivo && (
                      <a
                        href={gasto.arquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Arquivo
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(gasto.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}