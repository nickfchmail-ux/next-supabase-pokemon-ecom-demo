import { ShieldCheck, ShieldX } from 'lucide-react';
import { Badge } from '../../_componentAPI/badge';
import { Button } from '../../_componentAPI/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../_componentAPI/table';
import { getAllUsers } from '../../_lib/admin-data-service';

export const metadata = {
  title: 'Users',
};

const ROLE_STYLES = {
  admin: 'bg-purple-100 text-purple-700 border-purple-300',
  superadmin: 'bg-purple-200 text-purple-800 border-purple-400',
  customer: 'bg-slate-100 text-slate-600 border-slate-300',
};

/**
 * User management page — lists all members with role indicators.
 */
export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Registered Users</h2>
        <p className="text-slate-500 mt-1">{users?.length || 0} members in the database</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!users || users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs text-slate-500">#{u.id}</TableCell>
                  <TableCell className="font-medium">
                    {u.first_name} {u.last_name}
                  </TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={ROLE_STYLES[u.role] || ROLE_STYLES.customer}
                    >
                      {u.role === 'admin' || u.role === 'superadmin' ? (
                        <ShieldCheck size={12} className="mr-1" />
                      ) : (
                        <ShieldX size={12} className="mr-1" />
                      )}
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(u.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
