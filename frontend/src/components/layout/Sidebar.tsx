import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Bot,
  CheckSquare,
  BarChart3,
  Settings,
  UploadCloud,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import NirnayaLogo from "../ui/NirnayaLogo";

const primaryNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Meetings", href: "/meetings", icon: CalendarDays },
  { name: "AI Assistant", href: "/chat", icon: Bot, badge: "AI" },
  { name: "Action Items", href: "/action-items", icon: CheckSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Upload Audio", href: "/upload", icon: UploadCloud },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#E8E1D8] bg-[#FAF8F4] flex flex-col transition-all">
      {/* NIRNAYA Brand Header */}
      <div className="h-20 px-6 flex items-center border-b border-[#E8E1D8] bg-white">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <NirnayaLogo variant="full" size="md" showTagline />
        </NavLink>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6A65]">
          Workspace
        </div>
        {primaryNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all select-none cursor-pointer",
                  isActive
                    ? "bg-[#F7EDED] text-[#7A171C] font-semibold border border-[#7A171C]/20 shadow-2xs"
                    : "text-[#6F6A65] hover:bg-white hover:text-[#211F1D] hover:border hover:border-[#E8E1D8]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Subtle Gold Left Accent Line for Active State */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#C9953E] rounded-r-full" />
                  )}
                  <Icon
                    size={18}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-[#7A171C]" : "text-[#6F6A65] group-hover:text-[#7A171C]"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4E8] text-[#9A6F27] border border-[#C9953E]/30 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#E8E1D8] bg-white space-y-3">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8]">
          <div className="h-9 w-9 rounded-xl bg-[#7A171C] text-white flex items-center justify-center font-bold text-xs border border-[#C9953E]/30 shadow-xs">
            {user?.name?.[0]?.toUpperCase() || "N"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#211F1D] truncate">
              {user?.name || "Executive User"}
            </p>
            <p className="text-[11px] text-[#6F6A65] truncate">
              {user?.email || "user@nirnaya.ai"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <NavLink
            to="/profile"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#6F6A65] hover:bg-[#FAF8F4] hover:text-[#7A171C] border border-[#E8E1D8] transition-all"
          >
            <User size={14} />
            Profile
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
