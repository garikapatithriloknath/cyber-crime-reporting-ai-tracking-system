import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Info,
  CreditCard,
  UserX,
  PhoneCall,
  Copy,
  Check,
  Download,
  Volume2,
  VolumeX,
  Globe,
  Languages,
  Printer,
  FileText,
} from 'lucide-react';
import { instructionTranslations, getInstructionTranslation } from '../../utils/translations';
import { useLanguage } from '../../context/LanguageContext';

const ComplainantChecklist = ({ compact = false, showHeader = true, className = '', defaultLang }) => {
  const { language: globalLang, setLanguage } = useLanguage();
  const selectedLang = defaultLang && ['en', 'te', 'hi'].includes(defaultLang) ? defaultLang : globalLang;

  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync translation content
  const t = getInstructionTranslation(selectedLang);

  const handleLanguageChange = (langKey) => {
    setLanguage(langKey);
    // Stop speaking if switching language
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle SpeechSynthesis Read Aloud
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = t.summaryText || `${t.title}. ${t.subtitle}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Assign proper BCP 47 language tag
    if (selectedLang === 'te') {
      utterance.lang = 'te-IN';
    } else if (selectedLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // Clear queue
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle Copy to Clipboard in active language
  const handleCopy = () => {
    const textToCopy = t.summaryText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Handle Download Text File
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([t.summaryText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `CyberGuard_Instructions_${selectedLang.toUpperCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between transition-colors ${className}`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & LANGUAGE SELECTOR BAR                                    */}
      {/* ========================================================================= */}
      <div className="pt-3.5 pb-3 px-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
        
        {/* Language Selection Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">{t.selectLang}</span>
            <span className="sm:hidden font-bold">Language:</span>
          </div>

          {/* Language Buttons (English, Telugu, Hindi) */}
          <div className="inline-flex bg-slate-200/80 dark:bg-slate-950 p-1 rounded-lg shadow-inner gap-1">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedLang === 'en'
                  ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Read instructions in English"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>

            <button
              type="button"
              onClick={() => handleLanguageChange('te')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedLang === 'te'
                  ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="తెలుగులో సూచనలు చదవండి (Telugu)"
            >
              <span>🇮🇳</span>
              <span>తెలుగు (Telugu)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedLang === 'hi'
                  ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="हिन्दी में निर्देश पढ़ें (Hindi)"
            >
              <span>🇮🇳</span>
              <span>हिन्दी (Hindi)</span>
            </button>
          </div>
        </div>

        {/* Title Header */}
        {showHeader && (
          <div className="text-center pt-1">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px bg-slate-300 dark:bg-slate-700 w-8 sm:w-12"></span>
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100 font-mono">
                {t.title}
              </h2>
              <span className="h-px bg-slate-300 dark:bg-slate-700 w-8 sm:w-12"></span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.subtitle}</span>
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. CHECKLIST CONTENT (TRANSLATED)                                        */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed overflow-y-auto max-h-[560px]">
        
        {/* === SECTION 1: MANDATORY INFORMATION === */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              {t.mandatoryHeader}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              {t.requiredBadge}
            </span>
          </div>

          <ol className="list-none space-y-2 text-[11px] sm:text-xs">
            {/* Item 1: Date & Time */}
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
              <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">1.</span>
              <div>
                <strong className="text-slate-900 dark:text-slate-100">{t.mandatoryItems[0].title}</strong>{' '}
                <span>{t.mandatoryItems[0].desc}</span>
              </div>
            </li>

            {/* Item 2: Incident Details (200+ characters) */}
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
              <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">2.</span>
              <div>
                <strong className="text-slate-900 dark:text-slate-100">{t.mandatoryItems[1].title}</strong>{' '}
                <span>{t.mandatoryItems[1].desc} </span>
                {t.mandatoryItems[1].code && (
                  <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-rose-600 dark:text-rose-300 font-mono font-bold">
                    {t.mandatoryItems[1].code}
                  </code>
                )}
                <span>{t.mandatoryItems[1].suffix || ''}</span>
              </div>
            </li>

            {/* Item 3: Soft copy of National ID */}
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
              <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">3.</span>
              <div>
                <strong className="text-slate-900 dark:text-slate-100">{t.mandatoryItems[2].title}:</strong>{' '}
                <span>{t.mandatoryItems[2].desc} </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 px-1 rounded">
                  {t.mandatoryItems[2].formats}
                </span>{' '}
                <span>(&le; <strong>{t.mandatoryItems[2].maxSize}</strong>).</span>
              </div>
            </li>

            {/* Item 4: Financial Fraud Breakdown */}
            <li className="space-y-1.5 bg-amber-50/80 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/40">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-xs">
                <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>4. {t.mandatoryItems[3].title}</span>
              </div>
              <ul className="pl-4 sm:pl-5 space-y-1.5 text-[11px] text-amber-950 dark:text-amber-200/90 list-none">
                {t.mandatoryItems[3].financialItems.map((fi, idx) => {
                  const roman = ['i)', 'ii)', 'iii)', 'iv)'][idx];
                  return (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-700 dark:text-amber-400 font-bold shrink-0">{roman}</span>
                      <div>
                        <strong className="text-amber-900 dark:text-amber-200">{fi.label}</strong>
                        {fi.hint && (
                          <span className="text-[10px] text-amber-700/80 dark:text-amber-300/80 ml-1">
                            {fi.hint}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Item 5: Evidence uploads */}
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
              <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">5.</span>
              <div>
                <strong className="text-slate-900 dark:text-slate-100">{t.mandatoryItems[4].title}:</strong>{' '}
                <span>{t.mandatoryItems[4].desc} </span>
                <strong className="text-blue-600 dark:text-blue-400 font-bold">&le; {t.mandatoryItems[4].maxSize}</strong>
                <span>{t.mandatoryItems[4].suffix || ''}</span>
              </div>
            </li>
          </ol>
        </div>

        {/* === SECTION 2: OPTIONAL / DESIRABLE INFORMATION === */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              {t.optionalHeader}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {t.optionalBadge}
            </span>
          </div>

          <ol className="list-none space-y-2 text-[11px] sm:text-xs">
            {/* Optional 1: Suspected URLs */}
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
              <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">1.</span>
              <div>
                <strong className="text-slate-900 dark:text-slate-100">{t.optionalItems[0].title}</strong>{' '}
                <span>{t.optionalItems[0].desc}</span>
              </div>
            </li>

            {/* Optional 2: Suspect Details List */}
            <li className="space-y-1.5 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-1.5 font-bold text-blue-950 dark:text-blue-200 text-xs">
                <UserX className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>2. {t.optionalItems[1].title}</span>
              </div>
              <ul className="pl-4 sm:pl-5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 list-none">
                {t.optionalItems[1].suspectFields.map((field, sIdx) => {
                  const sRoman = ['i)', 'ii)', 'iii)', 'iv)', 'v)', 'vi)'][sIdx];
                  const isFullCol = sIdx >= 4;
                  return (
                    <li
                      key={sIdx}
                      className={`flex items-start gap-1.5 ${isFullCol ? 'col-span-1 sm:col-span-2' : ''}`}
                    >
                      <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">{sRoman}</span>
                      <span>{field}</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ol>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM ACTION FOOTER & HELPLINE                                       */}
      {/* ========================================================================= */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px]">
        
        {/* National Helpline 1930 Phone Dial Action */}
        <a
          href="tel:1930"
          className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 group transition-colors"
          title="Click to dial National Cyber Crime Helpline 1930"
        >
          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span>
            {t.helplineText} <strong className="text-red-600 dark:text-red-400 font-mono text-xs font-black">1930</strong>
          </span>
        </a>

        {/* Action Buttons: Audio, Download & Copy */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
          {/* Read Aloud Text-to-Speech Button */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              isSpeaking
                ? 'bg-amber-600 text-white shadow-xs font-bold animate-pulse'
                : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
            }`}
            title="Listen to instructions readout in selected language"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t.readAloud}</span>
              </>
            )}
          </button>

          {/* Download Text Guide */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-[11px] font-medium transition-colors"
            title="Download instructions as a text document"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">{t.downloadChecklist}</span>
          </button>

          {/* Copy Checklist to Clipboard */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
            }`}
            title="Copy all instructions to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? t.copiedText : t.copyChecklist}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplainantChecklist;
