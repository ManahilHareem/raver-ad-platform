import { InputHTMLAttributes, forwardRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Icons } from "@/components/ui/icons";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  type?: "text" | "email" | "password";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = "text", className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2 w-full">
        <label className="block text-[16px] font-medium text-[#121212]">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full h-[56px] py-[14px] px-[16px] rounded-[12px] border border-[#0000001A] ",
              "focus:outline-none transition-all",
              "placeholder:text-slate-400 text-[15px] text-[#4F4F4F]",
              isPassword && "pr-[52px]",
              error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50 active:bg-slate-100"
            >
              {showPassword ? (
                <Icons.EyeOff className="w-5 h-5" />
              ) : (
                <Icons.Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
