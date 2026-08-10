import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Attempt } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
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
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { attempts, currentUser, classStudents } = useEduPlay();
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  // Filter attempts based on role
  const filteredAttempts =
    currentUser.role === 'student'
      ? attempts.filter((a) => a.studentId === currentUser.id)
      : attempts;

  const totalCompleted = filteredAttempts.length;
  const avgAccuracy =
    totalCompleted > 0
      ? Math.round(filteredAttempts.reduce((acc, a) => acc + a.accuracy, 0) / totalCompleted)
      : 100;
  const totalScore = filteredAttempts.reduce((acc, a) => acc + a.score, 0);

  // Recharts Chart Data Prep
  const chartData = filteredAttempts.slice(0, 10).map((a, idx) => ({
    name: a.studentName.split(' ')[0] || `Student ${idx + 1}`,
    score: a.score,
    accuracy: a.accuracy,
    game: a.gameSlug,
  }));

  const exportGradebookCSV = () => {
    const headers = ['Student Name', 'Question Set', 'Game', 'Score', 'Accuracy %', 'Date'];
    const rows = filteredAttempts.map((a) => [
      a.studentName,
      `"${a.questionSetTitle}"`,
      a.gameSlug,
      a.score,
      `${a.accuracy}%`,
      new Date(a.completedAt).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'QuizGame_Gradebook_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-sky-600" />
            <span>Progress & Gradebook Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track student game completions, accuracy percentages, and weak topic breakdowns.
          </p>
        </div>

        {currentUser.role === 'teacher' && (
          <button
            onClick={exportGradebookCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Gradebook</span>
          </button>
        )}
      </div>

      {/* Stats Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Games Completed</p>
            <h3 className="text-2xl font-black text-slate-900">{totalCompleted}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Average Accuracy</p>
            <h3 className="text-2xl font-black text-emerald-600">{avgAccuracy}%</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Points Earned</p>
            <h3 className="text-2xl font-black text-amber-500">{totalScore}</h3>
          </div>
        </div>
      </div>

      {/* Visual Analytics Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-slate-900">
            Student Performance & Accuracy Breakdown
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#0284c7" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[0, 100]} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="score" fill="#0284c7" radius={[6, 6, 0, 0]} name="Score" />
                <Bar yAxisId="right" dataKey="accuracy" fill="#10b981" radius={[6, 6, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Attempt Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs space-y-4">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900">Recent Game Attempt Log</h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredAttempts.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Question Set</th>
                <th className="px-6 py-3">Game</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Accuracy</th>
                <th className="px-6 py-3">Completed At</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredAttempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{att.studentName}</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-700">{att.questionSetTitle}</td>
                  <td className="px-6 py-3.5 uppercase font-bold text-sky-600">{att.gameSlug}</td>
                  <td className="px-6 py-3.5 font-black text-amber-500">{att.score} pts</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        att.accuracy >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {att.accuracy}%
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 text-[11px]">
                    {new Date(att.completedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedAttempt(att)}
                      className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                      title="Inspect student responses"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attempt Question Inspector Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Attempt Inspector — {selectedAttempt.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  Set: {selectedAttempt.questionSetTitle} • Game: {selectedAttempt.gameSlug}
                </p>
              </div>

              <button
                onClick={() => setSelectedAttempt(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Individual Answers ({selectedAttempt.answers?.length || 0})
              </h4>

              {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                selectedAttempt.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      ans.isCorrect
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/60 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{ans.questionPrompt}</p>
                      <p className="text-[11px] mt-0.5">
                        Student Answer:{' '}
                        <span className="font-bold">{ans.studentAnswer}</span> | Correct:{' '}
                        <span className="font-bold">{ans.correctAnswer}</span>
                      </p>
                    </div>

                    <div>
                      {ans.isCorrect ? (
                        <Check className="w-5 h-5 text-emerald-600" />
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

