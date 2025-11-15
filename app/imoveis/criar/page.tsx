import ImovelForm from '../../components/ImovelForm';

export default function CriarImovelPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Imóvel</h1>
      <ImovelForm />
    </main>
  );
}
