import LocadorForm from '@/app/components/LocadorForm';
import PageWrapper from '@/app/components/PageWrapper';

interface EditarLocadorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarLocadorPage({ params }: EditarLocadorPageProps) {
  const { id } = await params;
  const locadorId = parseInt(id, 10);

  return (
    <PageWrapper title="Editar Locador">
      <LocadorForm locadorId={locadorId} />
    </PageWrapper>
  );
}
