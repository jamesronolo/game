export type UserRole = 'teacher' | 'student' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPro: boolean;
  avatarUrl?: string;
  className?: string;
}

export type QuestionType = 'text' | 'multiple_choice' | 'image' | 'audio';

export interface Question {
  id: string;
  setId: string;
  promptText: string;
  imageUrl?: string;
  audioUrl?: string;
  answer: string;
  options?: string[]; // For multiple choice
  type: QuestionType;
  position: number;
  hint?: string;
}

export interface QuestionSet {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description?: string;
  subject: string;
  gradeLevel: string;
  isPublic: boolean;
  tags: string[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export type GameSlug = 
  | 'wheel-spin'
  | 'ship-battle'
  | 'alien-spelling'
  | 'crane-game'
  | 'magic-potions'
  | 'flashcards'
  | 'roll-and-read'
  | 'ocean-quest';

export interface Game {
  id: string;
  name: string;
  slug: GameSlug;
  description: string;
  mechanic: string;
  badge: string;
  category: 'arcade' | 'quiz' | 'slp' | 'puzzle';
  minGrade?: string;
  iconName: string;
  gradientBg: string;
  accentColor: string;
  imageUrl?: string;
  isProOnly?: boolean;
}

export interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  questionSetId: string;
  questionSetTitle: string;
  gameSlug: GameSlug;
  gameName: string;
  joinCode: string;
  dueDate?: string;
  rewardsEnabled: boolean;
  createdAt: string;
}

export interface QuestionAttemptAnswer {
  questionId: string;
  questionPrompt: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeTakenSeconds?: number;
}

export interface Attempt {
  id: string;
  assignmentId?: string;
  studentId: string;
  studentName: string;
  questionSetId: string;
  questionSetTitle: string;
  gameSlug: GameSlug;
  score: number;
  accuracy: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
  answers: QuestionAttemptAnswer[];
}

export interface Sticker {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: string;
  emoji: string;
  description: string;
  unlockedAt?: string;
}

export interface StudentRewards {
  studentId: string;
  points: number;
  ticketsEarned: number;
  unlockedStickerIds: string[];
}

export interface ClassStudent {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  points: number;
}

export interface ClassGroup {
  id: string;
  name: string;
  color: string;
  members: string[];
}

export type ActiveTab =
  | 'home'
  | 'games'
  | 'game-play'
  | 'sets'
  | 'set-editor'
  | 'assignments'
  | 'teacher-tools'
  | 'progress'
  | 'rewards'
  | 'pro-upgrade'
  | 'multiplayer-join'
  | 'host-lobby'
  | 'coding-quiz'
  | 'school-records';

// ---- Programming Quiz ----
export interface ProgrammingQuizQuestion {
  id: string;
  number: number;
  question: string;
  options: string[]; // 4 options [A, B, C, D]
}

export interface ProgrammingQuizAnswerResult {
  questionId: string;
  number: number;
  question: string;
  selectedOption: string; // 'A' | 'B' | 'C' | 'D'
  correctOption: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
  points?: number;
}

export interface ProgrammingQuizSubmitResponse {
  success: boolean;
  id: string;
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
  graded: ProgrammingQuizAnswerResult[];
}

export interface ProgrammingQuizAttempt {
  id: string;
  studentName: string;
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
  answers: ProgrammingQuizAnswerResult[];
}

// ---- School Grade Records ----
export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  gradeValue: string; // e.g. 'A+', 'B', '95', etc.
  term: string;       // e.g. '1st Quarter', 'Semester 1'
  notes?: string;
  recordedBy: string;
  createdAt: string;
}
