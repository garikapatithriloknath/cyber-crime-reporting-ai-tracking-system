import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  FilePlus,
  FileText,
  Search,
  User,
  Bell,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Globe,
  CreditCard,
  Camera,
  Briefcase,
  ClipboardList,
  Info,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
  HelpCircle,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ComplainantChecklist from '../common/ComplainantChecklist';
import api from '../../services/api';

const getCategoryIcon = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('phish')) return Globe;
  if (cat.includes('fraud') || cat.includes('upi') || cat.includes('money')) return CreditCard;
  if (cat.includes('instagram') || cat.includes('social') || cat.includes('media')) return Camera;
  if (cat.includes('job') || cat.includes('offer')) return Briefcase;
  return Shield;
};

const getStatusBadge = (status = '') => {
  switch (status) {
    case 'Resolved':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'Investigating':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    case 'Under Review':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'Submitted':
    default:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
};

const UserDashboardModule = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { t, translateStatus, translateCategory, language } = useLanguage();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [userComplaints, setUserComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    submitted: 0,
    underReview: 0,
    investigating: 0,
    resolved: 0,
    statusDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  const navItems = [
    { id: 'Dashboard', name: t.navDashboard || 'Dashboard', icon: LayoutDashboard, path: '/user-dashboard' },
    { id: 'Instructions', name: t.navInstructions || 'Instructions', icon: ClipboardList, path: null },
    { id: 'New Complaint', name: t.navReportCrime || 'New Complaint', icon: FilePlus, path: '/submit-complaint' },
    { id: 'My Complaints', name: t.navMyComplaints || 'My Complaints', icon: FileText, path: '/my-complaints' },
    { id: 'Track Complaint', name: t.navTrackStatus || 'Track Complaint', icon: Search, path: '/track-complaint' },
    { id: 'Profile', name: t.navProfile || 'Profile', icon: User, path: '/profile' },
    { id: 'Notifications', name: t.navNotifications || 'Notifications', icon: Bell, path: '/notifications' },
  ];

  // Fetch real synchronized user data from backend
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userEmail = user?.email || '';
      const res = await api.get('/admin/stats', { params: { userEmail } });
      
      if (res.data.success && res.data.userStats) {
        const uStats = res.data.userStats;
        setStats({
          totalComplaints: uStats.totalComplaints || 0,
          submitted: uStats.submitted || 0,
          underReview: uStats.underReview || 0,
          investigating: uStats.investigating || 0,
          resolved: uStats.resolved || 0,
          statusDistribution: uStats.statusDistribution || [],
        });
        setUserComplaints(uStats.complaints || []);
      }
    } catch (e) {
      console.error('Failed to load user stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleItemClick = (item) => {
    setActiveNav(item.id);
    if (item.path && onNavigate) {
      onNavigate(item.path);
    }
  };

  // Safe percentage calculations for the donut chart SVG
  const totalSafe = stats.totalComplaints || 1;
  const underReviewPct = stats.totalComplaints > 0 ? Math.round(((stats.underReview + stats.submitted) / totalSafe) * 100) : 0;
  const investPct = stats.totalComplaints > 0 ? Math.round((stats.investigating / totalSafe) * 100) : 0;
  const resolvedPct = stats.totalComplaints > 0 ? Math.round((stats.resolved / totalSafe) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="module-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* Left Dark Sidebar */}
        <div className="md:col-span-3 bg-[#0B192C] text-slate-200 p-4 flex flex-col justify-between border-r border-slate-800">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800/80">
              <img src="/logo.jpeg" alt="Cyber Crime Logo" className="w-5 h-5 rounded-full object-cover border border-blue-400/60" />
              <span className="font-bold text-xs tracking-wide text-white">{t.brandTitle || 'CyberGuard AI'}</span>
            </div>

            {/* Nav list */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? item.id === 'Instructions'
                          ? 'bg-amber-600 text-white font-bold shadow'
                          : 'bg-blue-600 text-white font-semibold shadow'
                        : item.id === 'Instructions'
                        ? 'text-amber-300 hover:text-white hover:bg-amber-950/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.id === 'Instructions' && !isActive ? 'text-amber-400' : ''}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.navLogout || 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-9 p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between space-y-4">
          
          {activeNav === 'Instructions' ? (
            /* ========================================================================= */
            /* VIEW 1: DIRECT EMBEDDED INSTRUCTIONS CHECKLIST VIEW                       */
            /* ========================================================================= */
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-amber-500" />
                    <span>{t.navInstructions || 'Instructions & Checklist for Complainants'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.dashBannerDesc || 'Review all basic mandatory & optional requirements before reporting a cyber crime incident.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('Dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.dashBackToDashboard || 'Back to Dashboard'}</span>
                </button>
              </div>

              {/* Directly Embedded Checklist Module */}
              <ComplainantChecklist className="border border-slate-200 dark:border-slate-800 shadow-sm" />
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: STANDARD LIVE SYNCHRONIZED DASHBOARD OVERVIEW                     */
            /* ========================================================================= */
            <>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
                    {t.dashWelcome || 'Welcome'}, {user?.name || 'Sagar'}!
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.dashSubtitle || 'Report cyber crimes and track the investigation status of your complaints in real-time.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveNav('Instructions')}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t.navInstructions || 'Instructions'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate && onNavigate('/notifications')}
                    className="relative p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title={t.navNotifications || 'View Notifications'}
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900"></span>
                  </button>
                  
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                    <div
                      onClick={() => onNavigate && onNavigate('/profile')}
                      title={t.navProfile || 'View Profile'}
                      className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                    >
                      {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions Quick Banner */}
              <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 dark:from-slate-800/80 dark:to-blue-950/40 p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.dashBannerTitle || 'Checklist & Basic Requirements for Filing New Complaints'}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {t.dashBannerDesc || 'Keep your National ID, 200+ char incident details, Bank UTR No., and evidence files ready.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveNav('Instructions')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs transition-all"
                >
                  <span>{t.dashViewInstructions || 'View Instructions'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Dynamic Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      {t.dashStatTotal || 'Total Complaints'}
                    </p>
                    <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.totalComplaints}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      {t.dashStatPending || 'Under Review / Submitted'}
                    </p>
                    <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.underReview + stats.submitted}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      {t.dashStatInvestigating || 'Investigating'}
                    </p>
                    <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.investigating}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      {t.dashStatResolved || 'Resolved'}
                    </p>
                    <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.resolved}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Lower Two Panels: Real Recent Complaints & Status Donut Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Recent Complaints List */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                        {t.dashRecentTitle || 'Your Recent Complaints'}
                      </h4>
                      <button
                        onClick={() => onNavigate && onNavigate('/my-complaints')}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        {t.dashViewAll || 'View All'} ({stats.totalComplaints})
                      </button>
                    </div>

                    {userComplaints.length > 0 ? (
                      <div className="space-y-2">
                        {userComplaints.slice(0, 4).map((c) => {
                          const CIcon = getCategoryIcon(c.category);
                          return (
                            <div
                              key={c.id}
                              onClick={() => onNavigate && onNavigate(`/track-complaint?id=${c.id}`)}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-100 dark:border-slate-700 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                                  <CIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{c.title}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {c.id} • {translateCategory(c.category)}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadge(c.status)}`}>
                                {translateStatus(c.status)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                        <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        <p>{t.dashNoComplaints || 'No complaints registered yet under your account.'}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                    <button
                      onClick={() => onNavigate && onNavigate('/submit-complaint')}
                      className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow transition-colors text-center"
                    >
                      {t.dashReportIncidentBtn || '+ Report Incident'}
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate('/track-complaint')}
                      className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-600 transition-colors text-center"
                    >
                      {t.dashTrackStatusBtn || 'Track Status'}
                    </button>
                  </div>
                </div>

                {/* Right: Complaint Status Overview (Donut Chart) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-2">
                    {t.dashStatusOverview || 'Complaint Status Overview'}
                  </h4>
                  
                  <div className="flex flex-col items-center justify-center my-auto">
                    {/* SVG Donut Chart */}
                    <div className="relative w-28 h-28 my-1">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {/* Under Review / Submitted */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#3B82F6"
                          strokeWidth="5"
                          strokeDasharray={`${underReviewPct} ${100 - underReviewPct}`}
                          strokeDashoffset="0"
                        />
                        {/* Investigating */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#06B6D4"
                          strokeWidth="5"
                          strokeDasharray={`${investPct} ${100 - investPct}`}
                          strokeDashoffset={`-${underReviewPct}`}
                        />
                        {/* Resolved */}
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#10B981"
                          strokeWidth="5"
                          strokeDasharray={`${resolvedPct} ${100 - resolvedPct}`}
                          strokeDashoffset={`-${underReviewPct + investPct}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{stats.totalComplaints}</span>
                        <span className="text-[9px] text-slate-400">{t.dashStatTotal || 'Total'}</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="w-full space-y-1 text-[11px] mt-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {t.statusUnderReview || 'Under Review / Submitted'}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {stats.underReview + stats.submitted} ({underReviewPct}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> {t.statusInvestigating || 'Investigating'}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {stats.investigating} ({investPct}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {t.statusResolved || 'Resolved'}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {stats.resolved} ({resolvedPct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardModule;
