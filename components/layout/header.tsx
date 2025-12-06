/**
 * Header Component
 * Header dengan user info dan logout
 */

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { logout } from "@/app/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <header className="flex flex-1 h-16 items-center justify-between bg-slate-800">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white hidden md:block">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-slate-700/70 text-white"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-white">
                {user.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-800 border border-slate-700"
          >
            <DropdownMenuLabel className="bg-slate-800">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-white">Akun Saya</p>
                <p className="text-xs text-slate-300">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <form action={logout}>
              <DropdownMenuItem asChild>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 cursor-pointer font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
