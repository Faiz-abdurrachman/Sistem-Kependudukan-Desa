/**
 * Edit Kartu Keluarga Page
 * Form untuk mengedit data kartu keluarga
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getKartuKeluargaById } from "@/app/actions/kartu-keluarga";
import { getWilayahListForDropdown } from "@/app/actions/wilayah";
import { getPendudukList } from "@/app/actions/penduduk";
import { KKForm } from "@/components/kartu-keluarga/kk-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditKKPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get kartu keluarga data
  const { data: kk, error } = await getKartuKeluargaById(params.id);

  if (error || !kk) {
    redirect("/kartu-keluarga");
  }

  // Get wilayah list untuk dropdown
  const { data: wilayahList } = await getWilayahListForDropdown();

  // Get penduduk list untuk dropdown kepala keluarga
  const { data: pendudukList } = await getPendudukList({
    page: 1,
    limit: 100,
    status_dasar: "HIDUP",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Edit Data Kartu Keluarga
        </h1>
        <p className="text-slate-200 font-medium">
          Ubah data kartu keluarga sesuai dengan dokumen resmi
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">
            Form Edit Data Kartu Keluarga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <KKForm
            wilayahList={wilayahList || []}
            pendudukList={pendudukList || []}
            initialData={kk}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
