import Link from 'next/link';
import GastoForm from '@/app/components/GastoForm';
import GastoList from '@/app/components/GastoList';
import PageWrapper from '@/app/components/PageWrapper';

export default function GastosPage() {
  return (
    <PageWrapper
      title="Gerenciador de Gastos"
      actionButton={
        <Link
          href="/gastos/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver Dashboard
        </Link>
      }
    >
      <div className="space-y-6">
        <GastoForm />
        <GastoList />
      </div>
    </PageWrapper>
  );
}
