import React, { useEffect } from 'react';
import { X, Download, User, ZoomIn, Shield, Award } from 'lucide-react';

export default function ImageLightboxModal({ isOpen, onClose, imageUrl, title = 'Profile Photo', subtitle = '' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white cursor-default flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ZoomIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 font-mono">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download="profile-photo.jpg"
              target="_blank"
              rel="noopener noreferrer"
              title="Download Full Photo"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Full Image Display */}
        <div className="p-6 sm:p-8 flex items-center justify-center bg-slate-950/80">
          <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>CyberGuard Verified Profile Picture</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
