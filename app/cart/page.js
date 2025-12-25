import CartList from '../_component/CartList';
import CartSummary from '../_component/CartSummary';

export default function Page() {
  return (
    <div className="bg-yellow-200 flex flex-col md:grid md:grid-cols-[2fr_1fr] h-[80vh]  flex overflow-hidden">
      <CartList />
      <CartSummary />
    </div>
  );
}
