/**
 * Surat Page
 * Halaman untuk mengelola surat keluar
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SuratPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Surat Keluar</h1>
        <p className="text-slate-200 font-medium">
          Kelola surat-surat yang telah dicetak
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modul Surat</CardTitle>
          <CardDescription>
            Halaman ini sedang dalam pengembangan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-200 font-medium">
            Fitur pengelolaan surat akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
