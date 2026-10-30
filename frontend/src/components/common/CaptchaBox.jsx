import React, { useState, useEffect, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import api from '../../services/api';

const CaptchaBox = ({ onCaptchaChange, value = '', onChange, placeholder = 'Enter Captcha' }) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const canvasRef = useRef(null);

  // Draw captcha with realistic security distortions and noise
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#f1f5f9');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Random noise background lines
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 100 + 50)}, 0.45)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Random noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.35)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with distinct fonts, angles, and colors
    const charList = text.split('');
    const charSpacing = width / (charList.length + 1);

    charList.forEach((char, index) => {
      ctx.save();
      const x = (index + 0.8) * charSpacing;
      const y = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() - 0.5) * 0.45; // slight rotation

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Character font and styling
      const fontFamilies = ['Arial', 'Verdana', 'Georgia', 'Courier New', 'Trebuchet MS'];
      const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
      ctx.font = `bold ${Math.floor(height * 0.58)}px ${randomFont}`;
      
      const textColors = ['#0f172a', '#1e293b', '#1e3a8a', '#0369a1', '#047857', '#4338ca'];
      ctx.fillStyle = textColors[index % textColors.length];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Shadow for depth
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  };

  const fetchNewCaptcha = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/auth/captcha');
      if (res.data.success) {
        setCaptchaCode(res.data.captcha);
        setCaptchaToken(res.data.token);
        drawCaptcha(res.data.captcha);
        if (onCaptchaChange) {
          onCaptchaChange({ code: res.data.captcha, token: res.data.token });
        }
      }
    } catch (err) {
      // Fallback local generator
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const token = `local_${Date.now()}`;
      setCaptchaCode(code);
      setCaptchaToken(token);
      drawCaptcha(code);
      if (onCaptchaChange) {
        onCaptchaChange({ code, token });
      }
    } finally {
      setTimeout(() => setRefreshing(false), 250);
    }
  };

  useEffect(() => {
    fetchNewCaptcha();
  }, []);

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Captcha Canvas Box + Refresh Button */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shrink-0 shadow-inner">
        <canvas
          ref={canvasRef}
          width={120}
          height={38}
          className="rounded border border-slate-300 dark:border-slate-700 select-none bg-white cursor-pointer"
          onClick={fetchNewCaptcha}
          title="Click to refresh captcha"
        />
        <button
          type="button"
          onClick={fetchNewCaptcha}
          disabled={refreshing}
          className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
          title="Refresh Captcha"
          aria-label="Refresh Captcha"
        >
          <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Captcha Input */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={8}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider transition-all"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default CaptchaBox;
