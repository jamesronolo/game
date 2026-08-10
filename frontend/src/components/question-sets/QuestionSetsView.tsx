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
  Layers,
  Sparkles,
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
  const [launchModalSet, setLaunchModalSet] = useState<QuestionSet | null>(null);
  const [selectedGameSlug, setSelectedGameSlug] = useState<GameSlug>('wheel-spin');

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

  const handleLaunchGame = () => {
    if (!launchModalSet) return;
    launchGameWithSet(selectedGameSlug, launchModalSet.id);
    setLaunchModalSet(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-sky-600" />
            <span>Question Sets & Content Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse public question sets or create your own custom lists for games and assignments.
          </p>
        </div>

        <button
          onClick={handleCreateNewSet}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Question Set</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Sets' },
            { id: 'public', label: 'Shared Public Library' },
            { id: 'my', label: 'My Custom Sets' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Subjects</option>
            {subjectsList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          {/* Search Field */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Question Sets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSets.map((set) => {
          const isOwner = set.ownerId === currentUser.id;
          return (
            <div
              key={set.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">
                    {set.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {set.isPublic ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Globe2 className="w-3 h-3" /> Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Specs */}
                <h3 className="font-bold text-base text-slate-900 line-clamp-1">{set.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {set.description || 'Custom interactive question set for learning games.'}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">
                    {set.questions.length} Questions
                  </span>
                  <span>•</span>
                  <span className="text-[10px]">{set.gradeLevel}</span>
                </div>

                {/* Tags */}
                {set.tags && set.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-3">
                    {set.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setLaunchModalSet(set)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play in Game</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => cloneQuestionSet(set)}
                    className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Clone / Copy Set"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {isOwner && (
                    <>
                      <button
                        onClick={() => handleEditSet(set)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Question Set"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuestionSet(set.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Set"
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

      {/* Quick Launch Modal */}
      {launchModalSet && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Select Game for "{launchModalSet.title}"
                </h3>
                <p className="text-xs text-slate-500">
                  Choose which interactive game format to load:
                </p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <label className="text-xs font-semibold text-slate-700 block">
                Select Game Format:
              </label>
              <select
                value={selectedGameSlug}
                onChange={(e) => setSelectedGameSlug(e.target.value as GameSlug)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold focus:outline-hidden"
              >
                {gamesCatalog.map((g) => (
                  <option key={g.id} value={g.slug}>
                    {g.name} ({g.mechanic})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setLaunchModalSet(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchGame}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
              >
                Launch Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
