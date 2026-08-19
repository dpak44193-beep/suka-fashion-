import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import ethnicWearBanner from '@/imports/banners/ethnic-wear.png';
import readyToWearBanner from '@/imports/banners/ready-to-wear.png';
import westernWearBanner from '@/imports/banners/western-wear.png';
import accessoriesBanner from '@/imports/banners/accessories.png';

const PRODUCT_CATEGORIES = CATEGORIES.filter(cat => cat !== 'Sarees' && cat !== 'Lehengas');

const PRODUCT_BANNERS: Record<string, string> = {
  All: readyToWearBanner,
  'Kurtas & Suits': readyToWearBanner,
  'Gowns & Dresses': accessoriesBanner,
  'Western Wear': westernWearBanner,
  Accessories: ethnicWearBanner,
};

export default function ProductsPage() {
  const { navigate, products, selectedCategory: navigationCategory } = useApp();
  const { selectedSearch: navigationSearch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(navigationCategory);
  const [search, setSearch] = useState(navigationSearch);

  useEffect(() => {
    setSelectedCategory(navigationCategory);
    setSearch(navigationSearch);
  }, [navigationCategory, navigationSearch]);

  const filtered = useMemo(() => {
    let result = products.filter(p => p.isActive);

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, selectedCategory, search]);

  function clearSearch() {
    setSelectedCategory('All');
    setSearch('');
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-5">
            Our Collection
          </h1>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E8E4DC] rounded-full bg-white text-[#2D3436] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4A9BA8] focus:ring-2 focus:ring-[#4A9BA8]/20"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {['All', ...PRODUCT_CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => navigate('products', undefined, cat)}
                className={`shrink-0 px-4 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#4A9BA8] text-white border-[#4A9BA8]'
                    : 'border-[#E8E4DC] text-[#6B7280] hover:border-[#4A9BA8] hover:text-[#4A9BA8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category banner */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-[#F5F1E8]">
          <img
            src={PRODUCT_BANNERS[selectedCategory]}
            alt={`${selectedCategory === 'All' ? 'Suka Fashions' : selectedCategory} collection`}
            className="block h-auto w-full"
          />
        </div>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#9CA3AF]">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
          {search && (
            <button
              onClick={clearSearch}
              className="text-xs text-[#4A9BA8] hover:text-[#2D6B76] transition-colors"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-display text-xl text-[#2D3436] mb-2">No products found</p>
            <p className="text-sm text-[#9CA3AF] mb-5">Try another search</p>
            <button
              onClick={clearSearch}
              className="px-6 py-2.5 bg-[#4A9BA8] text-white text-sm rounded-full hover:bg-[#2D6B76] transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
