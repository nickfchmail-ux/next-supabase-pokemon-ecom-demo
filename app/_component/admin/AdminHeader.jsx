'use client';

import { LogOut, ShieldCheck } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminHeader({ user }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0">
      <h1 className="text-lg font-semibold text-slate-800">Admin Portal</h1>

      <div className="flex items-center gap-4">
        {/* Role badge */}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300">
          <ShieldCheck size={14} />
          {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
        </span>

        {/* User info */}
        <div className="flex items-center gap-3">
          {user?.image && (
            <img src={user.image} alt="" className="w-7 h-7 rounded-full border border-slate-300" />
          )}
          <span className="text-sm text-slate-600 hidden sm:inline">{user?.email}</span>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
