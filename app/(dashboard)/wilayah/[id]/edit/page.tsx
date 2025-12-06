/**
 * Edit Wilayah Page
 * Form untuk mengedit data wilayah
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWilayahById } from "@/app/actions/wilayah";
import { WilayahForm } from "@/components/wilayah/wilayah-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditWilayahPage({
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

  // Get wilayah data
  const { data: wilayah, error } = await getWilayahById(params.id);

  if (error || !wilayah) {
    redirect("/wilayah");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Edit Data Wilayah
        </h1>
        <p className="text-slate-200 font-medium">
          Ubah data wilayah administratif
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Form Edit Data Wilayah</CardTitle>
        </CardHeader>
        <CardContent>
          <WilayahForm initialData={wilayah} mode="edit" />
        </CardContent>
      </Card>
    </div>
  );
}


