import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  FilePlus, 
  Search, 
  AlertOctagon, 
  Lock, 
  Users, 
  Smartphone, 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';

const Home = () => {
  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track-complaint?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  const crimeCategories = [
    {
      title: 'Phishing',
      desc: 'Fraudulent emails, deceptive websites, and fake login links stealing credentials.',
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      tag: 'Credentials / Bank'
    },
    {
      title: 'Online Fraud',
      desc: 'UPI scams, fake e-commerce portals, lottery tricks, and unauthorized credit transactions.',
      icon: <AlertOctagon className="w-6 h-6 text-red-400" />,
      tag: 'Financial Crimes'
    },
    {
      title: 'Identity Theft',
      desc: 'Impersonation, cloned profiles, stolen documents, and illicit loan applications.',
      icon: <Users className="w-6 h-6 text-purple-400" />,
      tag: 'Personal Data'
    },
    {
      title: 'Social Media Scam',
      desc: 'Account takeovers, fake investment schemes, honey traps, and impersonation extortion.',
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      tag: 'Social Media'
    },
    {
      title: 'Cyberbullying',
      desc: 'Online harassment, non-consensual image sharing, stalking, and continuous threats.',
      icon: <ShieldAlert className="w-6 h-6 text-amber-400" />,
      tag: 'Harassment & Safety'
    },
    {
      title: 'Malware / Ransomware',
      desc: 'Trojan infection, device locking, ransom demands, spyware, and keylogger attacks.',
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      tag: 'System Threats'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow backdrop decorative elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wide shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-300" />
            AI-POWERED INCIDENT CLASSIFICATION & TRIAGE
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Report Cyber Crime. <br />
            <span className="cyber-gradient-text">Track Real-Time with AI.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            A fast, secure, and transparent digital gateway for reporting online fraud, harassment, and security breaches. 
            Powered by Natural Language Processing to categorize cases and assess emergency priority instantly.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/submit-complaint"
              className="cyber-gradient-btn w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-glow-cyan text-base"
            >
              <FilePlus className="w-5 h-5" />
              File Cyber Complaint
            </Link>
            
            <Link
              to="/track-complaint"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-gray-200 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Search className="w-5 h-5 text-cyan-400" />
              Track by Complaint ID
            </Link>
          </div>
        </div>

        {/* Quick Tracking Search Bar */}
        <div className="mt-14 max-w-xl mx-auto">
          <div className="cyber-card p-2 sm:p-3 border border-gray-700 shadow-2xl">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Complaint ID (e.g. CR-2026-8941)"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-900/90 border border-gray-700/80 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                Track Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6 AI Crime Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Supported Cyber Crime Classifications
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Our AI engine parses complaint narratives to classify crimes accurately into six distinct operational categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crimeCategories.map((item, idx) => (
            <div key={idx} className="cyber-card p-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gray-800/80 border border-gray-700/60 group-hover:border-cyan-500/50 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300">
                    {item.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-cyan-400 font-medium">
                <span>AI Auto-Detected</span>
                <span className="font-mono text-gray-500">Tier 1-3</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works & Process Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cyber-card p-8 sm:p-12 border border-gray-700/70">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              End-to-End Investigation Lifecycle
            </h2>
            <p className="text-sm text-gray-400">
              Transparent, accountable progress tracking from citizen reporting to closure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold">
                01
              </div>
              <h3 className="font-bold text-white text-base">Submit Incident</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Provide incident details, screenshots, transaction IDs, or suspect profiles.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-mono font-bold">
                02
              </div>
              <h3 className="font-bold text-white text-base">AI Classification</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                NLP algorithm infers crime taxonomy and assigns priority score (High / Medium / Low).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold">
                03
              </div>
              <h3 className="font-bold text-white text-base">Officer Investigation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cyber cell officers review digital forensics, take actions, and log real-time remarks.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold">
                04
              </div>
              <h3 className="font-bold text-white text-base">Resolution & Closure</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Citizen receives final action report, recovery advice, and official case status.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
