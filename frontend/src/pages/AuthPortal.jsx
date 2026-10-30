import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  Smartphone,
  KeyRound,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CitizenOtpAuthModule from '../components/modules/CitizenOtpAuthModule';
import api from '../services/api';

const AuthPortal = ({ initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode); // 'login', 'register', or 'forgot-password'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' (PRIMARY) or 'otp' (SECONDARY)
  const [roleType, setRoleType] = useState('citizen'); // 'citizen' or 'admin'
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields for Primary Password Mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password Fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: request OTP, 2: enter OTP & new password
  const [forgotDemoOtp, setForgotDemoOtp] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('citizen');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle role switch
  const handleRoleSelect = (role) => {
    setRoleType(role);
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccess(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user-dashboard');
        }
      }, 300);
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const res = await register(regName, regEmail, regPassword, regPhone, regRole);
    setLoading(false);

    if (res.success) {
      setSuccess('Account created successfully and saved in MongoDB! Redirecting...');
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user-dashboard');
        }
      }, 400);
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };

  const handleForgotPasswordSend = async (e) => {
    e?.preventDefault();
    if (!forgotEmail) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      if (res.data.success) {
        setForgotStep(2);
        setForgotDemoOtp(res.data.demoOtp || '');
        setSuccess(res.data.message || 'Verification code generated.');
      } else {
        setError(res.data.message || 'Failed to send reset code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No account found with this email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e?.preventDefault();
    if (!forgotOtp) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/reset-password', {
        email: forgotEmail,
        otp: forgotOtp,
        newPassword: forgotNewPassword,
      });

      if (res.data.success) {
        setSuccess('Password reset successfully! Redirecting to sign in...');
        setTimeout(() => {
          setEmail(forgotEmail);
          setPassword('');
          setMode('login');
          setLoginMethod('password');
          setForgotStep(1);
          setForgotOtp('');
          setForgotNewPassword('');
          setForgotConfirmPassword('');
          setForgotDemoOtp('');
          setError('');
          setSuccess('Password updated. Please log in with your new password.');
        }, 1200);
      } else {
        setError(res.data.message || 'Password reset failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] py-10 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-100 flex flex-col justify-center items-center">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Top Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-1.5 rounded-full bg-slate-800/90 border border-blue-500/30 shadow-lg mb-1">
            <img src="/logo.jpeg" alt="Cyber Crime Logo" className="w-14 h-14 rounded-full object-cover border-2 border-blue-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            CYBER CRIME REPORTING AND AI TRACKING SYSTEM
          </h1>
          <p className="text-xs text-blue-200/80">
            Secure Authentication & Investigation Monitoring Portal
          </p>
        </div>

        {/* Authentication Card */}
        <div className="w-full">
          {mode === 'login' ? (
            loginMethod === 'password' ? (
              /* ========================================================================= */
              /* 1. PRIMARY LOGIN: EMAIL ADDRESS WITH PASSWORD                             */
              /* ========================================================================= */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-7 space-y-4 text-slate-800 dark:text-slate-100">
                
                {/* Role Switcher (Citizen vs Officer) */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('citizen')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      roleType === 'citizen'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Citizen Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admin')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      roleType === 'admin'
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Officer / Admin
                  </button>
                </div>

                {/* Subtitle */}
                <div className="text-center pt-1 pb-1">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1.5 shadow-inner ${
                    roleType === 'admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
                    {roleType === 'admin' ? 'Police Officer Sign In' : 'Citizen Sign In'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your registered email and password to access your account
                  </p>
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Primary Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {roleType === 'admin' ? 'Officer Official Email' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sagar@example.com"
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email || '');
                          setForgotStep(1);
                          setForgotOtp('');
                          setForgotNewPassword('');
                          setForgotConfirmPassword('');
                          setForgotDemoOtp('');
                          setError('');
                          setSuccess('');
                          setMode('forgot-password');
                        }}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 px-4 text-white font-bold text-xs rounded-lg shadow-sm transition-all ${
                      roleType === 'admin'
                        ? 'bg-purple-700 hover:bg-purple-800'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Authenticating...' : `Sign In as ${roleType === 'admin' ? 'Officer' : 'Citizen'}`}
                  </button>
                </form>

                {/* Secondary Option: Mobile Number + OTP + Captcha Switcher */}
                {roleType === 'citizen' && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('otp');
                        setError('');
                        setSuccess('');
                      }}
                      className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Login with Mobile Number & OTP / Captcha</span>
                    </button>
                  </div>
                )}

                {/* Register Link */}
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  New Citizen?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            ) : (
              /* ========================================================================= */
              /* 2. SECONDARY LOGIN: MOBILE NUMBER + OTP + CAPTCHA                         */
              /* ========================================================================= */
              <div className="space-y-3">
                <CitizenOtpAuthModule
                  onSwitchToPassword={() => setLoginMethod('password')}
                  onSwitchToRegister={() => {
                    setMode('register');
                    setError('');
                    setSuccess('');
                  }}
                />
              </div>
            )
          ) : mode === 'forgot-password' ? (
            /* ========================================================================= */
            /* 4. FORGOT / RESET PASSWORD FORM                                           */
            /* ========================================================================= */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-7 space-y-4 text-slate-800 dark:text-slate-100">
              <div className="text-center pb-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 shadow-inner">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-white">Reset Account Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {forgotStep === 1
                    ? 'Enter your registered email to receive a verification code'
                    : 'Enter the verification code and set your new password'}
                </p>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleForgotPasswordSend} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. yourname@example.com"
                        className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                  >
                    {loading ? 'Sending Code...' : 'Send Verification Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                  {forgotDemoOtp && (
                    <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs flex items-center justify-between">
                      <span>Verification Code (Demo):</span>
                      <span className="font-mono font-bold tracking-widest text-sm bg-blue-200 dark:bg-blue-900 px-2 py-0.5 rounded">
                        {forgotDemoOtp}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setError('');
                        setSuccess('');
                      }}
                      className="py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all"
                    >
                      Change Email
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                    >
                      {loading ? 'Resetting...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginMethod('password');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* 3. NEW CITIZEN REGISTRATION FORM                                          */
            /* ========================================================================= */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-7 space-y-4 text-slate-800 dark:text-slate-100">
              <div className="text-center pb-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1 shadow-inner">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-white">Citizen Registration</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create your citizen account to file & track cyber complaints</p>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">Mobile Number</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('citizen')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        regRole === 'citizen'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('admin')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        regRole === 'admin'
                          ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Cyber Officer / Admin
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 px-4 text-white font-bold text-xs rounded-lg shadow-sm transition-all mt-1 ${
                    regRole === 'admin' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Creating Account...' : `Register as ${regRole === 'admin' ? 'Officer / Admin' : 'Citizen'}`}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginMethod('password');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPortal;
