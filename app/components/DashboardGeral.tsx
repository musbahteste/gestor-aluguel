'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, Scale } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface DashboardData {
  resumoAtual: {
    totalRecebido: number;
    totalGasto: number;
    saldo: number;
  };
  historicoAnual: {
    name: string;
    recebimentos: number;
    gastos: number;
  }[];
  imoveis: Imovel[];
}

interface Imovel {
  id: number;
  titulo: string;
}

export default function DashboardGeral() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [ano, setAno] = useState<string>(String(new Date().getFullYear()));
  const [imovelId, setImovelId] = useState<string>(''); // '' para "Todos"

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const url = `/api/dashboard/geral?mes=${mes}&ano=${ano}&imovelId=${imovelId}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Falha ao buscar dados da API');
        }
        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [mes, ano, imovelId]);

  if (loading) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  if (!data) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar os dados.</div>;
  }

  const { resumoAtual, historicoAnual, imoveis } = data;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Geral</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="mes-select" className="block text-sm font-medium text-gray-700 mb-1">
              Mês do Resumo
            </label>
            <select
              id="mes-select"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>
                  {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ano-select" className="block text-sm font-medium text-gray-700 mb-1">
              Ano do Resumo
            </label>
            <input
              id="ano-select"
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="imovel-select" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Imóvel
            </label>
            <select
              id="imovel-select"
              value={imovelId}
              onChange={(e) => setImovelId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os Imóveis</option>
              {imoveis.map((imovel) => (
                <option key={imovel.id} value={imovel.id}>
                  {imovel.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Recebido (Mês)</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-800">
              {formatCurrency(resumoAtual.totalRecebido)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Gasto (Mês)</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-800">
              {formatCurrency(resumoAtual.totalGasto)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Scale className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Saldo (Mês)</h3>
            <p className={`mt-1 text-2xl font-semibold ${resumoAtual.saldo >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
              {formatCurrency(resumoAtual.saldo)}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico Comparativo */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recebimentos vs. Gastos (Últimos 12 Meses)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={historicoAnual}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              labelStyle={{ color: '#333' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend />
            <Bar dataKey="recebimentos" fill="#16a34a" name="Recebimentos" />
            <Bar dataKey="gastos" fill="#dc2626" name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
