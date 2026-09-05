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
  StudentGrade,
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
  fetchGradesApi,
  createGradeApi,
  updateGradeApi,
  deleteGradeApi,
} from '../services/api';
import { GAME_IMAGE_MAP } from '../assets/gameImages';
import { toggleSound as setAudioSound, isSoundEnabled } from '../utils/soundEffects';

export const STICKER_PRICES: Record<string, number> = {
  Legendary: 2000,
  Epic: 1500,
  Rare: 1000,
  Common: 500,
};

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
  currentUser: User | null;
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
  redeemSpecificSticker: (stickerId: string) => Sticker | null;

  // Roster & Class Tools
  classStudents: ClassStudent[];
  addStudentToRoster: (student: { name: string; avatar: string }) => Promise<void>;
  updateStudentInRoster: (studentId: string, updates: { name?: string; avatar?: string }) => Promise<void>;
  deleteStudentFromRoster: (studentId: string) => Promise<void>;
  updateStudentStars: (studentId: string, delta: number) => Promise<void>;
  updateStudentPoints: (studentId: string, delta: number) => Promise<void>;

  // School Records / Grades
  grades: StudentGrade[];
  addGrade: (grade: Omit<StudentGrade, 'id' | 'createdAt'>) => Promise<void>;
  editGrade: (id: string, grade: Partial<StudentGrade>) => Promise<void>;
  removeGrade: (id: string) => Promise<void>;

  // Audio & Settings
  soundEnabled: boolean;
  toggleAudio: () => boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Pro Subscription Simulation
  isPro: boolean;
  toggleProStatus: () => void;

  // Helper actions
  launchGameWithSet: (gameSlug: GameSlug, questionSetId: string) => void;
  launchAssignment: (assignment: Assignment) => void;
}

const EduPlayContext = createContext<EduPlayContextType | undefined>(undefined);

// No hardcoded default user — derived dynamically from API
const GUEST_STUDENT: User = {
  id: 'u-student-guest',
  name: 'Student',
  email: 'student@eduplay.org',
  role: 'student',
  isPro: false,
};

const GUEST_TEACHER: User = {
  id: 'u-teacher-guest',
  name: 'Teacher',
  email: 'teacher@eduplay.org',
  role: 'teacher',
  isPro: true,
};

export const EduPlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  // Users state — default to student view until logged in
  const [usersList, setUsersList] = useState<User[]>([GUEST_STUDENT, GUEST_TEACHER]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem('eduplay_role');
    return savedRole === 'teacher' ? GUEST_TEACHER : GUEST_STUDENT;
  });
  const [isPro, setIsPro] = useState<boolean>(() => {
    const savedRole = localStorage.getItem('eduplay_role');
    return savedRole === 'teacher';
  });

  // Audio & Theme State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(isSoundEnabled());
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eduplay_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eduplay_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eduplay_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Dynamic Collections state initialized cleanly
  const [gamesCatalog, setGamesCatalog] = useState<Game[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [stickersCatalog, setStickersCatalog] = useState<Sticker[]>([]);
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [rewards, setRewards] = useState<StudentRewards>({
    studentId: '',
    points: 0,
    ticketsEarned: 0,
    unlockedStickerIds: [],
  });

  // Dynamic backend data load from API endpoints
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
        console.warn('Backend games load error:', err);
      }

      try {
        const sets = await fetchQuestionSets();
        if (sets && sets.length > 0) {
          setQuestionSets(sets);
        }
      } catch (err) {
        console.warn('Backend question sets load error:', err);
      }

      try {
        const asgs = await fetchAssignments();
        if (asgs && asgs.length > 0) {
          setAssignments(asgs);
        }
      } catch (err) {
        console.warn('Backend assignments load error:', err);
      }

      try {
        const atts = await fetchAttempts();
        if (atts && atts.length > 0) {
          setAttempts(atts);
        }
      } catch (err) {
        console.warn('Backend attempts load error:', err);
      }

      try {
        const stickers = await fetchStickersCatalog();
        if (stickers && stickers.length > 0) {
          setStickersCatalog(stickers);
        }
      } catch (err) {
        console.warn('Backend stickers load error:', err);
      }

      try {
        const roster = await fetchClassRoster();
        if (roster && roster.length > 0) {
          setClassStudents(roster);
        }
      } catch (err) {
        console.warn('Backend roster load error:', err);
      }

      try {
        const rws = await fetchStudentRewards(currentUser.id);
        if (rws) {
          setRewards(rws);
        }
      } catch (_err) {
        // Rewards will be dynamically initialized upon gameplay/save
      }

      try {
        const allGrades = await fetchGradesApi();
        setGrades(allGrades);
      } catch (err) {
        console.warn('Backend grades load error:', err);
      }
    }

    loadBackendData();
  }, []);

  // Role switching — teacher and student only
  const switchRole = (role: UserRole) => {
    const targetUser = usersList.find((u) => u.role === role) || {
      id: `u-${role}-guest`,
      name: role === 'teacher' ? 'Teacher' : 'Student',
      email: `${role}@eduplay.org`,
      role: role,
      isPro: role === 'teacher',
    };
    setCurrentUser(targetUser);
    setIsPro(targetUser.isPro);
    localStorage.setItem('eduplay_role', role);
    if (role === 'student' && ['school-records', 'assignments', 'teacher-tools'].includes(activeTab)) {
      setActiveTab('games');
    }
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
    if (rewards.ticketsEarned < 500) return null;

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

    const price = STICKER_PRICES[stickerToUnlock.rarity] || 500;
    if (rewards.ticketsEarned < price) return null;

    const updatedUnlocked = [...rewards.unlockedStickerIds, stickerToUnlock.id];
    const updatedRewards: StudentRewards = {
      ...rewards,
      ticketsEarned: rewards.ticketsEarned - price,
      unlockedStickerIds: updatedUnlocked,
    };

    setRewards(updatedRewards);
    updateStudentRewardsApi(rewards.studentId, updatedRewards).catch((err) =>
      console.warn('Failed to update rewards on backend:', err)
    );

    return stickerToUnlock;
  };

  const redeemSpecificSticker = (stickerId: string): Sticker | null => {
    const sticker = stickersCatalog.find((s) => s.id === stickerId);
    if (!sticker) return null;

    const price = STICKER_PRICES[sticker.rarity] || 500;
    if (rewards.ticketsEarned < price) return null;

    const updatedUnlocked = [...rewards.unlockedStickerIds, sticker.id];
    const updatedRewards: StudentRewards = {
      ...rewards,
      ticketsEarned: rewards.ticketsEarned - price,
      unlockedStickerIds: updatedUnlocked,
    };

    setRewards(updatedRewards);
    updateStudentRewardsApi(rewards.studentId, updatedRewards).catch((err) =>
      console.warn('Failed to update rewards on backend:', err)
    );

    return sticker;
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

  // Grade Record Actions
  const addGrade = async (gradeData: Omit<StudentGrade, 'id' | 'createdAt'>) => {
    try {
      const result = await createGradeApi(gradeData);
      const newGrade: StudentGrade = {
        ...gradeData,
        id: result.id,
        createdAt: result.createdAt,
      };
      setGrades((prev) => [newGrade, ...prev]);
    } catch (err) {
      console.warn('Failed to add grade record:', err);
      // Optimistic fallback
      const fallback: StudentGrade = {
        ...gradeData,
        id: `gr-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setGrades((prev) => [fallback, ...prev]);
    }
  };

  const editGrade = async (id: string, updates: Partial<StudentGrade>) => {
    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    try {
      await updateGradeApi(id, updates);
    } catch (err) {
      console.warn('Failed to update grade record:', err);
    }
  };

  const removeGrade = async (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
    try {
      await deleteGradeApi(id);
    } catch (err) {
      console.warn('Failed to delete grade record:', err);
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
        redeemSpecificSticker,
        classStudents,
        addStudentToRoster,
        updateStudentInRoster,
        deleteStudentFromRoster,
        updateStudentStars,
        updateStudentPoints,
        grades,
        addGrade,
        editGrade,
        removeGrade,
        soundEnabled,
        toggleAudio,
        darkMode,
        toggleDarkMode,
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
