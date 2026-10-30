import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);

      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network or server error during login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-1.5 rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 mb-2 shadow-glow-cyan">
            <img src="/logo.jpeg" alt="Cyber Crime Logo" className="w-14 h-14 rounded-full object-cover shadow-md" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Secure Portal Login
          </h2>
          <p className="text-xs text-gray-400">
            Sign in to submit complaints, track investigation status, or access the admin desk.
          </p>
        </div>

        {/* Login Card */}
        <div className="cyber-card p-6 sm:p-8 border border-gray-700/80 shadow-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900/90 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900/90 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cyber-gradient-btn w-full py-3 rounded-lg text-sm font-bold text-white shadow-glow-cyan flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info for Development/Review */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-2">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Default System Credentials:
            </p>
            <div className="flex items-center justify-between gap-2">
              <span>Citizen: <code className="text-cyan-300 font-mono">sagar@example.com</code> / <code className="text-cyan-300 font-mono">password123</code></span>
              <button
                type="button"
                onClick={() => {
                  setEmail('sagar@example.com');
                  setPassword('password123');
                }}
                className="px-2 py-0.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded text-[10px] font-bold"
              >
                Fill Citizen
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Officer: <code className="text-purple-300 font-mono">admin@cyberguard.gov.in</code> / <code className="text-purple-300 font-mono">adminpassword123</code></span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@cyberguard.gov.in');
                  setPassword('adminpassword123');
                }}
                className="px-2 py-0.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded text-[10px] font-bold"
              >
                Fill Admin
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Registration Link */}
        <p className="text-center text-xs text-gray-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
            Register as a citizen
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
