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

const MainContent: React.FC = () => {
  const {
    activeTab,
    selectedGame,
    selectedSet,
    activeAssignment,
    setActiveTab,
  } = useEduPlay();

  // If in game play view, render full-screen game launcher
  if (activeTab === 'game-play' && selectedGame && selectedSet) {
    return (
      <GameLauncher
        game={selectedGame}
        questionSet={selectedSet}
        assignment={activeAssignment}
        onExit={() => setActiveTab('games')}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full px-2 sm:px-4 lg:px-6 xl:px-8">
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
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-6 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Quiz Game</span>
            <span>• University Capstone EdTech Project (Inspired by Academoo)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <button onClick={() => setActiveTab('teacher-tools')} className="hover:underline">
              Free Teacher Tools
            </button>
            <button onClick={() => setActiveTab('games')} className="hover:underline">
              8 Games Catalog
            </button>
            <button onClick={() => setActiveTab('pro-upgrade')} className="hover:underline">
              Pro Pass Model
            </button>
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
