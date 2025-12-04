// components/DashboardPageClient.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { CreateLinkForm } from "../components/dashboard/CreateLinkForm";
import { LinksList } from "../components/dashboard/LinksList";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const t = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [errorMessage]);

  const handleLinkCreated = useCallback((newLink: LinkItem) => {
    setLinks((prev) => [newLink, ...prev]);
  }, []);

  const handleCopy = useCallback((code: string) => {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_BASE_URL ?? "");
    const value = `${base}/${code}`;

    navigator.clipboard
      .writeText(value)
      .then(() => setSuccessMessage("Short link copied to clipboard 📋"))
      .catch(() => setErrorMessage("Failed to copy. Please try again."));
  }, []);

  const handleDelete = useCallback(async (code: string) => {
    const ok = window.confirm(`Are you sure you want to delete "${code}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/links/${code}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(
          data.error ?? "Failed to delete link. Please try again.",
        );
        return;
      }

      setLinks((prev) => prev.filter((l) => l.code !== code));
      setSuccessMessage("Link deleted ✅");
    } catch {
      setErrorMessage("Network error. Please try again.");
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Ambient Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-linear-0-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute -right-40 top-60 h-96 w-96 rounded-full bg-linear-0-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-linear-0-to-br from-indigo-400/10 to-blue-400/10 blur-3xl" />
      </div>

      <DashboardHeader />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <CreateLinkForm onSuccess={handleLinkCreated} />
          </section>

          <section className="lg:col-span-3">
            <LinksList
              links={links}
              onCopy={handleCopy}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>

      {/* Global Toast Messages */}
      {(successMessage || errorMessage) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md space-y-3">
          {successMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/95 p-4 shadow-xl backdrop-blur-sm">
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
              <p className="text-sm font-medium text-emerald-800">
                {successMessage}
              </p>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/95 p-4 shadow-xl backdrop-blur-sm">
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
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
