import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Game, GameSlug } from '../../types';
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
  Lock,
  Crown,
  Search,
  BookOpen,
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
  const { gamesCatalog, questionSets, launchGameWithSet, isPro, setActiveTab, setSelectedGame } =
    useEduPlay();

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive EdTech Games Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            One Question Set, <span className="text-sky-400">Any Game Format</span>
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base">
            Choose from 8 distinct game mechanics below — Wheel Spin, Naval Ship Battle, Phonics Alien Spelling, Arcade Claw, and more!
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1">
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-hidden focus:border-sky-500"
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => {
          const IconComponent = ICON_MAP[game.iconName] || Gamepad2;
          return (
            <div
              key={game.id}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Header Visual Box */}
              <div className="h-48 bg-slate-900 p-4 flex flex-col justify-between relative overflow-hidden">
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                )}
                {/* Subtle top/bottom dark gradient for tag legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/40" />

                <div className="flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-slate-900/70 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                    {game.badge}
                  </span>
                  <span className="text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                    {game.minGrade}
                  </span>
                </div>

                <div className="flex items-center justify-between z-10">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Game Body Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {game.mechanic}
                  </span>

                  <button
                    onClick={() => handleStartPlay(game)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white font-bold text-xs transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Now</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select Question Set Modal */}
      {selectedGameForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-3xl sm:max-w-4xl bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header with Game Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
              {selectedGameForModal.imageUrl && (
                <img
                  src={selectedGameForModal.imageUrl}
                  alt={selectedGameForModal.name}
                  className="w-full sm:w-48 h-32 object-cover rounded-xl shadow-lg shrink-0"
                />
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedGameForModal.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Grade {selectedGameForModal.minGrade}
                  </span>
                </div>
                <h3 className="font-extrabold text-2xl sm:text-3xl text-white">
                  Launch {selectedGameForModal.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedGameForModal.description}
                </p>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider block">
                Select Content Question Set ({questionSets.length} Available):
              </label>
              <select
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
                className="w-full p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 text-sm sm:text-base font-bold focus:outline-none focus:border-sky-500 shadow-sm"
              >
                {questionSets.map((set) => (
                  <option key={set.id} value={set.id}>
                    📚 {set.title} ({set.questions.length} Questions) — {set.subject} ({set.gradeLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedGameForModal(null);
                  setActiveTab('host-lobby');
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Crown className="w-4 h-4 text-amber-600" /> Host Live Classroom Room
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSelectedGameForModal(null)}
                  className="px-5 py-3.5 rounded-2xl text-slate-600 hover:bg-slate-100 text-sm font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPlayWithSet}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-sm sm:text-base font-black shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Game Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
