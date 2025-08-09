"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Wrench,
  Upload,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/mro", label: "MRO Tasks", icon: Wrench },
  { href: "/mro/tracker", label: "MRO Job Tracker", icon: ClipboardList },
  { href: "/upload", label: "File Upload", icon: Upload },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="sticky top-0 h-[100dvh] z-40">
      <button
        className="md:hidden m-3 px-3 py-2 rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur hover:bg-white/15"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        Menu
      </button>
      <div
        className={cn(
          "md:w-64 w-72 md:translate-x-0 transition-all duration-300",
          "h-full p-4 md:p-6 bg-white/10 border-r border-white/15 backdrop-blur-xl",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-6 text-white font-semibold tracking-wide">
          Kenya Airways MRO
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl",
                  "text-white/80 hover:text-white border border-transparent",
                  "hover:bg-white/10 hover:border-white/10",
                  active && "bg-white/15 border-white/20 text-white"
                )}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}


