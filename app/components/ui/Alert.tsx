import { ReactNode } from "react";

interface AlertProps {
  type: "error" | "success";
  children: ReactNode;
}

export function Alert({ type, children }: AlertProps) {
  const styles = {
    error: {
      container: "border-red-200/80 bg-red-50/80",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-800",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ),
    },
    success: {
      container: "border-emerald-200/80 bg-emerald-50/80",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-800",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      ),
    },
  };

  const style = styles[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border ${style.container} p-4 shadow-sm backdrop-blur-sm`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
      >
        <svg
          className={`h-4 w-4 ${style.iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {style.icon}
        </svg>
      </div>
      <p className={`text-sm font-medium leading-relaxed ${style.textColor}`}>
        {children}
      </p>
    </div>
  );
}
