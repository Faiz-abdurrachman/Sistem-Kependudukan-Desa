/**
 * Mutasi Form Component
 * Form untuk create dan edit mutasi log
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMutasiSchema,
  updateMutasiSchema,
} from "@/lib/validations/mutasi";
import type {
  CreateMutasiData,
  UpdateMutasiData,
} from "@/lib/validations/mutasi";
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
import { createMutasi, updateMutasi } from "@/app/actions/mutasi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MutasiFormProps {
  pendudukList: Array<{
    id: string;
    nik: string;
    nama_lengkap: string;
  }>;
  initialData?: any; // Untuk edit mode
  mode?: "create" | "edit";
}

export function MutasiForm({
  pendudukList,
  initialData,
  mode = "create",
}: MutasiFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = mode === "create" ? createMutasiSchema : updateMutasiSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateMutasiData | UpdateMutasiData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          ...initialData,
          tanggal_peristiwa: initialData.tanggal_peristiwa
            ? initialData.tanggal_peristiwa.split("T")[0]
            : "",
        }
      : {},
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);

    try {
      let result;
      if (mode === "create") {
        result = await createMutasi(data as CreateMutasiData);
      } else {
        result = await updateMutasi({
          ...data,
          id: initialData.id,
        } as UpdateMutasiData);
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
          ? "Data mutasi berhasil ditambahkan"
          : "Data mutasi berhasil diperbarui"
      );

      // Redirect
      router.push("/mutasi");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Penduduk */}
      <div className="space-y-2">
        <Label htmlFor="penduduk_id" className="text-white">
          Penduduk <span className="text-red-400">*</span>
        </Label>
        <Select
          defaultValue={initialData?.penduduk_id || ""}
          onValueChange={(value) => setValue("penduduk_id", value)}
        >
          <SelectTrigger className="bg-gray-50">
            <SelectValue placeholder="Pilih Penduduk" />
          </SelectTrigger>
          <SelectContent>
            {pendudukList.map((penduduk) => (
              <SelectItem key={penduduk.id} value={penduduk.id}>
                {penduduk.nik} - {penduduk.nama_lengkap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.penduduk_id && (
          <p className="text-sm text-red-400">
            {errors.penduduk_id.message as string}
          </p>
        )}
      </div>

      {/* Jenis Mutasi */}
      <div className="space-y-2">
        <Label htmlFor="jenis_mutasi" className="text-white">
          Jenis Mutasi <span className="text-red-400">*</span>
        </Label>
        <Select
          defaultValue={initialData?.jenis_mutasi || ""}
          onValueChange={(value) => setValue("jenis_mutasi", value as any)}
        >
          <SelectTrigger className="bg-gray-50">
            <SelectValue placeholder="Pilih Jenis Mutasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LAHIR">LAHIR</SelectItem>
            <SelectItem value="MATI">MATI</SelectItem>
            <SelectItem value="PINDAH_DATANG">PINDAH DATANG</SelectItem>
            <SelectItem value="PINDAH_KELUAR">PINDAH KELUAR</SelectItem>
          </SelectContent>
        </Select>
        {errors.jenis_mutasi && (
          <p className="text-sm text-red-400">
            {errors.jenis_mutasi.message as string}
          </p>
        )}
      </div>

      {/* Tanggal Peristiwa */}
      <div className="space-y-2">
        <Label htmlFor="tanggal_peristiwa" className="text-white">
          Tanggal Peristiwa <span className="text-red-400">*</span>
        </Label>
        <Input
          id="tanggal_peristiwa"
          {...register("tanggal_peristiwa")}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          className="bg-gray-50"
        />
        {errors.tanggal_peristiwa && (
          <p className="text-sm text-red-400">
            {errors.tanggal_peristiwa.message as string}
          </p>
        )}
      </div>

      {/* Keterangan */}
      <div className="space-y-2">
        <Label htmlFor="keterangan" className="text-white">
          Keterangan (Opsional)
        </Label>
        <textarea
          id="keterangan"
          {...register("keterangan")}
          placeholder="Keterangan tambahan..."
          rows={3}
          className="w-full rounded-md border-2 border-gray-500 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.keterangan && (
          <p className="text-sm text-red-400">
            {errors.keterangan.message as string}
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
  );
}
