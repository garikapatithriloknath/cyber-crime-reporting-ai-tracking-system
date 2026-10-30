import React from 'react';
import ComplainantChecklist from '../components/common/ComplainantChecklist';
import BottomReferencePanels from '../components/modules/BottomReferencePanels';
import { ClipboardList, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructionsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <ClipboardList className="w-6 h-6 text-amber-500" />
            <span>Complainant Instructions & Guidelines</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Available in English, తెలుగు (Telugu), and हिन्दी (Hindi). Review requirements before filing your cyber complaint.
          </p>
        </div>

        <Link
          to="/submit-complaint"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all self-start sm:self-auto"
        >
          <span>File Complaint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Instructions Module */}
      <div className="max-w-4xl mx-auto">
        <ComplainantChecklist className="shadow-md" />
      </div>

      {/* Bottom Quick Reference Panels */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Quick System & AI Reference
        </h3>
        <BottomReferencePanels />
      </div>
    </div>
  );
};

export default InstructionsPage;
