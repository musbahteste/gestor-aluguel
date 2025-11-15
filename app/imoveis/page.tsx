import ImovelList from '../components/ImovelList';
import Link from 'next/link';

export default function ImoveisPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Imóveis</h1>
      <Link href="/imoveis/criar" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Criar Imóvel</Link>
      <ImovelList />
    </main>
  );
}
