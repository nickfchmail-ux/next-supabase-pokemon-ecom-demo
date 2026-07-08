'use server';

import { auth } from './auth';
import { ensureRoleColumn } from './data-service';
import { supabase } from './supabase';

// ──────────────────────────────────────────────────────────────────
// Admin Data Service — All queries use SUPABASE_SECRET_KEY
// Never call these from client components directly.
// Always go through Server Actions or API routes.
// ──────────────────────────────────────────────────────────────────

/**
 * Verify the current session has admin privileges.
 * Returns the userId if admin, throws otherwise.
 * Auto-migrates the role column if needed.
 */
async function requireAdmin() {
  await ensureRoleColumn();

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  const { data: member } = await supabase
    .from('members')
    .select('role')
    .eq('id', session.user.id)
    .single();

  console.log(`[requireAdmin] userId=${session.user.id}, role=${member?.role}`);

  if (member?.role !== 'admin' && member?.role !== 'superadmin') {
    throw new Error(
      `Forbidden: your role is '${member?.role || 'undefined'}'. Run: UPDATE members SET role = 'admin' WHERE id = ${session.user.id}`
    );
  }
  return session.user.id;
}

// ──────────────────────────────────────────────────────────────────
// Analytics Queries
// ──────────────────────────────────────────────────────────────────

export async function getTopProducts(limit = 10) {
  await requireAdmin();

  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select('product_id, quantity');

  if (error) throw new Error(error.message);

  const quantityByProduct = {};
  (orderItems || []).forEach((item) => {
    quantityByProduct[item.product_id] = (quantityByProduct[item.product_id] || 0) + item.quantity;
  });

  const topIds = Object.entries(quantityByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const { data: products, error: productError } = await supabase
    .from('pokemons')
    .select('id, name')
    .in('id', topIds);

  if (productError) throw new Error(productError.message);

  const productMap = {};
  (products || []).forEach((p) => { productMap[p.id] = p.name; });

  return topIds.map((id) => ({
    name: productMap[id] || `#${id}`,
    sold: quantityByProduct[id] || 0,
  }));
}

/**
 * Write an entry to the admin audit log.
 */
export async function auditLog(actionType, targetId = null, changes = null) {
  try {
    const adminId = await requireAdmin();
    await supabase.from('admin_audit_logs').insert([
      {
        admin_id: adminId,
        action_type: actionType,
        target_id: targetId ? String(targetId) : null,
        changes,
      },
    ]);
  } catch {
    // Audit log failures should not block the main operation
  }
}

// ──────────────────────────────────────────────────────────────────
// Dashboard KPIs
// ──────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  await requireAdmin();

  const [{ count: productCount }, { count: orderCount }, { count: userCount }, { data: orders }] =
    await Promise.all([
      supabase.from('pokemons').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('members').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount, payment_status, created_at'),
    ]);

  const totalRevenue = (orders || [])
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const paidCount = (orders || []).filter((o) => o.payment_status === 'paid').length;

  // 30-day sales for chart
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentOrders = (orders || []).filter((o) => new Date(o.created_at) >= thirtyDaysAgo);

  return {
    productCount: productCount || 0,
    orderCount: orderCount || 0,
    userCount: userCount || 0,
    totalRevenue,
    paidCount,
    recentOrders,
  };
}

// ──────────────────────────────────────────────────────────────────
// Product CRUD (Admin)
// ──────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  await requireAdmin();
  const { data, error } = await supabase
    .from('pokemons')
    .select('*, pokemons_selling(*)')
    .order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function getProductById(id) {
  await requireAdmin();
  const { data, error } = await supabase
    .from('pokemons')
    .select('*, pokemons_selling(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id, updates) {
  const adminId = await requireAdmin();
  const { data, error } = await supabase
    .from('pokemons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  await auditLog('PRODUCT_UPDATE', id, { before: null, after: updates });
  return data;
}

export async function createProduct(product) {
  const adminId = await requireAdmin();
  const { data, error } = await supabase.from('pokemons').insert([product]).select().single();
  if (error) throw new Error(error.message);
  await auditLog('PRODUCT_CREATE', data.id, product);
  return data;
}

export async function deleteProduct(id) {
  await requireAdmin();
  const { error } = await supabase.from('pokemons').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await auditLog('PRODUCT_DELETE', id);
  return { success: true };
}

// ──────────────────────────────────────────────────────────────────
// Order Management (Admin)
// ──────────────────────────────────────────────────────────────────

export async function getAllOrders() {
  await requireAdmin();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(orderId, paymentStatus) {
  await requireAdmin();
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('order_id', orderId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  await auditLog('ORDER_UPDATE', orderId, { paymentStatus });
  return data;
}

// ──────────────────────────────────────────────────────────────────
// User Management (Admin)
// ──────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  await requireAdmin();
  const { data, error } = await supabase
    .from('members')
    .select('id, first_name, last_name, email, role, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserRole(userId, role) {
  await requireAdmin();
  const { data, error } = await supabase
    .from('members')
    .update({ role })
    .eq('id', userId)
    .select('id, email, role')
    .single();
  if (error) throw new Error(error.message);
  await auditLog('USER_ROLE_UPDATE', userId, { role });
  return data;
}
