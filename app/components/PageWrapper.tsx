import React from 'react';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}

export default function PageWrapper({ title, children, actionButton }: PageWrapperProps) {
  return (
    <div className="w-full h-full flex flex-col p-6 md:p-8">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {actionButton}
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}