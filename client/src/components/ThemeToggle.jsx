// src/components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      title="Toggle theme"
      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}