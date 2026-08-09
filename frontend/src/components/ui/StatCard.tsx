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
      <Card glass className="p-5">
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
    <Card glass hoverable className="p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </h3>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md",
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
            )}
          >
            {isPositive ? (
              <ArrowUpRight size={14} className="mr-0.5" />
            ) : (
              <ArrowDownRight size={14} className="mr-0.5" />
            )}
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </Card>
  );
};
