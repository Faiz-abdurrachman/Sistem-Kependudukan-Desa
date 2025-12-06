/**
 * Server Actions untuk Notification Settings
 * Save dan load notification preferences
 */

"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get Notification Settings untuk user
 */
export async function getNotificationSettings() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get from user metadata (Supabase Auth user_metadata)
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const settings = authUser?.user_metadata?.notification_settings || {
      email: {
        mutasi: true,
        surat: true,
        laporan: false,
        sistem: true,
      },
      inApp: {
        mutasi: true,
        surat: true,
        laporan: true,
        sistem: true,
      },
    };

    return {
      data: settings,
      error: null,
    };
  } catch (error: any) {
    console.error("Error getting notification settings:", error);
    return {
      error: error.message || "Gagal mengambil pengaturan notifikasi",
    };
  }
}

/**
 * Save Notification Settings
 */
export async function saveNotificationSettings(settings: {
  email: {
    mutasi: boolean;
    surat: boolean;
    laporan: boolean;
    sistem: boolean;
  };
  inApp: {
    mutasi: boolean;
    surat: boolean;
    laporan: boolean;
    sistem: boolean;
  };
}) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Update user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        notification_settings: settings,
      },
    });

    if (error) {
      console.error("Error saving notification settings:", error);
      return {
        error: error.message || "Gagal menyimpan pengaturan notifikasi",
      };
    }

    return {
      error: null,
    };
  } catch (error: any) {
    console.error("Error saving notification settings:", error);
    return {
      error: error.message || "Gagal menyimpan pengaturan notifikasi",
    };
  }
}
