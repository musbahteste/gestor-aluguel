'use client';
import useSWR from 'swr';
import { User, Mail, Phone } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="bg-gray-200 p-3 rounded-full h-12 w-12 mr-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export default function LocadorList() {
  const { data, error } = useSWR('/api/locadores', fetcher);

  if (error) return <div className="text-center text-red-500 py-10">Erro ao carregar locadores.</div>;
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((locador: any) => (
        <div key={locador.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 truncate">{locador.nome}</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              {locador.email && (
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span>{locador.email}</span>
                </div>
              )}
              {locador.telefone && (
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span>{locador.telefone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

