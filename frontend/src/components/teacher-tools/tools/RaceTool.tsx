import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCheerSound } from '../../../utils/soundEffects';
import { ClassStudent } from '../../../types';

interface RaceToolProps {
  classStudents: ClassStudent[];
}

export const RaceTool: React.FC<RaceToolProps> = ({ classStudents }) => {
  const [racePositions, setRacePositions] = useState<Record<string, number>>({});

  useEffect(() => {
    if (classStudents.length > 0 && Object.keys(racePositions).length === 0) {
      const initial: Record<string, number> = {};
      classStudents.forEach((st, idx) => {
        initial[st.id] = (idx * 12) % 60;
      });
      setRacePositions(initial);
    }
  }, [classStudents]);

  const advanceCar = (studentId: string) => {
    setRacePositions((prev) => {
      const current = prev[studentId] || 0;
      const updated = Math.min(100, current + 15);
      if (updated >= 100) {
        playCheerSound();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
      return { ...prev, [studentId]: updated };
    });
  };

  const resetRace = () => {
    const reset: Record<string, number> = {};
    classStudents.forEach((st) => {
      reset[st.id] = 0;
    });
    setRacePositions(reset);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Behavior Race Track</h2>
          <p className="text-sm text-slate-500 mt-1">
            Project a live visual race track — advance students toward the finish line for great behavior and fast answers!
          </p>
        </div>

        <button
          onClick={resetRace}
          className="px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Reset Track
        </button>
      </div>

      <div className="space-y-6 bg-slate-950 p-8 rounded-3xl border-2 border-slate-800 shadow-2xl">
        {classStudents.map((student) => {
          const pos = racePositions[student.id] || 0;
          return (
            <div key={student.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{student.avatar}</span>
                  <span>{student.name}</span>
                </span>
                <button
                  onClick={() => advanceCar(student.id)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  + Advance Car (+15%)
                </button>
              </div>

              <div className="w-full h-12 bg-slate-900 rounded-2xl border-2 border-slate-800 relative overflow-hidden flex items-center">
                <div className="absolute right-4 top-0 bottom-0 flex items-center text-xs font-black text-slate-600 uppercase tracking-widest z-0">
                  🏁 FINISH
                </div>
                <div
                  className="absolute top-1 bottom-1 text-3xl transition-all duration-500 z-10"
                  style={{ left: `${Math.min(92, pos)}%` }}
                >
                  🏎️
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
