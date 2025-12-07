/**
 * Create Wilayah Page
 * Form untuk menambah wilayah baru
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WilayahForm } from "@/components/wilayah/wilayah-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export default async function CreateWilayahPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Tambah Wilayah Baru
        </h1>
        <p className="text-slate-200 font-medium">
          Isi data wilayah administratif (Dusun/RW/RT)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Form Data Wilayah</CardTitle>
        </CardHeader>
        <CardContent>
          <WilayahForm />
        </CardContent>
      </Card>
    </div>
  );
}
