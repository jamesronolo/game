import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCheerSound } from '../../../utils/soundEffects';

export const TimerTool: React.FC = () => {
  const [timerDuration, setTimerDuration] = useState(300); // 5 mins
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playCheerSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-12 shadow-xl flex flex-col items-center text-center space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Visual Classroom Countdown</h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Project a large visual countdown timer for test prep, group stations, and classroom clean-up time!
        </p>
      </div>

      <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border-2 border-slate-800 p-8 sm:p-12 text-center space-y-8 shadow-2xl">
        <div className="text-7xl sm:text-9xl font-black font-mono text-emerald-400 tracking-widest drop-shadow-2xl">
          {formatTime(timerRemaining)}
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { label: '1 Min', secs: 60 },
            { label: '3 Mins', secs: 180 },
            { label: '5 Mins', secs: 300 },
            { label: '10 Mins', secs: 600 },
            { label: '15 Mins', secs: 900 },
          ].map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTimerRunning(false);
                setTimerDuration(p.secs);
                setTimerRemaining(p.secs);
              }}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-extrabold text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="flex items-center gap-3 px-10 py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition cursor-pointer"
          >
            {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span>{isTimerRunning ? 'Pause Timer' : 'Start Timer'}</span>
          </button>

          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerRemaining(timerDuration);
            }}
            className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
