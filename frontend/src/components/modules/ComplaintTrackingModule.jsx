import React, { useState, useEffect } from 'react';
import {
  Search,
  Check,
  Circle,
  Printer,
  FileText,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Smartphone,
  Mail,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  Lock,
  Eye,
  KeyRound,
} from 'lucide-react';
import api from '../../services/api';
import { generateFirReceipt } from '../../utils/firGenerator';
import CaptchaBox from '../common/CaptchaBox';
import { useLanguage } from '../../context/LanguageContext';

const ComplaintTrackingModule = ({ initialComplaintId = '' }) => {
  const { t, translateStatus, translateCategory, translatePriority } = useLanguage();

  // Tracking Mode: 'otp' or 'id'
  const [trackMode, setTrackMode] = useState('otp');

  // Direct ID Search State
  const [complaintId, setComplaintId] = useState(initialComplaintId);

  // OTP Verification State
  const [contactType, setContactType] = useState('mobile');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaData, setCaptchaData] = useState({ code: '', token: '' });

  const [otpCountdown, setOtpCountdown] = useState(0);
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Tracking Results (HIDDEN BY DEFAULT UNTIL VERIFIED)
  const [isVerified, setIsVerified] = useState(false);
  const [foundComplaints, setFoundComplaints] = useState([]);
  const [selectedComplaintIndex, setSelectedComplaintIndex] = useState(0);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [rawComplaint, setRawComplaint] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const activeContact = contactType === 'mobile' ? mobileNumber : emailAddress;

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  // Format complaint object with structured stages
  const formatComplaintStages = (c) => {
    const allStageNames = ['Submitted', 'Under Review', 'Investigating', 'Resolved'];
    const statusIdx = allStageNames.indexOf(c.status);

    const stages = allStageNames.map((stageName, idx) => {
      const matchingTimeline = c.timeline?.find((t) => t.status === stageName);
      const isCompleted = idx <= statusIdx;
      const isActive = idx === statusIdx;

      return {
        name: stageName,
        date: matchingTimeline ? matchingTimeline.date : isCompleted ? c.date : 'Estimated next step',
        completed: isCompleted,
        active: isActive,
        note: matchingTimeline?.note,
      };
    });

    return {
      id: c.id,
      user: c.user,
      userEmail: c.userEmail,
      title: c.title,
      category: c.category,
      priority: c.priority,
      status: c.status,
      date: c.date,
      description: c.description,
      assignedOfficer: c.assignedOfficer || 'Cyber Defense Triage Team',
      evidenceFiles: c.evidenceFiles || [],
      stages,
    };
  };

  // 1. Fetch by Complaint ID
  const fetchComplaintStatus = async (idToFetch) => {
    if (!idToFetch || !idToFetch.trim()) {
      setError('Please enter a valid Complaint Tracking ID (e.g. COM-2024-002).');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get(`/complaints/${idToFetch.trim()}`);
      if (res.data.success && res.data.complaint) {
        const c = res.data.complaint;
        setRawComplaint(c);
        const formatted = formatComplaintStages(c);
        setActiveComplaint(formatted);
        setFoundComplaints([c]);
        setSelectedComplaintIndex(0);
        setIsVerified(true);
        setSuccess(`Loaded case record for ${c.id}`);
      }
    } catch (err) {
      setIsVerified(false);
      setActiveComplaint(null);
      setError(`Complaint ID "${idToFetch}" not found in system.`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP for Contact Tracking
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
        setOtpCountdown(60);
        setDemoOtpHint(res.data.demoOtp || '123456');
        setSuccess(res.data.message || `OTP dispatched to ${activeContact}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP + Captcha and Reveal Track Complaints
  const handleVerifyAndTrack = async (e) => {
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
      setError('Please enter the Captcha characters shown in the security box.');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/complaints/track-by-contact', {
        contact: activeContact.trim(),
        otp: otp.trim(),
        captcha: captchaInput.trim(),
        captchaToken: captchaData.token,
        type: contactType,
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        if (res.data.complaints && res.data.complaints.length > 0) {
          setFoundComplaints(res.data.complaints);
          setSelectedComplaintIndex(0);
          setRawComplaint(res.data.complaints[0]);
          setActiveComplaint(formatComplaintStages(res.data.complaints[0]));
          setIsVerified(true);
        } else {
          setIsVerified(false);
          setActiveComplaint(null);
          setError(`No complaints found for ${activeContact}. You can submit a new complaint anytime.`);
        }
      }
    } catch (err) {
      setIsVerified(false);
      setActiveComplaint(null);
      setError(err.response?.data?.message || 'Verification failed. Please check your OTP and Captcha.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearForm = () => {
    setMobileNumber('');
    setEmailAddress('');
    setOtp('');
    setCaptchaInput('');
    setError('');
    setSuccess('');
    setDemoOtpHint('');
    setIsVerified(false);
    setActiveComplaint(null);
    setFoundComplaints([]);
  };

  const handleSelectComplaint = (idx) => {
    setSelectedComplaintIndex(idx);
    const selected = foundComplaints[idx];
    setRawComplaint(selected);
    setActiveComplaint(formatComplaintStages(selected));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Track Complaint Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify your mobile number with OTP & Captcha to inspect your case investigation in real-time.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setTrackMode('otp');
                setError('');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                trackMode === 'otp'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile / Email OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setTrackMode('id');
                setError('');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                trackMode === 'id'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Complaint ID
            </button>
          </div>
        </div>

        {/* FEEDBACK MESSAGES */}
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

        {/* MODE 1: MOBILE / EMAIL + OTP + CAPTCHA FORM */}
        {trackMode === 'otp' ? (
          <form onSubmit={handleVerifyAndTrack} className="bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-px bg-slate-300 dark:bg-slate-600 w-6"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
                  CITIZEN VERIFICATION & TRACKING
                </span>
                <span className="h-px bg-slate-300 dark:bg-slate-600 w-6"></span>
              </div>

              {/* Toggle Mobile / Email */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setContactType('mobile')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    contactType === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('email')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    contactType === 'email' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Email
                </button>
              </div>
            </div>

            {/* Demo OTP Helper Chip */}
            {demoOtpHint && (
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center justify-between text-xs">
                <span className="text-blue-900 dark:text-blue-200 text-[11px]">
                  Demo OTP Dispatched: <strong className="font-mono text-xs">{demoOtpHint}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(demoOtpHint)}
                  className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {/* Row 1: MOBILE NO / EMAIL + GET OTP */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
              <label className="sm:col-span-3 font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide">
                {contactType === 'mobile' ? 'MOBILE NO:' : 'EMAIL ID:'} <span className="text-red-500 font-bold">*</span>
              </label>

              <div className="sm:col-span-9 flex items-center gap-2 min-w-0">
                {contactType === 'mobile' ? (
                  <>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-18 shrink-0 px-2.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={10}
                    />
                  </>
                ) : (
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="citizen@example.com"
                    className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || otpCountdown > 0}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold text-white transition-all shrink-0 whitespace-nowrap shadow-xs ${
                    otpCountdown > 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Get OTP'}
                </button>
              </div>
            </div>

            {/* Row 2: OTP */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
              <label className="sm:col-span-3 font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide">
                OTP: <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="sm:col-span-9">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Your OTP Number"
                  maxLength={6}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 3: CAPTCHA */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
              <label className="sm:col-span-3 font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide">
                SECURITY CODE: <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="sm:col-span-9 min-w-0">
                <CaptchaBox
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  onCaptchaChange={(data) => setCaptchaData(data)}
                  placeholder="Enter Captcha"
                />
              </div>
            </div>

            {/* Row 4: ACTION BUTTONS */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleClearForm}
                className="px-5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                {isVerifying ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Submit & Track</span>
              </button>
            </div>
          </form>
        ) : (
          /* MODE 2: DIRECT COMPLAINT ID SEARCH */
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchComplaintStatus(complaintId);
            }}
            className="flex items-center gap-2 max-w-md"
          >
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="e.g. COM-2024-002"
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Case</span>
            </button>
          </form>
        )}

      </div>

      {/* ========================================================================= */}
      {/* CONDITIONAL RENDERING: ONLY SHOW STATUS AFTER VERIFICATION                 */}
      {/* ========================================================================= */}
      {isVerified && activeComplaint ? (
        <div className="space-y-6 transition-all duration-300 animate-fadeIn">
          {/* Case Selector Tabs (if multiple cases exist for this verified citizen) */}
          {foundComplaints.length > 1 && (
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
                Select Filed Complaint ({foundComplaints.length} Records Found):
              </p>
              <div className="flex flex-wrap gap-2">
                {foundComplaints.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectComplaint(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      selectedComplaintIndex === idx
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.id} • {item.category} ({item.status})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DETAILED INVESTIGATION & TIMELINE CARD */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            
            {/* Banner with Status & FIR */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-blue-900 dark:text-blue-300 font-mono">
                      {activeComplaint.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {translateCategory(activeComplaint.category)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeComplaint.priority === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {translatePriority(activeComplaint.priority)} {t.myColPriority || 'Priority'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">{activeComplaint.title}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-xs">
                    {translateStatus(activeComplaint.status)}
                  </span>
                  <button
                    onClick={() => generateFirReceipt(rawComplaint || activeComplaint)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                    title="Download Official FIR Document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t.submitDownloadAck ? t.submitDownloadAck.split(' ')[0] + ' Receipt' : 'FIR Receipt'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Assigned Officer: <strong className="text-slate-800 dark:text-slate-200">{activeComplaint.assignedOfficer}</strong></span>
                </div>
                <span>Filed on: <strong className="text-slate-800 dark:text-slate-200 font-mono">{activeComplaint.date}</strong></span>
              </div>
            </div>

            {/* Incident Description */}
            <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white mb-1">Complainant Statement / Incident Summary:</strong>
              <p className="leading-relaxed">{activeComplaint.description}</p>
            </div>

            {/* 4-Stage Vertical Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Investigation Lifecycle & Milestones
              </h4>

              <div className="relative pl-6 space-y-6 pt-1 pb-1">
                {activeComplaint.stages.map((stage, idx) => {
                  const isLast = idx === activeComplaint.stages.length - 1;
                  return (
                    <div key={stage.name} className="relative flex items-start group">
                      {!isLast && (
                        <div
                          className={`absolute -left-4 top-4 bottom-[-24px] w-0.5 ${
                            stage.completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      )}

                      <div
                        className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 shadow-xs transition-all ${
                          stage.completed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-300'
                        }`}
                      >
                        {stage.completed ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <Circle className="w-2 h-2" />
                        )}
                      </div>

                      <div className="ml-2">
                        <p
                          className={`text-xs font-bold ${
                            stage.completed ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'
                          }`}
                        >
                          {stage.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{stage.date}</p>
                        {stage.note && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 p-2 rounded-md mt-1.5 border border-slate-200/70 dark:border-slate-700 max-w-md">
                            {stage.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidence Attachments Viewer */}
            {activeComplaint.evidenceFiles && activeComplaint.evidenceFiles.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Attached Digital Evidence ({activeComplaint.evidenceFiles.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeComplaint.evidenceFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px]">{file.originalName || file.filename}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{Math.round((file.size || 1024) / 1024)} KB</p>
                        </div>
                      </div>
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded transition-colors"
                          title="View file"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* Empty / Verification Guidance Placeholder */
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Verification Required to View Complaint Investigation Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Please enter your registered mobile number or email above, click <strong>Get OTP</strong>, enter the received 6-digit code with the security Captcha, and click <strong>Submit & Track</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplaintTrackingModule;
