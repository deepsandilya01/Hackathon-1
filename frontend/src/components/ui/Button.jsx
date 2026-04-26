import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-white hover:bg-black hover:text-white shadow-md",
    destructive: "bg-error text-white hover:bg-black",
    outline: "border border-outline bg-transparent hover:bg-black hover:text-white text-white",
    secondary: "bg-surface-container-high text-white hover:bg-black hover:text-white",
    ghost: "hover:bg-black hover:text-white text-white",
    link: "text-white underline-offset-4 hover:underline hover:text-gray-300",
  };
  const sizes = {
    default: "h-11 px-5 py-2",
    sm: "h-9 rounded-[12px] px-3",
    lg: "h-12 rounded-[12px] px-8",
    icon: "h-11 w-11",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-semibold ring-offset-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
