import LocatarioForm from '@/app/components/LocatarioForm';
import PageWrapper from '@/app/components/PageWrapper';

interface EditarLocatarioPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarLocatarioPage({ params }: EditarLocatarioPageProps) {
  const { id } = await params;
  const locatarioId = parseInt(id, 10);

  return (
    <PageWrapper title="Editar Locatário">
      <LocatarioForm locatarioId={locatarioId} />
    </PageWrapper>
  );
}
