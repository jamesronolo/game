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
  Sparkles,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 p-6 sm:p-10 rounded-3xl border border-teal-800/60 shadow-2xl text-white">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full text-xs font-black uppercase tracking-wider">
              Smartboard Classroom Suite
            </span>
            <span className="text-xs font-semibold text-slate-300">• 100% Free & Projector Ready</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <Wrench className="w-8 h-8 text-teal-400" />
            <span>Interactive Teacher Tools</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Project live classroom utilities directly onto smartboards or screens — random student name spinners, 3D dice rolls, behavior race tracks, noise decibel meters, and team groupers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('coding-quiz')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-amber-300" />
            <span>Coding Quiz Arena</span>
          </button>
          <button
            onClick={() => playCheerSound()}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Sound: Cheer</span>
          </button>
        </div>
      </div>

      {/* Tool Navigation Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'wheel' as const, label: 'Random Name Picker', icon: PieChart },
          { id: 'stars' as const, label: 'Star Chart & Behavior', icon: Star },
          { id: 'grouper' as const, label: 'Student Grouper', icon: Users },
          { id: 'dice' as const, label: 'Virtual 3D Dice', icon: Dices },
          { id: 'race' as const, label: 'Behavior Race Track', icon: Flag },
          { id: 'noise' as const, label: 'Noise Decibel Monitor', icon: Volume2 },
          { id: 'timer' as const, label: 'Classroom Timer', icon: Clock },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div className="animate-in fade-in duration-150">
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
    </div>
  );
};
