import Link from 'next/link';
import PageWrapper from '../components/PageWrapper';
import LocatarioList from '../components/LocatarioList';
import { PlusCircle } from 'lucide-react';

export default function LocatariosPage() {
  return (
    <PageWrapper
      title="Meus Locatários"
      actionButton={
        <Link
          href="/locatarios/criar"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Cadastrar Locatário</span>
        </Link>
      }
    >
      <LocatarioList />
    </PageWrapper>
  );
}
