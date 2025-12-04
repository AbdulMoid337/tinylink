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
      <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-red-400/20 to-pink-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-200/60 bg-white/80 shadow-2xl shadow-red-500/10 backdrop-blur-xl">
            {/* Error Header */}
            <div className="border-b border-red-100 bg-linear-to-br from-red-50/80 to-pink-50/80 px-8 py-6 text-center">
              <div className="relative mx-auto mb-4 inline-block">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-red-500 to-pink-500 opacity-20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-red-100 to-pink-100 text-5xl shadow-lg">
                  🔍
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                Link Not Found
              </h1>
              <p className="text-sm leading-relaxed text-gray-600">
                We couldn&apos;t locate a short URL with this code
              </p>
            </div>

            {/* Error Body */}
            <div className="px-8 py-6">
              <div className="mb-6 rounded-2xl border border-red-200/60 bg-red-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-bold text-red-900">
                      Code Not Found
                    </h3>
                    <p className="text-xs text-red-700">
                      The code{" "}
                      <span className="rounded-lg bg-white px-2 py-0.5 font-mono font-semibold text-red-800">
                        {code}
                      </span>{" "}
                      doesn&apos;t exist in our database
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const createdAt = link.createdAt as Date | undefined;

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
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-4">
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
                <p className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span>Analytics for</span>
                  <span className="rounded-lg bg-linear-to-r from-blue-500/10 to-purple-500/10 px-2 py-0.5 font-mono text-xs font-bold text-gray-900">
                    {link.code}
                  </span>
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="group flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-700 hover:shadow-md"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-2xl shadow-gray-900/5 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600" />

            <div className="border-b border-gray-200/60 bg-linear-to-br from-gray-50/80 to-white/80 px-8 py-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 px-4 py-2 shadow-sm backdrop-blur-sm">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                      <span className="text-xs font-semibold text-gray-600">
                        Active Link
                      </span>
                    </div>
                    <div className="rounded-xl border border-gray-200/80 bg-white/80 px-4 py-2 font-mono text-sm font-bold text-gray-900 shadow-sm backdrop-blur-sm">
                      /{link.code}
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Performance Analytics
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                    Track engagement metrics, monitor click patterns, and
                    analyze the performance of your shortened URL in real-time
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-2xl border border-gray-200/80 bg-white/90 px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                  >
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Visit Target
                  </a>
                  <Link
                    href={`/${link.code}`}
                    className="group flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    <svg
                      className="h-4 w-4"
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
                    Open Short URL
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Cards Grid */}
          <section className="grid gap-6 md:grid-cols-3">
            {/* Total Clicks Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
              <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-blue-500 via-cyan-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                  <svg
                    className="h-7 w-7 text-white"
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
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                  Engagement
                </span>
              </div>

              <div className="mb-2">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Total Clicks
                </h3>
                <p className="text-4xl font-bold tracking-tight text-gray-900">
                  {link.clickCount.toLocaleString()}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-gray-600">
                Total number of times this short link has been accessed
              </p>
            </div>

            {/* Last Clicked Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-emerald-500 via-teal-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                  <svg
                    className="h-7 w-7 text-white"
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
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                  Recent
                </span>
              </div>

              <div className="mb-2">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Last Activity
                </h3>
                <p className="text-base font-bold text-gray-900">
                  {link.lastClicked
                    ? new Date(link.lastClicked).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "No activity yet"}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-gray-600">
                {link.lastClicked
                  ? "Most recent timestamp when the link was accessed"
                  : "Waiting for the first visitor to click this link"}
              </p>
            </div>

            {/* Created At Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
              <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-500 via-pink-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                  <svg
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm">
                  Created
                </span>
              </div>

              <div className="mb-2">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Creation Date
                </h3>
                <p className="text-base font-bold text-gray-900">
                  {createdAt
                    ? new Date(createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown"}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-gray-600">
                Original timestamp when this short link was generated
              </p>
            </div>
          </section>

          {/* Target URL Section */}
          <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-xl shadow-gray-900/5 backdrop-blur-xl">
            <div className="border-b border-gray-200/60 bg-linear-to-br from-gray-50/80 to-white/80 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
                    <svg
                      className="h-6 w-6 text-white"
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
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Destination URL
                    </h2>
                    <p className="text-xs text-gray-600">
                      Where visitors are redirected
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                  Target
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="group relative overflow-hidden rounded-2xl border border-gray-300/80 bg-linear-to-br from-gray-50 to-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all font-mono text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline"
                      title={link.url}
                    >
                      {link.url}
                    </a>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  >
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-indigo-100/80 bg-linear-to-br from-indigo-50/50 to-purple-50/50 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
                    <svg
                      className="h-5 w-5"
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
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-indigo-900">
                      How Redirects Work
                    </h4>
                    <p className="text-xs leading-relaxed text-indigo-700">
                      When someone visits{" "}
                      <span className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-indigo-800">
                        /{link.code}
                      </span>
                      , they are instantly redirected to this destination URL.
                      Each redirect is tracked and the analytics are updated in
                      real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
