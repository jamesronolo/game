import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { QuestionSet, GameSlug } from '../../types';
import {
  BookOpen,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Search,
  Globe2,
  Lock,
  Play,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Layers,
  Zap,
  Tag,
  ArrowRight,
  Gamepad2,
} from 'lucide-react';

export const QuestionSetsView: React.FC = () => {
  const {
    questionSets,
    deleteQuestionSet,
    cloneQuestionSet,
    setEditingSetId,
    setActiveTab,
    gamesCatalog,
    launchGameWithSet,
    currentUser,
  } = useEduPlay();

  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'public'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Game Launch Modal State
  const [launchModalSet, setLaunchModalSet] = useState<QuestionSet | null>(null);
  const [selectedGameSlug, setSelectedGameSlug] = useState<GameSlug>('wheel-spin');

  // Delete Confirmation Modal State
  const [deleteConfirmSet, setDeleteConfirmSet] = useState<QuestionSet | null>(null);

  // Copy Notice Feedback
  const [clonedNotice, setClonedNotice] = useState<string | null>(null);

  const filteredSets = questionSets.filter((set) => {
    if (activeFilter === 'my' && set.ownerId !== currentUser.id) return false;
    if (activeFilter === 'public' && !set.isPublic) return false;
    if (selectedSubject !== 'all' && set.subject !== selectedSubject) return false;

    const query = searchQuery.toLowerCase();
    return (
      set.title.toLowerCase().includes(query) ||
      set.subject.toLowerCase().includes(query) ||
      set.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  const subjectsList = Array.from(new Set(questionSets.map((s) => s.subject)));

  const handleCreateNewSet = () => {
    setEditingSetId(null);
    setActiveTab('set-editor');
  };

  const handleEditSet = (set: QuestionSet) => {
    setEditingSetId(set.id);
    setActiveTab('set-editor');
  };

  const handleCloneSet = async (set: QuestionSet) => {
    await cloneQuestionSet(set);
    setClonedNotice(`Copied "${set.title}" to your custom sets!`);
    setTimeout(() => setClonedNotice(null), 3000);
  };

  const handleDeleteSetConfirm = async () => {
    if (!deleteConfirmSet) return;
    await deleteQuestionSet(deleteConfirmSet.id);
    setDeleteConfirmSet(null);
  };

  const handleLaunchGame = () => {
    if (!launchModalSet) return;
    launchGameWithSet(selectedGameSlug, launchModalSet.id);
    setLaunchModalSet(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notice */}
      {clonedNotice && (
        <div className="fixed top-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-indigo-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{clonedNotice}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Studio & Question Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Question Sets & Content Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Create custom question sets or choose from the public classroom library. Every set runs automatically across all 8 arcade game modes without reformatting!
          </p>
        </div>

        {/* Primary Action Button: Create New Question Set */}
        <button
          onClick={handleCreateNewSet}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW QUESTION SET</span>
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tab Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Sets', count: questionSets.length },
            { id: 'public', label: 'Public Library', count: questionSets.filter((s) => s.isPublic).length },
            { id: 'my', label: 'My Custom Sets', count: questionSets.filter((s) => s.ownerId === currentUser.id).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeFilter === tab.id
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Controls: Subject Dropdown & Keyword Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Subjects</option>
            {subjectsList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search set title, tags..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Question Sets Grid */}
      {filteredSets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No question sets found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filter, or click "Create New Question Set" to build your own custom learning curriculum.
          </p>
          <button
            onClick={handleCreateNewSet}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Create Question Set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((set) => {
            const isOwner = set.ownerId === currentUser.id;
            return (
              <div
                key={set.id}
                className="group card-interactive bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/60">
                      {set.subject}
                    </span>

                    <div className="flex items-center gap-1">
                      {set.isPublic ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                          <Globe2 className="w-3 h-3" /> Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                          <Lock className="w-3 h-3" /> Private
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {set.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {set.description || 'Interactive educational set for classroom arcade games.'}
                    </p>
                  </div>

                  {/* Question Stats Bar */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-black">
                      <Layers className="w-4 h-4" />
                      <span>{set.questions.length} Items</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">{set.gradeLevel}</span>
                  </div>

                  {/* Tags */}
                  {set.tags && set.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {set.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {/* Primary Button: Play in Game */}
                  <button
                    onClick={() => setLaunchModalSet(set)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>LAUNCH IN GAME</span>
                  </button>

                  {/* Secondary Action Icons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCloneSet(set)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      title="Duplicate set into your library"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {isOwner && (
                      <>
                        <button
                          onClick={() => handleEditSet(set)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                          title="Edit Questions & Answers"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmSet(set)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                          title="Delete Question Set"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced Interactive Game Launcher Modal */}
      {launchModalSet && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Select Game Engine
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose which arcade format will load "{launchModalSet.title}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLaunchModalSet(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Arcade Games Catalog Selection Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {gamesCatalog.map((g) => {
                const isSelected = selectedGameSlug === g.slug;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGameSlug(g.slug)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-400/50 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                      🎮
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{g.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{g.mechanic}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Launch Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setLaunchModalSet(null)}
                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchGame}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>LAUNCH GAME</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSet && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Delete Question Set?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-200">"{deleteConfirmSet.title}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmSet(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSetConfirm}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md cursor-pointer"
              >
                Yes, Delete Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
