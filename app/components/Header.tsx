'use client';

import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="md:hidden bg-white shadow-md h-16 flex items-center px-4 sticky top-0 z-10">
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900">
        <Menu size={24} />
      </button>
      <div className="ml-4 text-xl font-bold text-gray-800">Gestor<span className="text-blue-600">Aluguel</span></div>
    </header>
  );
}