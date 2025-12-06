/**
 * Surat Keluar Form Component
 * Form untuk create dan edit surat keluar
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSuratKeluarSchema,
  updateSuratKeluarSchema,
} from "@/lib/validations/surat-keluar";
import type {
  CreateSuratKeluarData,
  UpdateSuratKeluarData,
} from "@/lib/validations/surat-keluar";
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
  createSuratKeluar,
  updateSuratKeluar,
} from "@/app/actions/surat-keluar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SuratKeluarFormProps {
  pendudukList: Array<{
    id: string;
    nik: string;
    nama_lengkap: string;
  }>;
  initialData?: any; // Untuk edit mode
  mode?: "create" | "edit";
}

export function SuratKeluarForm({
  pendudukList,
  initialData,
  mode = "create",
}: SuratKeluarFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema =
    mode === "create" ? createSuratKeluarSchema : updateSuratKeluarSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateSuratKeluarData | UpdateSuratKeluarData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          ...initialData,
          tanggal_cetak: initialData.tanggal_cetak
            ? initialData.tanggal_cetak.split("T")[0]
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
        result = await createSuratKeluar(data as CreateSuratKeluarData);
      } else {
        result = await updateSuratKeluar({
          ...data,
          id: initialData.id,
        } as UpdateSuratKeluarData);
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
          ? "Data surat keluar berhasil ditambahkan"
          : "Data surat keluar berhasil diperbarui"
      );

      // Redirect
      router.push("/surat-keluar");
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

      {/* Jenis Surat */}
      <div className="space-y-2">
        <Label htmlFor="jenis_surat" className="text-white">
          Jenis Surat <span className="text-red-400">*</span>
        </Label>
        <Select
          defaultValue={initialData?.jenis_surat || ""}
          onValueChange={(value) => setValue("jenis_surat", value as any)}
        >
          <SelectTrigger className="bg-gray-50">
            <SelectValue placeholder="Pilih Jenis Surat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SKTM">
              SKTM (Surat Keterangan Tidak Mampu)
            </SelectItem>
            <SelectItem value="DOMISILI">DOMISILI</SelectItem>
            <SelectItem value="KEMATIAN">KEMATIAN</SelectItem>
            <SelectItem value="KELAHIRAN">KELAHIRAN</SelectItem>
            <SelectItem value="USAHA">USAHA</SelectItem>
            <SelectItem value="LAINNYA">LAINNYA</SelectItem>
          </SelectContent>
        </Select>
        {errors.jenis_surat && (
          <p className="text-sm text-red-400">
            {errors.jenis_surat.message as string}
          </p>
        )}
      </div>

      {/* Nomor Surat */}
      <div className="space-y-2">
        <Label htmlFor="nomor_surat" className="text-white">
          Nomor Surat <span className="text-red-400">*</span>
        </Label>
        <Input
          id="nomor_surat"
          {...register("nomor_surat")}
          placeholder="Nomor surat (contoh: 001/SKTM/2024)"
          className="bg-gray-50"
        />
        {errors.nomor_surat && (
          <p className="text-sm text-red-400">
            {errors.nomor_surat.message as string}
          </p>
        )}
      </div>

      {/* Tanggal Cetak */}
      <div className="space-y-2">
        <Label htmlFor="tanggal_cetak" className="text-white">
          Tanggal Cetak <span className="text-red-400">*</span>
        </Label>
        <Input
          id="tanggal_cetak"
          {...register("tanggal_cetak")}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          className="bg-gray-50"
        />
        {errors.tanggal_cetak && (
          <p className="text-sm text-red-400">
            {errors.tanggal_cetak.message as string}
          </p>
        )}
      </div>

      {/* File PDF URL */}
      <div className="space-y-2">
        <Label htmlFor="file_pdf_url" className="text-white">
          URL File PDF (Opsional)
        </Label>
        <Input
          id="file_pdf_url"
          {...register("file_pdf_url")}
          placeholder="https://..."
          type="url"
          className="bg-gray-50"
        />
        {errors.file_pdf_url && (
          <p className="text-sm text-red-400">
            {errors.file_pdf_url.message as string}
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
