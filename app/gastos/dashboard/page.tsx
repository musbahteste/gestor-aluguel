import Link from 'next/link';
import DashboardGastos from '@/app/components/DashboardGastos';

export default function DashboardGastosPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard de Gastos</h1>
          <Link
            href="/gastos"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Voltar
          </Link>
        </div>

        <DashboardGastos />
      </div>
    </div>
  );
}
