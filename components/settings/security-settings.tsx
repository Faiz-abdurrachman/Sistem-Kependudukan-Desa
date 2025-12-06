/**
 * Security Settings Component
 * Pengaturan keamanan akun
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export function SecuritySettings() {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua field harus diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi password tidak sama");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await updatePassword(currentPassword, newPassword);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password berhasil diubah");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mengubah password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Ubah Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-white">
                Password Saat Ini
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white">
                Password Baru
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-50 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400">Minimal 6 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">
                Konfirmasi Password Baru
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
            >
              {isChangingPassword ? "Mengubah..." : "Ubah Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Sesi Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Browser ini</p>
                  <p className="text-sm text-slate-400">
                    Windows • Chrome • Jakarta, Indonesia
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Terakhir aktif: Sekarang
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                  Aktif
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Fitur manajemen sesi lengkap akan segera tersedia.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Aktivitas Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border border-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Login Berhasil</p>
                  <p className="text-sm text-slate-400">
                    Chrome on Windows • 192.168.1.1
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date().toLocaleString("id-ID")}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                  Berhasil
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Riwayat login lengkap akan ditampilkan di sini. Fitur ini
              memerlukan setup audit log di database.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
