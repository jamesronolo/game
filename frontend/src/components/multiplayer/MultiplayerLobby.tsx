import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Play, Shield, Key, CheckCircle, ArrowRight } from 'lucide-react';
import { joinLobby, subscribeToLobbyUpdates, subscribeToGameStart } from '../../services/socket';
import { useEduPlay } from '../../context/EduPlayContext';

const AVATAR_OPTIONS = ['🐶', '🐱', '🦊', '🦁', '🐸', '🚀', '⭐', '👾', '👑', '🧙‍♂️'];

export const MultiplayerLobby: React.FC = () => {
  const { setActiveTab, setSelectedGame, setSelectedSet, gamesCatalog, questionSets } = useEduPlay();
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
      // Find game and set for playing
      const g = gamesCatalog.find((x) => x.slug === data.room.gameSlug) || gamesCatalog[0];
      const s = questionSets.find((x) => x.id === data.room.questionSetId) || questionSets[0];
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
      } else {
        setError(res.error || 'Failed to join room');
      }
    });
  };

  if (isJoined && room) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-8 border border-white/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            Live Lobby Connected
          </div>

          <h1 className="text-3xl font-extrabold mb-2">Waiting for Host to Start...</h1>
          <p className="text-indigo-100 text-sm mb-6">
            Get ready! You are in Room Code <span className="font-mono font-bold text-yellow-300 text-xl tracking-widest">{room.code}</span>
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-md mx-auto">
            <h3 className="text-xs uppercase font-bold text-indigo-200 tracking-wider mb-4 flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> Players in Lobby ({room.players?.length || 0})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {room.players?.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white/20 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/10 shadow-sm transition hover:scale-105"
                >
                  <span className="text-2xl">{p.avatar}</span>
                  <span className="text-xs font-semibold text-white truncate max-w-[100px]">{p.name}</span>
                  {p.isHost && (
                    <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded">
                      HOST
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
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl mx-auto mb-4 font-bold">
          <Key className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Join Live Game</h2>
        <p className="text-xs text-center text-slate-500 mb-6">Enter the 4-digit code provided by your teacher</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1 tracking-wider">Game Code</label>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 4892"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-center tracking-widest text-2xl font-mono font-bold py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase text-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1 tracking-wider">Your Player Name</label>
            <input
              type="text"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wider">Choose Avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`p-2 text-2xl rounded-xl border transition flex items-center justify-center ${
                    selectedAvatar === emoji
                      ? 'border-indigo-600 bg-indigo-50 shadow-sm scale-105'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition"
          >
            Join Lobby <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
