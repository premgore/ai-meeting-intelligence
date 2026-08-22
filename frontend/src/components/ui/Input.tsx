import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6A65]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[#6F6A65] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-[#E8E1D8] bg-white px-4 py-2.5 text-sm text-[#211F1D] placeholder-[#A39D97] transition-all focus:border-[#7A171C] focus:outline-none focus:ring-2 focus:ring-[#7A171C]/15",
              icon && "pl-10",
              error && "border-rose-600 focus:border-rose-600 focus:ring-rose-600/15",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
