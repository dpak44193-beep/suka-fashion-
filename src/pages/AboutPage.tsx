import { useApp } from '@/context/AppContext';
import sukaLogo from '@/imports/suka_logo.jpeg';

export default function AboutPage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-[#2D6B76] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-28 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <div>
            <p className="text-[#7FBCC4] text-xs uppercase tracking-[0.35em] mb-5 font-medium">
              Women Based · Women Empowered
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-tight mb-6">
              Fashion with a story.
            </h1>
            <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl">
              Suka Fashions brings together thoughtful Indian fashion, independent makers, and
              pieces designed to stay meaningful beyond a single season.
            </p>
          </div>
          <div className="relative min-h-[280px] sm:min-h-[360px] flex items-center justify-center overflow-hidden rounded-3xl bg-[#4A9BA8]/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <img
              src={sukaLogo}
              alt="Suka Fashions"
              className="relative w-4/5 max-w-md object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-[#7FBCC4] text-xs uppercase tracking-widest mb-3 font-medium">
            Our point of view
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-6">
            Curated, personal, and made to be worn your way.
          </h2>
          <p className="text-[#6B7280] leading-relaxed mb-10">
            From fluid sarees to contemporary silhouettes, every collection is selected for its
            craft, comfort, and character. We believe getting dressed should feel like an
            expression of who you are, not a rulebook to follow.
          </p>
          <button
            onClick={() => navigate('products')}
            className="px-7 py-3.5 bg-[#4A9BA8] text-white text-sm font-medium rounded-full hover:bg-[#2D6B76] transition-colors"
          >
            Explore the collection
          </button>
        </div>
      </section>
    </div>
  );
}
