import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Assignment, GameSlug } from '../../types';
import {
  ClipboardList,
  Plus,
  Play,
  Calendar,
  Award,
  Users,
  Key,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    createAssignment,
    deleteAssignment,
    questionSets,
    gamesCatalog,
    launchAssignment,
    currentUser,
  } = useEduPlay();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState(questionSets[0]?.id || '');
  const [selectedGameSlug, setSelectedGameSlug] = useState<GameSlug>('wheel-spin');
  const [dueDate, setDueDate] = useState('2026-08-15');
  const [rewardsEnabled, setRewardsEnabled] = useState(true);

  // Student join code state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreateAssignment = () => {
    const targetSet = questionSets.find((s) => s.id === selectedSetId) || questionSets[0];
    const targetGame = gamesCatalog.find((g) => g.slug === selectedGameSlug) || gamesCatalog[0];

    createAssignment({
      teacherId: currentUser.id,
      classId: 'cls-2b',
      className: 'Grade 3 - Room 2B',
      questionSetId: targetSet.id,
      questionSetTitle: targetSet.title,
      gameSlug: targetGame.slug,
      gameName: targetGame.name,
      dueDate,
      rewardsEnabled,
    });

    setIsCreateModalOpen(false);
  };

  const handleJoinAssignmentByCode = () => {
    setJoinError('');
    const code = joinCodeInput.trim().toUpperCase();
    const matched = assignments.find((a) => a.joinCode.toUpperCase() === code);

    if (matched) {
      launchAssignment(matched);
    } else {
      setJoinError('Invalid Join Code. Please check the code given by your teacher.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Curriculum Task Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Classroom Game Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign question sets coupled with arcade game formats with due dates and collectible sticker ticket rewards.
          </p>
        </div>

        {currentUser.role === 'teacher' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        )}
      </div>

      {/* Student Join Code Input Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-extrabold text-lg flex items-center justify-center md:justify-start gap-2 text-white">
            <Key className="w-5 h-5 text-amber-400" />
            <span>Have a Join Code from your Teacher?</span>
          </h3>
          <p className="text-xs text-slate-300">
            Enter your 8-digit assignment code below to jump directly into your assigned game world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="e.g. FUN-7890"
            className="px-4 py-3 rounded-2xl border border-slate-700 bg-slate-900/90 text-white font-mono font-extrabold text-sm uppercase tracking-widest focus:outline-hidden focus:ring-2 focus:ring-amber-400 w-full sm:w-48 text-center"
          />
          <button
            onClick={handleJoinAssignmentByCode}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md whitespace-nowrap transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            Join Game
          </button>
        </div>
      </div>
      {joinError && <p className="text-xs font-bold text-rose-500 px-2">{joinError}</p>}

      {/* Active Assignments Grid */}
      {assignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
          <ClipboardList className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-800 dark:text-white">No active assignments</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Teachers can create assignments to share specific games and question sets with students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="card-interactive bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/60">
                    {asg.className}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-300/60 dark:border-amber-700/60">
                    <span>{asg.joinCode}</span>
                    <button
                      onClick={() => handleCopyCode(asg.joinCode)}
                      title="Copy code"
                      className="hover:text-amber-900 dark:hover:text-white transition-colors"
                    >
                      {copiedCode === asg.joinCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                  {asg.questionSetTitle}
                </h3>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  Engine: {asg.gameName}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Due: <strong className="text-slate-800 dark:text-slate-200">{asg.dueDate || 'No Due Date'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Rewards: <strong className="text-slate-800 dark:text-slate-200">{asg.rewardsEnabled ? 'Sticker Tickets Enabled' : 'Disabled'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => launchAssignment(asg)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Assignment</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentUser.role === 'teacher' && (
                    <button
                      onClick={() => deleteAssignment(asg.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Create Classroom Assignment
            </h3>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5">
                Select Curriculum Set:
              </label>
              <select
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {questionSets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.questions.length} Questions)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5">
                Select Game Engine:
              </label>
              <select
                value={selectedGameSlug}
                onChange={(e) => setSelectedGameSlug(e.target.value as GameSlug)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {gamesCatalog.map((g) => (
                  <option key={g.id} value={g.slug}>
                    {g.name} ({g.mechanic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5">
                Due Date:
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="enableRewardsToggle"
                checked={rewardsEnabled}
                onChange={(e) => setRewardsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="enableRewardsToggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Reward students with sticker tickets on completion
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                Generate Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
