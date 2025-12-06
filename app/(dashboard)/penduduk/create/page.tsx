/**
 * Create Penduduk Page
 * Form untuk menambah penduduk baru
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getKKList } from "@/app/actions/kartu-keluarga";
import { PendudukForm } from "@/components/penduduk/penduduk-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CreatePendudukPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get KK list untuk dropdown
  const { data: kkList } = await getKKList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Tambah Penduduk Baru
        </h1>
        <p className="text-slate-200 font-medium">
          Isi data penduduk sesuai dengan dokumen resmi
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Form Data Penduduk</CardTitle>
        </CardHeader>
        <CardContent>
          <PendudukForm kkList={kkList || []} />
        </CardContent>
      </Card>
    </div>
  );
}
