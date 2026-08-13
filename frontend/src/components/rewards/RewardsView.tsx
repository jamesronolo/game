import React, { useState } from 'react';
import { useEduPlay, STICKER_PRICES } from '../../context/EduPlayContext';
import { Sticker } from '../../types';
import { playCheerSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Gift, Crown, Flame, Star, Tag, CheckCircle } from 'lucide-react';

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
    }, 1500);
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
    }, 800);
  };

  // Helper to count how many of a sticker ID the student owns
  const getStickerCount = (id: string) => {
    return rewards.unlockedStickerIds.filter((item) => item === id).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-700/60 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Sticker Rewards & Collection Shop</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Earn Points & Redeem Sticker Tickets!
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
            Play games to earn points & tickets. Redeem tickets to acquire Legendary, Epic, Rare, and Common stickers for your album. Items can be bought repeatedly!
          </p>

          {/* Rarity Prices Breakdown Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
            <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-2.5 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-amber-300">Legendary</div>
                <div className="text-sm font-extrabold text-white">2,000 Tickets</div>
              </div>
            </div>

            <div className="bg-purple-500/20 border border-purple-400/40 rounded-xl p-2.5 flex items-center gap-2">
              <Flame className="w-5 h-5 text-purple-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-purple-300">Epic</div>
                <div className="text-sm font-extrabold text-white">1,500 Tickets</div>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-400/40 rounded-xl p-2.5 flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-blue-300">Rare</div>
                <div className="text-sm font-extrabold text-white">1,000 Tickets</div>
              </div>
            </div>

            <div className="bg-slate-700/40 border border-slate-500/40 rounded-xl p-2.5 flex items-center gap-2">
              <Tag className="w-5 h-5 text-slate-300 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-black text-slate-300">Common</div>
                <div className="text-sm font-extrabold text-white">500 Tickets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Redemption Balance Box */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-400/50 text-center flex flex-col items-center justify-center gap-3 shrink-0 w-full lg:w-72 shadow-2xl">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-amber-400 animate-bounce" />
            <span className="text-xs font-bold text-slate-300">Your Tickets Balance:</span>
          </div>
          <span className="text-4xl font-black text-amber-400 tracking-tight">
            {rewards.ticketsEarned.toLocaleString()} 🎟️
          </span>

          <button
            onClick={handleRedeemTicket}
            disabled={rewards.ticketsEarned < 500 || isUnboxing}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
          >
            {isUnboxing ? 'Redeeming Item...' : 'MYSTERY BOX (500 Tickets)'}
          </button>
        </div>
      </div>

      {/* Unboxed Sticker Reveal Box */}
      {unboxedSticker && (
        <div className="bg-gradient-to-tr from-amber-500/20 via-purple-900/40 to-slate-900 border-2 border-amber-400 p-6 rounded-3xl text-center space-y-3 animate-in zoom-in-95 duration-200 shadow-2xl">
          <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ITEM REDEEMED / UNLOCKED! ({unboxedSticker.rarity})</span>
          </span>
          <div className="text-7xl animate-bounce my-2">{unboxedSticker.emoji}</div>
          <h3 className="text-3xl font-black text-white">{unboxedSticker.name}</h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-md mx-auto">{unboxedSticker.description}</p>
        </div>
      )}

      {/* Sticker Collection & Shop Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            <span>Collectible Sticker Shop ({new Set(rewards.unlockedStickerIds).size} / {stickersCatalog.length} Unlocked)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Items can be purchased multiple times and will remain available to buy again!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {stickersCatalog.map((sticker) => {
            const countOwned = getStickerCount(sticker.id);
            const isUnlocked = countOwned > 0;
            const price = STICKER_PRICES[sticker.rarity] || 500;
            const canAfford = rewards.ticketsEarned >= price;

            return (
              <div
                key={sticker.id}
                className={`p-5 rounded-3xl border text-center flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white border-purple-200 shadow-md hover:shadow-lg'
                    : 'bg-slate-50 border-slate-200 opacity-90'
                }`}
              >
                {/* Header Badge */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      sticker.rarity === 'Legendary'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : sticker.rarity === 'Epic'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : sticker.rarity === 'Rare'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {sticker.rarity}
                  </span>

                  {countOwned > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Owned x{countOwned}</span>
                    </span>
                  )}
                </div>

                {/* Emoji Display */}
                <div className="text-5xl my-4 flex items-center justify-center">
                  <span>{sticker.emoji}</span>
                </div>

                {/* Content */}
                <div className="space-y-1 mb-4">
                  <h4 className="font-black text-base text-slate-900">{sticker.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{sticker.description}</p>
                </div>

                {/* Redeem Price Button */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold text-slate-600 flex items-center justify-center gap-1">
                    <span>Price:</span>
                    <span className="font-black text-amber-600">{price.toLocaleString()} Tickets</span>
                  </div>

                  <button
                    onClick={() => handleBuySpecificSticker(sticker.id)}
                    disabled={!canAfford || isUnboxing}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition-all active:scale-95 shadow-sm ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-purple-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isUnboxing
                      ? 'Buying...'
                      : countOwned > 0
                      ? `REDEEM AGAIN (${price.toLocaleString()} 🎟️)`
                      : `REDEEM STICKER (${price.toLocaleString()} 🎟️)`}
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

