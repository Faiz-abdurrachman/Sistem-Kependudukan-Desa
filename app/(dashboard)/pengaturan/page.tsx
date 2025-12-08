/**
 * Pengaturan Page - Complete Settings
 * Halaman lengkap untuk pengaturan sistem dan akun
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { SystemSettings } from "@/components/settings/system-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { UserManagement } from "@/components/settings/user-management";
import { User, Settings, Shield, Bell } from "lucide-react";
import { isAdmin } from "@/lib/utils/rbac";

export default async function PengaturanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin
  const userIsAdmin = await isAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pengaturan</h1>
        <p className="text-slate-200 font-medium">
          Kelola pengaturan sistem dan akun Anda
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-slate-800 border-slate-700 gap-1">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Sistem
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifikasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemSettings />
          {userIsAdmin && (
            <div className="mt-6">
              <UserManagement />
            </div>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
