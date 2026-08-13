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
  Tag,
  Gamepad2,
  Globe2,
  Lock,
  Play,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Layers,
  Zap,
  HelpCircle,
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
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{clonedNotice}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-sky-700/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-semibold border border-sky-500/30">
            <BookOpen className="w-3.5 h-3.5 text-sky-300" />
            <span>Interactive Learning Content Library</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Question Sets & Curriculum Creator
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-2xl">
            Create custom question sets or choose from the public classroom library. Every question set can instantly power any of the 8 arcade game formats!
          </p>
        </div>

        {/* Primary Action Button: Create New Question Set */}
        <button
          onClick={handleCreateNewSet}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm rounded-2xl shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all shrink-0 border border-sky-300/40"
        >
          <Plus className="w-5 h-5" />
          <span>CREATE NEW QUESTION SET</span>
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tab Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: '📚 All Question Sets', count: questionSets.length },
            { id: 'public', label: '🌐 Shared Public Library', count: questionSets.filter((s) => s.isPublic).length },
            { id: 'my', label: '✏️ My Custom Sets', count: questionSets.filter((s) => s.ownerId === currentUser.id).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                activeFilter === tab.id
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeFilter === tab.id ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700'
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
            className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-sky-500"
          >
            <option value="all">All Subjects</option>
            {subjectsList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search set title, topic, or tags..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Question Sets Grid */}
      {filteredSets.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No question sets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filter, or click "Create New Question Set" to build your own custom learning list.
          </p>
          <button
            onClick={handleCreateNewSet}
            className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Create First Question Set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((set) => {
            const isOwner = set.ownerId === currentUser.id;
            return (
              <div
                key={set.id}
                className="bg-white rounded-3xl border-2 border-slate-200/80 hover:border-sky-400 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider border border-sky-200">
                      {set.subject}
                    </span>

                    <div className="flex items-center gap-1">
                      {set.isPublic ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Globe2 className="w-3 h-3" /> Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                          <Lock className="w-3 h-3" /> Private
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                      {set.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {set.description || 'Interactive educational set for classroom arcade games.'}
                    </p>
                  </div>

                  {/* Question Stats Bar */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1 text-sky-700 font-black">
                      <Layers className="w-4 h-4 text-sky-600" />
                      <span>{set.questions.length} Items</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-semibold">{set.gradeLevel}</span>
                  </div>

                  {/* Tags */}
                  {set.tags && set.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {set.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Primary Button: Play in Game */}
                  <button
                    onClick={() => setLaunchModalSet(set)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>PLAY IN GAME</span>
                  </button>

                  {/* Secondary Action Icons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCloneSet(set)}
                      className="p-2.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors border border-slate-200 hover:border-sky-300"
                      title="Clone / Duplicate this set to your library"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {isOwner && (
                      <>
                        <button
                          onClick={() => handleEditSet(set)}
                          className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-slate-200 hover:border-indigo-300"
                          title="Edit Title, Questions & Answers"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmSet(set)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 hover:border-rose-300"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">
                    Launch Game: "{launchModalSet.title}"
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select which interactive game format will load this question set:
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLaunchModalSet(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Arcade Games Catalog Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {gamesCatalog.map((g) => {
                const isSelected = selectedGameSlug === g.slug;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGameSlug(g.slug)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400 shadow-md'
                        : 'bg-slate-50 border-slate-200/80 hover:border-purple-300 hover:bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-sm">
                      🎮
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">{g.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{g.mechanic}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Launch Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setLaunchModalSet(null)}
                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchGame}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-purple-500/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>LAUNCH GAME NOW</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSet && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Delete Question Set?</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteConfirmSet.title}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmSet(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSetConfirm}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md"
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

