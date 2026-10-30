import React, { useState } from 'react';
import { Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserAuthModule = ({ onLoginSuccess, standalone = false }) => {
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('sagar@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const res = await login(loginEmail, loginPassword);
    setLoading(false);
    if (res.success) {
      setMessage(`Logged in successfully as ${res.user.name}`);
      if (onLoginSuccess) onLoginSuccess(res.user);
    } else {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    const res = await register(regName, regEmail, regPassword);
    setLoading(false);
    if (res.success) {
      setMessage('Account created! Welcome to CyberGuard.');
      if (onLoginSuccess) onLoginSuccess(res.user);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="space-y-3">
      {!standalone && (
        <div className="flex justify-end bg-slate-100 p-0.5 rounded-md text-xs font-semibold w-fit ml-auto">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-3 py-1 rounded transition-all ${activeTab === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1 rounded transition-all ${activeTab === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            Sign Up
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Welcome Back (Login) */}
        <div className={`module-card p-6 ${activeTab !== 'login' && !standalone ? 'hidden md:block' : ''}`}>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Welcome Back!</h3>
            <p className="text-xs text-slate-500">Login to your account</p>
          </div>

          {message && activeTab === 'login' && (
            <div className="mb-3 p-2 text-xs bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
              {message}
            </div>
          )}
          {error && activeTab === 'login' && (
            <div className="mb-3 p-2 text-xs bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 pr-8"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => setMessage('Demo password: password123')}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow transition-all duration-200"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>

        {/* Card 2: Create Account (Register) */}
        <div className={`module-card p-6 ${activeTab !== 'register' && !standalone ? 'hidden md:block' : ''}`}>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Create Account</h3>
            <p className="text-xs text-slate-500">Register to report cyber crimes</p>
          </div>

          {message && activeTab === 'register' && (
            <div className="mb-3 p-2 text-xs bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
              {message}
            </div>
          )}
          {error && activeTab === 'register' && (
            <div className="mb-3 p-2 text-xs bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-0.5">Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-0.5">Email Address</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-0.5">Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create your password"
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-0.5">Confirm Password</label>
              <input
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow transition-all duration-200 mt-2"
            >
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-3">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAuthModule;
