import ContratoList from '../components/ContratoList';
import Link from 'next/link';
import PageWrapper from '../components/PageWrapper';
import { PlusCircle } from 'lucide-react';

export default function ContratosPage() {
  return (
    <PageWrapper
      title="Contratos"
      actionButton={
        <Link 
          href="/contratos/gerar" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Gerar Contrato</span>
        </Link>
      }
    >
      <ContratoList />
    </PageWrapper>
  );
}
