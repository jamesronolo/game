import React, { useState } from 'react';
import { useEduPlay, STICKER_PRICES } from '../../context/EduPlayContext';
import { Sticker } from '../../types';
import { playCheerSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Gift, Crown, Flame, Star, Tag, CheckCircle2, Ticket } from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { rewards, stickersCatalog, redeemTicketForSticker, redeemSpecificSticker } = useEduPlay();

  const [unboxedSticker, setUnboxedSticker] = useState<Sticker | null>(null);
  const [isUnboxing, setIsUnboxing] = useState(false);

  const handleRedeemTicket = () => {
    if (rewards.ticketsEarned < 500 || isUnboxing) return;

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
    }, 1200);
  };

  const handleBuySpecificSticker = (stickerId: string) => {
    if (isUnboxing) return;
    setIsUnboxing(true);
    setUnboxedSticker(null);

    setTimeout(() => {
      const unlocked = redeemSpecificSticker(stickerId);
      if (unlocked) {
        setUnboxedSticker(unlocked);
        playCheerSound();
        confetti({ particleCount: 120, spread: 80 });
      }
      setIsUnboxing(false);
    }, 700);
  };

  const getStickerCount = (id: string) => {
    return rewards.unlockedStickerIds.filter((item) => item === id).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Gamification & Sticker Album</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Earn Points & Redeem Sticker Tickets!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Answer questions correctly across any game to accumulate points and tickets. Redeem your tickets to collect Legendary, Epic, Rare, and Common stickers for your digital sticker album!
          </p>

          {/* Rarity Prices Breakdown Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-2.5 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-amber-300">Legendary</div>
                <div className="text-xs font-extrabold text-white">2,000 Tickets</div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-400/30 rounded-2xl p-2.5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-purple-300">Epic</div>
                <div className="text-xs font-extrabold text-white">1,500 Tickets</div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-2.5 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-blue-300">Rare</div>
                <div className="text-xs font-extrabold text-white">1,000 Tickets</div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-2.5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-slate-300">Common</div>
                <div className="text-xs font-extrabold text-white">500 Tickets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Redemption Balance Box */}
        <div className="bg-slate-900/95 p-6 rounded-3xl border border-amber-400/40 text-center flex flex-col items-center justify-center gap-3 shrink-0 w-full lg:w-80 shadow-2xl">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Ticket Balance</span>
          </div>
          <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tracking-tight">
            {rewards.ticketsEarned.toLocaleString()}
          </span>

          <button
            onClick={handleRedeemTicket}
            disabled={rewards.ticketsEarned < 500 || isUnboxing}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {isUnboxing ? 'Unboxing Reward...' : 'MYSTERY REVEAL (500 Tickets)'}
          </button>
        </div>
      </div>

      {/* Unboxed Sticker Reveal Box */}
      {unboxedSticker && (
        <div className="bg-gradient-to-tr from-amber-500/20 via-purple-950/60 to-slate-900 border-2 border-amber-400 p-8 rounded-3xl text-center space-y-3 animate-in zoom-in-95 duration-200 shadow-2xl">
          <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ITEM UNLOCKED! ({unboxedSticker.rarity})</span>
          </span>
          <div className="text-7xl animate-bounce my-3">{unboxedSticker.emoji}</div>
          <h3 className="text-3xl font-black text-white">{unboxedSticker.name}</h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-md mx-auto">{unboxedSticker.description}</p>
        </div>
      )}

      {/* Sticker Collection & Shop Catalog */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Collectible Sticker Album ({new Set(rewards.unlockedStickerIds).size} / {stickersCatalog.length} Unlocked)</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Items can be collected repeatedly for sticker album boosts!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stickersCatalog.map((sticker) => {
            const countOwned = getStickerCount(sticker.id);
            const isUnlocked = countOwned > 0;
            const price = STICKER_PRICES[sticker.rarity] || 500;
            const canAfford = rewards.ticketsEarned >= price;

            return (
              <div
                key={sticker.id}
                className={`card-interactive p-6 rounded-3xl border text-center flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-indigo-200/80 dark:border-indigo-800/80 shadow-xs hover:border-indigo-400'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header Badge */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      sticker.rarity === 'Legendary'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : sticker.rarity === 'Epic'
                        ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                        : sticker.rarity === 'Rare'
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {sticker.rarity}
                  </span>

                  {countOwned > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>x{countOwned}</span>
                    </span>
                  )}
                </div>

                {/* Emoji Display */}
                <div className="text-6xl my-5 flex items-center justify-center filter drop-shadow-md">
                  <span>{sticker.emoji}</span>
                </div>

                {/* Content */}
                <div className="space-y-1 mb-5">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{sticker.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{sticker.description}</p>
                </div>

                {/* Redeem Price Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                    <span>Price:</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">{price.toLocaleString()} Tickets</span>
                  </div>

                  <button
                    onClick={() => handleBuySpecificSticker(sticker.id)}
                    disabled={!canAfford || isUnboxing}
                    className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all active:scale-95 shadow-sm cursor-pointer ${
                      canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isUnboxing
                      ? 'Redeeming...'
                      : countOwned > 0
                      ? `Redeem Again (${price.toLocaleString()} 🎟️)`
                      : `Redeem (${price.toLocaleString()} 🎟️)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
