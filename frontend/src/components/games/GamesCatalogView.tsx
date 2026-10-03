import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Game } from '../../types';
import {
  Gamepad2,
  PieChart,
  Ship,
  Rocket,
  Box,
  Sparkles,
  Layers,
  Dices,
  Waves,
  Play,
  Crown,
  Search,
  BookOpen,
  X,
  CheckCircle2,
  Users,
  Flame,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  PieChart,
  Ship,
  Rocket,
  Box,
  Sparkles,
  Layers,
  Dices,
  Waves,
};

export const GamesCatalogView: React.FC = () => {
  const { gamesCatalog, questionSets, launchGameWithSet, setActiveTab } = useEduPlay();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameForModal, setSelectedGameForModal] = useState<Game | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<string>('');

  const filteredGames = gamesCatalog.filter((game) => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.mechanic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartPlay = (game: Game) => {
    if (!selectedSetId && questionSets.length > 0) {
      setSelectedSetId(questionSets[0].id);
    }
    setSelectedGameForModal(game);
  };

  const confirmPlayWithSet = () => {
    const targetSetId = selectedSetId || (questionSets && questionSets.length > 0 ? questionSets[0].id : '');
    if (!selectedGameForModal || !targetSetId) return;
    launchGameWithSet(selectedGameForModal.slug, targetSetId);
    setSelectedGameForModal(null);
  };

  const activeSet = questionSets.find((s) => s.id === selectedSetId) || questionSets[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Multi-Mechanic Arcade Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            One Question Set, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">8 Game Worlds</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Pick from 8 varied gameplay dynamics — Wheel of Fortune, Naval Ship Battle, Phonics Space Spelling, Arcade Claw, and more. Any set of questions runs seamlessly in any game!
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All 8 Games' },
            { id: 'arcade', label: 'Arcade & Action' },
            { id: 'slp', label: 'Phonics & SLP' },
            { id: 'quiz', label: 'Quiz & Study' },
            { id: 'puzzle', label: 'Creativity & Logic' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mechanics, titles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => {
          const IconComponent = ICON_MAP[game.iconName] || Gamepad2;
          return (
            <div
              key={game.id}
              className="group card-interactive bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 overflow-hidden flex flex-col justify-between"
            >
              {/* Cover Art Box */}
              <div className="h-48 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                )}
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40" />

                <div className="flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-slate-950/70 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                    {game.badge}
                  </span>
                  <span className="text-[10px] font-bold text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                    Grade {game.minGrade}
                  </span>
                </div>

                <div className="flex items-center justify-between z-10">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5 text-indigo-300" />
                  </div>
                </div>
              </div>

              {/* Game Body Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {game.mechanic}
                  </span>

                  <button
                    onClick={() => handleStartPlay(game)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white dark:hover:text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select Question Set Modal */}
      {selectedGameForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header with Game Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-5">
              {selectedGameForModal.imageUrl && (
                <img
                  src={selectedGameForModal.imageUrl}
                  alt={selectedGameForModal.name}
                  className="w-full sm:w-40 h-28 object-cover rounded-xl shadow-md shrink-0"
                />
              )}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    {selectedGameForModal.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Grade {selectedGameForModal.minGrade}
                  </span>
                </div>
                <h3 className="font-extrabold text-2xl text-white">
                  Launch {selectedGameForModal.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedGameForModal.description}
                </p>
              </div>
            </div>

            {/* Content Selector */}
            <div className="space-y-3 my-4">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Select Curriculum Question Set ({questionSets.length} Available):
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {questionSets.map((set) => {
                  const isSelected = (selectedSetId || questionSets[0]?.id) === set.id;
                  return (
                    <div
                      key={set.id}
                      onClick={() => setSelectedSetId(set.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {set.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {set.subject} • {set.gradeLevel} • {set.questions.length} Questions
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedGameForModal(null);
                  setActiveTab('host-lobby');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/40 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Host as Live Classroom Room</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSelectedGameForModal(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPlayWithSet}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Solo Game</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
