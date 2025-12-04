import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  params: Promise<{ code: string }>;
};

export default async function CodeStatsPage({ params }: Props) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center shadow-2xl shadow-red-500/10 backdrop-blur">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-300">
            ⚠️
          </div>
          <h1 className="mb-2 text-lg font-semibold tracking-tight">
            Link not found
          </h1>
          <p className="mb-4 text-xs text-slate-400">
            We couldn&apos;t find any short URL with the code{" "}
            <span className="font-mono text-slate-100">{code}</span>.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-blue-500/40 transition hover:scale-[1.02] hover:shadow-blue-500/60"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const createdAt = (link as any).createdAt as Date | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-xs font-semibold text-slate-950 shadow-md shadow-blue-500/40">
                TL
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold tracking-tight">
                  TinyLink
                </div>
                <p className="text-[11px] text-slate-400">
                  Stats for{" "}
                  <span className="font-mono text-slate-100">{link.code}</span>
                </p>
              </div>
            </Link>
          </div>

          <Link
            href="/"
            className="text-xs font-medium text-slate-300 underline-offset-4 hover:underline hover:text-emerald-300"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Summary header */}
        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-blue-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300 ring-1 ring-slate-700/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Short code</span>
                <span className="font-mono text-slate-50">{link.code}</span>
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50">
                Link performance overview
              </h1>
              <p className="text-xs text-slate-400">
                Track total clicks, last activity, and quickly open the target page.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/${link.code}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-blue-500/40 transition hover:scale-[1.02] hover:shadow-blue-500/60"
              >
                Open short URL ↗
              </Link>
            </div>
          </div>
        </section>

        {/* Stats cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 shadow-lg shadow-slate-900/80 transition hover:-translate-y-1 hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Total clicks
              </p>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300 ring-1 ring-blue-500/40">
                Engagement
              </span>
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-50">
              {link.clickCount}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Every redirect increments this count.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 shadow-lg shadow-slate-900/80 transition hover:-translate-y-1 hover:shadow-emerald-500/20">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Last clicked
            </p>
            <div className="mt-2 text-sm text-slate-100">
              {link.lastClicked
                ? new Date(link.lastClicked).toLocaleString()
                : "Never clicked yet"}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Updated every time someone visits the short URL.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 shadow-lg shadow-slate-900/80 transition hover:-translate-y-1 hover:shadow-indigo-500/20">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Created at
            </p>
            <div className="mt-2 text-sm text-slate-100">
              {createdAt
                ? new Date(createdAt).toLocaleString()
                : "Not available"}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Timestamp of when this short link was created.
            </p>
          </div>
        </section>

        {/* Target URL card */}
        <section className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/80">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Target URL
            </p>
            <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-300 ring-1 ring-slate-700/80">
              Destination
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-xs text-slate-100 shadow-inner shadow-black/50">
            <div className="truncate" title={link.url}>
              {link.url}
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            This is where visitors are redirected when they hit{" "}
            <span className="font-mono text-slate-100">
              /{link.code}
            </span>
            .
          </p>
        </section>

        {/* Back link */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 underline-offset-4 hover:underline hover:text-emerald-300"
          >
            ← Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
