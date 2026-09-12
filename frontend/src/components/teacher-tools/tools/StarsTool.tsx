import React from 'react';
import { Star, Minus, Plus } from 'lucide-react';
import { playCheerSound } from '../../../utils/soundEffects';
import { ClassStudent } from '../../../types';

interface StarsToolProps {
  classStudents: ClassStudent[];
  updateStudentStars: (studentId: string, delta: number) => Promise<void>;
}

export const StarsTool: React.FC<StarsToolProps> = ({
  classStudents,
  updateStudentStars,
}) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Classroom Star Chart & Rewards</h2>
          <p className="text-sm text-slate-500 mt-1">
            Award stars and behavior points live during lessons to motivate participation and teamwork!
          </p>
        </div>
        <span className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 border border-amber-300 font-extrabold text-xs">
          ⭐ Total Class Stars: {classStudents.reduce((acc, s) => acc + s.stars, 0)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classStudents.map((student) => (
          <div
            key={student.id}
            className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50/80 flex flex-col justify-between shadow-sm hover:border-emerald-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{student.avatar}</span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{student.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-amber-600 font-black mt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{student.stars} Stars</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modify Stars:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStudentStars(student.id, -1)}
                  className="p-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 transition cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    updateStudentStars(student.id, 1);
                    playCheerSound();
                  }}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
