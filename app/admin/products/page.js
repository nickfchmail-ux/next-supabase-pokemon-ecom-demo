import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../_componentAPI/button';
import ProductSearchTable from '../../_component/admin/Products/ProductSearchTable';
import { getAllProducts } from '../../_lib/admin-data-service';

export const metadata = {
  title: 'Inventory',
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pokémon Inventory</h2>
          <p className="text-slate-500 mt-1">{products?.length || 0} products in catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus size={16} className="mr-1.5" />
            Add Pokémon
          </Button>
        </Link>
      </div>

      <ProductSearchTable products={products || []} />
    </div>
  );
}
