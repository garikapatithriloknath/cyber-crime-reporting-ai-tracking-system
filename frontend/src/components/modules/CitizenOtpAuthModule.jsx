import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  X,
  Lock,
  RotateCcw,
} from 'lucide-react';
import api from '../../services/api';
import CaptchaBox from '../common/CaptchaBox';
import { useAuth } from '../../context/AuthContext';

const CitizenOtpAuthModule = ({ onSwitchToPassword, onSwitchToRegister }) => {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  // Mode: 'mobile' or 'email'
  const [contactType, setContactType] = useState('mobile');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaData, setCaptchaData] = useState({ code: '', token: '' });

  // Status & Timers
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  const activeContact = contactType === 'mobile' ? mobileNumber : emailAddress;

  const handleSendOtp = async () => {
    if (!activeContact || !activeContact.trim()) {
      setError(`Please enter your ${contactType === 'mobile' ? 'mobile number' : 'email address'}.`);
      return;
    }

    if (contactType === 'mobile' && activeContact.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/send-otp', {
        contact: activeContact.trim(),
        type: contactType,
      });

      if (res.data.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setDemoOtpHint(res.data.demoOtp || '123456');
        setSuccess(res.data.message || `OTP dispatched to ${activeContact}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your contact and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMobileNumber('');
    setEmailAddress('');
    setOtp('');
    setCaptchaInput('');
    setError('');
    setSuccess('');
    setOtpSent(false);
    setDemoOtpHint('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!activeContact || !activeContact.trim()) {
      setError(`Please provide your ${contactType === 'mobile' ? 'mobile number' : 'email'}.`);
      return;
    }

    if (!otp || !otp.trim()) {
      setError('Please enter the OTP received on your mobile / email.');
      return;
    }

    if (!captchaInput || !captchaInput.trim()) {
      setError('Please enter the security Captcha characters.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/verify-otp', {
        contact: activeContact.trim(),
        otp: otp.trim(),
        captcha: captchaInput.trim(),
        captchaToken: captchaData.token,
        type: contactType,
      });

      if (res.data.success && res.data.token) {
        setSuccess(`Verified successfully! Welcome, ${res.data.user.name}. Redirecting...`);
        if (loginWithToken) {
          loginWithToken(res.data.token, res.data.user);
        } else {
          localStorage.setItem('cyber_token', res.data.token);
          localStorage.setItem('cyber_user', JSON.stringify(res.data.user));
        }

        setTimeout(() => {
          navigate('/user-dashboard');
        }, 400);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or Captcha. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Header matching reference image */}
      <div className="pt-5 pb-3 px-6 sm:px-8 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 relative">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px bg-slate-300 dark:bg-slate-700 w-8 sm:w-12"></span>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100 font-mono">
            CITIZEN LOGIN
          </h2>
          <span className="h-px bg-slate-300 dark:bg-slate-700 w-8 sm:w-12"></span>
        </div>

        {/* Top Right Click Here for New User Link */}
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            Click Here for New User
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 text-xs">
        {/* Error / Success Banners */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Demo OTP One-Click Chip */}
        {demoOtpHint && (
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center justify-between">
            <span className="text-[11px] text-blue-900 dark:text-blue-200 font-medium">
              Demo OTP Generated: <strong className="font-mono text-xs">{demoOtpHint}</strong>
            </span>
            <button
              type="button"
              onClick={() => setOtp(demoOtpHint)}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded shadow-xs"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Mobile / Email Selection Tabs */}
        <div className="flex items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => {
              setContactType('mobile');
              setError('');
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              contactType === 'mobile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Mobile Number
          </button>
          <button
            type="button"
            onClick={() => {
              setContactType('email');
              setError('');
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              contactType === 'email'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-3 h-3" />
            Email Address
          </button>
        </div>

        {/* Row 1: MOBILE NO / EMAIL + GET OTP BUTTON */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
          <label className="sm:col-span-4 font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide">
            {contactType === 'mobile' ? 'MOBILE NO:' : 'EMAIL ID:'} <span className="text-red-500 font-bold">*</span>
          </label>

          <div className="sm:col-span-8 flex items-center gap-2 min-w-0">
            {contactType === 'mobile' ? (
              <>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-18 shrink-0 px-2 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>

                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Mobile No."
                  className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  maxLength={10}
                />
              </>
            ) : (
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="citizen@example.com"
                className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || otpCountdown > 0}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shrink-0 whitespace-nowrap shadow-xs ${
                otpCountdown > 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Get OTP'}
            </button>
          </div>
        </div>

        {/* Row 2: OTP INPUT FIELD */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
          <label className="sm:col-span-4 font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide">
            OTP: <span className="text-red-500 font-bold">*</span>
          </label>

          <div className="sm:col-span-8">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Your OTP Number"
              maxLength={6}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
            />
          </div>
        </div>

        {/* Row 3: CAPTCHA FIELD MATCHING IMAGE */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center pt-1">
          <label className="sm:col-span-4 font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide">
            SECURITY CODE: <span className="text-red-500 font-bold">*</span>
          </label>

          <div className="sm:col-span-8 min-w-0">
            <CaptchaBox
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              onCaptchaChange={(data) => setCaptchaData(data)}
              placeholder="Enter Captcha"
            />
          </div>
        </div>

        {/* Row 4: ACTION BUTTONS (CLEAR & SUBMIT) */}
        <div className="pt-4 flex items-center justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 min-w-[100px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 min-w-[120px] disabled:opacity-60"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>Submit</span>
          </button>
        </div>

        {/* Bottom Helper Links */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            Forgot Login Id / Need Help?
          </button>

          {onSwitchToPassword && (
            <button
              type="button"
              onClick={onSwitchToPassword}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium flex items-center gap-1 hover:underline"
            >
              <Lock className="w-3 h-3" />
              Password / Admin Login
            </button>
          )}
        </div>
      </form>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Citizen Support & Login Assistance
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Forgot Login ID / Mobile Number?</strong> If you have registered a complaint earlier, you can access your case tracking using the 10-digit mobile number or email address specified during registration.
              </p>
              <p>
                <strong>Not receiving OTP?</strong>
                <br />• Ensure your mobile number is in network coverage.
                <br />• For instant demo and evaluation, use the pre-filled demo number <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-blue-600">9876543210</code> or click "Auto-Fill".
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-[11px]">
                National Cyber Crime Helpline: <strong>1930</strong> (24x7 Citizen Assistance).
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenOtpAuthModule;
