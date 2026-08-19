import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import sukaLogo from '@/imports/suka_logo.jpeg';

export default function AuthPage() {
  const { login, navigate, currentView } = useApp();
  const isLogin = currentView === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError(
          'Account not found or inactive. Use: priya@sukafashions.com (Super Admin), kavya@sukafashions.com (Admin), or anjali@example.com (Customer)'
        );
      }
      setLoading(false);
    }, 400);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login('anjali@example.com', password);
      setLoading(false);
    }, 400);
  }

  const inputCls =
    'w-full px-4 py-2.5 text-sm border border-[#E8E4DC] rounded-xl focus:outline-none focus:border-[#4A9BA8] focus:ring-2 focus:ring-[#4A9BA8]/20 transition-all';

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <button onClick={() => navigate('home')}>
              <img
                src={sukaLogo}
                alt="Suka Fashions"
                className="w-16 h-16 object-contain mx-auto mb-4"
              />
            </button>
            <h1 className="font-display text-2xl font-semibold text-[#2D3436]">
              {isLogin ? 'Welcome back' : 'Join Suka Fashions'}
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-1">
              {isLogin ? 'Sign in to your account' : 'Create your account today'}
            </p>
          </div>

          {/* Demo Hint */}
          {isLogin && (
            <div className="bg-[#F5F1E8] border border-[#E8E4DC] rounded-xl p-3.5 mb-6 text-xs text-[#6B7280]">
              <p className="font-semibold text-[#2D6B76] mb-1.5">Demo accounts (any password):</p>
              <p className="mb-0.5">
                <span className="font-medium">priya@sukafashions.com</span>{' '}
                &rarr; Super Admin
              </p>
              <p className="mb-0.5">
                <span className="font-medium">kavya@sukafashions.com</span>{' '}
                &rarr; Admin
              </p>
              <p>
                <span className="font-medium">anjali@example.com</span>{' '}
                &rarr; Customer
              </p>
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Anjali Singh"
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputCls}
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                required
                className={inputCls}
              />
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#4A9BA8] text-white rounded-xl font-medium hover:bg-[#2D6B76] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center text-[#9CA3AF] mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                navigate(isLogin ? 'register' : 'login');
                setError('');
              }}
              className="text-[#4A9BA8] hover:text-[#2D6B76] font-medium transition-colors"
            >
              {isLogin ? 'Register' : 'Sign in'}
            </button>
          </p>

          <button
            onClick={() => navigate('home')}
            className="block text-center text-xs text-[#C0BAB2] hover:text-[#9CA3AF] transition-colors mt-4 mx-auto"
          >
            &larr; Back to store
          </button>
        </div>
      </div>

      {/* Decorative Side */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=1200&fit=crop&auto=format"
          alt="Fashion editorial"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D6B76]/65 to-[#4A9BA8]/30" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="font-display text-3xl font-semibold leading-snug mb-3">
            &ldquo;Fashion is the armor to survive everyday life.&rdquo;
          </p>
          <p className="text-white/55 text-sm">Women Based &middot; Women Empowered</p>
        </div>
      </div>
    </div>
  );
}
