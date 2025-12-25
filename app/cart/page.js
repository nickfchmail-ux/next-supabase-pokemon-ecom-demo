import CartList from '../_component/CartList';
import CartSummary from '../_component/CartSummary';

export default function Page() {
  return (
    <div className="bg-yellow-200 grid grid-cols-[4fr_3fr] gap-2 h-[80vh] gap-2 flex overflow-hidden">
      <CartList />
      <CartSummary />
    </div>
  );
}
