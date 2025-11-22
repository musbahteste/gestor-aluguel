// app/layout.tsx
'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './globals.css'; // Seu arquivo de estilos globais

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex h-screen bg-gray-50">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
