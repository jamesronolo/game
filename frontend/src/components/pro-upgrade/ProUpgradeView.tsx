import React from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Sparkles, Crown, Check, Zap, Shield, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const ProUpgradeView: React.FC = () => {
  const { isPro, toggleProStatus } = useEduPlay();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 select-none">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-300/60 dark:border-amber-700/60">
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          <span>Quiz Game Educator Pass</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Unlock All 8 Game Worlds & Advanced Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          One-time classroom educator pass with zero recurring subscription traps. Students always join and play 100% free with no ads.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-400/80 dark:border-amber-500/60 p-8 sm:p-10 shadow-2xl max-w-lg mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-wider shadow-xs">
          One-Time Classroom Pass
        </div>

        <div className="text-center space-y-2 mb-8 mt-2">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">$29</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">/ Lifetime License</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>14-Day Money-Back Guarantee</span>
          </p>
        </div>

        <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 font-semibold mb-8">
          {[
            'Unlock all 8 interactive classroom game mechanics',
            'Unlimited custom question sets with image & audio prompts',
            'Full student sticker ticket gamification & mystery store',
            'Classroom gradebook analytics & CSV data exports',
            'Seamless live multiplayer host room capacity',
            'Zero advertisements for distraction-free learning',
          ].map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={toggleProStatus}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
            isPro
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
              : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 hover:scale-105 active:scale-95 shadow-amber-500/25'
          }`}
        >
          {isPro ? 'Pro Status Active (Tap to Toggle Demo)' : 'Activate Pro License (Instant Demo)'}
        </button>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-4">
          Demo toggle enables all premium features for evaluation without payment gateway.
        </p>
      </div>
    </div>
  );
};
