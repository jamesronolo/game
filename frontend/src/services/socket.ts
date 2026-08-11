import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function createLobby(
  gameSlug: string,
  questionSetId: string,
  hostName: string,
  callback: (res: { success: boolean; code?: string; room?: any; error?: string }) => void
) {
  const s = getSocket();
  s.emit('create_lobby', { gameSlug, questionSetId, hostName }, callback);
}

export function joinLobby(
  code: string,
  playerName: string,
  avatar: string,
  callback: (res: { success: boolean; code?: string; room?: any; error?: string }) => void
) {
  const s = getSocket();
  s.emit('join_lobby', { code, playerName, avatar }, callback);
}

export function startGame(code: string) {
  const s = getSocket();
  s.emit('start_game', { code });
}

export function updateScore(code: string, scoreDelta: number) {
  const s = getSocket();
  s.emit('update_score', { code, scoreDelta });
}

export function subscribeToLobbyUpdates(callback: (data: { room: any }) => void) {
  const s = getSocket();
  s.on('lobby_updated', callback);
  return () => {
    s.off('lobby_updated', callback);
  };
}

export function subscribeToGameStart(callback: (data: { room: any }) => void) {
  const s = getSocket();
  s.on('game_started', callback);
  return () => {
    s.off('game_started', callback);
  };
}
