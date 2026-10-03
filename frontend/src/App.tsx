import React from 'react';
import { EduPlayProvider, useEduPlay } from './context/EduPlayContext';
import { Navbar } from './components/common/Navbar';
import { HomeView } from './components/home/HomeView';
import { GamesCatalogView } from './components/games/GamesCatalogView';
import { GameLauncher } from './components/games/GameLauncher';
import { QuestionSetsView } from './components/question-sets/QuestionSetsView';
import { SetEditorView } from './components/question-sets/SetEditorView';
import { TeacherToolsView } from './components/teacher-tools/TeacherToolsView';
import { AssignmentsView } from './components/assignments/AssignmentsView';
import { ProgressView } from './components/dashboard/ProgressView';
import { RewardsView } from './components/rewards/RewardsView';
import { ProUpgradeView } from './components/pro-upgrade/ProUpgradeView';
import { MultiplayerLobby } from './components/multiplayer/MultiplayerLobby';
import { HostLobbyView } from './components/multiplayer/HostLobbyView';
import { CodingQuizView } from './components/coding-quiz/CodingQuizView';
import { SchoolRecordsView } from './components/school-records/SchoolRecordsView';
import { Gamepad2, Sparkles, Heart, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    selectedGame,
    selectedSet,
    activeAssignment,
    setActiveTab,
    setMultiplayerCode,
    gamesCatalog,
  } = useEduPlay();

  // If in game play view, render full-screen game launcher
  if (activeTab === 'game-play' && selectedGame && selectedSet) {
    return (
      <GameLauncher
        game={selectedGame}
        questionSet={selectedSet}
        assignment={activeAssignment}
        onExit={() => {
          setMultiplayerCode(null);
          setActiveTab('games');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50/60 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-2">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'games' && <GamesCatalogView />}
        {activeTab === 'sets' && <QuestionSetsView />}
        {activeTab === 'set-editor' && <SetEditorView />}
        {activeTab === 'teacher-tools' && <TeacherToolsView />}
        {activeTab === 'assignments' && <AssignmentsView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'rewards' && <RewardsView />}
        {activeTab === 'pro-upgrade' && <ProUpgradeView />}
        {activeTab === 'multiplayer-join' && <MultiplayerLobby />}
        {activeTab === 'host-lobby' && <HostLobbyView />}
        {activeTab === 'coding-quiz' && <CodingQuizView />}
        {activeTab === 'school-records' && <SchoolRecordsView />}
      </main>

      {/* Professional Modern Footer */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-xs">
                <Gamepad2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 tracking-tight">Quiz Game</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <p className="text-slate-500 dark:text-slate-400">
              Interactive EdTech Learning Platform • University Capstone Project
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-600 dark:text-slate-300 font-medium">
            <button onClick={() => setActiveTab('games')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {gamesCatalog.length > 0 ? `${gamesCatalog.length} Game Engines` : 'Games'}
            </button>
            <button onClick={() => setActiveTab('sets')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Question Sets
            </button>
            <button onClick={() => setActiveTab('teacher-tools')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Teacher Tools
            </button>
            <button onClick={() => setActiveTab('coding-quiz')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Programming Arena
            </button>
            <button onClick={() => setActiveTab('progress')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Analytics & Gradebook
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ad-free • Student privacy first • Real-time multiplayer enabled</span>
          </div>
          <div>
            Built with React 18, Tailwind CSS, Vite & Node.js
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <EduPlayProvider>
      <MainContent />
    </EduPlayProvider>
  );
}
