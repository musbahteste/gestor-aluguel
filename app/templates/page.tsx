import Link from 'next/link';
import TemplateList from '../components/TemplateList';
import PageWrapper from '../components/PageWrapper';
import { PlusCircle } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <PageWrapper
      title="Templates de Contrato"
      actionButton={
        <Link 
          href="/templates/criar" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Criar Template</span>
        </Link>
      }
    >
      <TemplateList />
    </PageWrapper>
  );
}
