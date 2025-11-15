import Link from 'next/link';
import TemplateList from '../components/TemplateList';

export default function TemplatesPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Templates de Contrato</h1>
      <Link href="/templates/criar" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Criar Template</Link>
      <TemplateList />
    </main>
  );
}
