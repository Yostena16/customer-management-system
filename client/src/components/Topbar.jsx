// src/components/Topbar.jsx
import { Bell, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-end border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
        </button>
        <button
          onClick={() => navigate("/customers", { state: { openAdd: true } })}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>
    </header>
  );
}