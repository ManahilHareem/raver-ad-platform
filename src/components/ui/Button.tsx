import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "social" | "ghost";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-[#01012A] to-[#2E2C66] text-white text-[18px] font-bold leading-none shadow-[inset_0px_-5px_5px_0px_#4F569B] flex items-center justify-center px-[16px] py-[14px] h-[56px] rounded-[12px]",
      secondary: "glass border-border-subtle text-text-primary",
      social: "bg-white border border-slate-200 text-slate-700 font-medium flex items-center justify-center gap-3 py-3",
      ghost: "text-text-secondary hover:text-text-primary transition-colors",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "h-12 w-full rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
