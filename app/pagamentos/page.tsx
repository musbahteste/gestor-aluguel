import Link from 'next/link';
import PagamentoForm from '@/app/components/PagamentoForm';
import PagamentoList from '@/app/components/PagamentoList';
import PageWrapper from '@/app/components/PageWrapper';

export default function PagamentosPage() {
  return (
    <PageWrapper
      title="Gerenciar Pagamentos"
      actionButton={
        <Link
          href="/pagamentos/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver Dashboard de Recebimentos
        </Link>
      }
    >
      <div className="space-y-6">
        <PagamentoForm />
        <PagamentoList />
      </div>
    </PageWrapper>
  );
}
