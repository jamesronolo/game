import React, { useState } from "react";
import { useEduPlay } from "../../context/EduPlayContext";
import {
  Gamepad2, BookOpen, Wrench, BarChart3, Award, Crown,
  Volume2, VolumeX, ClipboardList, Sun, Moon, Code2,
  GraduationCap, Users, Menu, X, Sparkles, School,
  Lock, Eye, EyeOff, AlertCircle, KeyRound, ArrowRight,
  Shield, CheckCircle2,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    activeTab, setActiveTab, currentUser, switchRole,
    soundEnabled, toggleAudio, darkMode, toggleDarkMode,
    isPro, rewards,
  } = useEduPlay();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState(false);
  const [teacherUsername, setTeacherUsername] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleTeacherClick = () => {
    if (currentUser?.role === "teacher") return;
    setTeacherUsername("");
    setTeacherPassword("");
    setAuthError("");
    setShowTeacherAuthModal(true);
  };

  const handleTeacherAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = teacherUsername.trim().toLowerCase();
    const cleanPass = teacherPassword.trim();
    if (cleanUser === "teacher" && cleanPass === "teacher123") {
      setAuthError("");
      setShowTeacherAuthModal(false);
      switchRole("teacher");
    } else {
      setAuthError("Invalid teacher credentials. (Default: teacher / teacher123)");
    }
  };

  if (!currentUser) return null;

  const isTeacher = currentUser.role === "teacher";
  const isStudent = currentUser.role === "student";

  const allNavItems = [
    { id: "games",          label: "Game Engines",     icon: Gamepad2,      roles: ["teacher","student"] },
    { id: "coding-quiz",    label: "Programming",     icon: Code2,         roles: ["teacher","student"], badge: "New" },
    { id: "sets",           label: "Question Sets",   icon: BookOpen,      roles: ["teacher","student"] },
    { id: "teacher-tools",  label: "Teacher Tools",   icon: Wrench,        roles: ["teacher"],           badge: "Free" },
    { id: "assignments",    label: "Assignments",     icon: ClipboardList, roles: ["teacher"] },
    { id: "school-records", label: "School Records",  icon: School,        roles: ["teacher"] },
    { id: "progress",       label: "Analytics",       icon: BarChart3,     roles: ["teacher","student"] },
    { id: "rewards",        label: "Rewards & Shop",  icon: Award,         roles: ["teacher","student"], count: rewards.ticketsEarned },
  ];

  const navItems = allNavItems.filter((i) => i.roles.includes(currentUser.role));

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#0c1220]/90 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-200">

      {/* ═══════════ MAIN TOP BAR ═══════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2.5 group focus:outline-hidden"
              title="Return to Home"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/30 transition-all duration-200">
                <Gamepad2 className="w-5 h-5 transition-transform group-hover:rotate-6" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                </span>
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-sky-200 dark:to-indigo-200 bg-clip-text text-transparent">
                    Quiz Game
                  </span>
                  {isPro && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-xs">
                      <Crown className="w-2.5 h-2.5 fill-current" /> PRO
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                  Classroom Arcade
                </p>
              </div>
            </button>

            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
              <button
                id="role-student-btn"
                onClick={() => switchRole("student")}
                title="Switch to Student view"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isStudent
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                id="role-teacher-btn"
                onClick={handleTeacherClick}
                title={isTeacher ? "Teacher view active" : "Unlock Teacher view"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isTeacher
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Teacher</span>
                {!isTeacher && <Lock className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Center: Desktop Top Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none uppercase ${
                      item.badge === "New"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/50"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {(item.count ?? 0) > 0 && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black rounded-full leading-none shadow-xs">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions, Join / Host & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Multiplayer Join Button */}
            <button
              onClick={() => setActiveTab("multiplayer-join")}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Join Game</span>
            </button>

            {/* Host Button for Teachers */}
            {isTeacher && (
              <button
                onClick={() => setActiveTab("host-lobby")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Host Room</span>
              </button>
            )}

            {/* User Profile Avatar Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold text-white shadow-xs ${
                isTeacher ? "bg-gradient-to-tr from-indigo-600 to-indigo-400" : "bg-gradient-to-tr from-emerald-600 to-emerald-400"
              }`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left leading-none">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                  {currentUser.name}
                </span>
                <span className={`text-[9px] font-extrabold uppercase tracking-wider ${
                  isTeacher ? "text-indigo-500" : "text-emerald-500"
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Utility Toggles: Dark Mode & Sound */}
            <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={toggleDarkMode}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
              </button>
              <button
                onClick={toggleAudio}
                title={soundEnabled ? "Mute Game Audio" : "Enable Game Audio"}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════ SUB-NAV BAR (Desktop xl and below md+) ═══════════ */}
      <div className="hidden md:block xl:hidden border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center h-10 gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                  {(item.count ?? 0) > 0 && (
                    <span className="px-1 py-0.2 bg-amber-500 text-slate-950 text-[8px] font-bold rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ═══════════ MOBILE DRAWER ═══════════ */}
      {mobileOpen && (
        <div className="xl:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          {/* User info banner in mobile */}
          <div className={`flex items-center justify-between p-3 rounded-2xl border ${
            isTeacher
              ? "bg-indigo-50/70 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900"
              : "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                isTeacher ? "bg-indigo-600" : "bg-emerald-600"
              }`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className={`text-xs font-semibold capitalize ${isTeacher ? "text-indigo-600 dark:text-indigo-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {currentUser.role} mode
                </div>
              </div>
            </div>

            {/* Mobile role switcher button */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => switchRole("student")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  isStudent ? "bg-emerald-500 text-white" : "text-slate-500"
                }`}
              >
                Student
              </button>
              <button
                onClick={handleTeacherClick}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  isTeacher ? "bg-indigo-600 text-white" : "text-slate-500"
                }`}
              >
                Teacher
                {!isTeacher && <Lock className="w-2.5 h-2.5" />}
              </button>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setMobileOpen(false); }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Multiplayer Quick Actions in Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { setActiveTab("multiplayer-join"); setMobileOpen(false); }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            >
              <Sparkles className="w-3.5 h-3.5" /> Join Live Game
            </button>
            {isTeacher && (
              <button
                onClick={() => { setActiveTab("host-lobby"); setMobileOpen(false); }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
              >
                <Crown className="w-3.5 h-3.5" /> Host Classroom
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ TEACHER AUTHENTICATION MODAL ═══════════ */}
      {showTeacherAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTeacherAuthModal(false);
              setAuthError("");
            }
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 to-slate-50 dark:from-indigo-950/40 dark:to-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    Teacher Verification
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-full">
                      Protected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Switch to teacher tools, assignment creator & gradebook
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTeacherAuthModal(false);
                  setAuthError("");
                }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleTeacherAuthSubmit} className="p-6 space-y-4">
              {authError && (
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <div>
                    <div className="font-bold">Access Denied</div>
                    <div>{authError}</div>
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Teacher Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={teacherUsername}
                    onChange={(e) => {
                      setTeacherUsername(e.target.value);
                      if (authError) setAuthError("");
                    }}
                    placeholder="Enter 'teacher'"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Teacher Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={teacherPassword}
                    onChange={(e) => {
                      setTeacherPassword(e.target.value);
                      if (authError) setAuthError("");
                    }}
                    placeholder="Enter 'teacher123'"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Hint */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Default credentials:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">teacher / teacher123</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeacherAuthModal(false);
                    setAuthError("");
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify & Enter Teacher Mode</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
