import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  QuestionSet,
  Game,
  Assignment,
  Attempt,
  ActiveTab,
  Sticker,
  StudentRewards,
  ClassStudent,
  GameSlug,
} from '../types';
import {
  fetchUsers,
  updateUserProfile,
  fetchGamesCatalog,
  fetchQuestionSets,
  saveQuestionSetApi,
  deleteQuestionSetApi,
  fetchAssignments,
  createAssignmentApi,
  fetchAttempts,
  recordAttemptApi,
  fetchStickersCatalog,
  fetchClassRoster,
  addStudentToRosterApi,
  updateStudentInRosterApi,
  deleteStudentFromRosterApi,
  deleteAssignmentApi,
  fetchStudentRewards,
  updateStudentRewardsApi,
} from '../services/api';
import {
  GAMES_CATALOG,
  MOCK_QUESTION_SETS,
  MOCK_ASSIGNMENTS,
  MOCK_ATTEMPTS,
  MOCK_STICKERS,
  MOCK_ROSTER,
  GAME_IMAGE_MAP,
} from '../data/mockData';
import { toggleSound as setAudioSound, isSoundEnabled } from '../utils/soundEffects';

interface EduPlayContextType {
  // Navigation & View
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  selectedSet: QuestionSet | null;
  setSelectedSet: (set: QuestionSet | null) => void;
  activeAssignment: Assignment | null;
  setActiveAssignment: (asg: Assignment | null) => void;
  editingSetId: string | null;
  setEditingSetId: (id: string | null) => void;

  // User & Role State
  currentUser: User;
  setCurrentUser: (user: User) => void;
  usersList: User[];
  switchRole: (role: UserRole) => void;

  // Data Collections
  questionSets: QuestionSet[];
  saveQuestionSet: (set: QuestionSet) => Promise<void>;
  deleteQuestionSet: (id: string) => Promise<void>;
  cloneQuestionSet: (set: QuestionSet) => Promise<void>;

  gamesCatalog: Game[];

  assignments: Assignment[];
  createAssignment: (asg: Omit<Assignment, 'id' | 'createdAt' | 'joinCode' | 'teacherName'>) => Promise<Assignment>;
  deleteAssignment: (id: string) => Promise<void>;

  attempts: Attempt[];
  recordAttempt: (attempt: Omit<Attempt, 'id' | 'completedAt'>) => Promise<void>;

  // Rewards & Album
  rewards: StudentRewards;
  stickersCatalog: Sticker[];
  redeemTicketForSticker: () => Sticker | null;

  // Roster & Class Tools
  classStudents: ClassStudent[];
  addStudentToRoster: (student: { name: string; avatar: string }) => Promise<void>;
  updateStudentInRoster: (studentId: string, updates: { name?: string; avatar?: string }) => Promise<void>;
  deleteStudentFromRoster: (studentId: string) => Promise<void>;
  updateStudentStars: (studentId: string, delta: number) => Promise<void>;
  updateStudentPoints: (studentId: string, delta: number) => Promise<void>;

  // Audio & Settings
  soundEnabled: boolean;
  toggleAudio: () => boolean;

  // Pro Subscription Simulation
  isPro: boolean;
  toggleProStatus: () => void;

  // Helper actions
  launchGameWithSet: (gameSlug: GameSlug, questionSetId: string) => void;
  launchAssignment: (assignment: Assignment) => void;
}

const EduPlayContext = createContext<EduPlayContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'u-teacher-1',
  name: 'Mrs. Sarah Davis',
  email: 'davis@elementary.edu',
  role: 'teacher',
  isPro: true,
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  className: 'Grade 3 - Room 2B',
};

export const EduPlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  // Users state
  const [usersList, setUsersList] = useState<User[]>([DEFAULT_USER]);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [isPro, setIsPro] = useState<boolean>(currentUser.isPro);

  // Audio State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(isSoundEnabled());

  // Collections state initialized with rich mock data defaults
  const [gamesCatalog, setGamesCatalog] = useState<Game[]>(GAMES_CATALOG);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(MOCK_QUESTION_SETS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [attempts, setAttempts] = useState<Attempt[]>(MOCK_ATTEMPTS);
  const [stickersCatalog, setStickersCatalog] = useState<Sticker[]>(MOCK_STICKERS);
  const [classStudents, setClassStudents] = useState<ClassStudent[]>(MOCK_ROSTER);
  const [rewards, setRewards] = useState<StudentRewards>({
    studentId: 'u-student-1',
    points: 450,
    ticketsEarned: 2,
    unlockedStickerIds: ['stk-1', 'stk-2'],
  });

  // Initial backend data load
  useEffect(() => {
    async function loadBackendData() {
      try {
        const users = await fetchUsers();
        if (users && users.length > 0) {
          setUsersList(users);
          setCurrentUser(users[0]);
          setIsPro(users[0].isPro);
        }
      } catch (err) {
        console.warn('Backend users load error:', err);
      }

      try {
        const games = await fetchGamesCatalog();
        if (games && games.length > 0) {
          setGamesCatalog(
            games.map((g) => ({
              ...g,
              imageUrl: GAME_IMAGE_MAP[g.slug] || g.imageUrl,
            }))
          );
        }
      } catch (err) {
        console.warn('Backend games load error (using mock fallback):', err);
      }

      try {
        const sets = await fetchQuestionSets();
        if (sets && sets.length > 0) {
          // Merge backend sets with MOCK_QUESTION_SETS: if a backend set has no questions,
          // use the questions from the matching mock set as a fallback
          const merged = sets.map((backendSet) => {
            const mockMatch = MOCK_QUESTION_SETS.find((m) => m.id === backendSet.id);
            if (mockMatch && mockMatch.questions.length > (backendSet.questions?.length || 0)) {
              return { ...backendSet, questions: mockMatch.questions };
            }
            const hasQuestions = Array.isArray(backendSet.questions) && backendSet.questions.length > 0;
            if (hasQuestions) return backendSet;
            return mockMatch ? { ...backendSet, questions: mockMatch.questions } : backendSet;
          });
          // Also include any mock sets not yet in the backend (qs-6, qs-7, qs-8 may not be seeded yet)
          MOCK_QUESTION_SETS.forEach((mockSet) => {
            if (!merged.find((s) => s.id === mockSet.id)) merged.push(mockSet);
          });
          setQuestionSets(merged);
        }
      } catch (err) {
        console.warn('Backend question sets load error (using mock fallback):', err);
      }

      try {
        const asgs = await fetchAssignments();
        if (asgs && asgs.length > 0) setAssignments(asgs);
      } catch (err) {
        console.warn('Backend assignments load error (using mock fallback):', err);
      }

      try {
        const atts = await fetchAttempts();
        if (atts && atts.length > 0) setAttempts(atts);
      } catch (err) {
        console.warn('Backend attempts load error (using mock fallback):', err);
      }

      try {
        const stickers = await fetchStickersCatalog();
        if (stickers && stickers.length > 0) setStickersCatalog(stickers);
      } catch (err) {
        console.warn('Backend stickers load error (using mock fallback):', err);
      }

      try {
        const roster = await fetchClassRoster();
        if (roster && roster.length > 0) setClassStudents(roster);
      } catch (err) {
        console.warn('Backend roster load error (using mock fallback):', err);
      }

      try {
        const rws = await fetchStudentRewards('u-student-1');
        if (rws) setRewards(rws);
      } catch (_err) {
        // Rewards row may not exist yet in DB — silently use mock default
      }
    }

    loadBackendData();
  }, []);

  // Role switching
  const switchRole = (role: UserRole) => {
    const targetUser = usersList.find((u) => u.role === role) || {
      id: `u-${role}-guest`,
      name: role === 'teacher' ? 'Teacher Guest' : role === 'student' ? 'Student Guest' : 'Parent Guest',
      email: `${role}@eduplay.org`,
      role: role,
      isPro: role === 'teacher',
    };
    setCurrentUser(targetUser);
    setIsPro(targetUser.isPro);
  };

  const toggleProStatus = async () => {
    const updated = !isPro;
    setIsPro(updated);
    setCurrentUser((prev) => ({ ...prev, isPro: updated }));
    try {
      await updateUserProfile(currentUser.id, { isPro: updated });
    } catch (err) {
      console.warn('Failed to save pro status:', err);
    }
  };

  const toggleAudio = () => {
    const nextState = setAudioSound();
    setSoundEnabled(nextState);
    return nextState;
  };

  // Question Set Actions
  const saveQuestionSet = async (set: QuestionSet) => {
    setQuestionSets((prev) => {
      const idx = prev.findIndex((s) => s.id === set.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = set;
        return updated;
      }
      return [set, ...prev];
    });

    try {
      await saveQuestionSetApi(set);
    } catch (err) {
      console.warn('Failed to persist question set to backend:', err);
    }
  };

  const deleteQuestionSet = async (id: string) => {
    setQuestionSets((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteQuestionSetApi(id);
    } catch (err) {
      console.warn('Failed to delete question set on backend:', err);
    }
  };

  const cloneQuestionSet = async (set: QuestionSet) => {
    const cloned: QuestionSet = {
      ...set,
      id: `qs-${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: `${currentUser.name} (My Copy)`,
      title: `${set.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveQuestionSet(cloned);
    setSelectedSet(cloned);
    setEditingSetId(cloned.id);
    setActiveTab('set-editor');
  };

  // Assignment Actions
  const createAssignment = async (
    asgData: Omit<Assignment, 'id' | 'createdAt' | 'joinCode' | 'teacherName'>
  ): Promise<Assignment> => {
    const tempCode = `EDU-${Math.floor(1000 + Math.random() * 9000)}`;
    const tempAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      teacherName: currentUser.name,
      joinCode: tempCode,
      createdAt: new Date().toISOString(),
    };

    setAssignments((prev) => [tempAsg, ...prev]);

    try {
      const created = await createAssignmentApi({
        ...asgData,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
      });
      setAssignments((prev) => prev.map((a) => (a.id === tempAsg.id ? created : a)));
      return created;
    } catch (err) {
      console.warn('Failed to persist assignment to backend:', err);
      return tempAsg;
    }
  };

  const deleteAssignment = async (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteAssignmentApi(id);
    } catch (err) {
      console.warn('Failed to delete assignment on backend:', err);
    }
  };

  // Attempt Actions
  const recordAttempt = async (attemptData: Omit<Attempt, 'id' | 'completedAt'>) => {
    const tempAttempt: Attempt = {
      ...attemptData,
      id: `att-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setAttempts((prev) => [tempAttempt, ...prev]);

    // Update local rewards
    if (attemptData.score > 0) {
      setRewards((prev) => {
        const newPoints = prev.points + attemptData.score;
        const newTickets = Math.floor(newPoints / 250);
        return {
          ...prev,
          points: newPoints,
          ticketsEarned: newTickets,
        };
      });
    }

    try {
      await recordAttemptApi(attemptData);
    } catch (err) {
      console.warn('Failed to persist attempt to backend:', err);
    }
  };

  // Rewards Actions
  const redeemTicketForSticker = (): Sticker | null => {
    if (rewards.ticketsEarned <= 0) return null;

    const lockedStickers = stickersCatalog.filter(
      (s) => !rewards.unlockedStickerIds.includes(s.id)
    );

    let stickerToUnlock: Sticker;
    if (lockedStickers.length > 0) {
      stickerToUnlock = lockedStickers[Math.floor(Math.random() * lockedStickers.length)];
    } else if (stickersCatalog.length > 0) {
      stickerToUnlock = stickersCatalog[Math.floor(Math.random() * stickersCatalog.length)];
    } else {
      return null;
    }

    const updatedUnlocked = Array.from(new Set([...rewards.unlockedStickerIds, stickerToUnlock.id]));
    const updatedRewards: StudentRewards = {
      ...rewards,
      ticketsEarned: Math.max(0, rewards.ticketsEarned - 1),
      unlockedStickerIds: updatedUnlocked,
    };

    setRewards(updatedRewards);
    updateStudentRewardsApi(rewards.studentId, updatedRewards).catch((err) =>
      console.warn('Failed to update rewards on backend:', err)
    );

    return stickerToUnlock;
  };

  // Roster Actions
  const addStudentToRoster = async (student: { name: string; avatar: string }) => {
    const trimmedName = student.name.trim();
    if (!trimmedName) return;

    try {
      const created = await addStudentToRosterApi({
        name: trimmedName,
        avatar: student.avatar.trim() || '🧑',
      });
      setClassStudents((prev) => [created, ...prev]);
    } catch (err) {
      console.warn('Failed to add student to backend roster:', err);
    }
  };

  const updateStudentInRoster = async (
    studentId: string,
    updates: { name?: string; avatar?: string }
  ) => {
    setClassStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        return {
          ...student,
          name: updates.name?.trim() || student.name,
          avatar: updates.avatar?.trim() || student.avatar,
        };
      })
    );

    try {
      await updateStudentInRosterApi(studentId, updates);
    } catch (err) {
      console.warn('Failed to update student on backend:', err);
    }
  };

  const deleteStudentFromRoster = async (studentId: string) => {
    setClassStudents((prev) => prev.filter((s) => s.id !== studentId));
    try {
      await deleteStudentFromRosterApi(studentId);
    } catch (err) {
      console.warn('Failed to delete student from backend roster:', err);
    }
  };

  const updateStudentStars = async (studentId: string, delta: number) => {
    let newStars = 0;
    setClassStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          newStars = Math.max(0, s.stars + delta);
          return { ...s, stars: newStars };
        }
        return s;
      })
    );

    try {
      await updateStudentInRosterApi(studentId, { stars: newStars });
    } catch (err) {
      console.warn('Failed to update student stars on backend:', err);
    }
  };

  const updateStudentPoints = async (studentId: string, delta: number) => {
    let newPoints = 0;
    setClassStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          newPoints = Math.max(0, s.points + delta);
          return { ...s, points: newPoints };
        }
        return s;
      })
    );

    try {
      await updateStudentInRosterApi(studentId, { points: newPoints });
    } catch (err) {
      console.warn('Failed to update student points on backend:', err);
    }
  };

  const launchGameWithSet = (gameSlug: GameSlug, questionSetId: string) => {
    if (!gamesCatalog || gamesCatalog.length === 0) return;
    if (!questionSets || questionSets.length === 0) return;
    const game = gamesCatalog.find((g) => g.slug === gameSlug) || gamesCatalog[0];
    const set = questionSets.find((s) => s.id === questionSetId) || questionSets[0];
    if (!game || !set) return;
    setSelectedGame(game);
    setSelectedSet(set);
    setActiveAssignment(null);
    setActiveTab('game-play');
  };

  const launchAssignment = (assignment: Assignment) => {
    if (!gamesCatalog || gamesCatalog.length === 0) return;
    if (!questionSets || questionSets.length === 0) return;
    const game = gamesCatalog.find((g) => g.slug === assignment.gameSlug) || gamesCatalog[0];
    const set = questionSets.find((s) => s.id === assignment.questionSetId) || questionSets[0];
    if (!game || !set) return;
    setSelectedGame(game);
    setSelectedSet(set);
    setActiveAssignment(assignment);
    setActiveTab('game-play');
  };

  return (
    <EduPlayContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedGame,
        setSelectedGame,
        selectedSet,
        setSelectedSet,
        activeAssignment,
        setActiveAssignment,
        editingSetId,
        setEditingSetId,
        currentUser,
        setCurrentUser,
        usersList,
        switchRole,
        questionSets,
        saveQuestionSet,
        deleteQuestionSet,
        cloneQuestionSet,
        gamesCatalog,
        assignments,
        createAssignment,
        deleteAssignment,
        attempts,
        recordAttempt,
        rewards,
        stickersCatalog,
        redeemTicketForSticker,
        classStudents,
        addStudentToRoster,
        updateStudentInRoster,
        deleteStudentFromRoster,
        updateStudentStars,
        updateStudentPoints,
        soundEnabled,
        toggleAudio,
        isPro,
        toggleProStatus,
        launchGameWithSet,
        launchAssignment,
      }}
    >
      {children}
    </EduPlayContext.Provider>
  );
};

export function useEduPlay() {
  const context = useContext(EduPlayContext);
  if (!context) {
    throw new Error('useEduPlay must be used within an EduPlayProvider');
  }
  return context;
}
