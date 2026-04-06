import TopBar from "@/components/layout/TopBar";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />
  );
}

export default function DashboardLoading() {
  return (
    <>
      <TopBar />
      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* Welcome skeleton */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Skeleton className="w-56 h-4 mb-2" />
            <Skeleton className="w-72 h-8" />
          </div>
          <Skeleton className="hidden sm:block w-32 h-11 rounded-xl" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-ink-100 rounded-2xl p-5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-28 h-3" />
                <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
              </div>
              <Skeleton className="w-36 h-7 mb-2" />
              <Skeleton className="w-24 h-3" />
            </div>
          ))}
        </div>

        {/* Bottom grid skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Overdue debts table skeleton */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-ink-50 flex items-center justify-between">
              <div>
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-48 h-3" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-ink-50">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  {/* Avatar */}
                  <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />

                  {/* Name + progress */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="w-36 h-3.5" />
                    <Skeleton className="w-48 h-3" />
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <Skeleton className="w-20 h-3" />
                        <Skeleton className="w-8 h-3" />
                      </div>
                      <Skeleton className="w-full h-1.5 rounded-full" />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0 space-y-1.5">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>

                  {/* Menu icon */}
                  <Skeleton className="w-4 h-4 ml-1 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-50">
                <Skeleton className="w-32 h-4" />
              </div>
              <div className="divide-y divide-ink-50">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                    <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="w-28 h-3" />
                      <Skeleton className="w-20 h-2.5" />
                    </div>
                    <Skeleton className="w-10 h-2.5 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-ink-900 border border-white/5 rounded-2xl p-5">
              <Skeleton className="w-28 h-4 bg-ink-700 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl">
                    <Skeleton className="w-36 h-3.5 bg-ink-700" />
                    <Skeleton className="w-4 h-4 bg-ink-700 rounded" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}