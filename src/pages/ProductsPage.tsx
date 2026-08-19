import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'discount';

function effectivePrice(p: Product): number {
  return p.price * (1 - p.discountPercentage / 100);
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'One Size'];

  function toggleSize(size: string) {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  }

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter(p => p.isActive);

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
    if (selectedSizes.length > 0) {
      result = result.filter(p =>
        selectedSizes.some(s => p.sizeOptions.includes(s))
      );
    }
    result = result.filter(p => effectivePrice(p) <= maxPrice);

    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      case 'price-desc':
        return [...result].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      case 'discount':
        return [...result].sort((a, b) => b.discountPercentage - a.discountPercentage);
      default:
        return result;
    }
  }, [selectedCategory, maxPrice, selectedSizes, sortBy, search]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedSizes.length +
    (maxPrice < 20000 ? 1 : 0);

  function clearFilters() {
    setSelectedCategory('All');
    setMaxPrice(20000);
    setSelectedSizes([]);
    setSearch('');
    setSortBy('featured');
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-5">
            Our Collection
          </h1>

          {/* Search + Sort + Filter Toggle */}
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
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E8E4DC] rounded-full focus:outline-none focus:border-[#4A9BA8] focus:ring-2 focus:ring-[#4A9BA8]/20"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="px-4 py-2.5 text-sm border border-[#E8E4DC] rounded-full focus:outline-none focus:border-[#4A9BA8] bg-white text-[#2D3436] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Best Discount</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 text-sm rounded-full border transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'bg-[#4A9BA8] text-white border-[#4A9BA8]'
                    : 'border-[#E8E4DC] text-[#2D3436] hover:border-[#4A9BA8]'
                }`}
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-white/30 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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
        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 mb-6 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      selectedSizes.includes(size)
                        ? 'bg-[#4A9BA8] text-white border-[#4A9BA8]'
                        : 'border-[#E8E4DC] text-[#6B7280] hover:border-[#4A9BA8]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">
                Max Price: &#8377;{maxPrice.toLocaleString('en-IN')}
              </p>
              <input
                type="range"
                min={500}
                max={20000}
                step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#4A9BA8]"
              />
              <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                <span>&#8377;500</span>
                <span>&#8377;20,000</span>
              </div>
            </div>
          </div>
        )}

        {/* Results bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#9CA3AF]">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
          {(activeFilterCount > 0 || search) && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#4A9BA8] hover:text-[#2D6B76] transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-display text-xl text-[#2D3436] mb-2">No products found</p>
            <p className="text-sm text-[#9CA3AF] mb-5">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-[#4A9BA8] text-white text-sm rounded-full hover:bg-[#2D6B76] transition-colors"
            >
              Clear Filters
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
