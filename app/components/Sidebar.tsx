'use client';
import { Fragment } from 'react';
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
  X,
  Building2,
} from 'lucide-react';

const menuLinks = [
  { href: '/dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
  { href: '/imoveis', label: 'Imóveis', icon: Home },
  { href: '/pagamentos', label: 'Pagamentos', icon: Wallet },
  { href: '/pagamentos/dashboard', label: 'Dashboard Recebimentos', icon: Receipt },
  { href: '/gastos', label: 'Gastos', icon: Shield },
  { href: '/gastos/dashboard', label: 'Dashboard Gastos', icon: Landmark },
  { href: '/contratos', label: 'Contratos', icon: FileText },
  { href: '/templates', label: 'Template', icon: FileText },
  { href: '/contratos/gerar', label: 'Gerar Contrato', icon: FileSignature },
  { href: '/locadores', label: 'Locadores', icon: Building2 },
  { href: '/locatarios', 'label': 'Locatários', icon: Users },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Fragment>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col z-30
                   transform transition-transform duration-300 ease-in-out
                   md:relative md:translate-x-0
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <div className="text-2xl font-bold">
            Gestor<span className="text-blue-400">Aluguel</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-300 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)} // Fecha o menu ao clicar em um link no mobile
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
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
    </Fragment>
  );
}