import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  FileText,
  TrendingUp,
  Tag,
  Settings,
  LogOut,
  Clock,
  Search,
  CheckCircle,
  BarChart3,
  Edit3,
  Shield,
  CreditCard,
  Globe,
  Camera,
  Briefcase,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

const AdminDashboardModule = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeAdminNav, setActiveAdminNav] = useState('Dashboard');
  const [adminStats, setAdminStats] = useState({
    totalComplaints: 0,
    submitted: 0,
    underReview: 0,
    investigating: 0,
    resolved: 0,
    totalUsers: 0,
    resolutionRate: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [categorySegments, setCategorySegments] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Complaints', icon: FileSpreadsheet, path: '/admin/complaints' },
    { name: 'Update Status', icon: Edit3, path: '/admin/update-status' },
    { name: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { name: 'Profile', icon: Users, path: '/profile' },
  ];

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes, complaintsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/analytics'),
        api.get('/complaints'),
      ]);

      if (statsRes.data.success && statsRes.data.adminStats) {
        setAdminStats(statsRes.data.adminStats);
      }

      if (analyticsRes.data.success) {
        let currentOffset = 0;
        const segments = (analyticsRes.data.categoryDistribution || []).map((seg) => {
          const item = { ...seg, offset: currentOffset };
          currentOffset -= seg.percentage;
          return item;
        });
        setCategorySegments(segments);
        setMonthlyTrends(analyticsRes.data.complaintsOverview || []);
      }

      if (complaintsRes.data.success && complaintsRes.data.complaints) {
        setRecentComplaints(complaintsRes.data.complaints.slice(0, 4));
      }
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleNavClick = (item) => {
    setActiveAdminNav(item.name);
    if (onNavigate) onNavigate(item.path);
  };

  const maxMonthCount = Math.max(...monthlyTrends.map((m) => m.count || 0), 10);

  return (
    <div className="space-y-4">
      <div className="module-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left Dark Sidebar */}
        <div className="md:col-span-3 bg-[#111827] text-slate-200 p-4 flex flex-col justify-between border-r border-slate-800">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-800">
              <img src="/logo.jpeg" alt="Cyber Crime Logo" className="w-5 h-5 rounded-full object-cover border border-purple-400/60" />
              <span className="font-bold text-xs tracking-wide text-white">Admin Panel</span>
            </div>

            {/* Menu */}
            <div className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminNav === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-purple-700 text-white font-semibold shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-9 p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                onClick={() => onNavigate && onNavigate('/profile')}
                title="Officer Profile"
                className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all shrink-0"
              >
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Officer Avatar" className="w-full h-full object-cover" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
                  {user?.name ? `${user.name} Desk` : 'Admin Dashboard'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Overview of all complaints, active forensic investigations, and system metrics.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate && onNavigate('/admin/complaints')}
                className="py-1.5 px-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-md shadow transition-colors"
              >
                Complaints Desk
              </button>
              <button
                onClick={() => onNavigate && onNavigate('/admin/update-status')}
                className="py-1.5 px-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-md transition-colors"
              >
                Update Case Status
              </button>
            </div>
          </div>

          {/* 4 Dynamic Real Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Total Complaints</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{adminStats.totalComplaints}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Under Review / Submitted</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{adminStats.underReview + adminStats.submitted}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Investigating</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{adminStats.investigating}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Resolved</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{adminStats.resolved}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2 Visual Panels: Complaints Overview Bar/Trend & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Monthly Trend */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Complaints Volume (Trend)</h4>
                <span className="text-[10px] font-mono text-slate-400">Resolution Rate: {adminStats.resolutionRate}%</span>
              </div>
              
              <div className="h-44 w-full flex flex-col justify-end pt-2">
                <div className="relative w-full h-32 flex items-end justify-between px-4 border-b border-slate-200 dark:border-slate-700">
                  {monthlyTrends.map((item, idx) => {
                    const heightPct = Math.min(100, Math.max(15, (item.count / maxMonthCount) * 100));
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 z-10 group">
                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.count}
                        </span>
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-5 sm:w-7 bg-purple-700 hover:bg-purple-600 rounded-t-md shadow-xs transition-all duration-300"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-2 px-4">
                  {monthlyTrends.map((item, idx) => (
                    <span key={idx}>{item.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real Category Distribution Donut Chart */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-2">Crime Category Distribution</h4>
              
              <div className="flex flex-col sm:flex-row items-center justify-around gap-3 my-auto">
                {/* Donut SVG */}
                <div className="relative w-28 h-28 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {categorySegments.map((seg, idx) => (
                      <circle
                        key={idx}
                        cx="18"
                        cy="18"
                        r="14"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="5"
                        strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`}
                        strokeDashoffset={`${seg.offset}`}
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{adminStats.totalComplaints}</span>
                    <span className="text-[9px] text-slate-400">Total</span>
                  </div>
                </div>

                {/* Dynamic Category Legend */}
                <div className="space-y-1 text-[10px] w-full sm:w-auto">
                  {categorySegments.slice(0, 5).map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="truncate max-w-[110px]">{item.name}</span>
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.count ? `${item.count} (${item.percentage}%)` : `${item.percentage}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardModule;
