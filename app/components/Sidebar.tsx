'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Landmark,
  Users,
  FileText,
  FileSignature,
  Wallet,
  Receipt,
  Shield,
  Building2,
} from 'lucide-react';

const menuLinks = [
  { href: '/dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
  { href: '/imoveis', label: 'Imóveis', icon: Home },
  { href: '/pagamentos', label: 'Pagamentos', icon: Wallet },
  { href: '/pagamentos/dashboard', label: 'Recebimentos', icon: Receipt },
  { href: '/gastos', label: 'Gastos', icon: Shield },
  { href: '/gastos/dashboard', label: 'Dashboard Gastos', icon: Landmark },
  { href: '/contratos', label: 'Contratos', icon: FileText },
  { href: '/templates', label: 'Template', icon: FileText },
  { href: '/contratos/gerar', label: 'Gerar Contrato', icon: FileSignature },
  { href: '/locadores', label: 'Locadores', icon: Building2 },
  { href: '/locatarios', 'label': 'Locatários', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        Gestor<span className="text-blue-400">Aluguel</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <Icon className="mr-3 h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Gestor de Aluguel</p>
      </div>
    </aside>
  );
}