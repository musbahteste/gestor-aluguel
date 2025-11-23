import ImovelForm from '@/app/components/ImovelForm';
import PageWrapper from '@/app/components/PageWrapper';

interface EditarImovelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarImovelPage({ params }: EditarImovelPageProps) {
  const { id } = await params;
  const imovelId = parseInt(id, 10);

  return (
    <PageWrapper title="Editar Imóvel">
      <ImovelForm imovelId={imovelId} />
    </PageWrapper>
  );
}
