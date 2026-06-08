// components/debtorsLayout/debtorsSkeleton.tsx
import TopBar from "@/components/layout/TopBar";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
}

export default function PageSkeleton() {
  return (
    <>
      <TopBar title="Debtors" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Skeleton className="w-64 h-4 flex-1" />
          <Skeleton className="w-full sm:w-36 h-11 rounded-xl" />
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="w-full sm:max-w-sm h-11 rounded-xl" />
          <Skeleton className="w-full sm:w-40 h-11 rounded-xl" />
        </div>

        {/* Stats chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-28 h-9 rounded-full" />
          ))}
        </div>

        {/* Table rows */}
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-50 flex items-center gap-4">
            <Skeleton className="w-40 h-4" />
          </div>
          <div className="divide-y divide-ink-50">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="w-32 h-3.5" />
                  <Skeleton className="w-48 h-3" />
                </div>
                <div className="text-right flex-shrink-0 space-y-1.5 hidden sm:block">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-16 h-3" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full hidden md:block" />
                <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
