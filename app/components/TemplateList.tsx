'use client';
import useSWR from 'swr';
import { FileText } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="bg-gray-200 p-3 rounded-full h-12 w-12 mr-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

export default function TemplateList() {
  const { data, error } = useSWR('/api/templates', fetcher);

  if (error) return <div className="text-center text-red-500 py-10">Erro ao carregar templates.</div>;
  if (!data) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((template: any) => (
        <div key={template.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{template.nome}</h2>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-4 rounded-md border border-gray-200">
              {template.conteudo}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
