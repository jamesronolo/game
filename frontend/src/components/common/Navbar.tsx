import React, { useState } from "react";
import { useEduPlay } from "../../context/EduPlayContext";
import { UserRole } from "../../types";
import {
  Gamepad2, BookOpen, Wrench, BarChart3, Award, Crown,
  Volume2, VolumeX, ClipboardList, Sun, Moon, Code2,
  GraduationCap, Users, Menu, X, Sparkles, School,
  Lock, Eye, EyeOff, AlertCircle, KeyRound,
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
      setAuthError("Invalid username or password. Please try again.");
    }
  };

  if (!currentUser) return null;

  const isTeacher = currentUser.role === "teacher";
  const isStudent = currentUser.role === "student";

  const allNavItems = [
    { id: "games",          label: "Games",           icon: Gamepad2,      roles: ["teacher","student"] },
    { id: "coding-quiz",    label: "Programming",     icon: Code2,         roles: ["teacher","student"], badge: "New" },
    { id: "sets",           label: "Question Sets",   icon: BookOpen,      roles: ["teacher","student"] },
    { id: "teacher-tools",  label: "Tools",           icon: Wrench,        roles: ["teacher"],           badge: "Free" },
    { id: "assignments",    label: "Assignments",     icon: ClipboardList, roles: ["teacher"] },
    { id: "school-records", label: "School Records",  icon: School,        roles: ["teacher"] },
    { id: "progress",       label: "Progress",        icon: BarChart3,     roles: ["teacher","student"] },
    { id: "rewards",        label: "Rewards",         icon: Award,         roles: ["teacher","student"], count: rewards.ticketsEarned },
  ];

  const navItems = allNavItems.filter((i) => i.roles.includes(currentUser.role));

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">

      {/* ═══════════ ROW 1 — Brand / Role / Controls ═══════════ */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-5">
        <div className="flex items-center h-12 gap-2 sm:gap-3">

          {/* Logo */}
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600
              flex items-center justify-center text-white shadow-sm
              group-hover:scale-105 transition-transform duration-200">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div className="hidden sm:block leading-none">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm tracking-tight
                  bg-gradient-to-r from-indigo-700 via-sky-600 to-purple-600
                  dark:from-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  Quiz Game
                </span>
                {isPro && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full
                    text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-300">
                    <Crown className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 tracking-wide">Interactive Learning</p>
            </div>
          </button>

          {/* Role Switcher pill (Swapped: Student first, Teacher second) */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800
            rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 shrink-0">
            {/* 1. Student button */}
            <button
              id="role-student-btn"
              onClick={() => switchRole("student")}
              title="Student view"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[11px] font-bold
                transition-all duration-200
                ${isStudent
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-500 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-700"}`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Student</span>
            </button>

            {/* 2. Teacher button (with password protection) */}
            <button
              id="role-teacher-btn"
              onClick={handleTeacherClick}
              title={isTeacher ? "Teacher view" : "Teacher view (Password required)"}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[11px] font-bold
                transition-all duration-200
                ${isTeacher
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700"}`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Teacher</span>
              {!isTeacher && <Lock className="w-2.5 h-2.5 ml-0.5 opacity-60 text-slate-400" />}
            </button>
          </div>

          {/* Flex spacer */}
          <div className="flex-1 min-w-0" />

          {/* User identity (md+) */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0
              ${isTeacher ? "bg-indigo-100 text-indigo-700 border-indigo-300" : "bg-emerald-100 text-emerald-700 border-emerald-300"}`}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-[10px] leading-tight">
              <div className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[90px]">
                {currentUser.name}
              </div>
              <div className={`font-semibold capitalize ${isTeacher ? "text-indigo-500" : "text-emerald-500"}`}>
                {currentUser.role}
              </div>
            </div>
          </div>

          {/* Multiplayer buttons (lg+) */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("multiplayer-join")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold
                bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200
                dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 shrink-0" /> Join
            </button>
            {isTeacher && (
              <button
                onClick={() => setActiveTab("host-lobby")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold
                  bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-colors whitespace-nowrap"
              >
                <Crown className="w-3 h-3 shrink-0" /> Host
              </button>
            )}
          </div>

          {/* Utility icon buttons */}
          <div className="flex items-center shrink-0">
            <button
              onClick={toggleDarkMode}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={toggleAudio}
              title={soundEnabled ? "Mute" : "Unmute"}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center
                hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4 text-slate-600" /> : <Menu className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════ ROW 2 — Nav tabs (desktop only) ═══════════ */}
      <div className="hidden md:block bg-slate-50/80 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-5">
          <nav className="flex items-center h-9 gap-0.5 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium
                    whitespace-nowrap transition-all duration-150 group shrink-0
                    ${active
                      ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-semibold shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800/50"
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-sky-500" : "text-slate-400 group-hover:text-slate-500"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1 py-0.5 rounded-full text-[8px] font-bold leading-none
                      ${item.badge === "New"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      }`}>
                      {item.badge}
                    </span>
                  )}
                  {(item.count ?? 0) > 0 && (
                    <span className="px-1 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded-full leading-none">
                      {item.count}
                    </span>
                  )}
                  {active && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-sky-500 rounded-full" />}
                </button>
              );
            })}

            {/* Join / Host pushed to far right of nav row (md-lg screens) */}
            <div className="ml-auto flex items-center gap-1 lg:hidden pl-2 shrink-0">
              <button
                onClick={() => setActiveTab("multiplayer-join")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold
                  bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                <Sparkles className="w-3 h-3" /> Join
              </button>
              {isTeacher && (
                <button
                  onClick={() => setActiveTab("host-lobby")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold
                    bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  <Crown className="w-3 h-3" /> Host
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* ═══════════ MOBILE DRAWER ═══════════ */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 py-3">

          {/* User info */}
          <div className={`flex items-center gap-2.5 mb-3 p-2.5 rounded-xl border
            ${isTeacher ? "bg-indigo-50 border-indigo-200" : "bg-emerald-50 border-emerald-200"}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 shrink-0
              ${isTeacher ? "bg-indigo-100 text-indigo-700 border-indigo-300" : "bg-emerald-100 text-emerald-700 border-emerald-300"}`}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</div>
              <div className={`text-xs font-semibold capitalize ${isTeacher ? "text-indigo-500" : "text-emerald-500"}`}>
                {currentUser.role} view
              </div>
            </div>
          </div>

          {/* Nav grid 2-col */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors
                    ${active
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Multiplayer */}
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab("multiplayer-join"); setMobileOpen(false); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold
                bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Join Game
            </button>
            {isTeacher && (
              <button
                onClick={() => { setActiveTab("host-lobby"); setMobileOpen(false); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold
                  bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-colors"
              >
                <Crown className="w-4 h-4" /> Host Class
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ TEACHER AUTHENTICATION MODAL ═══════════ */}
      {showTeacherAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTeacherAuthModal(false);
              setAuthError("");
            }
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    Teacher Verification
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-full">
                      Protected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter credentials to switch to Teacher View
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTeacherAuthModal(false);
                  setAuthError("");
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleTeacherAuthSubmit} className="p-6 space-y-4">
              {authError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <div>
                    <div className="font-semibold">Access Denied</div>
                    <div>{authError}</div>
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Teacher Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                    placeholder="Enter teacher username"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Teacher Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                    placeholder="Enter teacher password"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeacherAuthModal(false);
                    setAuthError("");
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login as Teacher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
