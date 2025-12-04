interface EmptyStateProps {
  hasSearch: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

export function EmptyState({ hasSearch, onClearSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-300/60 bg-gray-50/50 py-16 text-center backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-gray-400/20 to-gray-500/20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200 text-4xl shadow-lg">
          🔗
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-bold text-gray-900">
          {hasSearch ? "No matching links found" : "No links yet"}
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          {hasSearch
            ? "Try adjusting your search query"
            : "Create your first short link to get started"}
        </p>
        {hasSearch && (
          <button
            onClick={onClearSearch}
            className="rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
}
