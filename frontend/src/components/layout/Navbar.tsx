import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NirnayaLogo from "../ui/NirnayaLogo";

export interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Map route to page title
  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return "Executive Dashboard";
    if (path.startsWith("/meetings/")) return "Meeting Intelligence";
    if (path.startsWith("/meetings")) return "Meetings Repository";
    if (path.startsWith("/chat")) return "NIRNAYA AI Assistant";
    if (path.startsWith("/action-items")) return "Action Items Workspace";
    if (path.startsWith("/analytics")) return "Executive Analytics";
    if (path.startsWith("/upload")) return "Audio Intelligence Ingestion";
    if (path.startsWith("/reports")) return "Intelligence Reports";
    if (path.startsWith("/settings")) return "Workspace Settings";
    if (path.startsWith("/profile")) return "User Profile";
    return "Executive Workspace";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/chat?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notifications = [
    { id: 1, title: "Meeting Transcribed", time: "5m ago", desc: "Product Strategy audio transcription is ready." },
    { id: 2, title: "AI Summary Generated", time: "1h ago", desc: "Executive summary and 4 key decisions extracted." },
    { id: 3, title: "Report Sent", time: "3h ago", desc: "PDF intelligence report emailed to stakeholders." },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-[#E8E1D8] bg-[#FAF8F4]/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Current Page Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#6F6A65] hover:bg-[#F7EDED] hover:text-[#7A171C] transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <NirnayaLogo variant="mark" size="sm" />
          </div>
          <div>
            <h1 className="text-sm lg:text-base font-bold text-[#211F1D] tracking-tight">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        </div>
      </div>

      {/* Center/Right: Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6A65]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meetings, topics, decisions, action items..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#E8E1D8] bg-white text-xs text-[#211F1D] placeholder-[#A39D97] focus:outline-none focus:border-[#7A171C] focus:ring-2 focus:ring-[#7A171C]/15 transition-all"
          />
        </form>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl border border-[#E8E1D8] bg-white text-[#6F6A65] hover:text-[#7A171C] hover:bg-[#FAF4E8] transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C9953E]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#E8E1D8] bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#211F1D]">
                  Notifications
                </h4>
                <span className="text-[10px] font-bold text-[#7A171C] bg-[#F7EDED] px-2 py-0.5 rounded-full border border-[#7A171C]/20">
                  3 Unread
                </span>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F7EDED] transition-colors border border-[#E8E1D8]/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#211F1D]">{n.title}</span>
                      <span className="text-[10px] text-[#6F6A65]">{n.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#6F6A65] line-clamp-2">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-xl border border-[#E8E1D8] bg-white hover:bg-[#FAF8F4] transition-all cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg bg-[#7A171C] text-white flex items-center justify-center font-bold text-xs border border-[#C9953E]/30">
              {user?.name?.[0]?.toUpperCase() || "N"}
            </div>
            <span className="text-xs font-bold text-[#211F1D] hidden md:inline-block">
              {user?.name || "Executive User"}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#E8E1D8] bg-white p-2 shadow-xl z-50">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-[#211F1D] hover:bg-[#FAF8F4] transition-colors"
              >
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/settings");
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-[#211F1D] hover:bg-[#FAF8F4] transition-colors"
              >
                Workspace Settings
              </button>
              <div className="my-1 border-t border-[#E8E1D8]" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
