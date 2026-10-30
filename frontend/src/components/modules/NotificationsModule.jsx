import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Check,
  Circle,
  Trash2,
  ExternalLink,
  X,
  Clock,
  Shield,
  Search,
  Filter,
  Info,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const defaultNotifications = [
  {
    id: 'notif-1',
    message: 'Your complaint COM-2024-002 status updated to Investigating. Cyber Cell Unit has taken charge of UPI transaction logs.',
    date: '21 May 2024, 09:45 AM',
    read: false,
    type: 'status_update',
    complaintId: 'COM-2024-002',
  },
  {
    id: 'notif-2',
    message: 'Your complaint COM-2024-001 status updated to Under Review. Triage team assigned.',
    date: '20 May 2024, 11:15 AM',
    read: false,
    type: 'status_update',
    complaintId: 'COM-2024-001',
  },
  {
    id: 'notif-3',
    message: 'Public Security Advisory: New wave of fake banking APKs targeting mobile banking credentials detected nationwide.',
    date: '19 May 2024, 05:30 PM',
    read: true,
    type: 'announcement',
    complaintId: '',
  },
];

const NotificationsModule = ({ onViewAll }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'unread', 'read'
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/notifications', {
        params: { userEmail: user?.email },
      });
      if (res.data.success && res.data.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.warn('Using default notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await api.put('/admin/notifications/read-all', {
        userEmail: user?.email,
      });
    } catch (e) {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (selectedNotif) {
      setSelectedNotif((prev) => (prev ? { ...prev, read: true } : null));
    }
  };

  // Mark individual notification as read or unread
  const handleToggleRead = async (e, notif) => {
    e?.stopPropagation();
    const newReadState = !notif.read;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: newReadState } : n))
    );

    if (selectedNotif?.id === notif.id) {
      setSelectedNotif((prev) => ({ ...prev, read: newReadState }));
    }

    try {
      await api.put(`/admin/notifications/${notif.id}/read`, {
        read: newReadState,
      });
    } catch (err) {
      console.warn('Mark as read API fallback');
    }
  };

  // Delete individual notification
  const handleDeleteNotif = async (e, notifId) => {
    e?.stopPropagation();

    // Optimistic remove
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    if (selectedNotif?.id === notifId) {
      setSelectedNotif(null);
    }

    try {
      await api.delete(`/admin/notifications/${notifId}`);
    } catch (err) {
      console.warn('Delete notification API fallback');
    }
  };

  // Delete all notifications at once for user or admin
  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    const targetEmail = user?.role === 'admin' ? '' : user?.email;

    // Optimistic clear
    setNotifications([]);
    setSelectedNotif(null);
    setShowConfirmDeleteAll(false);

    try {
      await api.delete('/admin/notifications/clear-all', {
        params: {
          userEmail: targetEmail,
          role: user?.role,
        },
      });
    } catch (err) {
      console.warn('Delete all notifications API fallback:', err);
      fetchNotifications();
    } finally {
      setDeletingAll(false);
    }
  };

  // Open individual notification modal
  const handleOpenNotif = (notif) => {
    setSelectedNotif(notif);
    if (!notif.read) {
      // Auto mark read on open
      handleToggleRead(null, { ...notif, read: false });
    }
  };

  // Filtered notifications list
  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="module-card p-5 sm:p-6 bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-4 transition-colors">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t.notifTitle || 'Notifications'}</span>
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.notifSubtitle || 'Live case updates, investigation alerts, and announcements.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={fetchNotifications}
              title="Refresh Notifications"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{t.notifMarkAllRead || 'Mark all read'}</span>
              <span className="sm:hidden">Mark Read</span>
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmDeleteAll(true)}
              disabled={notifications.length === 0 || deletingAll}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-50"
              title="Delete all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.notifClearAll || 'Delete All'}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 pb-1">
          {['all', 'unread', 'read'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type === 'all' ? `All (${notifications.length})` : type === 'unread' ? `Unread (${unreadCount})` : `Read (${notifications.length - unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                No notifications in this filter.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n, idx) => (
              <div
                key={`${n.id || 'notif'}-${idx}`}
                onClick={() => handleOpenNotif(n)}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group hover:shadow-md ${
                  n.read
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400'
                    : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/70 text-slate-900 dark:text-white shadow-xs'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    n.read
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      : 'bg-blue-600 text-white shadow-sm'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                {/* Body Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold leading-snug line-clamp-2 ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {n.message}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.date}
                      </span>
                      {n.complaintId && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                          {n.complaintId}
                        </span>
                      )}
                    </div>

                    {/* Individual Row Action Buttons */}
                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                      {/* Individual Mark as Read / Unread Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(e, n)}
                        title={n.read ? 'Mark as unread' : 'Mark as read'}
                        className={`p-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                          n.read
                            ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800'
                            : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                        }`}
                      >
                        {n.read ? <Circle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 font-bold" />}
                        <span className="text-[10px] hidden sm:inline">{n.read ? 'Mark Unread' : 'Mark Read'}</span>
                      </button>

                      {/* Individual Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNotif(e, n.id)}
                        title="Delete notification"
                        className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* INDIVIDUAL NOTIFICATION DETAILS MODAL */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Notification Details
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedNotif.date}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Body */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedNotif.message}
              </p>

              {selectedNotif.complaintId && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Related Complaint:
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {selectedNotif.complaintId}
                  </span>
                </div>
              )}
            </div>

            {/* Actions in Modal */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                {/* Individual Toggle Read */}
                <button
                  type="button"
                  onClick={() => handleToggleRead(null, selectedNotif)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    selectedNotif.read
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedNotif.read ? 'Mark Unread' : 'Mark as Read'}</span>
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDeleteNotif(null, selectedNotif.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedNotif.complaintId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNotif(null);
                      navigate('/track-complaint');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track Case</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedNotif(null)}
                  className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE ALL NOTIFICATIONS MODAL */}
      {showConfirmDeleteAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete All Notifications?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to delete all <span className="font-bold text-slate-800 dark:text-slate-200">{notifications.length}</span> notification(s) at once? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfirmDeleteAll(false)}
                disabled={deletingAll}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                disabled={deletingAll}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {deletingAll ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Delete All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NotificationsModule;

