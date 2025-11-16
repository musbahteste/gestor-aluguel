import Link from 'next/link';
import PagamentoForm from '@/app/components/PagamentoForm';
import PagamentoList from '@/app/components/PagamentoList';

export default function PagamentosPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gerenciador de Pagamentos</h1>
          <Link
            href="/pagamentos/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ver Dashboard
          </Link>
        </div>

        <PagamentoForm />
        <PagamentoList />
      </div>
    </div>
  );
}
