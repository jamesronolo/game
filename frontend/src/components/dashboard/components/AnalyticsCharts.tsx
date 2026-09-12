import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Layers, Award } from 'lucide-react';

export type AnalyticsTab = 'scores' | 'distribution' | 'topics' | 'leaderboard';

interface AnalyticsChartsProps {
  activeTab: AnalyticsTab;
  setActiveTab: (tab: AnalyticsTab) => void;
  chartData: any[];
  gradeDistribution: any[];
  totalCompleted: number;
  topicBreakdown: any[];
  studentLeaderboard: any[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  activeTab,
  setActiveTab,
  chartData,
  gradeDistribution,
  totalCompleted,
  topicBreakdown,
  studentLeaderboard,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <span>Interactive Analytics Dashboard</span>
          </h2>
          <p className="text-xs text-slate-500">Live visual breakdowns across scores, accuracy & student mastery</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'scores' as const, label: 'Performance', icon: BarChart3 },
            { id: 'distribution' as const, label: 'Grade Tiers', icon: PieChartIcon },
            { id: 'topics' as const, label: 'Topic Mastery', icon: Layers },
            { id: 'leaderboard' as const, label: 'Leaderboard', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Recent Performance Chart */}
      {activeTab === 'scores' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dual Axis: Score (Blue) vs Accuracy % (Green)</span>
            <span>Last 10 Completions</span>
          </div>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#38bdf8" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#34d399" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar yAxisId="left" dataKey="score" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Score Points" />
                  <Bar yAxisId="right" dataKey="accuracy" fill="#34d399" radius={[6, 6, 0, 0]} name="Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No chart data available yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Grade Distribution Breakdown */}
      {activeTab === 'distribution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Proficiency Tier Breakdown</h3>
            {gradeDistribution.map((g, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{g.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">
                  {g.count} ({totalCompleted > 0 ? Math.round((g.count / totalCompleted) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Topic Mastery List */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Classroom accuracy metrics grouped by question set & activity topic</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicBreakdown.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-[180px]" title={t.fullTopic}>
                    {t.fullTopic}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                    {t.attempts} {t.attempts === 1 ? 'attempt' : 'attempts'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-black mb-1">
                    <span className="text-slate-500">Mastery:</span>
                    <span className={t.avgAccuracy >= 80 ? 'text-emerald-500' : t.avgAccuracy >= 60 ? 'text-amber-500' : 'text-rose-500'}>
                      {t.avgAccuracy}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        t.avgAccuracy >= 80 ? 'bg-emerald-500' : t.avgAccuracy >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${t.avgAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Student Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Top 10 performing students ranked by total points and accuracy</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {studentLeaderboard.map((st, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  idx === 0
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 ring-2 ring-amber-500/20'
                    : idx === 1
                    ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-300 dark:border-slate-600'
                    : idx === 2
                    ? 'bg-orange-500/10 border-orange-500/40'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center bg-slate-900/80 text-white shadow-inner">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{st.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {st.completedCount} tests • {st.avgAccuracy}% avg
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-amber-500">{st.totalScore}</span>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
