import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Sticker } from '../../types';
import { playCheerSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Lock, Gift, Zap, Crown } from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { rewards, stickersCatalog, redeemTicketForSticker } = useEduPlay();

  const [unboxedSticker, setUnboxedSticker] = useState<Sticker | null>(null);
  const [isUnboxing, setIsUnboxing] = useState(false);

  const handleRedeemTicket = () => {
    if (rewards.ticketsEarned <= 0 || isUnboxing) return;

    setIsUnboxing(true);
    setUnboxedSticker(null);

    setTimeout(() => {
      const unlocked = redeemTicketForSticker();
      if (unlocked) {
        setUnboxedSticker(unlocked);
        playCheerSound();
        confetti({ particleCount: 100, spread: 70 });
      }
      setIsUnboxing(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-700/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold mb-2 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Sticker Collection Album</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Earn Points & Redeem Sticker Tickets!
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Complete assigned games to earn points (250 pts = 1 Ticket). Redeem tickets to discover rare and legendary stickers for your album!
          </p>
        </div>

        {/* Ticket Redemption Box */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/40 text-center flex flex-col items-center gap-3 shrink-0 min-w-56">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">Available Tickets:</span>
            <span className="text-2xl font-black text-amber-400">{rewards.ticketsEarned}</span>
          </div>

          <button
            onClick={handleRedeemTicket}
            disabled={rewards.ticketsEarned <= 0 || isUnboxing}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all"
          >
            {isUnboxing ? 'Unboxing Mystery Box...' : 'REDEEM STICKER TICKET'}
          </button>
        </div>
      </div>

      {/* Unboxed Sticker Reveal Box */}
      {unboxedSticker && (
        <div className="bg-gradient-to-tr from-amber-500/20 via-purple-900/30 to-slate-900 border-2 border-amber-400 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in-95 duration-200">
          <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
            🎉 NEW UNLOCKED STICKER! ({unboxedSticker.rarity})
          </span>
          <div className="text-6xl animate-bounce my-2">{unboxedSticker.emoji}</div>
          <h3 className="text-2xl font-black text-white">{unboxedSticker.name}</h3>
          <p className="text-xs text-purple-200 max-w-md mx-auto">{unboxedSticker.description}</p>
        </div>
      )}

      {/* Sticker Album Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          <span>Collectible Sticker Album ({rewards.unlockedStickerIds.length} / {stickersCatalog.length})</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stickersCatalog.map((sticker) => {
            const isUnlocked = rewards.unlockedStickerIds.includes(sticker.id);
            return (
              <div
                key={sticker.id}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white border-purple-200 shadow-xs hover:shadow-md'
                    : 'bg-slate-100 border-slate-200/80 opacity-60'
                }`}
              >
                <div className="w-full flex justify-end">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      sticker.rarity === 'Legendary'
                        ? 'bg-amber-100 text-amber-800'
                        : sticker.rarity === 'Epic'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sticker.rarity}
                  </span>
                </div>

                <div className="text-4xl my-3">
                  {isUnlocked ? sticker.emoji : <Lock className="w-8 h-8 text-slate-400 my-1" />}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {isUnlocked ? sticker.name : '??? Locked'}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {isUnlocked ? sticker.description : 'Earn tickets to unlock'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
