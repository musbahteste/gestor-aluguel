'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TemplateList() {
  const { data, error } = useSWR('/api/templates', fetcher);

  if (error) return <div>Erro ao carregar templates.</div>;
  if (!data) return <div>Carregando...</div>;

  return (
    <ul className="space-y-2">
      {data.map((template: any) => (
        <li key={template.id} className="border p-4 rounded">
          <strong>{template.nome}</strong>
          <pre className="bg-gray-100 p-2 mt-2">{template.conteudo}</pre>
        </li>
      ))}
    </ul>
  );
}
