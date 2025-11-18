import Link from 'next/link';
import PagamentoForm from '@/app/components/PagamentoForm';
import PagamentoList from '@/app/components/PagamentoList';

export default function PagamentosPage() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Gerenciar Pagamentos
        </h1>
        <Link
          href="/pagamentos/dashboard"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-center text-sm font-medium"
        >
          Ver Dashboard de Recebimentos
        </Link>
      </div>

      {/* Formulário de Pagamento */}
      <PagamentoForm />

      {/* Lista de Pagamentos */}
      <PagamentoList />
    </div>
  );
}
