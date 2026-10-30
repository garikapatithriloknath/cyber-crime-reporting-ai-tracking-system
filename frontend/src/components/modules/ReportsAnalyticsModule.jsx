import React, { useState, useEffect } from 'react';
import { Users, FileSpreadsheet, Percent, BarChart3 } from 'lucide-react';
import api from '../../services/api';

const ReportsAnalyticsModule = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    resolvedRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [analyticsRes, statsRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/stats'),
        ]);

        if (analyticsRes.data.success && analyticsRes.data.monthlyComplaints) {
          setMonthlyData(analyticsRes.data.monthlyComplaints);
        }

        if (statsRes.data.success && statsRes.data.adminStats) {
          setStats({
            totalUsers: statsRes.data.adminStats.totalUsers || 0,
            totalComplaints: statsRes.data.adminStats.totalComplaints || 0,
            resolvedRate: statsRes.data.adminStats.resolutionRate || 0,
          });
        }
      } catch (e) {
        console.error('Failed to load analytics:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const maxCount = Math.max(...monthlyData.map((m) => m.count || 0), 10);

  return (
    <div className="space-y-4">
      <div className="module-card p-6 bg-white dark:bg-slate-900 space-y-5 shadow-md border border-slate-200 dark:border-slate-800">
        {/* Title Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Analytics & Reports</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">System growth metrics, resolution rates, and forensic trend data.</p>
          </div>
          <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Total Users</p>
              <p className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.totalUsers}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Total Complaints</p>
              <p className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.totalComplaints}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Resolved (%)</p>
              <p className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.resolvedRate}%</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Monthly Complaints Bar Chart */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-2">Monthly Complaints Filed</h4>
          
          <div className="h-48 w-full flex flex-col justify-end pt-2">
            <div className="relative w-full h-40 flex items-end justify-between px-3 sm:px-8 border-b border-slate-200 dark:border-slate-700">
              {/* Vertical Bars */}
              {monthlyData.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(12, (item.count / maxCount) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 z-10 group">
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-5 sm:w-8 bg-purple-700 hover:bg-purple-600 rounded-t-md shadow-xs transition-all duration-300"
                    />
                  </div>
                );
              })}
            </div>

            {/* X Axis Months */}
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-2 px-4 sm:px-10">
              {monthlyData.map((item, idx) => (
                <span key={idx}>{item.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalyticsModule;
