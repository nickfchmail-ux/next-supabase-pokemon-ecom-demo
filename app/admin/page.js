import { RevenueChart, TopProductsChart } from '../_component/admin/Dashboard/RevenueChart';
import StatCards from '../_component/admin/Dashboard/StatCards';
import { getDashboardStats, getTopProducts } from '../_lib/admin-data-service';

export const metadata = {
  title: 'Dashboard',
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const topProducts = await getTopProducts(10);

  const kpis = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: 'dollar-sign', type: 'grass', subtext: `${stats.paidCount} paid orders` },
    { label: 'Total Orders', value: stats.orderCount, icon: 'shopping-cart', type: 'water' },
    { label: 'Registered Users', value: stats.userCount, icon: 'users', type: 'psychic' },
    { label: 'Product Catalog', value: stats.productCount, icon: 'package', type: 'fire' },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">
          Welcome to the Poke芒 admin portal. Monitor your store&apos;s performance at a glance.
        </p>
      </div>

      {/* KPI Cards */}
      <StatCards stats={kpis} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats.recentOrders} />
        <TopProductsChart data={topProducts} />
      </div>

      {/* Visitor section — placeholder */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-2">Live Center Traffic</h3>
        <p className="text-sm text-slate-400">
          Real-time visitor monitoring will be integrated with Socket.IO in a future update.
        </p>
      </div>
    </div>
  );
}
