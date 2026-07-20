import { notFound } from 'next/navigation';
import ProductEditForm from '../../../_component/admin/Products/ProductEditForm';
import { getProductById } from '../../../_lib/admin-data-service';

export const dynamic = 'force-dynamic';
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return { title: `Edit: ${product?.name || 'Product'}` };
  } catch {
    return { title: 'Edit Product' };
  }
}

export default async function ProductEditPage({ params }) {
  const { id } = await params;
  const isNew = id === 'new';

  let product = null;
  if (!isNew) {
    try {
      product = await getProductById(id);
    } catch {
      notFound();
    }
  }

  return <ProductEditForm product={product} isNew={isNew} />;
}
