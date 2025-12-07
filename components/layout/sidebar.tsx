/**
 * Sidebar Navigation Component
 * Navigasi utama untuk dashboard
 */

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Home,
  TrendingUp,
  FileText,
  MapPin,
  Settings,
  UserCog,
  BarChart3,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Penduduk",
    href: "/penduduk",
    icon: Users,
  },
  {
    title: "Kartu Keluarga",
    href: "/kartu-keluarga",
    icon: Home,
  },
  {
    title: "Mutasi",
    href: "/mutasi",
    icon: TrendingUp,
  },
  {
    title: "Surat Keluar",
    href: "/surat-keluar",
    icon: FileText,
  },
  {
    title: "Wilayah",
    href: "/wilayah",
    icon: MapPin,
  },
  {
    title: "Laporan",
    href: "/laporan",
    icon: BarChart3,
  },
  {
    title: "Pengaturan",
    href: "/pengaturan",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-700/50 bg-slate-800 relative z-10">
      {/* Logo & Title */}
      <div className="flex h-16 items-center border-b border-slate-700/50 px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-md">
            <span className="text-lg font-bold text-white">SID</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">SID Next-Gen</h2>
            <p className="text-xs text-slate-300 font-medium">
              Sistem Informasi Desa
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all cursor-pointer relative z-10 w-full text-left border-0",
                isActive
                  ? "bg-slate-600 text-white shadow-lg font-bold border-l-4 border-l-primary"
                  : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-white font-medium"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/50 p-4">
        <p className="text-xs text-slate-300 font-medium text-center">
          © 2025 SID Next-Gen
        </p>
      </div>
    </div>
  );
}
