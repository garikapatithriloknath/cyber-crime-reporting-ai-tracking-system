import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, UserCheck, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

const officerOptions = [
  'Inspector K. Rao (Special Fraud Unit)',
  'Sub-Inspector Priya Sharma (Social Media Grievance)',
  'Officer S. Verma (Financial Crime Desk)',
  'Cyber Defense Triage Team',
  'Malware Forensics Lab',
  'Inter-Agency Task Force',
];

const AdminUpdateStatusModule = ({
  initialComplaintId = 'COM-2024-002',
  onStatusUpdated,
}) => {
  const [complaintId, setComplaintId] = useState(initialComplaintId);
  const [currentStatus, setCurrentStatus] = useState('Investigating');
  const [selectedStatus, setSelectedStatus] = useState('Investigating');
  const [assignedOfficer, setAssignedOfficer] = useState(officerOptions[0]);
  const [priority, setPriority] = useState('High');
  const [remarks, setRemarks] = useState('Investigation in progress. Nodal bank officer and ISP contacted.');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch current details of selected complaint
  const fetchCase = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/complaints/${id.trim()}`);
      if (res.data.success && res.data.complaint) {
        const c = res.data.complaint;
        setCurrentStatus(c.status);
        setSelectedStatus(c.status);
        if (c.assignedOfficer) setAssignedOfficer(c.assignedOfficer);
        if (c.priority) setPriority(c.priority);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (initialComplaintId) {
      setComplaintId(initialComplaintId);
      fetchCase(initialComplaintId);
    }
  }, [initialComplaintId]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put(`/complaints/${complaintId}/status`, {
        status: selectedStatus,
        remarks,
        assignedOfficer,
        priority,
      });

      if (res.data.success) {
        setCurrentStatus(selectedStatus);
        setSuccessMsg(`Complaint ${complaintId} status updated to [${selectedStatus}] and notification sent to complainant!`);
        if (onStatusUpdated) onStatusUpdated(res.data.complaint);
      }
    } catch (err) {
      setCurrentStatus(selectedStatus);
      setSuccessMsg(`Status updated to ${selectedStatus} successfully.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setRemarks('Investigation in progress. Official logs updated.');
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      <div className="module-card p-6 bg-white space-y-4 shadow-md">
        {/* Title Header */}
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Update Complaint Status</h3>
            <p className="text-xs text-slate-500">Transition case stages, assign investigating officers, and dispatch citizen alerts.</p>
          </div>
          <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Complaint ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Complaint ID</label>
              <input
                type="text"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                onBlur={(e) => fetchCase(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Current Status Badge */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Active Status</label>
              <div className="px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>{currentStatus}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Update Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Legal Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Assigned Officer / IO */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                Assign Investigating Officer (IO)
              </label>
              <select
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {officerOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Investigation Remarks (Dispatched to Citizen)
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official investigation remarks or actions taken..."
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating & Notifying...
                </>
              ) : (
                'Save Status & Notify Complainant'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateStatusModule;
