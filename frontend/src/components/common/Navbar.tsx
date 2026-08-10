import React, { useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { UserRole } from '../../types';
import {
  Gamepad2,
  BookOpen,
  Wrench,
  BarChart3,
  Award,
  Crown,
  Volume2,
  VolumeX,
  UserCheck,
  ChevronDown,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchRole,
    soundEnabled,
    toggleAudio,
    isPro,
    rewards,
  } = useEduPlay();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'games', label: 'Games Library', icon: Gamepad2 },
    { id: 'sets', label: 'Question Sets', icon: BookOpen },
    { id: 'teacher-tools', label: 'Free Teacher Tools', icon: Wrench, badge: 'Free' },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, roleRequired: 'teacher' },
    { id: 'progress', label: 'Progress & Gradebook', icon: BarChart3 },
    { id: 'rewards', label: 'Sticker Rewards', icon: Award, count: rewards.ticketsEarned },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-sky-700 bg-clip-text text-transparent">
                  Quiz Game
                </span>
                {isPro && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    <Crown className="w-3 h-3 text-amber-600" /> PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Interactive Learning Games
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.roleRequired && currentUser.role !== item.roleRequired) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-sky-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Pro Status Upgrade Button */}
            <button
              onClick={() => setActiveTab('pro-upgrade')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:brightness-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{isPro ? 'Pro Account' : 'Upgrade Pro Pass'}</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center border border-sky-300">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role} View
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Switch Evaluator Perspective
                    </p>
                  </div>
                  {(['teacher', 'student', 'parent'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentUser.role === r ? 'font-semibold text-sky-600 bg-sky-50/60' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 capitalize">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r} Mode</span>
                      </div>
                      {currentUser.role === r && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 gap-1 no-scrollbar text-xs">
          {navItems.map((item) => {
            if (item.roleRequired && currentUser.role !== item.roleRequired) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md whitespace-nowrap text-xs ${
                  isActive ? 'bg-sky-100 text-sky-800 font-semibold' : 'text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
