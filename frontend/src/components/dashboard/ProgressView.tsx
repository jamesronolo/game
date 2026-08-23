import React, { useState, useEffect, useMemo } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Attempt, ProgrammingQuizAttempt } from '../../types';
import { fetchProgrammingQuizAttempts } from '../../services/api';
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
import {
  BarChart3,
  Trophy,
  CheckCircle2,
  Clock,
  User,
  Download,
  BookOpen,
  Award,
  Zap,
  Eye,
  Check,
  X,
  FileText,
  Printer,
  RefreshCw,
  Search,
  Filter,
  Code2,
  Sparkles,
  TrendingUp,
  ArrowUpDown,
  ChevronRight,
  SlidersHorizontal,
  GraduationCap,
  PieChart as PieChartIcon,
  Layers,
  AlertTriangle,
  Flame,
  Target,
  ArrowRight,
  Gamepad2,
} from 'lucide-react';

type FilterCategory = 'all' | 'games' | 'programming-quiz' | 'high-accuracy' | 'needs-help';
type SortOption = 'recent' | 'score-desc' | 'score-asc' | 'accuracy-desc' | 'accuracy-asc';
type AnalyticsTab = 'scores' | 'distribution' | 'topics' | 'leaderboard';

export const ProgressView: React.FC = () => {
  const { attempts, currentUser, setActiveTab } = useEduPlay();
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [selectedCodingAttempt, setSelectedCodingAttempt] = useState<ProgrammingQuizAttempt | null>(null);
  const [programmingAttempts, setProgrammingAttempts] = useState<ProgrammingQuizAttempt[]>([]);
  const [loadingCodingAttempts, setLoadingCodingAttempts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<AnalyticsTab>('scores');
  const [exporting, setExporting] = useState(false);

  // Load Programming Quiz attempts dynamically from backend API
  const loadCodingAttempts = async () => {
    setLoadingCodingAttempts(true);
    try {
      const data = await fetchProgrammingQuizAttempts();
      setProgrammingAttempts(data || []);
    } catch {
      // silently handle
    } finally {
      setLoadingCodingAttempts(false);
    }
  };

  useEffect(() => {
    loadCodingAttempts();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCodingAttempts();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter game attempts dynamically based on active user role
  const roleGameAttempts = useMemo(() => {
    return currentUser.role === 'student'
      ? attempts.filter((a) => a.studentId === currentUser.id)
      : attempts;
  }, [attempts, currentUser]);

  // Unified items list computed dynamically from live attempts
  const combinedList = useMemo(() => {
    type UnifiedItem = {
      id: string;
      studentName: string;
      title: string;
      type: 'game' | 'programming-quiz';
      gameSlug?: string;
      score: number;
      maxScore: number;
      accuracy: number;
      completedAt: string;
      originalGameAttempt?: Attempt;
      originalCodingAttempt?: ProgrammingQuizAttempt;
    };

    const gameItems: UnifiedItem[] = roleGameAttempts.map((a) => ({
      id: a.id,
      studentName: a.studentName,
      title: a.questionSetTitle,
      type: 'game',
      gameSlug: a.gameSlug,
      score: a.score,
      maxScore: a.totalQuestions * 100,
      accuracy: a.accuracy,
      completedAt: a.completedAt,
      originalGameAttempt: a,
    }));

    const codingItems: UnifiedItem[] = programmingAttempts.map((a) => ({
      id: a.id,
      studentName: a.studentName || 'Anonymous',
      title: 'Basic Programming Quiz (25 Questions)',
      type: 'programming-quiz',
      score: a.score,
      maxScore: a.totalQuestions || 25,
      accuracy: a.accuracy,
      completedAt: a.completedAt,
      originalCodingAttempt: a,
    }));

    let list = [...gameItems, ...codingItems];

    // Filter dynamically by Category
    if (filterCategory === 'games') {
      list = list.filter((i) => i.type === 'game');
    } else if (filterCategory === 'programming-quiz') {
      list = list.filter((i) => i.type === 'programming-quiz');
    } else if (filterCategory === 'high-accuracy') {
      list = list.filter((i) => i.accuracy >= 80);
    } else if (filterCategory === 'needs-help') {
      list = list.filter((i) => i.accuracy < 75);
    }

    // Filter dynamically by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.studentName.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          (i.gameSlug && i.gameSlug.toLowerCase().includes(q))
      );
    }

    // Sort dynamically
    list.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      if (sortBy === 'score-desc') return b.score - a.score;
      if (sortBy === 'score-asc') return a.score - b.score;
      if (sortBy === 'accuracy-desc') return b.accuracy - a.accuracy;
      if (sortBy === 'accuracy-asc') return a.accuracy - b.accuracy;
      return 0;
    });

    return list;
  }, [roleGameAttempts, programmingAttempts, filterCategory, searchQuery, sortBy]);

  // Overall Dynamic KPIs
  const totalCompleted = combinedList.length;
  const avgAccuracy =
    totalCompleted > 0
      ? Math.round(combinedList.reduce((acc, a) => acc + a.accuracy, 0) / totalCompleted)
      : 100;
  const totalScore = combinedList.reduce((acc, a) => acc + a.score, 0);
  const masteryCount = combinedList.filter((a) => a.accuracy >= 80).length;
  const masteryRate = totalCompleted > 0 ? Math.round((masteryCount / totalCompleted) * 100) : 100;

  // Grade Distribution calculated dynamically
  const gradeDistribution = useMemo(() => {
    let excellent = 0; // >= 90
    let proficient = 0; // 80 - 89
    let developing = 0; // 70 - 79
    let needsReview = 0; // < 70

    combinedList.forEach((item) => {
      if (item.accuracy >= 90) excellent++;
      else if (item.accuracy >= 80) proficient++;
      else if (item.accuracy >= 70) developing++;
      else needsReview++;
    });

    return [
      { name: 'Mastery (90-100%)', count: excellent, color: '#10b981' },
      { name: 'Proficient (80-89%)', count: proficient, color: '#3b82f6' },
      { name: 'Developing (70-79%)', count: developing, color: '#f59e0b' },
      { name: 'Needs Practice (<70%)', count: needsReview, color: '#ef4444' },
    ];
  }, [combinedList]);

  // Topic Performance Breakdown dynamically calculated
  const topicBreakdown = useMemo(() => {
    const map: Record<string, { totalAccuracy: number; count: number; totalScore: number }> = {};

    combinedList.forEach((item) => {
      const key = item.type === 'programming-quiz' ? 'Programming Quiz' : (item.title || 'Games');
      if (!map[key]) {
        map[key] = { totalAccuracy: 0, count: 0, totalScore: 0 };
      }
      map[key].totalAccuracy += item.accuracy;
      map[key].totalScore += item.score;
      map[key].count += 1;
    });

    return Object.entries(map).map(([topic, data]) => ({
      topic: topic.length > 22 ? topic.substring(0, 22) + '...' : topic,
      fullTopic: topic,
      avgAccuracy: Math.round(data.totalAccuracy / data.count),
      avgScore: Math.round(data.totalScore / data.count),
      attempts: data.count,
    })).sort((a, b) => b.attempts - a.attempts);
  }, [combinedList]);

  // Student Leaderboard dynamically ranked
  const studentLeaderboard = useMemo(() => {
    const studentMap: Record<string, { totalScore: number; totalAccuracy: number; count: number; perfectScores: number }> = {};

    combinedList.forEach((item) => {
      const name = item.studentName || 'Student';
      if (!studentMap[name]) {
        studentMap[name] = { totalScore: 0, totalAccuracy: 0, count: 0, perfectScores: 0 };
      }
      studentMap[name].totalScore += item.score;
      studentMap[name].totalAccuracy += item.accuracy;
      studentMap[name].count += 1;
      if (item.accuracy === 100) studentMap[name].perfectScores += 1;
    });

    return Object.entries(studentMap)
      .map(([name, data]) => ({
        name,
        totalScore: data.totalScore,
        avgAccuracy: Math.round(data.totalAccuracy / data.count),
        completedCount: data.count,
        perfectScores: data.perfectScores,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  }, [combinedList]);

  // Weakest and Strongest Topics
  const topicInsights = useMemo(() => {
    if (topicBreakdown.length === 0) return { best: null, challenging: null };
    const sorted = [...topicBreakdown].sort((a, b) => b.avgAccuracy - a.avgAccuracy);
    return {
      best: sorted[0],
      challenging: sorted[sorted.length - 1],
    };
  }, [topicBreakdown]);

  // Chart Data dynamically prepped for top recent records
  const chartData = combinedList.slice(0, 10).map((a, idx) => ({
    name: a.studentName.split(' ')[0] || `Student ${idx + 1}`,
    score: a.score,
    accuracy: a.accuracy,
    type: a.type === 'programming-quiz' ? 'Prog Quiz' : a.gameSlug || 'Game',
  }));

  const exportGradebookCSV = () => {
    setExporting(true);
    const headers = [
      'Student Name',
      'Activity / Question Set',
      'Type',
      'Score Awarded',
      'Max Score',
      'Accuracy %',
      'Mastery Status',
      'Date Completed',
    ];
    const rows = combinedList.map((a) => [
      `"${a.studentName}"`,
      `"${a.title}"`,
      a.type === 'programming-quiz' ? 'Programming Quiz' : (a.gameSlug || 'Game'),
      a.score,
      a.maxScore,
      `${a.accuracy}%`,
      a.accuracy >= 80 ? 'Mastered' : 'Needs Practice',
      `"${new Date(a.completedAt).toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPlay_Gradebook_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setExporting(false), 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Action Buttons Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-800/80 p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Live Gradebook & Diagnostics Studio</span>
              </span>
              <span className="text-xs font-bold text-slate-300 hidden sm:inline">• Unified Classroom Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400" />
              <span>Progress & Gradebook Analytics</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time pedagogical analytics for games, 25-question Programming Quizzes, mastery distributions, automated auto-correct logs, and diagnostic heatmaps.
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('coding-quiz')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-indigo-900/40 border border-indigo-400/40 transition active:scale-95 cursor-pointer"
              title="Launch Programming Quiz"
            >
              <Code2 className="w-4 h-4 text-yellow-300" />
              <span>Programming Test</span>
            </button>

            <button
              onClick={() => setActiveTab('games')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shadow-lg shadow-sky-950/40 border border-sky-400/40 transition active:scale-95 cursor-pointer"
              title="Browse Games Library"
            >
              <Gamepad2 className="w-4 h-4 text-amber-200" />
              <span>Games Library</span>
            </button>

            <button
              onClick={exportGradebookCSV}
              disabled={exporting || combinedList.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 border border-emerald-400/40 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Download CSV report"
            >
              <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
              <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition active:scale-95 cursor-pointer"
              title="Print Report"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition active:scale-95 cursor-pointer"
              title="Refresh All Records"
            >
              <RefreshCw className={`w-4 h-4 text-sky-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary KPI Widgets (4-Card Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-13 h-13 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shadow-inner shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Submissions</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">{totalCompleted}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Games & Code Quizzes</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-inner shrink-0">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Accuracy</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{avgAccuracy}%</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Classroom Overall</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-13 h-13 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-inner shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mastery Rate (≥80%)</p>
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{masteryRate}%</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{masteryCount} of {totalCompleted} passed</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-13 h-13 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-inner shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Score Points</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-500 mt-0.5">{totalScore}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Cumulative Rewards</p>
          </div>
        </div>
      </div>

      {/* Dynamic Classroom Insights Bar */}
      {topicInsights.best && (
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-sky-900/40 rounded-2xl border border-indigo-500/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="font-extrabold text-indigo-200 uppercase tracking-wider">Pedagogical Diagnostics:</span>
              <p className="text-slate-300 mt-0.5">
                Top mastery in <span className="text-emerald-300 font-black">{topicInsights.best.fullTopic}</span> ({topicInsights.best.avgAccuracy}% avg).
                {topicInsights.challenging && topicInsights.challenging.avgAccuracy < 80 && (
                  <span> Focus recommended on <span className="text-rose-300 font-bold">{topicInsights.challenging.fullTopic}</span> ({topicInsights.challenging.avgAccuracy}% avg).</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('sets')}
              className="text-xs font-bold text-indigo-300 hover:text-white underline flex items-center gap-1"
            >
              <span>Manage Sets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Visual Analytics Studio */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* Studio Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Visual Analytics Studio</h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
            {[
              { id: 'scores', label: 'Recent Performance', icon: BarChart3 },
              { id: 'distribution', label: 'Grade Distribution', icon: PieChartIcon },
              { id: 'topics', label: 'Topic Mastery', icon: Target },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            ].map((tab) => {
              const isActive = activeAnalyticsTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAnalyticsTab(tab.id as AnalyticsTab)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
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
        {activeAnalyticsTab === 'scores' && (
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
        {activeAnalyticsTab === 'distribution' && (
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
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
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
        {activeAnalyticsTab === 'topics' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Classroom accuracy metrics grouped by question set & activity topic</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicBreakdown.map((t, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
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
        {activeAnalyticsTab === 'leaderboard' && (
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

      {/* Filter Buttons, Search & Gradebook Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4">
        {/* Filter Toolbar & Search Bar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Submission Log & Gradebook</h2>
              <p className="text-xs text-slate-500">Showing {combinedList.length} filtered records</p>
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student or activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-indigo-400 text-slate-900 dark:text-white w-52 sm:w-64 transition"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="score-desc">Highest Score</option>
                  <option value="score-asc">Lowest Score</option>
                  <option value="accuracy-desc">Highest Accuracy</option>
                  <option value="accuracy-asc">Lowest Accuracy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'all', label: 'All Records', count: roleGameAttempts.length + programmingAttempts.length },
              { id: 'programming-quiz', label: 'Programming Quizzes', count: programmingAttempts.length, icon: Code2 },
              { id: 'games', label: 'Interactive Games', count: roleGameAttempts.length },
              { id: 'high-accuracy', label: 'Mastery (≥80%)', count: combinedList.filter((i) => i.accuracy >= 80).length },
              { id: 'needs-help', label: 'Needs Practice (<75%)', count: combinedList.filter((i) => i.accuracy < 75).length },
            ].map((tab) => {
              const isActive = filterCategory === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id as FilterCategory)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Attempt Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Activity & Topic</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Score Awarded</th>
                <th className="px-6 py-3.5">Accuracy</th>
                <th className="px-6 py-3.5">Date Completed</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {combinedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">No submissions found matching filter criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try resetting search or take a quiz to generate scores.</p>
                  </td>
                </tr>
              ) : (
                combinedList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs flex items-center justify-center">
                        {item.studentName.charAt(0)}
                      </div>
                      <span>{item.studentName}</span>
                    </td>

                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-semibold max-w-xs truncate">
                      {item.title}
                    </td>

                    <td className="px-6 py-4">
                      {item.type === 'programming-quiz' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                          <Code2 className="w-3 h-3" /> Prog Quiz (1 pt/Q)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 uppercase">
                          {item.gameSlug}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-black">
                      {item.type === 'programming-quiz' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                          {item.score} <span className="text-xs font-semibold text-slate-400">/ 25 pts</span>
                        </span>
                      ) : (
                        <span className="text-amber-500 font-black text-sm">
                          {item.score} <span className="text-xs font-semibold text-slate-400">pts</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg font-black text-[11px] ${
                          item.accuracy >= 80
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : item.accuracy >= 60
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {item.accuracy}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(item.completedAt).toLocaleDateString()} {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (item.originalGameAttempt) setSelectedAttempt(item.originalGameAttempt);
                          if (item.originalCodingAttempt) setSelectedCodingAttempt(item.originalCodingAttempt);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                        title="Inspect detailed question answers"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL 1: Game Attempt Question Inspector ───────────────────────────── */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">Game Response Inspector</span>
                <h3 className="font-black text-xl text-slate-900 dark:text-white mt-0.5">
                  {selectedAttempt.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  Set: {selectedAttempt.questionSetTitle} • Game: {selectedAttempt.gameSlug} • Score: {selectedAttempt.score} pts ({selectedAttempt.accuracy}%)
                </p>
              </div>

              <button
                onClick={() => setSelectedAttempt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Individual Question Breakdown ({selectedAttempt.answers?.length || 0})
              </h4>

              {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                selectedAttempt.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                      ans.isCorrect
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{ans.questionPrompt}</p>
                      <p className="text-[11px] mt-1">
                        Student: <span className="font-bold">{ans.studentAnswer}</span> | Correct:{' '}
                        <span className="font-bold">{ans.correctAnswer}</span>
                      </p>
                    </div>

                    <div className="shrink-0">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <X className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No question breakdown recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Programming Quiz Attempt Inspector ────────────────────────── */}
      {selectedCodingAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">Programming Quiz Inspector</span>
                <h3 className="font-black text-xl text-slate-900 dark:text-white mt-0.5">
                  {selectedCodingAttempt.studentName || 'Anonymous'}
                </h3>
                <p className="text-xs text-slate-500">
                  Score: <span className="font-black text-emerald-600">{selectedCodingAttempt.score} / {selectedCodingAttempt.totalQuestions} pts</span> • {selectedCodingAttempt.accuracy}% Accuracy • {new Date(selectedCodingAttempt.completedAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedCodingAttempt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                25 Questions Breakdown ({selectedCodingAttempt.answers?.length || 0})
              </h4>

              {selectedCodingAttempt.answers && selectedCodingAttempt.answers.length > 0 ? (
                selectedCodingAttempt.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      ans.isCorrect
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-800 dark:text-white">{idx + 1}. {ans.question}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${ans.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {ans.isCorrect ? '+1 Point' : '0 Points'}
                        </span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-300">
                          Selected: Option {ans.selectedOption} | Correct: Option {ans.correctOption} ({ans.correctAnswer})
                        </span>
                      </div>
                      {!ans.isCorrect && ans.explanation && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                          💡 {ans.explanation}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <X className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No question breakdown recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
