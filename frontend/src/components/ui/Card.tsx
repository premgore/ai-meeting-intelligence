import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  glass = false,
  hoverable = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8E1D8] bg-white p-6 shadow-xs transition-all duration-200",
        hoverable && "hover:shadow-md hover:border-[#D4C9BC] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
