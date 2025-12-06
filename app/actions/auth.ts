/**
 * Server Actions untuk Authentication
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Logout
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

/**
 * Update Password
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify current password by trying to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: "Password saat ini salah" };
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message || "Gagal mengubah password" };
  }

  return { error: null };
}

/**
 * Get Active Sessions
 */
export async function getActiveSessions() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", data: null };
  }

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { error: null, data: [] };
  }

  return {
    error: null,
    data: [
      {
        id: session.access_token.substring(0, 20),
        device: "Browser",
        location: "Unknown",
        ip: "Unknown",
        lastActive: new Date(session.expires_at! * 1000).toISOString(),
        current: true,
      },
    ],
  };
}

/**
 * Get Login Activity
 */
export async function getLoginActivity(limit: number = 10) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", data: null };
  }

  // Get user metadata for login history
  // Note: Supabase doesn't store login history by default
  // This is a placeholder - you might want to create an audit_log table
  const loginHistory = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      location: "Jakarta, Indonesia",
      success: true,
    },
  ];

  return { error: null, data: loginHistory };
}
