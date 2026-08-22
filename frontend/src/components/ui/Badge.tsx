import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "burgundy" | "gold" | "success" | "warning" | "danger" | "info" | "outline" | "low" | "medium" | "high";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: "bg-[#F7EDED] text-[#7A171C] border-[#E8E1D8]",
    burgundy: "bg-[#7A171C] text-white border-[#7A171C]",
    gold: "bg-[#FAF4E8] text-[#9A6F27] border-[#C9953E]/30",
    success: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
    warning: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    danger: "bg-[#FDF2F2] text-[#991B1B] border-[#FECACA]",
    info: "bg-[#FAF4E8] text-[#7A171C] border-[#E8E1D8]",
    outline: "bg-transparent text-[#6F6A65] border-[#E8E1D8]",
    low: "bg-[#F7EDED] text-[#7A171C] border-[#E8E1D8]",
    medium: "bg-[#FAF4E8] text-[#9A6F27] border-[#C9953E]/30",
    high: "bg-[#FDF2F2] text-[#991B1B] border-[#FECACA]",
  };

  const dotColors = {
    default: "bg-[#7A171C]",
    burgundy: "bg-[#C9953E]",
    gold: "bg-[#C9953E]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-[#7A171C]",
    outline: "bg-[#C9953E]",
    low: "bg-[#7A171C]",
    medium: "bg-[#C9953E]",
    high: "bg-rose-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />}
      {children}
    </span>
  );
};
