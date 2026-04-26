import React from "react";
import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-primary text-white hover:bg-primary/80",
    secondary: "border-transparent bg-surface-container-high text-white hover:bg-surface-container-highest",
    destructive: "border-transparent bg-error text-white hover:bg-error/80",
    outline: "text-white border-outline",
    success: "border-transparent bg-emerald-600 text-white hover:bg-emerald-600/80",
    warning: "border-transparent bg-yellow-500 text-slate-950 hover:bg-yellow-500/80",
    active: "border-transparent bg-blue-600 text-white hover:bg-blue-600/80",
    critical: "border-transparent bg-red-600 text-white animate-pulse"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
