/**
 * Profile Settings Component
 * Form untuk mengubah profil user
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileSettingsProps {
  user: {
    id: string;
    email?: string | null;
  };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [email, setEmail] = useState(user.email || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Email dan User ID tidak dapat diubah melalui UI
    // Email diatur oleh Supabase Auth dan hanya bisa diubah oleh admin
    // User ID adalah identifier unik yang tidak dapat diubah
    toast.info(
      "Email dan User ID tidak dapat diubah. Hubungi administrator untuk perubahan email."
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5" />
          Informasi Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
            className="bg-slate-700 text-slate-300"
          />
          <p className="text-xs text-slate-400">
            Email tidak dapat diubah. Hubungi administrator untuk mengubah
            email.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-id" className="text-white">
            User ID
          </Label>
          <Input
            id="user-id"
            type="text"
            value={user.id}
            disabled
            className="bg-slate-700 text-slate-300 font-mono text-sm"
          />
          <p className="text-xs text-slate-400">ID unik untuk akun Anda</p>
        </div>

        <div className="pt-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-200">
              <strong>Catatan:</strong> Email dan User ID tidak dapat diubah
              melalui aplikasi. Email hanya dapat diubah oleh administrator
              melalui Supabase Dashboard.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
