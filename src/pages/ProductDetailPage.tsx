import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PRODUCTS } from '@/data/mockData';

export default function ProductDetailPage() {
  const { selectedProductId, navigate, addToCart } = useApp();
  const product = PRODUCTS.find(p => p.id === selectedProductId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <p className="text-5xl mb-5">🛍️</p>
          <p className="font-display text-xl text-[#2D3436] mb-2">Product not found</p>
          <button
            onClick={() => navigate('products')}
            className="text-sm text-[#4A9BA8] hover:underline"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  function handleAddToCart() {
    let valid = true;
    if (!selectedSize) { setSizeError(true); valid = false; }
    if (!selectedColor) { setColorError(true); valid = false; }
    if (!valid) return;
    addToCart({ product: product!, size: selectedSize, color: selectedColor, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const related = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-8" aria-label="Breadcrumb">
          <button onClick={() => navigate('home')} className="hover:text-[#4A9BA8] transition-colors">
            Home
          </button>
          <span aria-hidden>›</span>
          <button onClick={() => navigate('products')} className="hover:text-[#4A9BA8] transition-colors">
            Products
          </button>
          <span aria-hidden>›</span>
          <span className="text-[#2D3436] truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F1E8]">
              <img
                src={product.images[selectedImage] ?? product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? 'border-[#4A9BA8] shadow-md'
                        : 'border-transparent hover:border-[#7FBCC4]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="py-2">
            <p className="text-xs text-[#7FBCC4] uppercase tracking-widest font-medium mb-2">
              {product.category}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] leading-tight mb-5">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-2xl font-bold text-[#2D6B76]">
                &#8377;{discountedPrice.toLocaleString('en-IN')}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-base text-[#9CA3AF] line-through">
                    &#8377;{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs bg-[#D4A574]/20 text-[#D4A574] px-2.5 py-1 rounded-full font-semibold">
                    {product.discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stockQuantity > 10 ? (
                <p className="text-sm text-[#7A9D84] font-medium">&#10003; In Stock</p>
              ) : product.stockQuantity > 0 ? (
                <p className="text-sm text-[#D4A574] font-medium">
                  &#9888; Only {product.stockQuantity} left — order soon
                </p>
              ) : (
                <p className="text-sm text-red-400 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Size</p>
                {sizeError && (
                  <p className="text-xs text-red-400">Please select a size</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                      selectedSize === size
                        ? 'bg-[#4A9BA8] text-white border-[#4A9BA8] shadow-sm'
                        : sizeError
                        ? 'border-red-300 text-[#2D3436] hover:border-[#4A9BA8]'
                        : 'border-[#E8E4DC] text-[#2D3436] hover:border-[#4A9BA8]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Color</p>
                {colorError && (
                  <p className="text-xs text-red-400">Please select a color</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setColorError(false); }}
                    className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                      selectedColor === color
                        ? 'bg-[#4A9BA8] text-white border-[#4A9BA8] shadow-sm'
                        : colorError
                        ? 'border-red-300 text-[#2D3436] hover:border-[#4A9BA8]'
                        : 'border-[#E8E4DC] text-[#2D3436] hover:border-[#4A9BA8]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-[#E8E4DC] flex items-center justify-center text-[#2D3436] hover:border-[#4A9BA8] hover:text-[#4A9BA8] transition-colors text-lg leading-none"
                >
                  &minus;
                </button>
                <span className="w-8 text-center font-medium text-[#2D3436]">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(q => Math.min(product.stockQuantity, q + 1))
                  }
                  className="w-9 h-9 rounded-full border border-[#E8E4DC] flex items-center justify-center text-[#2D3436] hover:border-[#4A9BA8] hover:text-[#4A9BA8] transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-7">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className={`flex-1 py-3.5 rounded-xl font-medium text-sm transition-all ${
                  added
                    ? 'bg-[#7A9D84] text-white'
                    : product.stockQuantity === 0
                    ? 'bg-[#F0EDE8] text-[#9CA3AF] cursor-not-allowed'
                    : 'bg-[#4A9BA8] text-white hover:bg-[#2D6B76] shadow-sm'
                }`}
              >
                {added ? '&#10003; Added to Cart' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => navigate('cart')}
                className="px-5 py-3.5 border-2 border-[#4A9BA8] text-[#4A9BA8] rounded-xl font-medium text-sm hover:bg-[#4A9BA8] hover:text-white transition-all"
              >
                Cart
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-[#E8E4DC] pt-6">
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">
                About this piece
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed">{product.description}</p>
            </div>

            <p className="text-xs text-[#C0BAB2] mt-5">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-[#E8E4DC] pt-12">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D3436] mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate('product-detail', p.id)}
                  className="group text-left"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F1E8] mb-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-display text-sm font-semibold text-[#2D3436] leading-tight mb-1">
                    {p.name}
                  </p>
                  <p className="text-sm text-[#2D6B76] font-semibold">
                    &#8377;{(p.price * (1 - p.discountPercentage / 100)).toLocaleString('en-IN')}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
