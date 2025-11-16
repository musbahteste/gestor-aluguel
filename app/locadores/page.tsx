import Link from 'next/link';
import PageWrapper from '../components/PageWrapper';
import LocadorList from '../components/LocadorList';
import { PlusCircle } from 'lucide-react';

export default function LocadoresPage() {
  return (
    <PageWrapper
      title="Meus Locadores"
      actionButton={
        <Link
          href="/locadores/criar"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Cadastrar Locador</span>
        </Link>
      }
    >
      <LocadorList />
    </PageWrapper>
  );
}
