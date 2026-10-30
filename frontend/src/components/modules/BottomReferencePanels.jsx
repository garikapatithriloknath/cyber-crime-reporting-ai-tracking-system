import React from 'react';
import {
  Globe,
  CreditCard,
  UserCheck,
  Smartphone,
  ShieldX,
  Bug,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Search,
  Check,
  ArrowRight,
  Code2,
  Server,
  Database,
  Cpu,
  Wrench,
  Image,
  File,
  Video,
  Music
} from 'lucide-react';

const BottomReferencePanels = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
      {/* 1. AI CATEGORIES */}
      <div className="module-card p-4 bg-white flex flex-col justify-between">
        <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase border-b border-slate-100 pb-1.5 mb-2">
          AI CATEGORIES
        </h4>
        <div className="space-y-1.5 text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>Phishing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-orange-500" />
            <span>Online Fraud</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-purple-500" />
            <span>Identity Theft</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Social Media Scam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldX className="w-3.5 h-3.5 text-pink-500" />
            <span>CyberBullying</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5 text-cyan-500" />
            <span>Malware / Ransomware</span>
          </div>
        </div>
      </div>

      {/* 2. PRIORITY LEVELS */}
      <div className="module-card p-4 bg-white flex flex-col justify-between">
        <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase border-b border-slate-100 pb-1.5 mb-2">
          PRIORITY LEVELS
        </h4>
        <div className="space-y-2 text-[11px]">
          <div className="flex items-start gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">High</span>
              <p className="text-[10px] text-slate-500">(Needs Immediate Action)</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Medium</span>
              <p className="text-[10px] text-slate-500">(Moderate Priority)</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Low</span>
              <p className="text-[10px] text-slate-500">(Can be Handled Later)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPLAINT STATUS WORKFLOW */}
      <div className="module-card p-4 bg-white flex flex-col justify-between lg:col-span-1">
        <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase border-b border-slate-100 pb-1.5 mb-2 text-center">
          COMPLAINT STATUS WORKFLOW
        </h4>
        <div className="flex items-center justify-between gap-1 text-[10px] text-center my-auto py-1">
          {/* Submitted */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1">
              <FileText className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-800">Submitted</span>
          </div>

          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />

          {/* Under Review */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center mb-1">
              <Clock className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-800">Under Review</span>
          </div>

          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />

          {/* Investigating */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1">
              <Search className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-800">Investigating</span>
          </div>

          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />

          {/* Resolved */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1">
              <Check className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-800">Resolved</span>
          </div>
        </div>
      </div>

      {/* 4. TECHNOLOGIES USED */}
      <div className="module-card p-4 bg-white flex flex-col justify-between">
        <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase border-b border-slate-100 pb-1.5 mb-2">
          TECHNOLOGIES USED
        </h4>
        <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-700">
          <div>
            <p className="font-bold text-slate-900">Frontend</p>
            <p className="text-slate-500">React.js, Tailwind CSS</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">Backend</p>
            <p className="text-slate-500">Node.js, Express.js</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">Database</p>
            <p className="text-slate-500">MongoDB</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">AI/ML</p>
            <p className="text-slate-500">Python, Scikit-learn, NLP</p>
          </div>
          <div className="col-span-2 pt-0.5 border-t border-slate-100">
            <p className="font-bold text-slate-900">Tools</p>
            <p className="text-slate-500">VS Code, Postman, Git, GitHub</p>
          </div>
        </div>
      </div>

      {/* 5. EVIDENCE UPLOAD */}
      <div className="module-card p-4 bg-white flex flex-col justify-between">
        <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase border-b border-slate-100 pb-1.5 mb-2 text-center">
          EVIDENCE UPLOAD
        </h4>
        <div className="flex items-center justify-around gap-1 my-auto">
          <div className="flex flex-col items-center gap-1 text-[10px] text-slate-600">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Image className="w-3.5 h-3.5" />
            </div>
            <span>Images</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[10px] text-slate-600">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <File className="w-3.5 h-3.5" />
            </div>
            <span>Documents</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[10px] text-slate-600">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span>Videos</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[10px] text-slate-600">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Music className="w-3.5 h-3.5" />
            </div>
            <span>Audio</span>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 text-center font-mono mt-1">
          (Max File Size: 10MB)
        </p>
      </div>
    </div>
  );
};

export default BottomReferencePanels;
