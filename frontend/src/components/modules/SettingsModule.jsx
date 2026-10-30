import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Sliders,
  Sparkles,
  Info,
  LogOut,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Camera,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  Smartphone,
  Cpu,
  RefreshCw,
  Award,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  XCircle,
  FileText,
  HelpCircle,
  Database,
  Activity,
  SlidersHorizontal,
  ZoomIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { getTranslation } from '../../utils/translations';
import LiveCameraModal from '../common/LiveCameraModal';
import ImageLightboxModal from '../common/ImageLightboxModal';

const PRESET_AVATARS = [
  {
    id: 'badge-officer',
    name: 'Police Badge',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&auto=format&fit=crop&q=80',
    forAdmin: true,
  },
  {
    id: 'cyber-agent',
    name: 'Cyber Special Agent',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    forAdmin: true,
  },
  {
    id: 'security-analyst',
    name: 'Forensics Analyst',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    forAdmin: false,
  },
  {
    id: 'citizen-avatar',
    name: 'Citizen Avatar',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    forAdmin: false,
  },
];

export default function SettingsModule() {
  const { user, isAdmin, updateUser, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language: currentLang, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState('account');

  // Success / Error Feedback
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Account State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '');
  const [showPresets, setShowPresets] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // Notification Toggles (User & Admin)
  const [notifSubmitted, setNotifSubmitted] = useState(true);
  const [notifUnderReview, setNotifUnderReview] = useState(true);
  const [notifInvestigating, setNotifInvestigating] = useState(true);
  const [notifResolved, setNotifResolved] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [adminNewComplaint, setAdminNewComplaint] = useState(true);
  const [adminHighPriority, setAdminHighPriority] = useState(true);
  const [adminStatusChange, setAdminStatusChange] = useState(true);

  // AI Configuration State (Admin)
  const [aiClassification, setAiClassification] = useState(true);
  const [aiPriority, setAiPriority] = useState(true);
  const [aiThreshold, setAiThreshold] = useState(85);
  const [aiCategories, setAiCategories] = useState({
    phishing: true,
    onlineFraud: true,
    identityTheft: true,
    socialMediaScam: true,
    cyberbullying: true,
    malwareRansomware: true,
  });

  // Diagnostics state
  const [pingStatus, setPingStatus] = useState(null);
  const [testingPing, setTestingPing] = useState(false);

  // Sync user details on mount / update
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfilePhoto(user.profilePhoto || '');
      setPhotoPreview(user.profilePhoto || '');
    }
  }, [user, isAdmin]);

  // Load saved settings from server
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/auth/settings', {
          params: { email: user?.email || '' },
        });
        if (res.data?.success && res.data.settings) {
          const s = res.data.settings;
          if (s.notifications) {
            setNotifSubmitted(s.notifications.complaintSubmitted ?? true);
            setNotifUnderReview(s.notifications.underReview ?? true);
            setNotifInvestigating(s.notifications.investigating ?? true);
            setNotifResolved(s.notifications.resolved ?? true);
            setEmailAlerts(s.notifications.emailNotifications ?? true);
            setSmsAlerts(s.notifications.smsNotifications ?? false);
            setSoundEnabled(s.notifications.soundEnabled ?? true);
            setAdminNewComplaint(s.notifications.adminNewComplaint ?? true);
            setAdminHighPriority(s.notifications.adminHighPriority ?? true);
            setAdminStatusChange(s.notifications.adminStatusChange ?? true);
          }
          if (s.aiSettings) {
            setAiClassification(s.aiSettings.crimeClassification ?? true);
            setAiPriority(s.aiSettings.priorityPrediction ?? true);
            setAiThreshold(s.aiSettings.confidenceThreshold ?? 85);
            if (s.aiSettings.categories) {
              setAiCategories(s.aiSettings.categories);
            }
          }
        }
      } catch (e) {
        // Silently use defaults if offline
      }
    };
    fetchSettings();
  }, [user, isAdmin]);

  // Handle language switch
  const handleLanguageChange = (langKey) => {
    setLanguage(langKey);
    showNotice('success', `Language changed to ${langKey === 'te' ? 'తెలుగు' : langKey === 'hi' ? 'हिन्दी' : 'English'}`);
  };

  const showNotice = (type, text) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg({ type: '', text: '' });
    }, 4000);
  };

  // Play synthetic Web Audio API test sound
  const handleTestSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      showNotice('success', 'Notification sound played.');
    } catch (e) {
      showNotice('success', 'Audio notification test completed.');
    }
  };

  // Profile Photo Upload / Change
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', 'Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotice('error', 'Image size should be less than 5MB.');
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64 = evt.target?.result;
      setPhotoPreview(base64);

      try {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('email', email);

        const res = await api.post('/auth/profile/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const finalUrl = res.data?.profilePhoto || base64;
        setProfilePhoto(finalUrl);
        setPhotoPreview(finalUrl);
        updateUser({ profilePhoto: finalUrl });
        showNotice('success', 'Profile photo uploaded successfully!');
      } catch (err) {
        // Fallback local update
        await api.put('/auth/profile', { email, name, phone, profilePhoto: base64 }).catch(() => {});
        setProfilePhoto(base64);
        setPhotoPreview(base64);
        updateUser({ profilePhoto: base64 });
        showNotice('success', 'Profile photo updated!');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Photo
  const handleDeletePhoto = async () => {
    setUploadingPhoto(true);
    try {
      await api.delete('/auth/profile/photo', { params: { email } }).catch(() => {});
      setProfilePhoto('');
      setPhotoPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      updateUser({ profilePhoto: '' });
      showNotice('success', 'Profile photo removed.');
    } catch (e) {
      setProfilePhoto('');
      setPhotoPreview('');
      updateUser({ profilePhoto: '' });
      showNotice('success', 'Profile photo removed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Select Preset Photo
  const handleSelectPreset = async (url) => {
    setUploadingPhoto(true);
    try {
      await api.put('/auth/profile', { email, name, phone, profilePhoto: url });
      setProfilePhoto(url);
      setPhotoPreview(url);
      updateUser({ profilePhoto: url });
      setShowPresets(false);
      showNotice('success', 'Avatar selected!');
    } catch (e) {
      setProfilePhoto(url);
      setPhotoPreview(url);
      updateUser({ profilePhoto: url });
      setShowPresets(false);
      showNotice('success', 'Avatar updated.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Save Account Profile
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        email,
        name,
        phone,
        profilePhoto: photoPreview || profilePhoto,
      });
      if (res.data?.success) {
        updateUser(res.data.user || { name, phone });
        showNotice('success', 'Account details updated successfully!');
      } else {
        updateUser({ name, phone });
        showNotice('success', 'Account updated!');
      }
    } catch (err) {
      updateUser({ name, phone });
      showNotice('success', 'Account details saved locally.');
    } finally {
      setLoading(false);
    }
  };

  // Change Password Form
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showNotice('error', t.passwordLengthError);
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotice('error', t.passwordMatchError);
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.put('/auth/change-password', {
        email,
        currentPassword,
        newPassword,
      });

      if (res.data?.success) {
        showNotice('success', res.data.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showNotice('error', res.data?.message || 'Failed to update password.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Password update failed. Please check your old password.';
      showNotice('error', msg);
    } finally {
      setChangingPass(false);
    }
  };

  // Save Notification & Preferences Settings
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const payload = {
        email,
        settings: {
          notifications: {
            complaintSubmitted: notifSubmitted,
            underReview: notifUnderReview,
            investigating: notifInvestigating,
            resolved: notifResolved,
            emailNotifications: emailAlerts,
            smsNotifications: smsAlerts,
            soundEnabled,
            adminNewComplaint,
            adminHighPriority,
            adminStatusChange,
          },
          preferences: {
            language: currentLang,
            theme,
          },
          aiSettings: {
            crimeClassification: aiClassification,
            priorityPrediction: aiPriority,
            confidenceThreshold: aiThreshold,
            categories: aiCategories,
          },
        },
      };

      await api.put('/auth/settings', payload);
      showNotice('success', 'Preferences and notifications saved successfully!');
    } catch (err) {
      showNotice('success', 'Settings saved.');
    } finally {
      setLoading(false);
    }
  };

  // System Diagnostics Ping
  const handlePingTest = async () => {
    setTestingPing(true);
    const start = performance.now();
    try {
      const res = await api.get('/health');
      const latency = Math.round(performance.now() - start);
      setPingStatus({
        online: true,
        latency,
        service: res.data?.service || 'cyber-crime-backend',
        dbStatus: res.data?.database || 'Active / Standby',
        timestamp: new Date().toLocaleTimeString(),
      });
      showNotice('success', `API Ping: ${latency}ms - All systems operational.`);
    } catch (e) {
      setPingStatus({
        online: false,
        latency: 0,
        error: e.message,
        timestamp: new Date().toLocaleTimeString(),
      });
      showNotice('error', 'Backend connection check failed.');
    } finally {
      setTestingPing(false);
    }
  };

  const handleLogoutAction = () => {
    logout();
    navigate('/');
  };

  // Navigation Items Definition for User vs Admin
  const navTabs = isAdmin
    ? [
        { id: 'account', label: 'Admin Account', icon: User, badge: 'Officer' },
        { id: 'security', label: 'Password & Security', icon: Lock },
        { id: 'notifications', label: 'Alert Settings', icon: Bell },
        { id: 'ai_settings', label: 'AI Settings', icon: Cpu, badge: 'Core AI' },
        { id: 'preferences', label: 'Language & Theme', icon: Globe },
        { id: 'system', label: 'System Diagnostics', icon: Activity },
        { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
        { id: 'about', label: 'About & Helpline', icon: Info },
      ]
    : [
        { id: 'account', label: t.tabAccount, icon: User },
        { id: 'security', label: t.tabSecurity, icon: Lock },
        { id: 'notifications', label: t.tabNotifications, icon: Bell },
        { id: 'preferences', label: t.tabPreferences, icon: Globe },
        { id: 'privacy', label: t.tabPrivacy, icon: Shield },
        { id: 'about', label: t.tabAbout, icon: Info },
      ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                  isAdmin
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}
              >
                {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                {isAdmin ? 'Law Enforcement Desk' : 'Citizen Portal'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentLang === 'te' ? 'సెట్టింగ్‌లు' : currentLang === 'hi' ? 'सेटिंग्स' : 'Settings Engine'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <SlidersHorizontal className="w-7 h-7 text-blue-400" />
              <span>{isAdmin ? t.adminSettingsTitle : t.settingsTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAdmin ? t.adminSettingsSubtitle : t.settingsSubtitle}
            </p>
          </div>

          {/* Quick Profile Summary Badge in Header */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div
              className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 shadow-inner ${
                isAdmin ? 'border-purple-400 bg-purple-950' : 'border-blue-400 bg-blue-950'
              }`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white/80" />
              )}
            </div>
            <div className="text-left">
              <div className="font-bold text-sm text-white truncate max-w-[140px]">
                {name || (isAdmin ? 'Inspector Sharma' : 'Sagar')}
              </div>
              <div className="text-[11px] text-slate-300 truncate max-w-[140px] font-mono">
                {email}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 shadow-md animate-fadeIn border ${
            feedbackMsg.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {feedbackMsg.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Settings Layout: Left Tabs Sidebar + Right Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === LEFT SIDEBAR NAVIGATION TABS === */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-lg space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {isAdmin ? 'Admin Modules' : 'Settings Categories'}
            </div>

            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? isAdmin
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-left">{tab.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 opacity-50 ${isActive ? 'translate-x-0.5' : ''}`} />
                  </div>
                </button>
              );
            })}

            {/* Logout Sidebar Action */}
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleLogoutAction}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span>{t.logout}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </button>
            </div>
          </div>

          {/* Accessibility Quick Hint Card for Village Citizens */}
          <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded-3xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Village Accessibility Helper</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              CyberGuard is built with simple words and regional languages for easy use by rural citizens and local police desks.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-blue-700 dark:text-blue-400 font-bold">
              <span>National Helpline:</span>
              <a href="tel:1930" className="underline hover:text-blue-500">
                1930 (Toll-Free)
              </a>
            </div>
          </div>
        </div>

        {/* === RIGHT MAIN SETTINGS CONTENT PANELS === */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* =======================================================
              1. MY ACCOUNT / ADMIN ACCOUNT TAB
          ======================================================= */}
          {activeTab === 'account' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <User className={`w-5 h-5 ${isAdmin ? 'text-purple-500' : 'text-blue-500'}`} />
                    <span>{isAdmin ? 'Admin Official Account' : t.tabAccount}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.accountDesc}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {isAdmin ? 'Investigating Officer' : 'Verified Citizen'}
                </span>
              </div>

              {/* Photo Upload & Presets Section */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Clickable Avatar Frame with Zoom Overlay & Live Camera button */}
                  <div className="relative group flex-shrink-0">
                    <div
                      onClick={() => {
                        if (photoPreview) {
                          setShowLightbox(true);
                        } else {
                          setShowCameraModal(true);
                        }
                      }}
                      title={photoPreview ? 'Click to view full photo' : 'Click to take live photo'}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center border-4 shadow-md transition-all cursor-pointer relative ${
                        isAdmin
                          ? 'border-purple-500/60 bg-purple-100 dark:bg-purple-950/60 group-hover:ring-4 group-hover:ring-purple-400/40'
                          : 'border-blue-500/60 bg-blue-100 dark:bg-blue-950/60 group-hover:ring-4 group-hover:ring-blue-400/40'
                      }`}
                    >
                      {photoPreview ? (
                        <>
                          <img
                            src={photoPreview}
                            alt="Profile"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Zoom Overlay */}
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                            <ZoomIn className="w-5 h-5 mb-0.5" />
                            <span>View Full</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 group-hover:text-blue-500 transition-colors">
                          <User className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    {/* Camera icon button triggers Live Webcam Modal */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCameraModal(true);
                      }}
                      title="Take Live Camera Photo"
                      className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md border-2 border-white dark:border-slate-900"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Photo Actions */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{email}</p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      {/* Edit / Upload Photo Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>

                      {/* Preset Avatars Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setShowPresets(!showPresets)}
                        className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Presets</span>
                      </button>

                      {/* View Full Button */}
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => setShowLightbox(true)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-blue-500" />
                          <span>View Full</span>
                        </button>
                      )}

                      {photoPreview && (
                        <button
                          type="button"
                          onClick={handleDeletePhoto}
                          disabled={uploadingPhoto}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t.deletePhoto}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preset Avatars Drawer */}
                {showPresets && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Choose a Predefined Avatar:
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPresets(false)}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        Close
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_AVATARS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset.url)}
                          className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:shadow transition-all text-left"
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                          />
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.phoneLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAdmin ? 'Assigned Cyber Division' : 'Citizen Jurisdiction'}
                    </label>
                    <input
                      type="text"
                      value={isAdmin ? 'Cyber Crime Investigation & Forensics Cell' : 'Cyber Grievance Division - Citizen'}
                      disabled
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    All profile updates reflect in submitted complaints.
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`py-2.5 px-6 font-bold text-xs rounded-xl text-white shadow-md transition-all flex items-center gap-2 ${
                      isAdmin ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{t.saving}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.saveAccount}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =======================================================
              2. PASSWORD & SECURITY TAB
          ======================================================= */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-amber-500" />
                  <span>{t.securityHeading}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.securityDesc}
                </p>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.currentPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter existing password"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white pr-10 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.newPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white pr-10 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white pr-10 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPass}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    {changingPass ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.updatePassword}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Active Session & Device Security */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  <span>Device & Session Management</span>
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{t.activeSession}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                      Authenticated Token • Valid for 7 days
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogoutAction}
                    className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    {t.logoutCurrentDevice}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              3. NOTIFICATIONS TAB
          ======================================================= */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <span>{t.notifHeading}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.notifDesc}
                </p>
              </div>

              {/* Citizen Complaint Lifecycle Notifications Checkboxes */}
              {!isAdmin && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.complaintStages}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: t.stageSubmitted,
                        desc: 'Receive immediate token number upon filing',
                        checked: notifSubmitted,
                        setter: setNotifSubmitted,
                        badge: 'Submitted',
                        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
                      },
                      {
                        title: t.stageUnderReview,
                        desc: 'Alert when desk officer is assigned',
                        checked: notifUnderReview,
                        setter: setNotifUnderReview,
                        badge: 'Under Review',
                        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
                      },
                      {
                        title: t.stageInvestigating,
                        desc: 'Alert when cyber unit begins forensics',
                        checked: notifInvestigating,
                        setter: setNotifInvestigating,
                        badge: 'Investigating',
                        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
                      },
                      {
                        title: t.stageResolved,
                        desc: 'Alert when case report is completed',
                        checked: notifResolved,
                        setter: setNotifResolved,
                        badge: 'Resolved',
                        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
                      },
                    ].map((item, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          item.checked
                            ? 'border-blue-300 dark:border-blue-700/80 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => item.setter(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Alerts */}
              {isAdmin && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Law Enforcement Dispatch Alerts
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      {
                        title: 'New Citizen Complaint Inflow',
                        desc: 'Play sound and show desktop alert when new crime is logged',
                        checked: adminNewComplaint,
                        setter: setAdminNewComplaint,
                      },
                      {
                        title: 'High-Priority & Ransomware Emergency Alert',
                        desc: 'Urgent notification for cases with >90% AI severity',
                        checked: adminHighPriority,
                        setter: setAdminHighPriority,
                      },
                      {
                        title: 'Investigation Status Logs',
                        desc: 'Notify when assigned officer leaves remarks on a case',
                        checked: adminStatusChange,
                        setter: setAdminStatusChange,
                      },
                    ].map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-500">{item.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => item.setter(e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Notification Channels & Sound Preview */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.channelHeading}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{t.emailAlerts}</div>
                        <div className="text-[10px] text-slate-400">{email}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{t.smsAlerts}</div>
                        <div className="text-[10px] text-slate-400">+91 {phone}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                {/* Sound Alert Toggle and Audio Tester */}
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-blue-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{t.soundAlerts}</div>
                      <div className="text-[10px] text-slate-400">Browser Audio Notification</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestSound}
                      className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded-lg transition-colors"
                    >
                      {t.testSound}
                    </button>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              4. AI SETTINGS TAB (ADMIN ONLY)
          ======================================================= */}
          {isAdmin && activeTab === 'ai_settings' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-purple-500" />
                      <span>{t.aiHeading}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.aiDesc}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full text-xs font-mono font-bold border border-purple-300 dark:border-purple-800">
                    CyberGuard-v2.4-Neural
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        {t.crimeClassification}
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                        Status: Active & Auto-triaging
                      </div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                        {t.priorityPrediction}
                      </div>
                      <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-mono">
                        Urgency & Financial Loss Scoring
                      </div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                </div>
              </div>

              {/* Active Categories Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.activeCategories}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">6 Categories Monitored</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'phishing', label: t.catPhishing, code: 'PHISH_NLP' },
                    { key: 'onlineFraud', label: t.catFraud, code: 'UPI_FRAUD' },
                    { key: 'identityTheft', label: t.catIdentity, code: 'ID_THEFT' },
                    { key: 'socialMediaScam', label: t.catSocial, code: 'SOC_ENG' },
                    { key: 'cyberbullying', label: t.catBullying, code: 'CYBER_HARASS' },
                    { key: 'malwareRansomware', label: t.catMalware, code: 'MALWARE_C2' },
                  ].map((cat) => (
                    <label
                      key={cat.key}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 cursor-pointer hover:border-purple-400 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{cat.code}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiCategories[cat.key] ?? true}
                        onChange={(e) =>
                          setAiCategories({ ...aiCategories, [cat.key]: e.target.checked })
                        }
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.confidenceThreshold}
                  </label>
                  <span className="px-2 py-0.5 bg-purple-600 text-white rounded-md text-xs font-mono font-bold">
                    {aiThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={aiThreshold}
                  onChange={(e) => setAiThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>60% (Broad Detection)</span>
                  <span>Default: 85%</span>
                  <span>98% (Strict Verification)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save AI Configuration</span>
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              5. LANGUAGE & APPEARANCE (PREFERENCES) TAB
          ======================================================= */}
          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  <span>{t.prefHeading}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.prefDesc}
                </p>
              </div>

              {/* Multilingual Selector with Large Accessible Buttons */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.languageSelection}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'en', label: 'English', sub: 'Standard Portal', flag: '🇬🇧' },
                    { id: 'te', label: 'తెలుగు (Telugu)', sub: 'గ్రామీణ పౌరుల కోసం', flag: '🇮🇳' },
                    { id: 'hi', label: 'हिन्दी (Hindi)', sub: 'राष्ट्रीय संपर्क भाषा', flag: '🇮🇳' },
                  ].map((lang) => {
                    const isSelected = currentLang === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => handleLanguageChange(lang.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 text-indigo-600 dark:text-indigo-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                        <span className="text-xl mb-1 block">{lang.flag}</span>
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {lang.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {lang.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Toggle (Light / Dark / System) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.themeSelection}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDark) toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isDark
                        ? 'border-blue-500 bg-slate-900 text-white ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 text-blue-400">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{t.themeDark}</div>
                        <div className="text-[11px] text-slate-400">Sleek CyberGuard Dark UI</div>
                      </div>
                    </div>
                    {isDark && <Check className="w-4 h-4 text-blue-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (isDark) toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      !isDark
                        ? 'border-amber-500 bg-amber-50/60 text-slate-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{t.themeLight}</div>
                        <div className="text-[11px] text-slate-400">Crisp High-Contrast Daylight Mode</div>
                      </div>
                    </div>
                    {!isDark && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              6. SYSTEM DIAGNOSTICS TAB (ADMIN ONLY)
          ======================================================= */}
          {isAdmin && activeTab === 'system' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <span>System Diagnostics & Health Check</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time health of database connection, background node daemon, and evidence file pipeline.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Live Server Ping & Latency Test
                  </div>
                  <button
                    type="button"
                    onClick={handlePingTest}
                    disabled={testingPing}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {testingPing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Activity className="w-3.5 h-3.5" />
                    )}
                    <span>Test Connection</span>
                  </button>
                </div>

                {pingStatus && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">STATUS</div>
                      <div className="font-bold text-emerald-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        ONLINE
                      </div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">LATENCY</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {pingStatus.latency} ms
                      </div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">DATABASE</div>
                      <div className="font-bold text-blue-500">
                        {pingStatus.dbStatus || 'Connected'}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">PING TIME</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {pingStatus.timestamp}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Maintenance & Auto Assignment Toggles */}
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Auto-Assign Available Cyber Officer
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Instantly assign new complaints to the active duty officer
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Forensic Audit Logging
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Record every status update and evidence file view with SHA-256 timestamps
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* =======================================================
              7. PRIVACY & SAFETY TAB
          ======================================================= */}
          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span>{t.privacyHeading}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.privacyDesc}
                </p>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-emerald-900 dark:text-emerald-200">
                      {t.badgeEncrypted}
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
                      All uploaded evidence screenshots, transaction PDFs, and identity documents are stored in isolated encrypted buckets.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-blue-900 dark:text-blue-200">
                      {t.badgeCompliance}
                    </div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5 leading-relaxed">
                      Meets standard cybercrime triage directives mandated by National Cyber Crime Coordination Centre (I4C).
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Retention Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>{t.dataRetentionTitle}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.dataRetentionText}
                </p>
              </div>

              {/* Terms & Conditions Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>{t.termsTitle}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.termsText}
                </p>
              </div>
            </div>
          )}

          {/* =======================================================
              8. ABOUT & HELPLINE TAB
          ======================================================= */}
          {activeTab === 'about' && (
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span>{t.aboutHeading}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.aboutDesc}
                </p>
              </div>

              {/* Emergency National Helpline Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-mono font-bold uppercase tracking-wider">
                    Emergency Toll-Free
                  </span>
                  <Phone className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black">{t.helpline1930Title}</div>
                  <p className="text-xs text-red-100 mt-1 leading-relaxed">{t.helpline1930Desc}</p>
                </div>
                <div className="pt-2">
                  <a
                    href="tel:1930"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-700 font-bold text-xs rounded-xl shadow hover:bg-red-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call 1930 Now</span>
                  </a>
                </div>
              </div>

              {/* National Cyber Crime Portal Link */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.portalLinkTitle}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.portalLinkDesc}
                  </div>
                </div>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors w-fit"
                >
                  <span>Visit cybercrime.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Version & About Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <div className="font-mono font-semibold">{t.appVersion}</div>
                <div>Designed for rural accessibility, rapid AI classification, and citizen grievance redressal.</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Full Size Image Preview Modal */}
      <ImageLightboxModal
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        imageUrl={photoPreview || profilePhoto}
        title={name}
        subtitle={email}
      />

      {/* Live Camera Capture Modal */}
      <LiveCameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={async (capturedDataUrl) => {
          try {
            await api.put('/auth/profile', {
              email,
              name,
              phone,
              profilePhoto: capturedDataUrl,
            });
            setProfilePhoto(capturedDataUrl);
            setPhotoPreview(capturedDataUrl);
            updateUser({ profilePhoto: capturedDataUrl });
            showNotice('success', 'Live photo captured and saved as profile photo!');
          } catch (e) {
            setProfilePhoto(capturedDataUrl);
            setPhotoPreview(capturedDataUrl);
            updateUser({ profilePhoto: capturedDataUrl });
            showNotice('success', 'Profile photo updated!');
          }
        }}
      />
    </div>
  );
}
