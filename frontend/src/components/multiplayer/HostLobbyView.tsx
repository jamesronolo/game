import React, { useState, useEffect } from 'react';
import { Users, Play, Crown, Sparkles, Copy, Check, ArrowLeft } from 'lucide-react';
import { createLobby, startGame, subscribeToLobbyUpdates } from '../../services/socket';
import { useEduPlay } from '../../context/EduPlayContext';
import { GameSlug } from '../../types';

export const HostLobbyView: React.FC = () => {
  const { gamesCatalog, questionSets, setActiveTab, setSelectedGame, setSelectedSet } = useEduPlay();
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
    createLobby(selectedGameSlug, selectedSetId, 'Teacher Host', (res) => {
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
        <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setRoom(null)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
              <Crown className="w-3.5 h-3.5" /> LIVE HOST PANEL
            </span>
          </div>

          <div className="text-center my-6">
            <p className="text-xs uppercase font-bold tracking-widest text-indigo-200 mb-2">Student Join Code</p>
            <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 shadow-inner">
              <span className="font-mono text-5xl font-extrabold tracking-widest text-yellow-300">{room.code}</span>
              <button
                onClick={copyCode}
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-2xl transition"
                title="Copy Join Code"
              >
                {isCopied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Joined Players */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-200" /> Joined Students ({room.players?.length || 0})
              </h3>
              <span className="text-xs text-indigo-100">Waiting for class to enter code...</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {room.players?.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white/20 rounded-xl p-3 flex items-center gap-3 border border-white/10 shadow-sm"
                >
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-indigo-200">{p.isHost ? 'Host Teacher' : 'Student'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            disabled={!room.players || room.players.length === 0}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
          >
            <Play className="w-5 h-5 fill-current" /> Start Live Multiplayer Game Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Host Live Class Lobby</h2>
            <p className="text-xs text-slate-500">Project join code on classroom board for real-time play</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">1. Select Game Mode</label>
            <select
              value={selectedGameSlug}
              onChange={(e) => setSelectedGameSlug(e.target.value as GameSlug)}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {gamesCatalog.map((g) => (
                <option key={g.id} value={g.slug}>
                  🎮 {g.name} ({g.mechanic})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">2. Select Question Set</label>
            <select
              value={selectedSetId}
              onChange={(e) => setSelectedSetId(e.target.value)}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition mt-4"
          >
            <Sparkles className="w-5 h-5 text-amber-300" /> Create Live Room & Generate Join Code
          </button>
        </div>
      </div>
    </div>
  );
};
