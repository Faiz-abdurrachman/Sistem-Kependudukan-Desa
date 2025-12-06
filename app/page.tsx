/**
 * Root Page - Redirect ke Login atau Dashboard
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika sudah login, redirect ke dashboard
  // Jika belum login, redirect ke login
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
