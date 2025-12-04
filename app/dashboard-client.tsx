"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";

type LinkItem = {
  code: string;
  url: string;
  clickCount: number;
  lastClicked: string | null;
};

type Props = {
  initialLinks: LinkItem[];
};

export default function DashboardPageClient({ initialLinks }: Props) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-clear success toast
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const filteredLinks = useMemo(() => {
    if (!search.trim()) return links;
    const q = search.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(q) || l.url.toLowerCase().includes(q),
    );
  }, [links, search]);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      resetMessages();

      const trimmedUrl = url.trim();
      const trimmedCode = code.trim();

      if (!trimmedUrl) {
        setError("Target URL is required.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: trimmedUrl,
            code: trimmedCode || undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(
            data.error ??
              (res.status === 409
                ? "This code is already taken. Try another one."
                : "Failed to create link. Please try again."),
          );
          return;
        }

        const data = (await res.json()) as LinkItem;

        setLinks((prev) => [
          {
            code: data.code,
            url: data.url,
            clickCount: data.clickCount,
            lastClicked: data.lastClicked,
          },
          ...prev,
        ]);
        setUrl("");
        setCode("");
        setSuccess("Link created successfully ✨");
      } finally {
        setLoading(false);
      }
    },
    [url, code],
  );

  const handleDelete = useCallback(async (codeToDelete: string) => {
    resetMessages();

    const ok = window.confirm(
      `Are you sure you want to delete "${codeToDelete}"?`,
    );
    if (!ok) return;

    const res = await fetch(`/api/links/${codeToDelete}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to delete link. Please try again.");
      return;
    }

    setLinks((prev) => prev.filter((l) => l.code !== codeToDelete));
    setSuccess("Link deleted ✅");
  }, []);

  const copyShortUrl = useCallback((code: string) => {
    resetMessages();

    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_BASE_URL ?? "");
    const value = `${base}/${code}`;

    navigator.clipboard
      .writeText(value)
      .then(() => setSuccess("Short link copied to clipboard 📋"))
      .catch(() => setError("Failed to copy. Please try again."));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Ambient Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-linear-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute -right-40 top-60 h-96 w-96 rounded-full bg-linear-to-bl from-purple-400/20 to-pink-400/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-linear-to-t from-indigo-400/10 to-blue-400/10 blur-3xl" />
      </div>

      {/* Navigation Header */}
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

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Panel - Create Link Form */}
          <section className="lg:col-span-2">
            <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-2xl shadow-gray-900/5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
              {/* Gradient Accent Border */}
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600" />

              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Create Short Link
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  Transform long URLs into memorable short links with built-in
                  analytics
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleCreate}>
                {/* Target URL Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Destination URL
                  </label>
                  <input
                    type="url"
                    className="w-full rounded-2xl border border-gray-300/80 bg-white/80 px-5 py-3.5 text-sm font-medium text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://example.com/your-long-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Must include http:// or https://
                  </p>
                </div>

                {/* Custom Code Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <svg
                      className="h-4 w-4 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    Custom Code
                    <span className="text-xs font-normal text-gray-500">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-gray-300/80 bg-white/80 px-5 py-3.5 font-mono text-sm font-medium text-gray-900 shadow-sm backdrop-blur-sm placeholder:font-sans placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="my-custom-link"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={loading}
                  />
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Leave blank for auto-generation
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5 transition-transform group-hover:scale-110"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Generate Short Link
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 z-0 bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </form>

              {/* Status Messages */}
              {(error || success) && (
                <div className="mt-6 space-y-3">
                  {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/80 p-4 shadow-sm backdrop-blur-sm">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <svg
                          className="h-4 w-4 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-red-800">
                        {error}
                      </p>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 shadow-sm backdrop-blur-sm">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-4 w-4 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-emerald-800">
                        {success}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Pro Tip */}
              <div className="mt-6 rounded-2xl border border-blue-100/80 bg-linear-to-br from-blue-50/50 to-cyan-50/50 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-blue-900">
                      Pro Tip
                    </h4>
                    <p className="text-xs leading-relaxed text-blue-700">
                      Use memorable custom codes for marketing campaigns,
                      documentation, or social media links to boost
                      click-through rates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel - Links List */}
          <section className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-2xl shadow-gray-900/5 backdrop-blur-xl">
              {/* Header with Search */}
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
                        {filteredLinks.length}
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

              {/* Links Content */}
              <div className="max-h-[600px] overflow-y-auto p-6">
                {filteredLinks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-300/60 bg-gray-50/50 py-16 text-center backdrop-blur-sm">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-linear-to-br from-gray-400/20 to-gray-500/20 blur-xl" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200 text-4xl shadow-lg">
                        🔗
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        {search ? "No matching links found" : "No links yet"}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600">
                        {search
                          ? "Try adjusting your search query"
                          : "Create your first short link to get started"}
                      </p>
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLinks.map((l, idx) => (
                      <div
                        key={l.code}
                        className={`group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-500/10 ${
                          idx === 0 ? "animate-[fadeIn_0.4s_ease-out]" : ""
                        }`}
                      >
                        {/* Gradient Accent */}
                        <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          {/* Link Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <Link
                                href={`/code/${l.code}`}
                                className="group/link inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 px-4 py-2 text-base font-bold text-gray-900 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 hover:shadow-md"
                              >
                                <span className="font-mono">{l.code}</span>
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

                              {/* Stats Badges */}
                              <div className="flex items-center gap-2">
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
                                  {l.clickCount}{" "}
                                  {l.clickCount === 1 ? "click" : "clicks"}
                                </span>
                              </div>
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
                                title={l.url}
                              >
                                {l.url}
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
                                {l.lastClicked
                                  ? `Last clicked: ${new Date(l.lastClicked).toLocaleString()}`
                                  : "Never clicked"}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => copyShortUrl(l.code)}
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
                              onClick={() => handleDelete(l.code)}
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
