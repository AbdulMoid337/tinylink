export function DashboardHeader() {
  return (
    <nav className="relative z-10 border-b border-gray-200/60 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-blue-600 to-cyan-500 opacity-80 blur-md" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-blue-600 to-cyan-500 shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
                TinyLink
                <span className="rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                  Pro
                </span>
              </h1>
              <p className="text-sm text-gray-600">
                Smart URL shortener with analytics
              </p>
            </div>
          </div>

          <a
            href="/healthz"
            className="group flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/80 hover:text-emerald-700 hover:shadow-md"
          >
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Health Status
          </a>
        </div>
      </div>
    </nav>
  );
}
