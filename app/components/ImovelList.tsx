'use client';
import useSWR from 'swr';
import { Home, DollarSign, MapPin } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
);

export default function ImovelList() {
  const { data, error, isLoading } = useSWR('/api/imoveis', fetcher);

  // --- INÍCIO DA CORREÇÃO ---
  // Garante que 'imoveis' seja sempre um array.
  // Se 'data' for um array, usa 'data'. Caso contrário, usa um array vazio.
  const imoveis = Array.isArray(data) ? data : [];
  // --- FIM DA CORREÇÃO ---

  if (error) return <div className="text-center py-10 text-red-500">Erro ao carregar imóveis.</div>;
  
  // Usa o estado 'isLoading' do SWR para uma verificação mais precisa.
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {imoveis.length === 0 && !isLoading ? (
        <div className="col-span-full text-center py-10 text-gray-500">
          Nenhum imóvel cadastrado ainda.
        </div>
      ) : (
        imoveis.map((imovel: any) => (
          <div key={imovel.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 truncate">{imovel.titulo}</h2>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span>{imovel.endereco}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-400" />
                  <span className="font-semibold text-gray-800">{formatCurrency(imovel.valorAluguel)}</span>
                  <span className="ml-1">/ mês</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
