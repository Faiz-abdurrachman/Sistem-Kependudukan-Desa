/**
 * Kartu Keluarga Form Component
 * Form untuk create dan edit kartu keluarga
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createKartuKeluargaSchema,
  updateKartuKeluargaSchema,
} from "@/lib/validations/kartu-keluarga";
import type {
  CreateKartuKeluargaData,
  UpdateKartuKeluargaData,
} from "@/lib/validations/kartu-keluarga";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createKartuKeluarga,
  updateKartuKeluarga,
} from "@/app/actions/kartu-keluarga";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface KKFormProps {
  wilayahList: Array<{
    id: string;
    label: string;
    dusun: string;
    rw: string | null;
    rt: string | null;
  }>;
  pendudukList?: Array<{
    id: string;
    nik: string;
    nama_lengkap: string;
  }>;
  initialData?: any; // Untuk edit mode
  mode?: "create" | "edit";
}

export function KKForm({
  wilayahList,
  pendudukList = [],
  initialData,
  mode = "create",
}: KKFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema =
    mode === "create" ? createKartuKeluargaSchema : updateKartuKeluargaSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateKartuKeluargaData | UpdateKartuKeluargaData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  // Watch wilayah_id dan kepala_keluarga_id untuk controlled Select
  const wilayahId = watch("wilayah_id");
  const kepalaKeluargaId = watch("kepala_keluarga_id");

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);

    try {
      let result;
      if (mode === "create") {
        result = await createKartuKeluarga(data as CreateKartuKeluargaData);
      } else {
        result = await updateKartuKeluarga({
          ...data,
          id: initialData.id,
        } as UpdateKartuKeluargaData);
      }

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      // Success
      toast.success(
        mode === "create"
          ? "Data kartu keluarga berhasil ditambahkan"
          : "Data kartu keluarga berhasil diperbarui"
      );

      // Redirect (revalidatePath sudah dipanggil di server action)
      router.push("/kartu-keluarga");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay saat submit */}
      {isSubmitting && (
        <LoadingOverlay message="Menyimpan data kartu keluarga..." />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Nomor KK */}
        <div className="space-y-2">
          <Label htmlFor="nomor_kk" className="text-white">
            Nomor Kartu Keluarga <span className="text-red-400">*</span>
          </Label>
          <Input
            id="nomor_kk"
            {...register("nomor_kk")}
            placeholder="16 digit Nomor KK"
            maxLength={16}
            className="bg-gray-50"
          />
          {errors.nomor_kk && (
            <p className="text-sm text-red-400">
              {errors.nomor_kk.message as string}
            </p>
          )}
        </div>

        {/* Wilayah */}
        <div className="space-y-2">
          <Label htmlFor="wilayah_id" className="text-white">
            Wilayah <span className="text-red-400">*</span>
          </Label>
          {wilayahList.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-md border-2 border-yellow-500 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                <p className="font-semibold mb-1">Tidak ada data wilayah</p>
                <p className="text-yellow-700 mb-2">
                  Silakan tambah data wilayah terlebih dahulu sebelum membuat
                  Kartu Keluarga.
                </p>
                <p className="text-xs text-yellow-600 italic">
                  Setelah menambah data, refresh halaman ini untuk memuat data
                  wilayah.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/wilayah/create" className="flex-1">
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400 w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Data Wilayah
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <Select
              value={wilayahId || ""}
              onValueChange={(value) =>
                setValue("wilayah_id", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih Wilayah" />
              </SelectTrigger>
              <SelectContent>
                {wilayahList.map((wilayah) => (
                  <SelectItem key={wilayah.id} value={wilayah.id}>
                    {wilayah.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.wilayah_id && (
            <p className="text-sm text-red-400">
              {errors.wilayah_id.message as string}
            </p>
          )}
        </div>

        {/* Alamat Lengkap */}
        <div className="space-y-2">
          <Label htmlFor="alamat_lengkap" className="text-white">
            Alamat Lengkap <span className="text-red-400">*</span>
          </Label>
          <textarea
            id="alamat_lengkap"
            {...register("alamat_lengkap")}
            placeholder="Alamat lengkap tempat tinggal"
            rows={3}
            className="w-full rounded-md border-2 border-gray-500 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.alamat_lengkap && (
            <p className="text-sm text-red-400">
              {errors.alamat_lengkap.message as string}
            </p>
          )}
        </div>

        {/* Kepala Keluarga (Optional) */}
        {pendudukList.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="kepala_keluarga_id" className="text-white">
              Kepala Keluarga (Opsional)
            </Label>
            <Select
              value={kepalaKeluargaId || ""}
              onValueChange={(value) =>
                setValue("kepala_keluarga_id", value || null, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih Kepala Keluarga (opsional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tidak ada</SelectItem>
                {pendudukList.map((penduduk) => (
                  <SelectItem key={penduduk.id} value={penduduk.id}>
                    {penduduk.nik} - {penduduk.nama_lengkap}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kepala_keluarga_id && (
              <p className="text-sm text-red-400">
                {errors.kepala_keluarga_id.message as string}
              </p>
            )}
          </div>
        )}

        {/* Foto Scan URL */}
        <div className="space-y-2">
          <Label htmlFor="foto_scan_url" className="text-white">
            URL Foto Scan KK (Opsional)
          </Label>
          <Input
            id="foto_scan_url"
            {...register("foto_scan_url")}
            placeholder="https://..."
            type="url"
            className="bg-gray-50"
          />
          {errors.foto_scan_url && (
            <p className="text-sm text-red-400">
              {errors.foto_scan_url.message as string}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : mode === "create" ? (
              "Simpan Data"
            ) : (
              "Update Data"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
