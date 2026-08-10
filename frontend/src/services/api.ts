import { User, Game, QuestionSet, Assignment, Attempt, Sticker, ClassStudent, StudentRewards } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }

  return res.json();
}

// Users
export async function fetchUsers(): Promise<User[]> {
  return fetchJson<User[]>('/users');
}

export async function updateUserProfile(id: string, updates: Partial<User>): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// Games Catalog
export async function fetchGamesCatalog(): Promise<Game[]> {
  return fetchJson<Game[]>('/games');
}

// Question Sets
export async function fetchQuestionSets(): Promise<QuestionSet[]> {
  return fetchJson<QuestionSet[]>('/question-sets');
}

export async function saveQuestionSetApi(set: QuestionSet): Promise<{ success: boolean; id: string }> {
  return fetchJson<{ success: boolean; id: string }>('/question-sets', {
    method: 'POST',
    body: JSON.stringify(set),
  });
}

export async function deleteQuestionSetApi(id: string): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`/question-sets/${id}`, {
    method: 'DELETE',
  });
}

// Assignments
export async function fetchAssignments(): Promise<Assignment[]> {
  return fetchJson<Assignment[]>('/assignments');
}

export async function createAssignmentApi(
  asgData: Omit<Assignment, 'id' | 'createdAt' | 'joinCode' | 'teacherName'> & { teacherName?: string }
): Promise<Assignment> {
  return fetchJson<Assignment>('/assignments', {
    method: 'POST',
    body: JSON.stringify(asgData),
  });
}

export async function deleteAssignmentApi(id: string): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`/assignments/${id}`, {
    method: 'DELETE',
  });
}

// Attempts
export async function fetchAttempts(): Promise<Attempt[]> {
  return fetchJson<Attempt[]>('/attempts');
}

export async function recordAttemptApi(attemptData: Omit<Attempt, 'id' | 'completedAt'>): Promise<{ success: boolean; id: string; completedAt: string }> {
  return fetchJson<{ success: boolean; id: string; completedAt: string }>('/attempts', {
    method: 'POST',
    body: JSON.stringify(attemptData),
  });
}

// Stickers
export async function fetchStickersCatalog(): Promise<Sticker[]> {
  return fetchJson<Sticker[]>('/stickers');
}

// Class Roster
export async function fetchClassRoster(): Promise<ClassStudent[]> {
  return fetchJson<ClassStudent[]>('/roster');
}

export async function addStudentToRosterApi(student: { name: string; avatar: string }): Promise<ClassStudent> {
  return fetchJson<ClassStudent>('/roster', {
    method: 'POST',
    body: JSON.stringify(student),
  });
}

export async function updateStudentInRosterApi(
  studentId: string,
  updates: { name?: string; avatar?: string; stars?: number; points?: number }
): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`/roster/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteStudentFromRosterApi(studentId: string): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`/roster/${studentId}`, {
    method: 'DELETE',
  });
}


// Student Rewards
export async function fetchStudentRewards(studentId: string): Promise<StudentRewards> {
  return fetchJson<StudentRewards>(`/rewards/${studentId}`);
}

export async function updateStudentRewardsApi(studentId: string, rewards: Partial<StudentRewards>): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`/rewards/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(rewards),
  });
}

// AI Question Set Generator
export async function generateAiQuestionSet(payload: { topic: string; gradeLevel?: string; count?: number; subject?: string }) {
  return fetchJson<{ success: boolean; data: any }>('/ai/generate-set', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
