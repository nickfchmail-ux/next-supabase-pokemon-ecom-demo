import { redirect } from 'next/navigation';
import { auth } from './auth';

/**
 * withAdminAuth — Server-side HOC that wraps an admin page component.
 *
 * Validates ENTIRELY on the backend (server component):
 * 1. User must be authenticated (NextAuth session).
 * 2. User's role must be 'admin' or 'superadmin' (from members.role column).
 *
 * Usage:
 *   import { withAdminAuth } from '../_lib/admin-auth';
 *   function MyAdminPage() { return <div>Admin Panel</div>; }
 *   export default withAdminAuth(MyAdminPage);
 */
export function withAdminAuth(PageComponent) {
  async function AdminProtectedPage(props) {
    const session = await auth();

    if (!session?.user?.id) {
      redirect('/login');
    }

    const role = session.user.role;
    if (role !== 'admin' && role !== 'superadmin') {
      redirect('/account');
    }

    return <PageComponent {...props} />;
  }

  AdminProtectedPage.displayName = `withAdminAuth(${PageComponent.displayName || PageComponent.name || 'PageComponent'})`;
  return AdminProtectedPage;
}
