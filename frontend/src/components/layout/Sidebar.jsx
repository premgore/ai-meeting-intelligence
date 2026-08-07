import {
  LayoutDashboard,
  CalendarDays,
  Upload,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Meetings",
    path: "/meetings",
    icon: CalendarDays,
  },
  {
    title: "Upload",
    path: "/upload",
    icon: Upload,
  },
  {
    title: "AI Chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">

      <div className="p-6 border-b border-slate-800">

        <h1 className="text-xl font-bold">
          AI Meeting
        </h1>

        <p className="text-sm text-slate-400">
          Intelligence
        </p>

      </div>

      <nav className="flex-1 p-4">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}