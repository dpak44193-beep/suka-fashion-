import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=900&fit=crop&auto=format';

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1583496661160-fb5218be5698?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop&auto=format',
];

export default function HomePage() {
  const { navigate } = useApp();
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0 bg-[#2D6B76]">
          <img
            src={HERO_IMAGE}
            alt="Suka Fashions hero collection"
            className="w-full h-full object-cover opacity-55"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D6B76]/85 via-[#4A9BA8]/40 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <p className="text-[#7FBCC4] text-xs sm:text-sm uppercase tracking-[0.35em] mb-5 font-medium">
                Women Based &middot; Women Empowered
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                Wear Your
                <br />
                <em className="not-italic text-[#D4A574]">Story</em>
              </h1>
              <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed max-w-sm">
                Curated collections that celebrate every woman — from ethereal sarees to contemporary silhouettes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('products')}
                  className="px-8 py-3.5 bg-white text-[#2D6B76] font-medium rounded-full hover:bg-[#F5F1E8] transition-all shadow-lg text-sm"
                >
                  Explore Collection
                </button>
                <button
                  onClick={() => navigate('login')}
                  className="px-8 py-3.5 border border-white/40 text-white font-medium rounded-full hover:bg-white/10 transition-all text-sm"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#7FBCC4] text-xs uppercase tracking-widest mb-2 font-medium">
            Browse By
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436]">
            Categories
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => navigate('products')}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#F5F1E8]"
            >
              <img
                src={CATEGORY_IMAGES[i]}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D6B76]/80 via-[#2D6B76]/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-3">
                <p className="text-white text-xs font-medium text-center leading-tight">
                  {cat}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#7FBCC4] text-xs uppercase tracking-widest mb-2 font-medium">
              Handpicked For You
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436]">
              Featured Pieces
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-sm text-[#4A9BA8] hover:text-[#2D6B76] transition-colors flex items-center gap-1 font-medium"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-16 max-w-7xl lg:mx-auto">
        <div className="bg-gradient-to-r from-[#2D6B76] to-[#4A9BA8] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2">
              Order via WhatsApp
            </h3>
            <p className="text-[#7FBCC4] text-sm sm:text-base">
              Simple, personal, and direct. No complicated checkout.
            </p>
          </div>
          <button
            onClick={() => navigate('products')}
            className="shrink-0 px-8 py-3.5 bg-[#25D366] text-white font-medium rounded-full hover:bg-[#1ebe5d] transition-colors flex items-center gap-2.5 shadow-lg text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Start Shopping
          </button>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E4DC]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: '✦',
              title: 'Curated Quality',
              desc: 'Every piece is selected for its craftsmanship, material, and enduring elegance.',
            },
            {
              icon: '♡',
              title: 'Women Empowered',
              desc: 'Supporting women artisans and designers across India — from weave to wardrobe.',
            },
            {
              icon: '◎',
              title: 'Personal Service',
              desc: 'Direct WhatsApp ordering for a boutique experience. We know your name, not just your order.',
            },
          ].map(v => (
            <div key={v.title} className="space-y-4">
              <div className="text-3xl text-[#4A9BA8]">{v.icon}</div>
              <h4 className="font-display text-xl font-semibold text-[#2D3436]">{v.title}</h4>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
