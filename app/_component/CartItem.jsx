import AmendCartQuanityButton from './AmendCartQuanityButton';
import PokemonDetailNavigationImage from './PokemonDetailNavigationImage';
import Price from './Price';
import PurchaseQuanity from './PurchaseQuanity';
import TotalCountPerItem from './TotalCountPerItem';

export default function CartItem({ item, isInView, ref }) {
  if (!item) return;

  return (
    <div
      ref={ref}
      className="flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-gray-50 flex items-center justify-center p-3 relative overflow-hidden rounded-l-2xl">
        <PokemonDetailNavigationImage id={item?.id} view={'cart'} />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg truncate">{item?.name}</h3>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {item.species.map((sp) => (
              <span
                key={sp}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize"
              >
                {sp}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <AmendCartQuanityButton id={item?.id} view={'mobile'} />
            <PurchaseQuanity id={item?.id} view={'Cart'} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-400 line-through">
              ${item.pokemons_selling?.regular_price}
            </span>
            <Price
              price={(
                item.pokemons_selling?.regular_price *
                (1 - (item.pokemons_selling?.discount || 0) / 100)
              ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            />
            <TotalCountPerItem id={item?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
