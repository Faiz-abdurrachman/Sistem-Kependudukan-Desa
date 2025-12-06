/**
 * Edit Penduduk Page
 * Form untuk mengedit data penduduk
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPendudukById } from "@/app/actions/penduduk";
import { getKKList } from "@/app/actions/kartu-keluarga";
import { PendudukForm } from "@/components/penduduk/penduduk-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditPendudukPage({
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

  // Get penduduk data
  const { data: penduduk, error } = await getPendudukById(params.id);

  if (error || !penduduk) {
    redirect("/penduduk");
  }

  // Get KK list untuk dropdown
  const { data: kkList } = await getKKList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Edit Data Penduduk
        </h1>
        <p className="text-slate-200 font-medium">
          Ubah data penduduk sesuai dengan dokumen resmi
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Form Edit Data Penduduk</CardTitle>
        </CardHeader>
        <CardContent>
          <PendudukForm
            kkList={kkList || []}
            initialData={penduduk}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
