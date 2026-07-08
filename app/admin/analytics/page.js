import { RevenueChart, TopProductsChart } from '../../_component/admin/Dashboard/RevenueChart';
import { getDashboardStats, getTopProducts } from '../../_lib/admin-data-service';

export const metadata = {
  title: 'Analytics',
};

export default async function AdminAnalyticsPage() {
  const stats = await getDashboardStats();
  const topProducts = await getTopProducts(10);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-slate-500 mt-1">Revenue trends and top-performing products from real order data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats.recentOrders} />
        <TopProductsChart data={topProducts} />
      </div>
    </div>
  );
}
