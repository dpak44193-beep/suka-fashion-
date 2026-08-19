import { Product } from '@/types';
import { useApp } from '@/context/AppContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { navigate } = useApp();
  const discountedPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  return (
    <button
      onClick={() => navigate('product-detail', product.id)}
      className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E8E4DC]"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-[#F5F1E8]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-[#D4A574] text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {product.discountPercentage}% OFF
          </span>
        )}
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <span className="absolute top-3 right-3 bg-[#4A9BA8] text-white text-xs px-2.5 py-1 rounded-full">
            Only {product.stockQuantity} left
          </span>
        )}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-medium text-[#2D3436] bg-white/80 px-3 py-1.5 rounded-full">
              Out of stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-[#7FBCC4] uppercase tracking-widest mb-1.5">
          {product.category}
        </p>
        <h3 className="font-display text-base font-semibold text-[#2D3436] mb-2 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-[#2D6B76]">
            &#8377;{discountedPrice.toLocaleString('en-IN')}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-[#9CA3AF] line-through">
              &#8377;{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {product.colorOptions.slice(0, 3).map((c, i) => (
            <span key={c} className="text-xs text-[#6B7280]">
              {c}{i < Math.min(2, product.colorOptions.length - 1) ? ',' : ''}
            </span>
          ))}
          {product.colorOptions.length > 3 && (
            <span className="text-xs text-[#9CA3AF]">
              +{product.colorOptions.length - 3} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
