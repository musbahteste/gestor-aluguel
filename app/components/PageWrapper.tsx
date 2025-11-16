import React from 'react';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}

export default function PageWrapper({ title, children, actionButton }: PageWrapperProps) {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {actionButton}
      </div>
      {children}
    </div>
  );
}