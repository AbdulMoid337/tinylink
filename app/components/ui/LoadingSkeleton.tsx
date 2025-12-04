export function LinkCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 rounded-xl bg-gray-200/80" />
            <div className="h-7 w-24 rounded-full bg-gray-200/60" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200/60" />
            <div className="h-4 w-64 rounded bg-gray-200/80" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-gray-200/60" />
            <div className="h-3 w-48 rounded bg-gray-200/60" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 rounded-xl bg-gray-200/80" />
          <div className="h-10 w-20 rounded-xl bg-gray-200/80" />
        </div>
      </div>
    </div>
  );
}

export function LinksListSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3].map((i) => (
        <LinkCardSkeleton key={i} />
      ))}
    </div>
  );
}
