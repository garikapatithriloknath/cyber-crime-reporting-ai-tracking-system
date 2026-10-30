import React, { useState } from 'react';
import NewComplaintModule from '../components/modules/NewComplaintModule';
import AiPredictionModule from '../components/modules/AiPredictionModule';
import ComplainantChecklist from '../components/common/ComplainantChecklist';
import { Sparkles, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SubmitComplaintPage = () => {
  const { t } = useLanguage();
  const [activeSideTab, setActiveSideTab] = useState('checklist'); // 'checklist' or 'ai'
  const [prediction, setPrediction] = useState({
    category: 'Online Fraud',
    confidenceCategory: 92,
    priority: 'High',
    confidencePriority: 88,
  });

  const handleCreated = (complaint) => {
    if (complaint.confidenceCategory) {
      setPrediction({
        category: complaint.category,
        confidenceCategory: complaint.confidenceCategory,
        priority: complaint.priority,
        confidencePriority: complaint.confidencePriority,
      });
      setActiveSideTab('ai');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {t.submitTitle || 'File New Cyber Crime Complaint'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.submitSubtitle || 'Follow the complainant instructions checklist and provide necessary evidences for rapid police action.'}
          </p>
        </div>

        {/* Side Panel Selector on Desktop */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSideTab('checklist')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeSideTab === 'checklist'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            {t.navInstructions || 'Instructions Checklist'}
          </button>

          <button
            type="button"
            onClick={() => setActiveSideTab('ai')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeSideTab === 'ai'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {t.submitAiPreviewTitle || 'AI Live Classifier'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: New Complaint Form */}
        <div className="lg:col-span-7">
          <NewComplaintModule onComplaintCreated={handleCreated} />
        </div>

        {/* Right Column: Dynamic Tab (Checklist or AI Prediction) */}
        <div className="lg:col-span-5 space-y-4">
          {activeSideTab === 'checklist' ? (
            <ComplainantChecklist />
          ) : (
            <AiPredictionModule
              category={prediction.category}
              categoryConfidence={prediction.confidenceCategory}
              priority={prediction.priority}
              priorityConfidence={prediction.confidencePriority}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaintPage;
