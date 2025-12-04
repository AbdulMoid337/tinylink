"use client";

import { FormEvent, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";

interface CreateLinkFormProps {
  onSuccess: (link: any) => void;
}

export function CreateLinkForm({ onSuccess }: CreateLinkFormProps) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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

      const data = await res.json();
      setUrl("");
      setCode("");
      setSuccess("Link created successfully ✨");
      onSuccess(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-2xl shadow-gray-900/5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600" />

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Create Short Link
        </h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Transform long URLs into memorable short links with built-in analytics
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          type="url"
          label="Destination URL"
          icon={
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
          }
          placeholder="https://example.com/your-long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          helperText="Must include http:// or https://"
        />

        <Input
          type="text"
          label="Custom Code"
          icon={
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
          }
          placeholder="my-custom-link"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
          helperText="Leave blank for auto-generation"
          className="font-mono placeholder:font-sans"
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="w-full"
        >
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
        </Button>
      </form>

      {(error || success) && (
        <div className="mt-6 space-y-3">
          {error && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}
        </div>
      )}

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
            <h4 className="mb-1 text-sm font-bold text-blue-900">Pro Tip</h4>
            <p className="text-xs leading-relaxed text-blue-700">
              Use memorable custom codes for marketing campaigns, documentation,
              or social media links to boost click-through rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
