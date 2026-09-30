import React, { useState, useEffect, useMemo } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Attempt, ProgrammingQuizAttempt } from '../../types';
import { fetchProgrammingQuizAttempts } from '../../services/api';
import {
  BarChart3,
  Download,
  BookOpen,
  Eye,
  FileText,
  Printer,
  RefreshCw,
  Search,
  Code2,
  Sparkles,
  ArrowUpDown,
  ArrowRight,
} from 'lucide-react';
import { AttemptDetailModal } from './components/AttemptDetailModal';
import { CodingAttemptDetailModal } from './components/CodingAttemptDetailModal';
import { AnalyticsCharts, AnalyticsTab } from './components/AnalyticsCharts';
import { ProgressSummaryCards } from './components/ProgressSummaryCards';

type FilterCategory = 'all' | 'games' | 'programming-quiz' | 'high-accuracy' | 'needs-help';
type SortOption = 'recent' | 'score-desc' | 'score-asc' | 'accuracy-desc' | 'accuracy-asc';

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

    if (filterCategory === 'games') {
      list = list.filter((i) => i.type === 'game');
    } else if (filterCategory === 'programming-quiz') {
      list = list.filter((i) => i.type === 'programming-quiz');
    } else if (filterCategory === 'high-accuracy') {
      list = list.filter((i) => i.accuracy >= 80);
    } else if (filterCategory === 'needs-help') {
      list = list.filter((i) => i.accuracy < 75);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.studentName.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          (i.gameSlug && i.gameSlug.toLowerCase().includes(q))
      );
    }

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
    let excellent = 0;
    let proficient = 0;
    let developing = 0;
    let needsReview = 0;

    combinedList.forEach((item) => {
      if (item.accuracy >= 90) excellent++;
      else if (item.accuracy >= 80) proficient++;
      else if (item.accuracy >= 70) developing++;
      else needsReview++;
    });

    return [
      { name: 'Mastery (90-100%)', count: excellent, color: '#10b981' },
      { name: 'Proficient (80-89%)', count: proficient, color: '#38bdf8' },
      { name: 'Developing (70-79%)', count: developing, color: '#f59e0b' },
      { name: 'Needs Review (<70%)', count: needsReview, color: '#ef4444' },
    ];
  }, [combinedList]);

  // Topic Mastery Breakdown
  const topicBreakdown = useMemo(() => {
    const map = new Map<string, { topic: string; totalAccuracy: number; count: number }>();

    combinedList.forEach((item) => {
      const topicKey = item.title;
      const current = map.get(topicKey) || { topic: topicKey, totalAccuracy: 0, count: 0 };
      current.totalAccuracy += item.accuracy;
      current.count += 1;
      map.set(topicKey, current);
    });

    return Array.from(map.values())
      .map((t) => ({
        topic: t.topic.length > 22 ? t.topic.slice(0, 22) + '…' : t.topic,
        fullTopic: t.topic,
        avgAccuracy: Math.round(t.totalAccuracy / t.count),
        attempts: t.count,
      }))
      .sort((a, b) => b.avgAccuracy - a.avgAccuracy);
  }, [combinedList]);

  // Student Leaderboard
  const studentLeaderboard = useMemo(() => {
    const map = new Map<string, { name: string; totalScore: number; count: number; totalAccuracy: number }>();

    combinedList.forEach((item) => {
      const current = map.get(item.studentName) || {
        name: item.studentName,
        totalScore: 0,
        count: 0,
        totalAccuracy: 0,
      };
      current.totalScore += item.score;
      current.count += 1;
      current.totalAccuracy += item.accuracy;
      map.set(item.studentName, current);
    });

    return Array.from(map.values())
      .map((s) => ({
        name: s.name,
        totalScore: s.totalScore,
        completedCount: s.count,
        avgAccuracy: Math.round(s.totalAccuracy / s.count),
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  }, [combinedList]);

  // Pedagogical Insights
  const topicInsights = useMemo(() => {
    if (topicBreakdown.length === 0) return { best: null, challenging: null };
    const sorted = [...topicBreakdown].sort((a, b) => b.avgAccuracy - a.avgAccuracy);
    return {
      best: sorted[0],
      challenging: sorted.length > 1 ? sorted[sorted.length - 1] : null,
    };
  }, [topicBreakdown]);

  // Chart Data: Last 10 items
  const chartData = useMemo(() => {
    return [...combinedList]
      .reverse()
      .slice(-10)
      .map((item, idx) => ({
        name: item.studentName.split(' ')[0] || `S${idx + 1}`,
        score: item.score,
        accuracy: item.accuracy,
      }));
  }, [combinedList]);

  // Export CSV
  const exportGradebookCSV = () => {
    setExporting(true);
    try {
      const headers = ['Student Name', 'Activity Title', 'Type', 'Game Slug', 'Score', 'Accuracy %', 'Date Completed'];
      const rows = combinedList.map((i) => [
        `"${i.studentName}"`,
        `"${i.title.replace(/"/g, '""')}"`,
        `"${i.type}"`,
        `"${i.gameSlug || 'N/A'}"`,
        i.score,
        `${i.accuracy}%`,
        `"${new Date(i.completedAt).toLocaleString()}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `EduPlay_Gradebook_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // ignore
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border-2 border-indigo-900/80 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-black uppercase tracking-widest">
                Academic Gradebook & Learning Analytics
              </span>
              <span className="text-xs font-bold text-slate-300">Live Database Synced</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              <BarChart3 className="w-9 h-9 text-indigo-400" />
              <span>Student Performance & Progress</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track mastery rates, review question breakdowns, inspect answers for interactive games and programming tests, and export gradebook records!
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('coding-quiz')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-indigo-950/40 border border-indigo-400/30 transition active:scale-95 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-yellow-300" />
              <span>Open Coding Test Quiz</span>
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
      <ProgressSummaryCards
        totalCompleted={totalCompleted}
        avgAccuracy={avgAccuracy}
        masteryRate={masteryRate}
        masteryCount={masteryCount}
        totalScore={totalScore}
      />

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
              className="text-xs font-bold text-indigo-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Review Practice Sets</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Visual Analytics Chart Suite with Interactive Tabs */}
      <AnalyticsCharts
        activeTab={activeAnalyticsTab}
        setActiveTab={setActiveAnalyticsTab}
        chartData={chartData}
        gradeDistribution={gradeDistribution}
        totalCompleted={totalCompleted}
        topicBreakdown={topicBreakdown}
        studentLeaderboard={studentLeaderboard}
      />

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

      {/* Modal 1: Game Attempt Question Inspector */}
      <AttemptDetailModal
        attempt={selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
      />

      {/* Modal 2: Programming Quiz Attempt Inspector */}
      <CodingAttemptDetailModal
        attempt={selectedCodingAttempt}
        onClose={() => setSelectedCodingAttempt(null)}
      />
    </div>
  );
};
