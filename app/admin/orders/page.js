import OrderTable from '../../_component/admin/Orders/OrderTable';
import { getAllOrders } from '../../_lib/admin-data-service';

export const metadata = {
  title: 'Orders',
};

/**
 * Master Order Operations Queue.
 * Server-rendered data table with status management.
 */
export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Order Operations Queue</h2>
        <p className="text-slate-500 mt-1">
          Manage and track all customer orders. Click an order for details.
        </p>
      </div>

      <OrderTable orders={orders} />
    </div>
  );
}
