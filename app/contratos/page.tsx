import ContratoList from '../components/ContratoList';
import Link from 'next/link';

export default function ContratosPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contratos</h1>
      <Link href="/contratos/gerar" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Gerar Contrato</Link>
      <ContratoList />
    </main>
  );
}
