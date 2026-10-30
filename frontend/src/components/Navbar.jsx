import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  FilePlus,
  Search,
  FileText,
  ShieldAlert,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle,
  Edit3,
  Sun,
  Moon,
  Sparkles,
  Settings,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifCount = async () => {
        try {
          const res = await api.get('/admin/notifications', {
            params: { userEmail: user?.email },
          });
          if (res.data.success) {
            setUnreadCount(res.data.unreadCount || 0);
          }
        } catch (e) {}
      };
      fetchNotifCount();
      const interval = setInterval(fetchNotifCount, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#07132B] border-b border-slate-200 dark:border-blue-900/60 shadow-md backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/user-dashboard') : '/'}
            className="flex items-center space-x-2.5 group"
          >
            <div className="relative">
              <img
                src="/logo.jpeg"
                alt="Cyber Crime Logo"
                className={`w-8 h-8 rounded-full object-cover border-2 transition-all shadow-md ${
                  isAdmin ? 'border-purple-500' : 'border-blue-500'
                }`}
              />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                CYBER<span className={isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}>GUARD</span>
              </span>
              <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-blue-300/80 -mt-1 font-semibold">
                {isAdmin ? t.brandAdminSub || 'Law Enforcement Desk' : t.brandCitizenSub || 'Citizen Portal'}
              </span>
            </div>
          </Link>

          {/* Desktop Role-Based Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              isAdmin ? (
                /* === ADMIN ONLY MODULES === */
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'text-white bg-purple-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{t.navAdminDashboard || 'Admin Dashboard'}</span>
                  </Link>

                  <Link
                    to="/admin/complaints"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive('/admin/complaints')
                        ? 'text-white bg-purple-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.navAdminComplaints || 'Complaint Management'}</span>
                  </Link>

                  <Link
                    to="/admin/update-status"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive('/admin/update-status')
                        ? 'text-white bg-purple-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.navAdminStatus || 'Update Status'}</span>
                  </Link>

                  <Link
                    to="/analytics"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive('/analytics')
                        ? 'text-white bg-purple-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{t.navAdminAnalytics || 'Reports & Analytics'}</span>
                  </Link>

                  <Link
                    to="/admin/settings"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive('/admin/settings') || isActive('/settings')
                        ? 'text-white bg-purple-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t.navSettings || 'Settings'}</span>
                  </Link>
                </>
              ) : (
                /* === USER ONLY MODULES === */
                <>
                  <Link
                    to="/user-dashboard"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      isActive('/user-dashboard')
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {t.navDashboard || 'Dashboard'}
                  </Link>

                  <Link
                    to="/submit-complaint"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isActive('/submit-complaint')
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>{t.navReportCrime || 'Report Crime'}</span>
                  </Link>

                  <Link
                    to="/track-complaint"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isActive('/track-complaint')
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{t.navTrackStatus || 'Track Status'}</span>
                  </Link>

                  <Link
                    to="/my-complaints"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isActive('/my-complaints')
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.navMyComplaints || 'My Complaints'}</span>
                  </Link>

                  <Link
                    to="/instructions"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isActive('/instructions')
                        ? 'text-white bg-amber-600 shadow-sm'
                        : 'text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.navInstructions || 'Instructions'}</span>
                  </Link>

                  <Link
                    to="/notifications"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 relative ${
                      isActive('/notifications')
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="relative">
                      <Bell className="w-3.5 h-3.5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-mono text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <span>{t.navNotifications || 'Notifications'}</span>
                  </Link>

                  <Link
                    to="/settings"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isActive('/settings')
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t.navSettings || 'Settings'}</span>
                  </Link>
                </>
              )
            ) : null}
          </div>

          {/* Right Controls (Theme Toggle, Settings, Profile, Logout) */}
          <div className="flex items-center space-x-2">
            {/* === CLEAN THEME TOGGLE BUTTON (SYMBOL ONLY) === */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-amber-300 hover:bg-slate-700 hover:border-amber-400/50 shadow-glow-sun'
                  : 'bg-slate-100 border-slate-300 text-indigo-700 hover:bg-slate-200 hover:border-indigo-400/50 shadow-glow-moon'
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-[spin_12s_linear_infinite]" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Direct Settings Gear Icon Button */}
                <Link
                  to={isAdmin ? '/admin/settings' : '/settings'}
                  title={t.navSettings || 'Settings & Preferences'}
                  className={`p-1.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                    isActive('/settings') || isActive('/admin/settings')
                      ? isAdmin
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </Link>

                {/* Profile Avatar Button */}
                <Link
                  to="/profile"
                  title={`${t.navProfile || 'Profile'} (${user?.name || (isAdmin ? 'Inspector Sharma' : 'Sagar')})`}
                  className={`p-1 rounded-full border transition-all duration-300 flex items-center justify-center shadow-sm ${
                    isAdmin
                      ? 'bg-purple-50 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/80 hover:ring-2 hover:ring-purple-400/50'
                      : 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/80 hover:ring-2 hover:ring-blue-400/50'
                  }`}
                >
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="Profile Avatar"
                      className="w-6 h-6 rounded-full object-cover shadow-xs"
                    />
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isAdmin ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title={t.navLogout || 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  {t.navSignIn ? t.navSignIn.split('/')[0] : 'Sign In'}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-[#0B192C] border-b border-slate-200 dark:border-slate-800 text-xs shadow-lg animate-fadeIn">
          {isAuthenticated ? (
            isAdmin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-purple-600 dark:text-purple-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navAdminDashboard || 'Admin Dashboard'}
                </Link>
                <Link
                  to="/admin/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navAdminComplaints || 'Complaint Management'}
                </Link>
                <Link
                  to="/admin/update-status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navAdminStatus || 'Update Status'}
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navAdminAnalytics || 'Reports & Analytics'}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/user-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-blue-600 dark:text-blue-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navDashboard || 'Dashboard'}
                </Link>
                <Link
                  to="/submit-complaint"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navReportCrime || 'Submit Complaint'}
                </Link>
                <Link
                  to="/track-complaint"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navTrackStatus || 'Track Status'}
                </Link>
                <Link
                  to="/my-complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navMyComplaints || 'My Complaints'}
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navNotifications || 'Notifications'}
                </Link>
                <Link
                  to="/instructions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-amber-600 dark:text-amber-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4 text-amber-500" />
                  <span>{t.navInstructions || 'Instructions & Guidelines'}</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.navSettings || 'Settings'}
                </Link>
              </>
            )
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-white font-bold bg-blue-600 text-center"
            >
              {t.navSignIn || 'Sign In / Register'}
            </Link>
          )}

          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-blue-500" />
                )}
                <span>{t.navProfile || 'Profile Settings'} ({user?.name || (isAdmin ? 'Inspector Sharma' : 'Sagar')})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded font-semibold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navLogout || 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
