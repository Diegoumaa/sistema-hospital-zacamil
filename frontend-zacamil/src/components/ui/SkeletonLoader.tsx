import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col h-56">
          <div className="h-1.5 bg-slate-200 w-full" />
          <div className="p-6 flex-1 mt-1">
            <div className="flex justify-between items-start mb-5">
              <div className="h-6 w-24 bg-slate-200 rounded-full" />
            </div>
            <div className="h-7 w-3/4 bg-slate-200 rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 rounded" />
              <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-9 w-32 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
