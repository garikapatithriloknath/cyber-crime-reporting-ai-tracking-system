import React from 'react';
import { PhoneCall, Globe, AlertTriangle, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B192C] text-slate-600 dark:text-gray-400 mt-auto transition-colors duration-300">
      {/* Helpline Banner */}
      <div className="bg-gradient-to-r from-red-100 via-amber-50 to-blue-100 dark:from-red-950/40 dark:via-gray-900 dark:to-cyan-950/40 border-b border-slate-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-700 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-amber-400" />
            <span>
              <strong>Emergency Cyber Fraud Helpline:</strong> Dial <strong>1930</strong> immediately to report financial fraud.
            </span>
          </div>
          <div className="flex items-center gap-4 text-blue-700 dark:text-cyan-400">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:underline font-semibold"
            >
              National Cyber Crime Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Portal Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <img
                src="/logo.jpeg"
                alt="Cyber Crime Logo"
                className="w-7 h-7 rounded-full object-cover border border-blue-500/60 shadow-sm"
              />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                Cyber<span className="text-blue-600 dark:text-cyan-400">Guard</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed max-w-md">
              An intelligent, transparent, and rapid cyber crime reporting & automated AI tracking system. Classifying
              incidents into Phishing, Online Fraud, Identity Theft, Social Media Scam, Cyberbullying, and Malware with
              automated priority scoring.
            </p>
          </div>

          {/* Col 2: Fast Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Portal Home / Login
                </a>
              </li>
              <li>
                <a href="/submit-complaint" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Submit Complaint
                </a>
              </li>
              <li>
                <a href="/track-complaint" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Track Complaint Status
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Officer / Admin Access
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Crime Taxonomy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 mb-3">
              Supported Crimes
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                Phishing
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                Online Fraud
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                Identity Theft
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                Social Media Scam
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                Cyberbullying
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                Malware
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-gray-800/80 text-center text-xs text-slate-400 dark:text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Cyber Crime Reporting and AI Tracking System. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
