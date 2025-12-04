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
    const t = setTimeout(() => setSuccess(null), 2500);
    return () => clearTimeout(t);
  }, [success]);

  const filteredLinks = useMemo(() => {
    if (!search.trim()) return links;
    const q = search.toLowerCase();
    return links.filter(
      (l) => l.code.toLowerCase().includes(q) || l.url.toLowerCase().includes(q),
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

    const ok = window.confirm(`Are you sure you want to delete "${codeToDelete}"?`);
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
        : process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const value = `${base}/${code}`;

    navigator.clipboard
      .writeText(value)
      .then(() => setSuccess("Short link copied to clipboard 📋"))
      .catch(() => setError("Failed to copy. Please try again."));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-sm font-semibold shadow-lg shadow-blue-500/40">
              TL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight">
                  TinyLink
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Minimal URL shortener with stats.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/healthz"
              className="text-xs font-medium text-slate-300 underline-offset-4 hover:underline hover:text-emerald-300"
            >
              Healthcheck
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
        {/* Left: create form + status */}
        <section
          className="flex-1 rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-blue-500/10 backdrop-blur
                     transition-transform duration-300 hover:-translate-y-1 hover:shadow-blue-500/20"
        >
          <h2 className="mb-1 text-sm font-semibold tracking-tight text-slate-50">
            Create a short link
          </h2>
          <p className="mb-4 text-xs text-slate-400">
            Paste a long URL, optionally choose a custom code, and we&apos;ll generate a
            trackable short link.
          </p>

          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-200">
                Target URL
              </label>
              <input
                type="url"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50
                           shadow-inner shadow-black/50 outline-none ring-0 transition
                           placeholder:text-slate-500
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
                placeholder="https://example.com/docs"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
              <p className="text-[11px] text-slate-400">
                Must include <span className="font-mono">http://</span> or{" "}
                <span className="font-mono">https://</span>.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-200">
                Custom code <span className="text-slate-500">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50
                             shadow-inner shadow-black/50 outline-none ring-0 transition
                             placeholder:text-slate-500
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
                  placeholder="A-Za-z0-9, 6–8 chars"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Must be globally unique. Leave empty to auto-generate.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400
                         px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-500/40
                         transition-transform duration-150
                         hover:scale-[1.02] hover:shadow-blue-500/60
                         disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-slate-900 border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <span>Shorten URL</span>
                </>
              )}
            </button>
          </form>

          {/* Toasts / alerts */}
          <div className="mt-4 space-y-2">
            {error && (
              <div
                className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100
                           shadow shadow-red-500/20 transition-all duration-200"
              >
                <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-red-400" />
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div
                className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100
                           shadow shadow-emerald-500/20 transition-all duration-200"
              >
                <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p>{success}</p>
              </div>
            )}
          </div>

          {/* Small hint */}
          <p className="mt-5 text-[11px] text-slate-500">
            Pro tip: Use custom codes for docs, pricing pages, or campaigns so you remember
            them easily.
          </p>
        </section>

        {/* Right: list & search */}
        <section
          className="flex-[1.5] rounded-2xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl shadow-slate-900/80 backdrop-blur
                     transition-transform duration-300 hover:-translate-y-1 hover:shadow-blue-500/10"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-50">
                All links
              </h2>
              <p className="text-[11px] text-slate-400">
                Search, copy, and manage your short URLs.
              </p>
            </div>

            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-50
                         shadow-inner shadow-black/40 outline-none ring-0 transition
                         placeholder:text-slate-500
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60
                         sm:w-60"
              placeholder="Filter by code or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700/70 bg-slate-950/40 py-10 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                🔗
              </span>
              <p className="text-sm text-slate-200">
                No links yet.{search ? " Try clearing your search." : ""}
              </p>
              {!search && (
                <p className="text-xs text-slate-500">
                  Create your first short link from the panel on the left.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60">
              <div className="max-h-[480px] overflow-auto">
                <table className="min-w-full text-xs">
                  <thead className="sticky top-0 z-10 border-b border-slate-800/90 bg-slate-950/95 text-[10px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-3 py-2 text-left">Code</th>
                      <th className="px-3 py-2 text-left">Target URL</th>
                      <th className="px-3 py-2 text-right">Clicks</th>
                      <th className="px-3 py-2 text-left">Last clicked</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredLinks.map((l, idx) => (
                      <tr
                        key={l.code}
                        className={`transition-colors duration-150 hover:bg-slate-900/80 ${
                          idx === 0 ? "animate-[fadeIn_0.35s_ease-out]" : ""
                        }`}
                      >
                        <td className="whitespace-nowrap px-3 py-2 align-middle">
                          <Link
                            href={`/code/${l.code}`}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-[11px] font-medium text-blue-300 ring-1 ring-blue-500/40 transition hover:bg-blue-500/10 hover:text-blue-200"
                          >
                            <span className="font-mono">{l.code}</span>
                            <span className="text-[9px] text-slate-400">stats</span>
                          </Link>
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <div className="max-w-xs truncate text-[11px] text-slate-200 md:max-w-md">
                            <span title={l.url}>{l.url}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right align-middle text-[11px] text-slate-100">
                          {l.clickCount}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap align-middle text-[11px] text-slate-400">
                          {l.lastClicked
                            ? new Date(l.lastClicked).toLocaleString()
                            : "Never"}
                        </td>
                        <td className="px-3 py-2 text-right align-middle">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => copyShortUrl(l.code)}
                              className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100
                                         shadow shadow-black/40 transition
                                         hover:-translate-y-[1px] hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-100 hover:shadow-blue-500/30"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(l.code)}
                              className="rounded-full border border-red-500/40 bg-red-500/5 px-3 py-1 text-[11px] font-medium text-red-200
                                         shadow shadow-red-900/40 transition
                                         hover:-translate-y-[1px] hover:bg-red-500/15 hover:shadow-red-500/40"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
    