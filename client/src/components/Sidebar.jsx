// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Settings, Anchor, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
     const { user, logout } = useAuth();
  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Anchor size={20} />
        </div>
        <div>
          <h1 className="font-bold leading-tight text-gray-900">Harbor</h1>
          <p className="text-xs text-gray-400">CRM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

          {/* User profile */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
            <p className="text-xs capitalize text-gray-400">{user?.role || "staff"}</p>
          </div>
          <button onClick={logout} title="Log out"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
            <LogOut size={18} />
          </button>
        </div>
      </div>

    </aside>
  );
}