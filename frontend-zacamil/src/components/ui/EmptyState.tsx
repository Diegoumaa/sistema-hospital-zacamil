import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center animate-fade-in transition-all">
      <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
        <svg
          className="w-10 h-10 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-lg">{description}</p>
    </div>
  );
};
