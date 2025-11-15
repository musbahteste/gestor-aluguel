import ContratoGenerator from '../../components/ContratoGenerator';

export default function GerarContratoPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gerar Contrato</h1>
      <ContratoGenerator />
    </main>
  );
}
