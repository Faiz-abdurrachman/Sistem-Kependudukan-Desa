/**
 * Dashboard Layout
 * Layout dengan Sidebar & Header untuk semua halaman dashboard
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Loader2 } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check di layout level - sekali saja untuk semua pages
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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

        {/* Page Content dengan Suspense */}
        <main className="flex-1 overflow-y-auto bg-slate-900">
          <div className="max-w-7xl mx-auto p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                    <p className="text-slate-300 font-medium">Memuat...</p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
