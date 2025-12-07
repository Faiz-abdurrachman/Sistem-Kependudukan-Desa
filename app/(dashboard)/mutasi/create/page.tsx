/**
 * Create Mutasi Page
 * Form untuk menambah mutasi baru
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPendudukList } from "@/app/actions/penduduk";
import { MutasiForm } from "@/components/mutasi/mutasi-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export default async function CreateMutasiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get penduduk list untuk dropdown
  const { data: pendudukList } = await getPendudukList({
    page: 1,
    limit: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Tambah Mutasi Baru
        </h1>
        <p className="text-slate-200 font-medium">
          Catat perubahan status penduduk (Lahir, Mati, Pindah)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Form Data Mutasi</CardTitle>
        </CardHeader>
        <CardContent>
          <MutasiForm pendudukList={pendudukList || []} />
        </CardContent>
      </Card>
    </div>
  );
}
