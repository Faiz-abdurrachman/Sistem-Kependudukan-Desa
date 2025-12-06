/**
 * Notification Settings Component
 * Pengaturan notifikasi
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getNotificationSettings,
  saveNotificationSettings,
} from "@/app/actions/notifications";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    mutasi: true,
    surat: true,
    laporan: false,
    sistem: true,
  });

  const [inAppNotifications, setInAppNotifications] = useState({
    mutasi: true,
    surat: true,
    laporan: true,
    sistem: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      const result = await getNotificationSettings();
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        setEmailNotifications(result.data.email || emailNotifications);
        setInAppNotifications(result.data.inApp || inAppNotifications);
      }
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveNotificationSettings({
        email: emailNotifications,
        inApp: inAppNotifications,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Pengaturan notifikasi berhasil disimpan");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan pengaturan");
      console.error("Save notification settings error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notifikasi Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">
                  Mutasi Penduduk
                </Label>
                <p className="text-sm text-slate-400">
                  Notifikasi saat ada mutasi baru (lahir, mati, pindah)
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.mutasi}
                onChange={(e) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    mutasi: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">Surat Keluar</Label>
                <p className="text-sm text-slate-400">
                  Notifikasi saat ada surat baru yang dibuat
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.surat}
                onChange={(e) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    surat: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">Laporan</Label>
                <p className="text-sm text-slate-400">
                  Notifikasi saat laporan siap di-download
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.laporan}
                onChange={(e) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    laporan: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">
                  Peringatan Sistem
                </Label>
                <p className="text-sm text-slate-400">
                  Notifikasi untuk update sistem dan maintenance
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.sistem}
                onChange={(e) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    sistem: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Notifikasi email akan dikirim ke alamat email Anda yang terdaftar.
          </p>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifikasi In-App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">
                  Mutasi Penduduk
                </Label>
                <p className="text-sm text-slate-400">
                  Tampilkan notifikasi di aplikasi
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppNotifications.mutasi}
                onChange={(e) =>
                  setInAppNotifications({
                    ...inAppNotifications,
                    mutasi: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">Surat Keluar</Label>
                <p className="text-sm text-slate-400">
                  Tampilkan notifikasi di aplikasi
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppNotifications.surat}
                onChange={(e) =>
                  setInAppNotifications({
                    ...inAppNotifications,
                    surat: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">Laporan</Label>
                <p className="text-sm text-slate-400">
                  Tampilkan notifikasi di aplikasi
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppNotifications.laporan}
                onChange={(e) =>
                  setInAppNotifications({
                    ...inAppNotifications,
                    laporan: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
              <div>
                <Label className="text-white font-semibold">
                  Peringatan Sistem
                </Label>
                <p className="text-sm text-slate-400">
                  Tampilkan notifikasi di aplikasi
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppNotifications.sistem}
                onChange={(e) =>
                  setInAppNotifications({
                    ...inAppNotifications,
                    sistem: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Notifikasi in-app akan muncul di pojok kanan atas layar.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md border-2 border-blue-500 hover:border-blue-400"
        >
          {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>
    </div>
  );
}
