/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          darker: '#07132B',
          dark: '#0B192C',
          card: '#111827',
          border: '#1E293B',
          accent: '#06B6D4',     // Cyan
          neon: '#10B981',       // Emerald Neon
          alert: '#EF4444',      // Red Alert
          warning: '#F59E0B',    // Amber
          subtle: '#9CA3AF'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'glow-sun': '0 0 15px 2px rgba(245, 158, 11, 0.4)',
        'glow-moon': '0 0 15px 2px rgba(99, 102, 241, 0.4)',
      }
    },
  },
  plugins: [],
}
