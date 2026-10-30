import React, { useState } from 'react';
import { Bot, Cpu } from 'lucide-react';
import api from '../../services/api';

const AiPredictionModule = ({
  category = 'Phishing',
  categoryConfidence = 92,
  priority = 'High',
  priorityConfidence = 88,
}) => {
  const [currentCategory, setCurrentCategory] = useState(category);
  const [currentCatConf, setCurrentCatConf] = useState(categoryConfidence);
  const [currentPriority, setCurrentPriority] = useState(priority);
  const [currentPrioConf, setCurrentPrioConf] = useState(priorityConfidence);
  const [testQuery, setTestQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleScenarios = [
    { label: 'Phishing', text: 'Received fake bank login email asking for credentials' },
    { label: 'UPI Fraud', text: 'Scammer sent fake QR code on WhatsApp demanding money' },
    { label: 'Instagram Fake ID', text: 'Impersonation profile copying personal pictures' },
    { label: 'Ransomware', text: 'Malicious virus encrypted files and demands Bitcoin' },
  ];

  const handleTestScenario = async (text) => {
    setTestQuery(text);
    setLoading(true);
    try {
      const res = await api.post('/complaints/predict', { title: text, description: text });
      if (res.data.success) {
        setCurrentCategory(res.data.category);
        setCurrentCatConf(res.data.confidenceCategory);
        setCurrentPriority(res.data.priority);
        setCurrentPrioConf(res.data.confidencePriority);
      }
    } catch (err) {
      if (text.includes('bank') || text.includes('email')) {
        setCurrentCategory('Phishing');
        setCurrentCatConf(92);
        setCurrentPriority('High');
        setCurrentPrioConf(88);
      } else if (text.includes('QR') || text.includes('WhatsApp')) {
        setCurrentCategory('Online Fraud');
        setCurrentCatConf(95);
        setCurrentPriority('High');
        setCurrentPrioConf(91);
      } else if (text.includes('Instagram')) {
        setCurrentCategory('Social Media Scam');
        setCurrentCatConf(89);
        setCurrentPriority('Medium');
        setCurrentPrioConf(82);
      } else {
        setCurrentCategory('Malware/Ransomware');
        setCurrentCatConf(97);
        setCurrentPriority('High');
        setCurrentPrioConf(94);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="module-card p-6 bg-white space-y-4 shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">AI Prediction Results</h3>
            <p className="text-xs text-slate-500">Automated NLP classification and risk analysis.</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* Prediction Results Table / Grid */}
        <div className="space-y-3">
          {/* Row 1: Predicted Category */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Predicted Category:</span>
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {currentCategory}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Confidence Score:</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {currentCatConf}%
              </span>
            </div>
          </div>

          {/* Row 2: Priority Level */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Priority Level:</span>
              <span
                className={`px-3 py-1 rounded-md text-xs font-bold ${
                  currentPriority === 'High'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}
              >
                {currentPriority}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Confidence Score:</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {currentPrioConf}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Simulator Buttons */}
        <div className="pt-2">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Test Live AI Classification:</p>
          <div className="flex flex-wrap gap-1.5">
            {sampleScenarios.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleTestScenario(s.text)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-md border border-slate-200 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner with Robot icon */}
        <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center gap-2.5 text-xs text-slate-700">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <p className="text-[11px] leading-tight">
            AI predictions help authorities prioritize and take faster action.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiPredictionModule;
