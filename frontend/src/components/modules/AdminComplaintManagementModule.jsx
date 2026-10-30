import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Edit3,
  RefreshCw,
  Download,
  Printer,
  FileText,
  ExternalLink,
  Filter,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Layers,
  Archive,
  X
} from 'lucide-react';
import api from '../../services/api';
import { generateFirReceipt } from '../../utils/firGenerator';

const defaultAdminComplaints = [
  {
    id: 'COM-2024-001',
    user: 'Rahul',
    userEmail: 'rahul@example.com',
    title: 'Phishing Website',
    category: 'Phishing',
    priority: 'High',
    status: 'Under Review',
    date: '20 May 2024',
    description: 'Received a suspicious banking login email with a spoofed URL attempting to harvest netbanking passwords.',
    assignedOfficer: 'Cyber Defense Triage Team',
    evidenceFiles: [],
  },
  {
    id: 'COM-2024-002',
    user: 'Priya',
    userEmail: 'sagar@example.com',
    title: 'UPI Scam',
    category: 'Online Fraud',
    priority: 'High',
    status: 'Investigating',
    date: '20 May 2024',
    description: 'Fraudulent QR code sent on WhatsApp demanding payment verification.',
    assignedOfficer: 'Inspector K. Rao',
    evidenceFiles: [],
  },
  {
    id: 'COM-2024-003',
    user: 'Amit',
    userEmail: 'amit@example.com',
    title: 'Instagram Fake ID',
    category: 'Social Media Scam',
    priority: 'Medium',
    status: 'Resolved',
    date: '18 May 2024',
    description: 'Fake Instagram profile created using personal photos requesting money.',
    assignedOfficer: 'Cyber Cell Unit 2',
    evidenceFiles: [],
  },
  {
    id: 'COM-2024-004',
    user: 'Neha',
    userEmail: 'neha@example.com',
    title: 'Job Offer Scam',
    category: 'Online Fraud',
    priority: 'Medium',
    status: 'Under Review',
    date: '17 May 2024',
    description: 'Received fake appointment letter asking for security deposit.',
    assignedOfficer: 'Officer S. Verma',
    evidenceFiles: [],
  },
  {
    id: 'COM-2024-005',
    user: 'Vikram',
    userEmail: 'vikram@example.com',
    title: 'Malicious App',
    category: 'Malware/Ransomware',
    priority: 'High',
    status: 'Investigating',
    date: '16 May 2024',
    description: 'Ransomware pop-up encrypted local drive.',
    assignedOfficer: 'Malware Lab',
    evidenceFiles: [],
  },
];

const AdminComplaintManagementModule = ({ onSelectComplaint, onEditStatus }) => {
  const [complaints, setComplaints] = useState(defaultAdminComplaints);
  const [deletedComplaints, setDeletedComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'deleted'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [undoItem, setUndoItem] = useState(null);

  const fetchAdminComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints', {
        params: {
          search: searchTerm,
          status: selectedStatus,
          category: selectedCategory,
          priority: selectedPriority,
        },
      });
      if (res.data.success && res.data.complaints) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.warn('Using default admin complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedCases = async () => {
    try {
      const res = await api.get('/complaints/deleted/all');
      if (res.data?.success) {
        setDeletedComplaints(res.data.deletedComplaints || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchAdminComplaints();
    fetchDeletedCases();
  }, [selectedStatus, selectedCategory, selectedPriority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminComplaints();
  };

  // Delete Case by Officer with Undo capability
  const handleDeleteCase = async (e, item) => {
    e?.stopPropagation();
    const targetId = item.id;

    // Optimistically remove from active and add to deleted
    setComplaints((prev) => prev.filter((c) => c.id !== targetId));
    setDeletedComplaints((prev) => [{ ...item, isDeleted: true }, ...prev.filter((d) => d.id !== targetId)]);
    if (selectedCase?.id === targetId) setSelectedCase(null);

    // Set Undo Toast with 8-second timer
    setUndoItem({ ...item });
    setTimeout(() => {
      setUndoItem(null);
    }, 8000);

    try {
      await api.delete(`/complaints/${targetId}`);
    } catch (err) {
      console.warn('Delete API fallback');
    }
  };

  // Undo / Restore Case
  const handleUndoCase = async (itemToRestore) => {
    const target = itemToRestore || undoItem;
    if (!target) return;

    const targetId = target.id;

    // Optimistically restore
    setDeletedComplaints((prev) => prev.filter((c) => c.id !== targetId));
    setComplaints((prev) => [{ ...target, isDeleted: false }, ...prev.filter((c) => c.id !== targetId)]);
    setUndoItem(null);

    try {
      await api.post(`/complaints/${targetId}/restore`);
    } catch (err) {
      console.warn('Restore API fallback');
    }
  };

  // Export complaints as CSV
  const exportToCSV = () => {
    const currentList = activeTab === 'active' ? complaints : deletedComplaints;
    if (!currentList || currentList.length === 0) return;

    const headers = [
      'Case ID',
      'Citizen Name',
      'Citizen Email',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Date Lodged',
      'Assigned Officer',
      'Evidence Count',
      'Description',
    ];

    const rows = currentList.map((c) => [
      `"${c.id}"`,
      `"${c.user || ''}"`,
      `"${c.userEmail || ''}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${c.category || ''}"`,
      `"${c.priority || ''}"`,
      `"${c.status || ''}"`,
      `"${c.date || ''}"`,
      `"${c.assignedOfficer || 'Triage'}"`,
      c.evidenceCount || (c.evidenceFiles ? c.evidenceFiles.length : 0),
      `"${(c.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CyberCrime_Complaints_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Under Review':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Investigating':
        return 'bg-cyan-50 text-cyan-700 border border-cyan-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    }
  };

  const displayedList = activeTab === 'active' ? complaints : deletedComplaints;

  return (
    <div className="space-y-4">
      <div className="module-card p-5 sm:p-6 bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-4 transition-colors">
        
        {/* Header and Filter Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Case Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Law enforcement triage, risk priority inspection, status updates, and case file controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search case, user, type..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-36 sm:w-44 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All Status">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All Categories">All Categories</option>
              <option value="Phishing">Phishing</option>
              <option value="Online Fraud">Online Fraud</option>
              <option value="Identity Theft">Identity Theft</option>
              <option value="Social Media Scam">Social Media Scam</option>
              <option value="CyberBullying">CyberBullying</option>
              <option value="Malware/Ransomware">Malware</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              title="Download filtered records as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                fetchAdminComplaints();
                fetchDeletedCases();
              }}
              title="Refresh Cases"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* UNDO BANNER */}
        {undoItem && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl flex items-center justify-between gap-3 shadow-md animate-slideDown">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Case <strong className="font-mono">{undoItem.id}</strong> deleted.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleUndoCase(undoItem)}
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
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Active Cases ({complaints.length})</span>
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
            <span>Trash / Deleted Cases ({deletedComplaints.length})</span>
          </button>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300">
                <th className="py-3 px-3.5 font-semibold">ID</th>
                <th className="py-3 px-3.5 font-semibold">User</th>
                <th className="py-3 px-3.5 font-semibold">Title</th>
                <th className="py-3 px-3.5 font-semibold">Category (AI)</th>
                <th className="py-3 px-3.5 font-semibold">Priority</th>
                <th className="py-3 px-3.5 font-semibold">Status</th>
                <th className="py-3 px-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                    {activeTab === 'active'
                      ? 'No active cases matching the filter criteria.'
                      : 'Trash is empty. No deleted case records.'}
                  </td>
                </tr>
              ) : (
                displayedList.map((item, idx) => (
                  <tr key={`${item.id || item._id || 'admin-complaint'}-${idx}`} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-purple-700 dark:text-purple-400">{item.id}</td>
                    <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-white">{item.user}</td>
                    <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-slate-200">{item.title}</td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="py-3 px-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-purple-700 dark:text-purple-400">
                        {activeTab === 'active' ? (
                          <>
                            <button
                              title="View Case Details & Evidence"
                              onClick={() => setSelectedCase(item)}
                              className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-950/60 rounded-md transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Update Status"
                              onClick={() => onEditStatus && onEditStatus(item.id)}
                              className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-950/60 rounded-md transition-colors text-slate-600 dark:text-slate-400 hover:text-purple-700"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              title="Download FIR Receipt"
                              onClick={() => generateFirReceipt(item)}
                              className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-950/60 rounded-md transition-colors text-blue-600 dark:text-blue-400"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              title="Delete Case"
                              onClick={(e) => handleDeleteCase(e, item)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            title="Undo Deletion / Restore Case"
                            onClick={() => handleUndoCase(item)}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1"
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

        {/* Inspection Modal */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400">{selectedCase.id}</span>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white">{selectedCase.title}</h4>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Reported By:</span>
                  <span className="font-semibold">{selectedCase.user} ({selectedCase.userEmail || 'sagar@example.com'})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">AI Classified Category:</span>
                  <span className="font-semibold">{selectedCase.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Priority:</span>
                  <span className="font-bold text-red-600">{selectedCase.priority}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Officer / IO:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-400">{selectedCase.assignedOfficer || 'Cyber Defense Triage Team'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{selectedCase.status}</span>
                </div>

                <div className="py-2">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Incident Narrative:</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed">
                    {selectedCase.description || 'No detailed narrative provided.'}
                  </div>
                </div>

                {/* Evidence Files */}
                {selectedCase.evidenceFiles && selectedCase.evidenceFiles.length > 0 && (
                  <div className="py-1">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Attached Evidence Files:</span>
                    <div className="space-y-1.5">
                      {selectedCase.evidenceFiles.map((file, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-[11px] font-medium truncate">{file.originalName || file.filename}</span>
                          </div>
                          {file.url && (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-[11px] font-semibold flex items-center gap-1"
                            >
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex flex-wrap justify-between items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => handleDeleteCase(e, selectedCase)}
                  className="py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Case</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => generateFirReceipt(selectedCase)}
                    className="py-2 px-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print FIR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onEditStatus) onEditStatus(selectedCase.id);
                      setSelectedCase(null);
                    }}
                    className="py-2 px-3.5 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 flex items-center gap-1.5 shadow"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Status</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCase(null)}
                    className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintManagementModule;

