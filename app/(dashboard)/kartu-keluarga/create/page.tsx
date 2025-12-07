/**
 * Create Kartu Keluarga Page
 * Form untuk menambah kartu keluarga baru
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWilayahListForDropdown } from "@/app/actions/wilayah";
import { getPendudukList } from "@/app/actions/penduduk";
import { KKForm } from "@/components/kartu-keluarga/kk-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export default async function CreateKKPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get wilayah list untuk dropdown
  const { data: wilayahList } = await getWilayahListForDropdown();

  // Get penduduk list untuk dropdown kepala keluarga (opsional)
  const { data: pendudukList } = await getPendudukList({
    page: 1,
    limit: 100,
    status_dasar: "HIDUP",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Tambah Kartu Keluarga Baru
        </h1>
        <p className="text-slate-200 font-medium">
          Isi data kartu keluarga sesuai dengan dokumen resmi
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Form Data Kartu Keluarga</CardTitle>
        </CardHeader>
        <CardContent>
          <KKForm
            wilayahList={wilayahList || []}
            pendudukList={pendudukList || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
