import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  X,
  Printer,
  Search,
  Check,
} from 'lucide-react';
import api from '../../services/api';
import { generateFirReceipt } from '../../utils/firGenerator';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const NewComplaintModule = ({ onComplaintCreated }) => {
  const { user } = useAuth();
  const { t, translateCategory, translatePriority } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [predictedCategory, setPredictedCategory] = useState('');
  const [predictedPriority, setPredictedPriority] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileError, setFileError] = useState('');

  const descTrimmed = description.trim();
  const descLength = descTrimmed.length;
  const isLengthValid = descLength >= 20;

  // Live auto-prediction debounce as user types
  useEffect(() => {
    if (!title && !description) {
      setPredictedCategory('');
      setPredictedPriority('');
      setConfidence(0);
      return;
    }

    const timer = setTimeout(async () => {
      setIsPredicting(true);
      try {
        const res = await api.post('/complaints/predict', { title, description });
        if (res.data.success) {
          setPredictedCategory(res.data.category);
          setPredictedPriority(res.data.priority);
          setConfidence(res.data.confidenceCategory);
        }
      } catch (err) {
        // Fallback local heuristics
        const text = `${title} ${description}`.toLowerCase();
        if (/phish|bank|otp|login link/i.test(text)) {
          setPredictedCategory('Phishing');
          setPredictedPriority('High');
          setConfidence(92);
        } else if (/upi|qr|money|scam|fraud/i.test(text)) {
          setPredictedCategory('Online Fraud');
          setPredictedPriority('High');
          setConfidence(95);
        } else if (/instagram|fake id|impersonat/i.test(text)) {
          setPredictedCategory('Social Media Scam');
          setPredictedPriority('Medium');
          setConfidence(89);
        } else {
          setPredictedCategory('Online Fraud');
          setPredictedPriority('Medium');
          setConfidence(85);
        }
      } finally {
        setIsPredicting(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [title, description]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const combined = [...evidenceFiles, ...newFiles].slice(0, 5);
      setEvidenceFiles(combined);

      const oversized = combined.find((file) => file.size > 10 * 1024 * 1024);
      if (oversized) {
        setFileError(`File too large (${(oversized.size / (1024 * 1024)).toFixed(1)}MB). Max 10MB per file allowed.`);
      } else {
        setFileError('');
      }
    }
    e.target.value = '';
  };

  const removeFile = (index) => {
    const remaining = evidenceFiles.filter((_, i) => i !== index);
    setEvidenceFiles(remaining);
    const oversized = remaining.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setFileError(`File too large (${(oversized.size / (1024 * 1024)).toFixed(1)}MB). Max 10MB per file allowed.`);
    } else {
      setFileError('');
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setEvidenceFiles([]);
    setPredictedCategory('');
    setPredictedPriority('');
    setConfidence(0);
    setSuccessMessage('');
    setErrorMessage('');
    setFileError('');
    setSubmittedComplaint(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !descTrimmed) {
      setErrorMessage(t.submitIncidentDetailsHint || 'Please provide both a complaint title and incident description.');
      return;
    }

    if (descLength < 20) {
      setErrorMessage(`Incident description must be at least 20 characters describing the event chronologically (currently ${descLength} characters, ${20 - descLength} more needed).`);
      return;
    }

    const oversized = evidenceFiles.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setFileError(`File too large (${(oversized.size / (1024 * 1024)).toFixed(1)}MB). Max 10MB per file allowed.`);
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setFileError('');
    setSuccessMessage('');
    setSubmittedComplaint(null);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('user', user?.name || 'Citizen');
      formData.append('userEmail', user?.email || '');
      formData.append('evidenceCount', evidenceFiles.length || 1);

      evidenceFiles.forEach((file) => {
        formData.append('evidence', file);
      });

      const res = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccessMessage(`${t.submitSuccessTitle || 'Complaint lodged successfully!'} ${t.submitAckRef || 'Reference ID'}: ${res.data.complaint.id}`);
        setSubmittedComplaint(res.data.complaint);
        if (onComplaintCreated) onComplaintCreated(res.data.complaint);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint. Please retry.';
      if (/file too large|limit_file_size|file.*large|large.*file|too large/i.test(msg)) {
        setFileError('File too large: Attached file exceeds the 10MB limit. Max 10MB per file allowed.');
        setErrorMessage('');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="module-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
        {/* Title Header */}
        <div className="mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {t.submitTitle || 'Submit a New Complaint'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.submitSubtitle || 'Provide accurate details to help law enforcement and AI triage team take immediate action.'}
          </p>
        </div>

        {successMessage && submittedComplaint && (
          <div className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="font-bold text-xs sm:text-sm">{successMessage}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <button
                type="button"
                onClick={() => generateFirReceipt(submittedComplaint)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                {t.submitDownloadAck || 'Download Official FIR Receipt (PDF)'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/track-complaint?id=${submittedComplaint.id}`)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t.submitTrackNow || 'Track Status Now'}
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Complaint Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.myColTitle || 'Complaint Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.myFilterSearch || 'e.g. Phishing Banking SMS / UPI Payment Scam'}
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
              required
            />
          </div>

          {/* Category (AI Prediction) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>{t.submitAiPreviewTitle || 'Category & Priority (AI Live Prediction)'}</span>
              {isPredicting && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-normal">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> AI Analyzing...
                </span>
              )}
            </label>
            <div className="px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 flex items-center justify-between min-h-[40px]">
              {predictedCategory ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {translateCategory(predictedCategory)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {confidence}% {t.submitAiConfidence || 'Confidence'}
                  </span>
                  {predictedPriority && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        predictedPriority === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {t.myColPriority || 'Priority'}: {translatePriority(predictedPriority)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-slate-400 italic">
                  Will be auto-classified by AI as you describe the crime
                </span>
              )}
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.submitIncidentDetails || 'Incident Description (Minimum 20 characters)'}
              </label>
              {description.length > 0 && (
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded transition-colors ${
                    isLengthValid
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {descLength} / 20 chars {isLengthValid ? '✓' : `(${20 - descLength} more required)`}
                </span>
              )}
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the cyber incident chronologically with all details (minimum 20 characters). You can include URLs, emails, transaction IDs, and special characters..."
              className={`w-full px-3.5 py-2.5 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 placeholder:text-slate-400 resize-none leading-relaxed transition-colors ${
                !isLengthValid && description.length > 0
                  ? 'border-amber-400 dark:border-amber-600 focus:ring-amber-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-transparent'
              }`}
              required
            />

            {/* Live hint if under 20 characters */}
            {description.length > 0 && !isLengthValid && (
              <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Minimum 20 characters required. Please add {20 - descLength} more character(s) describing what occurred chronologically.</span>
              </p>
            )}
          </div>

          {/* Upload Evidence */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.submitUploadEvidence || 'Upload Evidence Files (Screenshots, PDFs, SMS Records)'}
              </label>
              {fileError && (
                <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  {fileError}
                </span>
              )}
            </div>

            <div
              className={`border border-dashed rounded-lg p-3.5 transition-colors ${
                fileError
                  ? 'border-red-400 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 text-xs">
                <label className="cursor-pointer px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  Select Files
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
                  />
                </label>

                {fileError ? (
                  <span className="text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    {fileError}
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {evidenceFiles.length > 0
                      ? `${evidenceFiles.length} file(s) ready to upload`
                      : (t.submitEvidenceHint || 'Attach payment receipts, chat screenshots, or suspicious emails')}
                  </span>
                )}
              </div>

              {/* Selected Files List Chips */}
              {evidenceFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  {evidenceFiles.map((file, idx) => {
                    const isOversized = file.size > 10 * 1024 * 1024;
                    return (
                      <div
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border ${
                          isOversized
                            ? 'bg-red-50 dark:bg-red-950/70 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 font-medium'
                            : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300'
                        }`}
                      >
                        <FileText
                          className={`w-3.5 h-3.5 ${
                            isOversized ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                        <span className="max-w-[150px] truncate font-medium">{file.name}</span>
                        <span
                          className={`text-[9px] font-mono ${
                            isOversized ? 'text-red-600 dark:text-red-400 font-bold' : 'text-blue-500'
                          }`}
                        >
                          ({Math.round(file.size / 1024)} KB{isOversized ? ' - File too large' : ''})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-slate-400 hover:text-red-600 ml-1"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-[10px] text-slate-400 mt-2">
                Supported: PNG, JPG, PDF, TXT (Max 10MB per file, up to 5 files).
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t.submittingBtn || 'Submitting & Uploading...'}
                </>
              ) : (
                t.submitBtn || 'Submit Complaint'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg border border-slate-300 dark:border-slate-700 transition-colors"
            >
              {t.btnCancel || 'Reset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaintModule;
