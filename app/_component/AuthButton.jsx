"use client"

import Avatar from "@mui/material/Avatar";
import { ShieldCheck } from 'lucide-react';
import Link from "next/link";
import SignOutButton from "./SignOutButton";

function AuthButton({ user }) {
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div>
      {!user ? <Link href={'/login'}>Sign in</Link> : null}

      {user && (
        <li className="text-sm flex place-items-center gap-2">
          {/* Admin badge — visible for admin users */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-2 py-1 rounded-full transition-colors"
              title="Go to Admin Portal"
            >
              <ShieldCheck size={14} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          <Avatar alt={user?.name} src={user?.image} sx={{ width: 30, height: 30 }} />

          <span>{user?.first_name}</span>
          <SignOutButton view={'mobile'} />
        </li>
      )}
    </div>
  );
}
export default AuthButton;
