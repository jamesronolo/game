import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { playCheerSound } from '../../utils/soundEffects';
import {
  Wrench,
  PieChart,
  Star,
  Users,
  Dices,
  Flag,
  Trophy,
  Volume2,
  Clock,
  Code2,
} from 'lucide-react';
import { TeacherToolTab } from './types';
import { WheelTool } from './tools/WheelTool';
import { StarsTool } from './tools/StarsTool';
import { GrouperTool } from './tools/GrouperTool';
import { DiceTool } from './tools/DiceTool';
import { RaceTool } from './tools/RaceTool';
import { NoiseMonitorTool } from './tools/NoiseMonitorTool';
import { TimerTool } from './tools/TimerTool';

export const TeacherToolsView: React.FC = () => {
  const {
    classStudents,
    addStudentToRoster,
    updateStudentInRoster,
    deleteStudentFromRoster,
    updateStudentStars,
    setActiveTab,
  } = useEduPlay();

  const [activeTool, setActiveTool] = useState<TeacherToolTab>('wheel');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-emerald-800/80 shadow-2xl text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-black uppercase tracking-widest">
              Smartboard Classroom Suite
            </span>
            <span className="text-xs font-bold text-slate-300">100% Free • No Ads</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <Wrench className="w-9 h-9 text-emerald-400" />
            <span>Interactive Teacher Tools</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Project live classroom utilities directly onto smartboards, TVs, or projectors — random student spinners, 3D dice rolls, behavior race tracks, noise meters, and group generators!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('coding-quiz')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black flex items-center gap-2 transition shadow-md shadow-indigo-900/30 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-yellow-300" /> Programming Test Quiz 🚀
          </button>
          <button
            onClick={() => playCheerSound()}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-2 transition cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Cheer Sound
          </button>
        </div>
      </div>

      {/* Tool Navigation Selector Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        {[
          { id: 'wheel' as const, label: 'Random Name Picker', icon: PieChart },
          { id: 'stars' as const, label: 'Star Chart & Behavior', icon: Star },
          { id: 'grouper' as const, label: 'Student Grouper', icon: Users },
          { id: 'dice' as const, label: 'Virtual 3D Dice', icon: Dices },
          { id: 'race' as const, label: 'Behavior Race Track', icon: Flag },
          { id: 'noise' as const, label: 'Noise Level Monitor', icon: Volume2 },
          { id: 'timer' as const, label: 'Classroom Timer', icon: Clock },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      {activeTool === 'wheel' && (
        <WheelTool
          classStudents={classStudents}
          addStudentToRoster={addStudentToRoster}
          updateStudentInRoster={updateStudentInRoster}
          deleteStudentFromRoster={deleteStudentFromRoster}
          updateStudentStars={updateStudentStars}
        />
      )}

      {activeTool === 'stars' && (
        <StarsTool
          classStudents={classStudents}
          updateStudentStars={updateStudentStars}
        />
      )}

      {activeTool === 'grouper' && (
        <GrouperTool classStudents={classStudents} />
      )}

      {activeTool === 'dice' && (
        <DiceTool />
      )}

      {activeTool === 'race' && (
        <RaceTool classStudents={classStudents} />
      )}

      {activeTool === 'noise' && (
        <NoiseMonitorTool />
      )}

      {activeTool === 'timer' && (
        <TimerTool />
      )}
    </div>
  );
};
