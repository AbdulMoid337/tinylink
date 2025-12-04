// components/dashboard/LinksList.tsx
"use client";

import { useState, useMemo } from "react";
import { LinkCard } from "./LinkCard";
import { EmptyState } from "./EmptyState";
import { LinksListSkeleton } from "../ui/LoadingSkeleton";

interface LinkItem {
  code: string;
  url: string;
  clickCount: number;
  lastClicked: string | null;
}

interface LinksListProps {
  links: LinkItem[];
  isLoading?: boolean;
  onCopy: (code: string) => void;
  onDelete: (code: string) => void;
}

export function LinksList({
  links = [], // Add default empty array
  isLoading = false,
  onCopy,
  onDelete,
}: LinksListProps) {
  const [search, setSearch] = useState("");

  const filteredLinks = useMemo(() => {
    // Add safety check
    if (!Array.isArray(links)) return [];
    if (!search.trim()) return links;

    const q = search.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(q) || l.url.toLowerCase().includes(q),
    );
  }, [links, search]);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-2xl shadow-gray-900/5 backdrop-blur-xl">
      <div className="border-b border-gray-200/60 bg-linear-to-br from-gray-50/80 to-white/80 p-6 backdrop-blur-sm">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">
              Your Links
            </h2>
            <p className="text-sm text-gray-600">
              Manage and track all your shortened URLs
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/80 px-1.5 py-1.5 shadow-sm backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-white">
              <span className="text-xs font-bold">
                {filteredLinks?.length ?? 0}
              </span>
            </div>
            <span className="pr-3 text-xs font-semibold text-gray-700">
              Total
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full rounded-2xl border border-gray-300/80 bg-white/90 py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
            placeholder="Search by code or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-6">
        {isLoading ? (
          <LinksListSkeleton />
        ) : !filteredLinks || filteredLinks.length === 0 ? (
          <EmptyState
            hasSearch={!!search}
            searchQuery={search}
            onClearSearch={() => setSearch("")}
          />
        ) : (
          <div className="space-y-4">
            {filteredLinks.map((link, idx) => (
              <LinkCard
                key={link.code}
                {...link}
                isNew={idx === 0}
                onCopy={onCopy}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
