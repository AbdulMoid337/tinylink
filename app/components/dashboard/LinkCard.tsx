// components/dashboard/LinkCard.tsx
"use client";

import Link from "next/link";

interface LinkCardProps {
  code: string;
  url: string;
  clickCount: number;
  lastClicked: string | null;
  onCopy: (code: string) => void;
  onDelete: (code: string) => void;
  isNew?: boolean;
}

export function LinkCard({
  code,
  url,
  clickCount,
  lastClicked,
  onCopy,
  onDelete,
  isNew = false,
}: LinkCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-500/10 ${
        isNew ? "animate-[fadeIn_0.4s_ease-out]" : ""
      }`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/code/${code}`}
              className="group/link inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 px-4 py-2 text-base font-bold text-gray-900 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 hover:shadow-md"
            >
              <span className="font-mono">{code}</span>
              <svg
                className="h-4 w-4 text-blue-600 transition-transform group-hover/link:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </Link>

            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {clickCount} {clickCount === 1 ? "click" : "clicks"}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <p
              className="max-w-md truncate text-sm font-medium text-gray-600"
              title={url}
            >
              {url}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {lastClicked
                ? `Last clicked: ${new Date(lastClicked).toLocaleString()}`
                : "Never clicked"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopy(code)}
            className="group/btn flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white/90 px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover/btn:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy
          </button>
          <button
            type="button"
            onClick={() => onDelete(code)}
            className="group/btn flex items-center gap-2 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-2.5 text-xs font-semibold text-red-700 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-red-300 hover:bg-red-100 hover:text-red-800 hover:shadow-md"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover/btn:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
