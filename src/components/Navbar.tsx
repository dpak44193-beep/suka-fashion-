import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import sukaLogo from '@/imports/suka_logo.jpeg';

export default function Navbar() {
  const { navigate, cart, currentUser, logout, currentView } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const prompts = ['Search accessories...', 'Search western wear...', 'Search kurtas...'];
    let promptIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const timer = window.setInterval(() => {
      const prompt = prompts[promptIndex];
      characterIndex += deleting ? -1 : 1;
      setSearchPlaceholder(prompt.slice(0, characterIndex));

      if (!deleting && characterIndex === prompt.length) deleting = true;
      if (deleting && characterIndex === 0) {
        deleting = false;
        promptIndex = (promptIndex + 1) % prompts.length;
      }
    }, 90);

    return () => window.clearInterval(timer);
  }, []);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate('products', undefined, 'All', search.trim());
  }

  function getDashboardView() {
    if (!currentUser) return 'login' as const;
    if (currentUser.role === 'super_admin') return 'super-admin' as const;
    if (currentUser.role === 'admin') return 'admin-dashboard' as const;
    return 'customer-dashboard' as const;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/96 backdrop-blur-sm border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <img
              src={sukaLogo}
              alt="Suka Fashions logo"
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:block leading-tight">
              <span className="font-display text-xl font-semibold text-[#2D6B76] group-hover:text-[#4A9BA8] transition-colors">
                Suka
              </span>
              <span className="font-display text-xl text-[#4A9BA8] group-hover:text-[#2D6B76] transition-colors">
                {' '}Fashions
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', view: 'home' as const },
              { label: 'About', view: 'about' as const },
              { label: 'Products', view: 'products' as const },
            ].map(link => (
              <button
                key={link.view}
                onClick={() => navigate(link.view)}
                className={`text-sm tracking-wide transition-colors ${
                  currentView === link.view
                    ? 'text-[#4A9BA8] font-medium'
                    : 'text-[#2D3436] hover:text-[#4A9BA8]'
                }`}
              >
                {link.label}
              </button>
            ))}
            {currentUser && (
              <button
                onClick={() => navigate(getDashboardView())}
                className={`text-sm tracking-wide transition-colors ${
                  ['customer-dashboard', 'admin-dashboard', 'super-admin'].includes(currentView)
                    ? 'text-[#4A9BA8] font-medium'
                    : 'text-[#2D3436] hover:text-[#4A9BA8]'
                }`}
              >
                Dashboard
              </button>
            )}
          </div>

          <form onSubmit={submitSearch} className="hidden lg:block relative w-56 xl:w-64">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0Z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search products"
              className="w-full rounded-full border border-white/20 bg-black/50 py-2 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-white/65 focus:border-[#7FBCC4]"
            />
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 text-[#2D3436] hover:text-[#4A9BA8] transition-colors"
              aria-label="Shopping cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A9BA8] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-[#2D3436] font-medium">
                  {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-[#7FBCC4] hover:text-[#2D6B76] transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => navigate('login')}
                  className="px-3 py-2 text-sm text-[#2D3436] hover:text-[#4A9BA8] transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-3.5 py-2 bg-[#4A9BA8] text-white text-sm rounded-full hover:bg-[#2D6B76] transition-colors font-medium"
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#2D3436] hover:text-[#4A9BA8] transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E8E4DC] py-4 space-y-1">
            <form onSubmit={submitSearch} className="relative mb-3 px-3">
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search products"
                className="w-full rounded-full border border-[#2D3436]/20 bg-black/50 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/65 focus:border-[#4A9BA8]"
              />
            </form>
            {[
              { label: 'Home', view: 'home' as const },
              { label: 'About', view: 'about' as const },
              { label: 'Products', view: 'products' as const },
            ].map(link => (
              <button
                key={link.view}
                onClick={() => { navigate(link.view); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2.5 text-sm text-[#2D3436] hover:text-[#4A9BA8] hover:bg-[#F5F1E8] rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            {currentUser ? (
              <>
                <button
                  onClick={() => { navigate(getDashboardView()); setMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 text-sm text-[#2D3436] hover:text-[#4A9BA8] hover:bg-[#F5F1E8] rounded-lg transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 text-sm text-[#7FBCC4] hover:bg-[#F5F1E8] rounded-lg transition-colors"
                >
                  Sign out ({currentUser.name.split(' ')[0]})
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1 pt-2">
                <button
                  onClick={() => { navigate('login'); setMenuOpen(false); }}
                  className="block px-3 py-2.5 text-sm text-[#2D3436] hover:text-[#4A9BA8] transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => { navigate('register'); setMenuOpen(false); }}
                  className="block px-3.5 py-2.5 text-sm text-white bg-[#4A9BA8] hover:bg-[#2D6B76] rounded-full transition-colors font-medium"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
