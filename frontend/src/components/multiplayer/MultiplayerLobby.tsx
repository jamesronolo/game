import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Play, Shield, Key, CheckCircle2, ArrowRight } from 'lucide-react';
import { joinLobby, subscribeToLobbyUpdates, subscribeToGameStart } from '../../services/socket';
import { useEduPlay } from '../../context/EduPlayContext';

const AVATAR_OPTIONS = ['🐶', '🐱', '🦊', '🦁', '🐸', '🚀', '⭐', '👾', '👑', '🧙‍♂️'];

export const MultiplayerLobby: React.FC = () => {
  const { setActiveTab, setSelectedGame, setSelectedSet, setMultiplayerCode, gamesCatalog, questionSets } = useEduPlay();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐶');
  const [room, setRoom] = useState<any>(null);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const unsubscribeLobby = subscribeToLobbyUpdates((data) => {
      setRoom(data.room);
    });

    const unsubscribeStart = subscribeToGameStart((data) => {
      const g = gamesCatalog.find((x) => x.slug === data.room.gameSlug) || gamesCatalog[0];
      const s = questionSets.find((x) => x.id === data.room.questionSetId) || questionSets[0];
      setMultiplayerCode(data.room.code);
      setSelectedGame(g);
      setSelectedSet(s);
      setActiveTab('game-play');
    });

    return () => {
      unsubscribeLobby();
      unsubscribeStart();
    };
  }, [gamesCatalog, questionSets, setActiveTab, setSelectedGame, setSelectedSet]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      setError('Please enter both join code and your name');
      return;
    }
    setError('');

    joinLobby(code, name, selectedAvatar, (res) => {
      if (res.success) {
        setIsJoined(true);
        setRoom(res.room);
        setMultiplayerCode(res.code || code);
      } else {
        setError(res.error || 'Failed to join room');
      }
    });
  };

  if (isJoined && room) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        <div className="bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden mb-8 border border-indigo-700/60">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Live Multiplayer Arena Connected</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">Waiting for Teacher to Start...</h1>
          <p className="text-indigo-200 text-xs sm:text-sm mb-6">
            Get ready! You are in Room Code <span className="font-mono font-bold text-amber-300 text-2xl tracking-widest ml-1">{room.code}</span>
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-lg mx-auto shadow-inner">
            <h3 className="text-xs uppercase font-extrabold text-indigo-200 tracking-wider mb-4 flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> Players in Lobby ({room.players?.length || 0})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {room.players?.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white/10 rounded-2xl p-3 flex flex-col items-center gap-1 border border-white/10 shadow-sm transition hover:scale-105"
                >
                  <span className="text-3xl filter drop-shadow-sm">{p.avatar}</span>
                  <span className="text-xs font-bold text-white truncate max-w-[110px]">{p.name}</span>
                  {p.isHost && (
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                      Teacher Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl mx-auto mb-4 font-bold border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
          <Key className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-extrabold text-center text-slate-900 dark:text-white mb-1">Join Live Game</h2>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">Enter the 4-digit code provided by your teacher</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60">
            {error}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Game Room Code</label>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 4892"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden uppercase text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Player Name</label>
            <input
              type="text"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white font-semibold text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2 tracking-wider">Select Avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`p-2.5 text-2xl rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                    selectedAvatar === emoji
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 shadow-xs scale-105'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Join Live Lobby</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
