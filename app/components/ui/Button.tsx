import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "group relative overflow-hidden rounded-2xl px-6 py-4 text-sm font-bold shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white shadow-blue-500/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40",
    secondary:
      "border border-gray-200/80 bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm hover:scale-105 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md",
    danger:
      "border border-red-200/80 bg-red-50/80 text-red-700 shadow-sm backdrop-blur-sm hover:scale-105 hover:border-red-300 hover:bg-red-100 hover:text-red-800 hover:shadow-md",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
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
            Loading...
          </>
        ) : (
          children
        )}
      </span>
      {variant === "primary" && (
        <div className="absolute inset-0 z-0 bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </button>
  );
}
