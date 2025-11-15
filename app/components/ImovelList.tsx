'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ImovelList() {
  const { data, error } = useSWR('/api/imoveis', fetcher);

  if (error) return <div>Erro ao carregar imóveis.</div>;
  if (!data) return <div>Carregando...</div>;

  return (
    <ul className="space-y-2">
      {data.map((imovel: any) => (
        <li key={imovel.id} className="border p-4 rounded">
          <strong>{imovel.titulo}</strong> — {imovel.endereco} <br />
          Valor: R$ {imovel.valorAluguel}
        </li>
      ))}
    </ul>
  );
}
