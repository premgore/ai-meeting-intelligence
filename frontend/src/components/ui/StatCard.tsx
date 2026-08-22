import React from "react";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";
import { cn } from "../../lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  isPositive?: boolean;
  subtitle?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  isPositive = true,
  subtitle,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-20 mt-4" />
        <Skeleton className="h-3 w-32 mt-2" />
      </Card>
    );
  }

  return (
    <Card hoverable className="p-5 relative overflow-hidden group border-[#E8E1D8] bg-white">
      {/* Top subtle gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7A171C] via-[#C9953E] to-[#7A171C] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6A65]">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-[#F7EDED] text-[#7A171C] border border-[#E8E1D8] group-hover:border-[#C9953E]/40 group-hover:scale-105 transition-all">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#211F1D] tracking-tight">
          {value}
        </h3>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border",
              isPositive
                ? "bg-[#FAF4E8] text-[#9A6F27] border-[#C9953E]/30"
                : "bg-rose-50 text-rose-800 border-rose-200"
            )}
          >
            {isPositive ? (
              <ArrowUpRight size={14} className="mr-0.5 text-[#C9953E]" />
            ) : (
              <ArrowDownRight size={14} className="mr-0.5 text-rose-600" />
            )}
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#6F6A65]">
          {subtitle}
        </p>
      )}
    </Card>
  );
};
