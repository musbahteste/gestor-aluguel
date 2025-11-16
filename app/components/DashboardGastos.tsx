'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardData {
  resumo: {
    totalGasto: number;
    quantidade: number;
    porTipo: Record<string, number>;
    porImovel: Array<{
      imovel: {
        id: number;
        titulo: string;
        locador: { nome: string };
      };
      total: number;
    }>;
  };
  gastos: Array<{
    id: number;
    tipo: string;
    valor: number;
    dataGasto: string;
    descricao?: string;
    imovel: {
      titulo: string;
      locador: { nome: string };
    };
  }>;
}

interface Imovel {
  id: number;
  titulo: string;
  locador: { nome: string };
}

export default function DashboardGastos() {
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
      let url = `/api/gastos/dashboard?mes=${mes}&ano=${ano}`;
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

  const { resumo, gastos } = dashboard;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard de Gastos</h2>
        
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
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Gastos</p>
              <p className="text-4xl font-bold text-red-600">
                {formatCurrency(resumo.totalGasto)}
              </p>
            </div>
            <div className="text-5xl text-red-200">💸</div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quantidade de Gastos</p>
              <p className="text-4xl font-bold text-blue-600">
                {resumo.quantidade}
              </p>
            </div>
            <div className="text-5xl text-blue-200">📊</div>
          </div>
        </div>
      </div>

      {/* Gastos por Tipo */}
      {Object.keys(resumo.porTipo).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Gastos por Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(resumo.porTipo).map(([tipo, valor]) => (
              <div key={tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(valor as number)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gastos por Imóvel */}
      {resumo.porImovel.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Gastos por Imóvel</h3>
          <div className="space-y-3">
            {resumo.porImovel.map((item) => (
              <div key={item.imovel.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.imovel.titulo}</p>
                  <p className="text-sm text-gray-600">{item.imovel.locador.nome}</p>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listagem de Gastos */}
      {gastos.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-xl font-bold">Gastos do Período</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Imóvel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto, index) => (
                  <tr
                    key={gasto.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(gasto.dataGasto)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {gasto.tipo.charAt(0).toUpperCase() + gasto.tipo.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {gasto.imovel.titulo}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600">
                      -{formatCurrency(gasto.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {gastos.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhum gasto registrado para o período selecionado.
        </div>
      )}
    </div>
  );
}
