import React from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Sparkles, Crown, Check, Zap, Shield, HeartHandshake } from 'lucide-react';

export const ProUpgradeView: React.FC = () => {
  const { isPro, toggleProStatus } = useEduPlay();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-300">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          <span>Quiz Game Pro Teacher Pass</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Unlock All 8 Games & Student Sticker Rewards
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          One-time pass purchase (no recurring subscription traps!). Students always play 100% free.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-400 p-8 shadow-xl max-w-lg mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
          One-Time Classroom Pass
        </div>

        <div className="text-center space-y-2 mb-6">
          <span className="text-4xl font-black text-slate-900">$29</span>
          <span className="text-xs text-slate-500 font-semibold"> / One-time payment</span>
          <p className="text-xs text-emerald-600 font-bold">14-Day Money-Back Guarantee</p>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 font-semibold mb-8">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Unlock all 8 interactive classroom games</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Unlimited question sets with image & audio prompts</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Student sticker ticket rewards system</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Full gradebook tracking & CSV exports</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Paddle payment integration (handles tax & receipts automatically)</span>
          </li>
        </ul>

        <button
          onClick={toggleProStatus}
          className={`w-full py-3.5 rounded-xl font-black text-sm shadow-lg transition-all ${
            isPro
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950'
          }`}
        >
          {isPro ? 'Pro Status Active (Tap to Toggle Off)' : 'Activate Pro Pass (Demo Toggle)'}
        </button>

        <p className="text-[10px] text-slate-400 text-center mt-3">
          Simulates Pro access control logic for capstone evaluation.
        </p>
      </div>
    </div>
  );
};
