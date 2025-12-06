/**
 * Dashboard Layout
 * Layout dengan Sidebar & Header untuk semua halaman dashboard
 */

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex relative z-10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header dengan Mobile Menu */}
        <div className="flex items-center gap-4 border-b border-slate-700/50 bg-slate-800 px-4 md:px-6 shadow-sm">
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          <Header />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-900">
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
