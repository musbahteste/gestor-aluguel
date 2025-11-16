'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardData {
  resumo: {
    totalRecebido: number;
    totalPendente: number;
    totalAtrasado: number;
    totalGeral: number;
    quantidade: number;
    porMetodo: Record<string, number>;
    porImovel: Array<{
      imovel: {
        id: number;
        titulo: string;
        locador: { nome: string };
      };
      total: number;
    }>;
  };
}

interface Imovel {
  id: number;
  titulo: string;
  locador: { nome: string };
}

export default function DashboardRecebimentos() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [ano, setAno] = useState<string>(String(new Date().getFullYear()));
  const [imovelSelecionado, setImovelSelecionado] = useState<string>('');

  useEffect(() => {
    fetchImoveis();
    fetchDashboard();
  }, [mes, ano, imovelSelecionado]);

  const fetchImoveis = async () => {
    try {
      const res = await fetch('/api/imoveis');
      const data = await res.json();
      setImoveis(data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      let url = `/api/pagamentos/dashboard?mes=${mes}&ano=${ano}`;
      if (imovelSelecionado) {
        url += `&imovelId=${imovelSelecionado}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setDashboard(data);
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="text-center py-8 text-red-500">Erro ao carregar dashboard</div>;
  }

  const { resumo } = dashboard;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard de Recebimentos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês
            </label>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>
                  {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <select
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imóvel
            </label>
            <select
              value={imovelSelecionado}
              onChange={(e) => setImovelSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os imóveis</option>
              {imoveis.map(imovel => (
                <option key={imovel.id} value={imovel.id}>
                  {imovel.titulo} - {imovel.locador.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Recebido</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(resumo.totalRecebido)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Pagamentos confirmados</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pendente</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {formatCurrency(resumo.totalPendente)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Aguardando confirmação</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Atrasado</h3>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(resumo.totalAtrasado)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Vencidos</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Geral</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(resumo.totalGeral)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{resumo.quantidade} pagamentos</p>
        </div>
      </div>

      {/* Gráfico de Métodos de Pagamento */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Pagamentos por Método</h3>
        <div className="space-y-3">
          {Object.entries(resumo.porMetodo).length === 0 ? (
            <p className="text-gray-500">Nenhum pagamento registrado</p>
          ) : (
            Object.entries(resumo.porMetodo).map(([metodo, valor]) => (
              <div key={metodo} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 capitalize mb-1">
                    {metodo}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(valor / resumo.totalGeral) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="ml-4 text-sm font-medium text-gray-700 min-w-max">
                  {formatCurrency(valor)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recebimentos por Imóvel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Recebimentos por Imóvel</h3>
        </div>

        {resumo.porImovel.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum pagamento registrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Imóvel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Locador
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Total Recebido
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {resumo.porImovel.map(item => (
                  <tr key={item.imovel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">
                      {item.imovel.titulo}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.imovel.locador.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
