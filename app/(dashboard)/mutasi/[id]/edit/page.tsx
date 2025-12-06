/**
 * Edit Mutasi Page
 * Form untuk mengedit data mutasi
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getMutasiById } from "@/app/actions/mutasi";
import { getPendudukList } from "@/app/actions/penduduk";
import { MutasiForm } from "@/components/mutasi/mutasi-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditMutasiPage({
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

  // Get mutasi data
  const { data: mutasi, error } = await getMutasiById(params.id);

  if (error || !mutasi) {
    redirect("/mutasi");
  }

  // Get penduduk list untuk dropdown
  const { data: pendudukList } = await getPendudukList({
    page: 1,
    limit: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Data Mutasi</h1>
        <p className="text-slate-200 font-medium">Ubah data mutasi penduduk</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Form Edit Data Mutasi</CardTitle>
        </CardHeader>
        <CardContent>
          <MutasiForm
            pendudukList={pendudukList || []}
            initialData={mutasi}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
