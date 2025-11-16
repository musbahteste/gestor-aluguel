import ImovelForm from '@/app/components/ImovelForm';
import PageWrapper from '@/app/components/PageWrapper';

export default function CriarImovelPage() {
  return (
    <PageWrapper title="Cadastrar Novo Imóvel">
      <ImovelForm />
    </PageWrapper>
  );
}

