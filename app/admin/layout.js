import { redirect } from 'next/navigation';
import AdminHeader from '../_component/admin/AdminHeader';
import AdminSidebar from '../_component/admin/AdminSidebar';
import { auth } from '../_lib/auth';

export const metadata = {
  title: { template: '%s — Poke芒 Admin', default: 'Admin Dashboard — Poke芒' },
};

/**
 * AdminLayout — Route guard (server component).
 * Passes ONLY serializable user fields to Client Components.
 */
export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/login?error=UnauthorizedAccess');
  }

  // Extract ONLY serializable fields — never pass the raw session object
  const user = {
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
    name: session.user.name,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <AdminSidebar user={user} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
