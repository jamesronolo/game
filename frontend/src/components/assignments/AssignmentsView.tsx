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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-sky-600" />
            <span>Classroom Game Assignments</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign question sets + games to your class with due dates and sticker ticket rewards.
          </p>
        </div>

        {currentUser.role === 'teacher' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        )}
      </div>

      {/* Student Join Code Input Box */}
      <div className="bg-gradient-to-r from-indigo-900 via-sky-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2 text-sky-300">
            <Key className="w-5 h-5 text-amber-400" />
            <span>Have a Join Code from your Teacher?</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Enter your 8-digit assignment code below to jump directly into your assigned game!
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="e.g. FUN-7890"
            className="px-4 py-2.5 rounded-xl border border-sky-400/40 bg-slate-950 text-white font-extrabold text-sm uppercase tracking-wider focus:outline-hidden focus:border-amber-400 w-full sm:w-44"
          />
          <button
            onClick={handleJoinAssignmentByCode}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md whitespace-nowrap"
          >
            Join Game
          </button>
        </div>
      </div>
      {joinError && <p className="text-xs font-bold text-rose-600 px-2">{joinError}</p>}

      {/* Active Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                  {asg.className}
                </span>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  CODE: {asg.joinCode}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900">{asg.questionSetTitle}</h3>
              <p className="text-xs font-semibold text-sky-600 mt-1">
                Game Format: {asg.gameName}
              </p>

              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due Date: {asg.dueDate || 'No Due Date'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sticker Rewards: {asg.rewardsEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => launchAssignment(asg)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Assignment</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(asg.joinCode)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  title="Copy Join Code"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>

                {currentUser.role === 'teacher' && (
                  <button
                    onClick={() => deleteAssignment(asg.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Create New Assignment
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select Question Set:
              </label>
              <select
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
              >
                {questionSets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.questions.length} Questions)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select Game Format:
              </label>
              <select
                value={selectedGameSlug}
                onChange={(e) => setSelectedGameSlug(e.target.value as GameSlug)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
              >
                {gamesCatalog.map((g) => (
                  <option key={g.id} value={g.slug}>
                    {g.name} ({g.mechanic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="enableRewardsToggle"
                checked={rewardsEnabled}
                onChange={(e) => setRewardsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="enableRewardsToggle" className="text-xs font-semibold text-slate-700">
                Enable Student Sticker Ticket Rewards for completing this assignment
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md"
              >
                Create & Generate Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
