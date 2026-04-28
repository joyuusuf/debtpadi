// ─── Skeleton ────────────────────────────────────────────────────────────────

function Bone({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`bg-ink-100 rounded-lg animate-pulse ${className}`} style={style} />;
}

export default function PageSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1 space-y-2"><Bone className="h-7 w-32" /><Bone className="h-4 w-64" /></div>
        <Bone className="h-11 w-full sm:w-40 rounded-xl" />
      </div>
      <Bone className="h-11 w-full rounded-xl mb-4" />
      <div className="flex gap-2 mb-5">
        {[64, 80, 72, 72, 72].map((w, i) => (<Bone key={i} className="h-9 rounded-xl flex-shrink-0" style={{ width: w }} />))}
      </div>
      <div className="hidden sm:block bg-white border border-ink-100 rounded-2xl overflow-hidden">
        <div className="border-b border-ink-100 bg-ink-50/50 flex gap-4 px-5 py-3.5">
          {[120, 180, 100, 130, 80, 60].map((w, i) => (<Bone key={i} className="h-3 rounded" style={{ width: w }} />))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-ink-50">
            <div className="flex items-center gap-3 flex-[1.4]">
              <Bone className="w-9 h-9 rounded-xl flex-shrink-0" />
              <div className="space-y-1.5"><Bone className="h-3 w-28" /><Bone className="h-2.5 w-20" /></div>
            </div>
            <Bone className="h-3 flex-[1.8] max-w-[200px]" />
            <div className="flex-1 space-y-1.5"><Bone className="h-3.5 w-24" /><Bone className="h-2.5 w-16" /></div>
            <div className="flex-1 space-y-1.5"><Bone className="h-2 w-12" /><Bone className="h-1.5 w-32 rounded-full" /></div>
            <Bone className="h-6 w-20 rounded-full flex-shrink-0" />
            <div className="flex gap-1.5"><Bone className="h-8 w-8 rounded-lg" /><Bone className="h-8 w-8 rounded-lg" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
