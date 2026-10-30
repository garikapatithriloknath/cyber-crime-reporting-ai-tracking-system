import React, { useState, useEffect } from 'react';
import {
  Plus,
  Eye,
  RefreshCw,
  Printer,
  Search,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Archive,
  Layers
} from 'lucide-react';
import api from '../../services/api';
import { generateFirReceipt } from '../../utils/firGenerator';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const defaultComplaintsList = [
  {
    id: 'COM-2024-001',
    user: 'Rahul',
    userEmail: 'rahul@example.com',
    title: 'Phishing Website',
    category: 'Phishing',
    priority: 'High',
    status: 'Under Review',
    date: '20 May 2024',
  },
  {
    id: 'COM-2024-002',
    user: 'Priya',
    userEmail: 'sagar@example.com',
    title: 'Online Fraud - UPI Scam',
    category: 'Online Fraud',
    priority: 'High',
    status: 'Investigating',
    date: '20 May 2024',
  },
  {
    id: 'COM-2024-003',
    user: 'Amit',
    userEmail: 'amit@example.com',
    title: 'Instagram Impersonation',
    category: 'Social Media Scam',
    priority: 'Medium',
    status: 'Resolved',
    date: '18 May 2024',
  },
  {
    id: 'COM-2024-004',
    user: 'Neha',
    userEmail: 'neha@example.com',
    title: 'Fake Job Offer Scam',
    category: 'Online Fraud',
    priority: 'Medium',
    status: 'Under Review',
    date: '17 May 2024',
  },
  {
    id: 'COM-2024-005',
    user: 'Vikram',
    userEmail: 'vikram@example.com',
    title: 'Malicious Software',
    category: 'Malware/Ransomware',
    priority: 'High',
    status: 'Investigating',
    date: '16 May 2024',
  },
];

const MyComplaintsModule = ({ onNewComplaintClick, onSelectComplaint }) => {
  const { user } = useAuth();
  const { t, translateStatus, translateCategory, translatePriority } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [deletedComplaints, setDeletedComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'deleted'
  const [loading, setLoading] = useState(false);
  const [undoItem, setUndoItem] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints', {
        params: {
          userEmail: user?.email || '',
        },
      });
      if (res.data.success && res.data.complaints) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.warn('Could not fetch complaints from server:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeleted = async () => {
    try {
      const res = await api.get('/complaints/deleted/all', {
        params: { userEmail: user?.email },
      });
      if (res.data?.success) {
        setDeletedComplaints(res.data.deletedComplaints || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchComplaints();
    fetchDeleted();
  }, [user]);

  // Handle Delete Complaint with Undo capability
  const handleDelete = async (e, item) => {
    e?.stopPropagation();
    const targetId = item.id;

    setComplaints((prev) => prev.filter((c) => c.id !== targetId));
    setDeletedComplaints((prev) => [item, ...prev]);

    setUndoItem(item);

    try {
      await api.delete(`/complaints/${targetId}`);
    } catch (err) {
      console.error('Failed to soft delete complaint:', err);
    }
  };

  const handleUndo = async (itemToRestore) => {
    if (!itemToRestore) return;
    const targetId = itemToRestore.id;

    setDeletedComplaints((prev) => prev.filter((c) => c.id !== targetId));
    setComplaints((prev) => [itemToRestore, ...prev]);
    setUndoItem(null);

    try {
      await api.post(`/complaints/restore/${targetId}`);
    } catch (err) {
      console.error('Failed to restore complaint:', err);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'Low':
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      case 'Investigating':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'Submitted':
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    }
  };

  const displayedList = activeTab === 'active' ? complaints : deletedComplaints;

  return (
    <div className="space-y-4">
      <div className="module-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {t.myComplaintsTitle || 'My Registered Complaints'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.myComplaintsSubtitle || 'Complete history and real-time investigation logs for all your filed complaints.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchComplaints();
                fetchDeleted();
              }}
              title="Refresh List"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onNewComplaintClick && onNewComplaintClick()}
              className="flex items-center gap-1.5 py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.myFileNewBtn || '+ File New Complaint'}</span>
            </button>
          </div>
        </div>

        {/* UNDO NOTIFICATION BANNER */}
        {undoItem && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl flex items-center justify-between gap-3 shadow-md animate-slideDown">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Complaint <strong className="font-mono">{undoItem.id}</strong> deleted.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleUndo(undoItem)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>UNDO</span>
            </button>
          </div>
        )}

        {/* Active vs Deleted Filter Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Active ({complaints.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deleted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'deleted'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Trash ({deletedComplaints.length})</span>
          </button>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300">
                <th className="py-3 px-3.5 font-semibold">{t.myColId || 'ID'}</th>
                <th className="py-3 px-3.5 font-semibold">{t.myColTitle || 'Title'}</th>
                <th className="py-3 px-3.5 font-semibold">{t.myColCategory || 'Category'}</th>
                <th className="py-3 px-3.5 font-semibold">{t.myColPriority || 'Priority'}</th>
                <th className="py-3 px-3.5 font-semibold">{t.myColStatus || 'Status'}</th>
                <th className="py-3 px-3.5 font-semibold">{t.myColDate || 'Date'}</th>
                <th className="py-3 px-3.5 font-semibold text-center">{t.myColActions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                    {activeTab === 'active'
                      ? (t.myNoComplaintsFound || 'No active complaints found. Click "New Complaint" to lodge a report.')
                      : 'Trash is empty. No deleted complaints.'}
                  </td>
                </tr>
              ) : (
                displayedList.map((item, idx) => (
                  <tr key={`${item.id || item._id || 'complaint'}-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td
                      onClick={() => onSelectComplaint && onSelectComplaint(item.id)}
                      className="py-3 px-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
                    >
                      {item.id}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">{item.title}</td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300">{translateCategory(item.category)}</td>
                    <td className="py-3 px-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(item.priority)}`}>
                        {translatePriority(item.priority)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(item.status)}`}>
                        {translateStatus(item.status)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">{item.date}</td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {activeTab === 'active' ? (
                          <>
                            <button
                              title={t.myActionTrack || 'Track Status'}
                              onClick={() => onSelectComplaint && onSelectComplaint(item.id)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors"
                            >
                              <Search className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Download Official FIR Receipt"
                              onClick={(e) => {
                                e.stopPropagation();
                                generateFirReceipt(item);
                              }}
                              className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Delete Complaint"
                              onClick={(e) => handleDelete(e, item)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            title="Undo Deletion / Restore"
                            onClick={() => handleUndo(item)}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Undo / Restore</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyComplaintsModule;
