import Link from 'next/link';
import GastoForm from '@/app/components/GastoForm';
import GastoList from '@/app/components/GastoList';

export default function GastosPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gerenciador de Gastos</h1>
          <Link
            href="/gastos/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ver Dashboard
          </Link>
        </div>

        <GastoForm />
        <GastoList />
      </div>
    </div>
  );
}
