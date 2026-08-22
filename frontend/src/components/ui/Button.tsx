import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const variants = {
    primary:
      "bg-[#7A171C] hover:bg-[#631216] text-white shadow-xs focus:ring-[#7A171C]",
    secondary:
      "bg-[#FAF4E8] hover:bg-[#F3E8D3] text-[#7A171C] border border-[#C9953E]/30 focus:ring-[#C9953E]",
    gold:
      "bg-[#C9953E] hover:bg-[#B28332] text-white shadow-xs focus:ring-[#C9953E]",
    outline:
      "border border-[#E8E1D8] bg-white hover:bg-[#FAF8F4] text-[#211F1D] focus:ring-[#7A171C]",
    ghost:
      "bg-transparent hover:bg-[#F7EDED] text-[#6F6A65] hover:text-[#7A171C] focus:ring-[#7A171C]",
    danger:
      "bg-rose-700 hover:bg-rose-800 text-white shadow-xs focus:ring-rose-700",
    glass:
      "bg-white/90 hover:bg-white text-[#211F1D] border border-[#E8E1D8] shadow-xs",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-2.5 gap-2.5",
    icon: "p-2 aspect-square",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
