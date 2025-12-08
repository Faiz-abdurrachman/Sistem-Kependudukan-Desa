/**
 * Penduduk Form Component
 * Form untuk create dan edit penduduk
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createPendudukSchema,
  updatePendudukSchema,
} from "@/lib/validations/penduduk";
import type {
  CreatePendudukData,
  UpdatePendudukData,
} from "@/lib/validations/penduduk";
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
import { createPenduduk, updatePenduduk } from "@/app/actions/penduduk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface PendudukFormProps {
  kkList: Array<{ id: string; nomor_kk: string; alamat_lengkap: string }>;
  initialData?: any; // Untuk edit mode
  mode?: "create" | "edit";
}

export function PendudukForm({
  kkList,
  initialData,
  mode = "create",
}: PendudukFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema =
    mode === "create" ? createPendudukSchema : updatePendudukSchema;
  const defaultValues = initialData
    ? {
        ...initialData,
        tgl_lahir: initialData.tgl_lahir
          ? new Date(initialData.tgl_lahir).toISOString().split("T")[0]
          : "",
      }
    : {
        status_dasar: "HIDUP" as const,
        gol_darah: "-" as const,
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreatePendudukData | UpdatePendudukData>({
    // @ts-expect-error - Type mismatch between form schema and validation schema
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Convert tgl_lahir string to Date object
      const formData = {
        ...data,
        tgl_lahir: data.tgl_lahir ? new Date(data.tgl_lahir) : undefined,
      };

      let result;
      if (mode === "create") {
        result = await createPenduduk(formData as CreatePendudukData);
      } else {
        result = await updatePenduduk({
          ...formData,
          id: initialData.id,
        } as UpdatePendudukData);
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
          ? "Data penduduk berhasil ditambahkan"
          : "Data penduduk berhasil diperbarui"
      );

      // Redirect (revalidatePath sudah dipanggil di server action)
      router.push("/penduduk");
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

      {/* Kartu Keluarga */}
      <div className="space-y-2">
        <Label htmlFor="kk_id" className="text-white">
          Kartu Keluarga <span className="text-red-400">*</span>
        </Label>
        <Select
          defaultValue={initialData?.kk_id || ""}
          onValueChange={(value) => setValue("kk_id", value)}
        >
          <SelectTrigger className="bg-gray-50">
            <SelectValue placeholder="Pilih Kartu Keluarga" />
          </SelectTrigger>
          <SelectContent>
            {kkList.map((kk) => (
              <SelectItem key={kk.id} value={kk.id}>
                {kk.nomor_kk} - {kk.alamat_lengkap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kk_id && (
          <p className="text-sm text-red-400">
            {errors.kk_id.message as string}
          </p>
        )}
      </div>

      {/* NIK */}
      <div className="space-y-2">
        <Label htmlFor="nik" className="text-white">
          NIK <span className="text-red-400">*</span>
        </Label>
        <Input
          id="nik"
          {...register("nik")}
          placeholder="16 digit NIK"
          maxLength={16}
          className="bg-gray-50"
        />
        {errors.nik && (
          <p className="text-sm text-red-400">{errors.nik.message as string}</p>
        )}
      </div>

      {/* Nama Lengkap */}
      <div className="space-y-2">
        <Label htmlFor="nama_lengkap" className="text-white">
          Nama Lengkap <span className="text-red-400">*</span>
        </Label>
        <Input
          id="nama_lengkap"
          {...register("nama_lengkap")}
          placeholder="Nama lengkap sesuai KTP"
          className="bg-gray-50"
        />
        {errors.nama_lengkap && (
          <p className="text-sm text-red-400">
            {errors.nama_lengkap.message as string}
          </p>
        )}
      </div>

      {/* Tempat & Tanggal Lahir */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tempat_lahir" className="text-white">
            Tempat Lahir <span className="text-red-400">*</span>
          </Label>
          <Input
            id="tempat_lahir"
            {...register("tempat_lahir")}
            placeholder="Kota/Kabupaten"
            className="bg-gray-50"
          />
          {errors.tempat_lahir && (
            <p className="text-sm text-red-400">
              {errors.tempat_lahir.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tgl_lahir" className="text-white">
            Tanggal Lahir <span className="text-red-400">*</span>
          </Label>
          <Input
            id="tgl_lahir"
            type="date"
            {...register("tgl_lahir")}
            className="bg-gray-50"
          />
          {errors.tgl_lahir && (
            <p className="text-sm text-red-400">
              {errors.tgl_lahir.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Jenis Kelamin & Golongan Darah */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jenis_kelamin" className="text-white">
            Jenis Kelamin <span className="text-red-400">*</span>
          </Label>
          <Select
            defaultValue={initialData?.jenis_kelamin || ""}
            onValueChange={(value) =>
              setValue("jenis_kelamin", value as "LAKI-LAKI" | "PEREMPUAN")
            }
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LAKI-LAKI">Laki-Laki</SelectItem>
              <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          {errors.jenis_kelamin && (
            <p className="text-sm text-red-400">
              {errors.jenis_kelamin.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gol_darah" className="text-white">
            Golongan Darah <span className="text-red-400">*</span>
          </Label>
          <Select
            defaultValue={initialData?.gol_darah || "-"}
            onValueChange={(value) =>
              setValue("gol_darah", value as "A" | "B" | "AB" | "O" | "-")
            }
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Pilih Golongan Darah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="AB">AB</SelectItem>
              <SelectItem value="O">O</SelectItem>
              <SelectItem value="-">-</SelectItem>
            </SelectContent>
          </Select>
          {errors.gol_darah && (
            <p className="text-sm text-red-400">
              {errors.gol_darah.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Agama & Status Kawin */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="agama" className="text-white">
            Agama <span className="text-red-400">*</span>
          </Label>
          <Select
            defaultValue={initialData?.agama || ""}
            onValueChange={(value) => setValue("agama", value as any)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Pilih Agama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ISLAM">Islam</SelectItem>
              <SelectItem value="KRISTEN">Kristen</SelectItem>
              <SelectItem value="KATOLIK">Katolik</SelectItem>
              <SelectItem value="HINDU">Hindu</SelectItem>
              <SelectItem value="BUDDHA">Buddha</SelectItem>
              <SelectItem value="KONGHUCU">Konghucu</SelectItem>
              <SelectItem value="LAINNYA">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          {errors.agama && (
            <p className="text-sm text-red-400">
              {errors.agama.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status_kawin" className="text-white">
            Status Kawin <span className="text-red-400">*</span>
          </Label>
          <Select
            defaultValue={initialData?.status_kawin || ""}
            onValueChange={(value) => setValue("status_kawin", value as any)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Pilih Status Kawin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BELUM KAWIN">Belum Kawin</SelectItem>
              <SelectItem value="KAWIN">Kawin</SelectItem>
              <SelectItem value="CERAI HIDUP">Cerai Hidup</SelectItem>
              <SelectItem value="CERAI MATI">Cerai Mati</SelectItem>
            </SelectContent>
          </Select>
          {errors.status_kawin && (
            <p className="text-sm text-red-400">
              {errors.status_kawin.message as string}
            </p>
          )}
        </div>
      </div>

      {/* SHDK & Pendidikan */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shdk" className="text-white">
            Status Hubungan dalam Keluarga{" "}
            <span className="text-red-400">*</span>
          </Label>
          <Select
            defaultValue={initialData?.shdk || ""}
            onValueChange={(value) => setValue("shdk", value as any)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Pilih SHDK" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KEPALA KELUARGA">Kepala Keluarga</SelectItem>
              <SelectItem value="SUAMI">Suami</SelectItem>
              <SelectItem value="ISTRI">Istri</SelectItem>
              <SelectItem value="ANAK">Anak</SelectItem>
              <SelectItem value="MENANTU">Menantu</SelectItem>
              <SelectItem value="CUCU">Cucu</SelectItem>
              <SelectItem value="ORANG TUA">Orang Tua</SelectItem>
              <SelectItem value="MERTUA">Mertua</SelectItem>
              <SelectItem value="FAMILI LAIN">Famili Lain</SelectItem>
              <SelectItem value="PEMBANTU">Pembantu</SelectItem>
              <SelectItem value="LAINNYA">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          {errors.shdk && (
            <p className="text-sm text-red-400">
              {errors.shdk.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pendidikan" className="text-white">
            Pendidikan <span className="text-red-400">*</span>
          </Label>
          <Select
            defaultValue={initialData?.pendidikan || ""}
            onValueChange={(value) => setValue("pendidikan", value as any)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Pilih Pendidikan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TIDAK / BELUM SEKOLAH">
                Tidak / Belum Sekolah
              </SelectItem>
              <SelectItem value="BELUM TAMAT SD">Belum Tamat SD</SelectItem>
              <SelectItem value="SD / SEDERAJAT">SD / Sederajat</SelectItem>
              <SelectItem value="SMP / SEDERAJAT">SMP / Sederajat</SelectItem>
              <SelectItem value="SMA / SEDERAJAT">SMA / Sederajat</SelectItem>
              <SelectItem value="D1 / D2 / D3">D1 / D2 / D3</SelectItem>
              <SelectItem value="D4 / S1">D4 / S1</SelectItem>
              <SelectItem value="S2">S2</SelectItem>
              <SelectItem value="S3">S3</SelectItem>
            </SelectContent>
          </Select>
          {errors.pendidikan && (
            <p className="text-sm text-red-400">
              {errors.pendidikan.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Pekerjaan */}
      <div className="space-y-2">
        <Label htmlFor="pekerjaan" className="text-white">
          Pekerjaan <span className="text-red-400">*</span>
        </Label>
        <Input
          id="pekerjaan"
          {...register("pekerjaan")}
          placeholder="Contoh: PNS, Wiraswasta, dll"
          className="bg-gray-50"
        />
        {errors.pekerjaan && (
          <p className="text-sm text-red-400">
            {errors.pekerjaan.message as string}
          </p>
        )}
      </div>

      {/* Nama Ayah & Ibu */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama_ayah" className="text-white">
            Nama Ayah
          </Label>
          <Input
            id="nama_ayah"
            {...register("nama_ayah")}
            placeholder="Nama ayah"
            className="bg-gray-50"
          />
          {errors.nama_ayah && (
            <p className="text-sm text-red-400">
              {errors.nama_ayah.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nama_ibu" className="text-white">
            Nama Ibu
          </Label>
          <Input
            id="nama_ibu"
            {...register("nama_ibu")}
            placeholder="Nama ibu"
            className="bg-gray-50"
          />
          {errors.nama_ibu && (
            <p className="text-sm text-red-400">
              {errors.nama_ibu.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Status Dasar */}
      <div className="space-y-2">
        <Label htmlFor="status_dasar" className="text-white">
          Status Dasar <span className="text-red-400">*</span>
        </Label>
        <Select
          defaultValue={initialData?.status_dasar || "HIDUP"}
          onValueChange={(value) =>
            setValue("status_dasar", value as "HIDUP" | "MATI" | "PINDAH")
          }
        >
          <SelectTrigger className="bg-gray-50">
            <SelectValue placeholder="Pilih Status Dasar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIDUP">Hidup</SelectItem>
            <SelectItem value="MATI">Mati</SelectItem>
            <SelectItem value="PINDAH">Pindah</SelectItem>
          </SelectContent>
        </Select>
        {errors.status_dasar && (
          <p className="text-sm text-red-400">
            {errors.status_dasar.message as string}
          </p>
        )}
      </div>

      {/* Catatan */}
      <div className="space-y-2">
        <Label htmlFor="catatan" className="text-white">
          Catatan
        </Label>
        <textarea
          id="catatan"
          {...register("catatan")}
          placeholder="Catatan tambahan (opsional)"
          rows={3}
          className="w-full rounded-md border-2 border-gray-500 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.catatan && (
          <p className="text-sm text-red-400">
            {errors.catatan.message as string}
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
