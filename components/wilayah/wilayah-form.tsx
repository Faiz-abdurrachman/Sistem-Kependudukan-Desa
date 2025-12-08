/**
 * Wilayah Form Component
 * Form untuk create dan edit wilayah
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createWilayahSchema,
  updateWilayahSchema,
} from "@/lib/validations/wilayah";
import type {
  CreateWilayahData,
  UpdateWilayahData,
} from "@/lib/validations/wilayah";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createWilayah, updateWilayah } from "@/app/actions/wilayah";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface WilayahFormProps {
  initialData?: any; // Untuk edit mode
  mode?: "create" | "edit";
}

export function WilayahForm({
  initialData,
  mode = "create",
}: WilayahFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = mode === "create" ? createWilayahSchema : updateWilayahSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWilayahData | UpdateWilayahData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);

    try {
      let result;
      if (mode === "create") {
        result = await createWilayah(data as CreateWilayahData);
      } else {
        result = await updateWilayah({
          ...data,
          id: initialData.id,
        } as UpdateWilayahData);
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
          ? "Data wilayah berhasil ditambahkan"
          : "Data wilayah berhasil diperbarui"
      );

      // Redirect (revalidatePath sudah dipanggil di server action)
      router.push("/wilayah");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay saat submit */}
      {isSubmitting && <LoadingOverlay message="Menyimpan data wilayah..." />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Dusun */}
        <div className="space-y-2">
          <Label htmlFor="dusun" className="text-white">
            Dusun <span className="text-red-400">*</span>
          </Label>
          <Input
            id="dusun"
            {...register("dusun")}
            placeholder="Nama Dusun"
            className="bg-gray-50"
          />
          {errors.dusun && (
            <p className="text-sm text-red-400">
              {errors.dusun.message as string}
            </p>
          )}
        </div>

        {/* RW */}
        <div className="space-y-2">
          <Label htmlFor="rw" className="text-white">
            RW (Opsional)
          </Label>
          <Input
            id="rw"
            {...register("rw")}
            placeholder="RW"
            className="bg-gray-50"
          />
          {errors.rw && (
            <p className="text-sm text-red-400">
              {errors.rw.message as string}
            </p>
          )}
        </div>

        {/* RT */}
        <div className="space-y-2">
          <Label htmlFor="rt" className="text-white">
            RT (Opsional)
          </Label>
          <Input
            id="rt"
            {...register("rt")}
            placeholder="RT"
            className="bg-gray-50"
          />
          {errors.rt && (
            <p className="text-sm text-red-400">
              {errors.rt.message as string}
            </p>
          )}
        </div>

        {/* Nama Desa */}
        <div className="space-y-2">
          <Label htmlFor="nama_desa" className="text-white">
            Nama Desa (Opsional)
          </Label>
          <Input
            id="nama_desa"
            {...register("nama_desa")}
            placeholder="Nama Desa"
            className="bg-gray-50"
          />
          {errors.nama_desa && (
            <p className="text-sm text-red-400">
              {errors.nama_desa.message as string}
            </p>
          )}
        </div>

        {/* Nama Kecamatan */}
        <div className="space-y-2">
          <Label htmlFor="nama_kecamatan" className="text-white">
            Nama Kecamatan (Opsional)
          </Label>
          <Input
            id="nama_kecamatan"
            {...register("nama_kecamatan")}
            placeholder="Nama Kecamatan"
            className="bg-gray-50"
          />
          {errors.nama_kecamatan && (
            <p className="text-sm text-red-400">
              {errors.nama_kecamatan.message as string}
            </p>
          )}
        </div>

        {/* Nama Kabupaten */}
        <div className="space-y-2">
          <Label htmlFor="nama_kabupaten" className="text-white">
            Nama Kabupaten (Opsional)
          </Label>
          <Input
            id="nama_kabupaten"
            {...register("nama_kabupaten")}
            placeholder="Nama Kabupaten"
            className="bg-gray-50"
          />
          {errors.nama_kabupaten && (
            <p className="text-sm text-red-400">
              {errors.nama_kabupaten.message as string}
            </p>
          )}
        </div>

        {/* Nama Provinsi */}
        <div className="space-y-2">
          <Label htmlFor="nama_provinsi" className="text-white">
            Nama Provinsi (Opsional)
          </Label>
          <Input
            id="nama_provinsi"
            {...register("nama_provinsi")}
            placeholder="Nama Provinsi"
            className="bg-gray-50"
          />
          {errors.nama_provinsi && (
            <p className="text-sm text-red-400">
              {errors.nama_provinsi.message as string}
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
