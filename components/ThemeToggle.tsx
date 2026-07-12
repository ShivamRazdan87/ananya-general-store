"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 transition"
    >
      {isDark ? (
        <Sun size={22} className="text-haldi-400" />
      ) : (
        <Moon size={22} className="text-gray-700" />
      )}
    </button>
  );
}
