/**
 * Edit Surat Keluar Page
 * Form untuk mengedit data surat keluar
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSuratKeluarById } from "@/app/actions/surat-keluar";
import { getPendudukList } from "@/app/actions/penduduk";
import { SuratKeluarForm } from "@/components/surat-keluar/surat-keluar-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditSuratKeluarPage({
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

  // Get surat keluar data
  const { data: surat, error } = await getSuratKeluarById(params.id);

  if (error || !surat) {
    redirect("/surat-keluar");
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
          Edit Data Surat Keluar
        </h1>
        <p className="text-slate-200 font-medium">Ubah data surat keluar</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">
            Form Edit Data Surat Keluar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SuratKeluarForm
            pendudukList={pendudukList || []}
            initialData={surat}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
