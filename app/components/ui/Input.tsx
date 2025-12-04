import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  helperText?: string;
}

export function Input({
  label,
  icon,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {icon}
        {label}
      </label>
      <input
        className={`w-full rounded-2xl border border-gray-300/80 bg-white/80 px-5 py-3.5 text-sm font-medium text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      {helperText && (
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
          {helperText}
        </p>
      )}
    </div>
  );
}
