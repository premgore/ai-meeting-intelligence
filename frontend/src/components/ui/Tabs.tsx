import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex space-x-1 rounded-xl bg-[#FAF8F4] p-1 border border-[#E8E1D8]", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors focus:outline-none select-none cursor-pointer",
              isActive
                ? "text-[#7A171C]"
                : "text-[#6F6A65] hover:text-[#211F1D]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#E8E1D8]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] rounded-full font-bold",
                    isActive
                      ? "bg-[#F7EDED] text-[#7A171C] border border-[#7A171C]/20"
                      : "bg-[#E8E1D8] text-[#6F6A65]"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
