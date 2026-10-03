import React, { useState, useEffect } from 'react';
import { Users, Play, Crown, Sparkles, Copy, Check, ArrowLeft } from 'lucide-react';
import { createLobby, startGame, subscribeToLobbyUpdates } from '../../services/socket';
import { useEduPlay } from '../../context/EduPlayContext';
import { GameSlug } from '../../types';

export const HostLobbyView: React.FC = () => {
  const { currentUser, gamesCatalog, questionSets, setActiveTab, setSelectedGame, setSelectedSet, setMultiplayerCode } = useEduPlay();
  const [selectedGameSlug, setSelectedGameSlug] = useState(gamesCatalog[0]?.slug || 'wheel-spin');
  const [selectedSetId, setSelectedSetId] = useState(questionSets[0]?.id || 'qs-1');
  const [room, setRoom] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = subscribeToLobbyUpdates((data) => {
      setRoom(data.room);
    });
    return () => unsub();
  }, []);

  const handleCreateRoom = () => {
    setError('');
    createLobby(selectedGameSlug, selectedSetId, currentUser?.name || 'Teacher Host', (res) => {
      if (res.success) {
        setRoom(res.room);
      } else {
        setError(res.error || 'Failed to create lobby');
      }
    });
  };

  const handleStartGame = () => {
    if (!room) return;
    const g = gamesCatalog.find((x) => x.slug === room.gameSlug) || gamesCatalog[0];
    const s = questionSets.find((x) => x.id === room.questionSetId) || questionSets[0];
    setSelectedGame(g);
    setSelectedSet(s);
    setMultiplayerCode(room.code);
    startGame(room.code);
    setActiveTab('game-play');
  };

  const copyCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (room) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-700/60">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setRoom(null)}
              className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-xs tracking-wider">
              <Crown className="w-3.5 h-3.5" /> LIVE HOST PANEL
            </span>
          </div>

          <div className="text-center my-6">
            <p className="text-xs uppercase font-extrabold tracking-widest text-indigo-300 mb-2">Student Join Code</p>
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 shadow-inner">
              <span className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-amber-300">{room.code}</span>
              <button
                onClick={copyCode}
                className="p-3 bg-white/15 hover:bg-white/25 rounded-2xl transition cursor-pointer"
                title="Copy Join Code"
              >
                {isCopied ? <Check className="w-6 h-6 text-emerald-300" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
            <p className="text-xs text-indigo-200 mt-2 font-semibold">Project this code on the classroom smartboard</p>
          </div>

          {/* Joined Players */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-300" /> Joined Students ({room.players?.length || 0})
              </h3>
              <span className="text-xs text-indigo-200">Waiting for players to join...</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {room.players?.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white/15 rounded-2xl p-3 flex items-center gap-3 border border-white/10 shadow-xs"
                >
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-indigo-300">{p.isHost ? 'Host Teacher' : 'Student'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            disabled={!room.players || room.players.length === 0}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5 fill-current" /> Start Live Multiplayer Game Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center border border-amber-300/30">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Host Live Class Session</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Generate a live 4-digit room code to project in class</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">1. Select Game Engine</label>
            <select
              value={selectedGameSlug}
              onChange={(e) => setSelectedGameSlug(e.target.value as GameSlug)}
              className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {gamesCatalog.map((g) => (
                <option key={g.id} value={g.slug}>
                  🎮 {g.name} ({g.mechanic})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">2. Select Question Set</label>
            <select
              value={selectedSetId}
              onChange={(e) => setSelectedSetId(e.target.value)}
              className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {questionSets.map((s) => (
                <option key={s.id} value={s.id}>
                  📚 {s.title} ({s.questions?.length || 0} questions)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98] mt-4 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Live Room Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
