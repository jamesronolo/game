export type TeacherToolTab =
  | 'wheel'
  | 'stars'
  | 'grouper'
  | 'dice'
  | 'race'
  | 'noise'
  | 'timer';

export const WHEEL_PALETTES = {
  vibrant: [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4',
    '#f97316', '#14b8a6', '#e11d48', '#6366f1', '#84cc16', '#d946ef',
    '#0284c7', '#16a34a', '#ea580c', '#9333ea', '#0d9488', '#eab308',
    '#db2777', '#2563eb', '#059669', '#c026d3', '#4f46e5', '#ca8a04',
  ],
  candy: [
    '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff9f1c', '#2ec4b6', '#a78bfa',
    '#f472b6', '#38bdf8', '#4ade80', '#fbbf24', '#fb7185', '#c084fc',
    '#818cf8', '#34d399', '#f87171', '#60a5fa', '#f43f5e', '#a855f7',
  ],
  neon: [
    '#00f5d4', '#7b2cbf', '#fee440', '#f72585', '#4cc9f0', '#7209b7',
    '#3a0ca3', '#4361ee', '#4895ef', '#06d6a0', '#b5179e', '#118ab2',
    '#00b4d8', '#ff007f', '#70e000', '#38b000', '#9d4edd', '#0077b6',
  ],
  sunset: [
    '#f72585', '#b5179e', '#7209b7', '#3f37c9', '#4895ef', '#4cc9f0',
    '#f39c12', '#d35400', '#c0392b', '#e74c3c', '#9b59b6', '#8e44ad',
    '#ff7b00', '#ff8800', '#ff9500', '#ffa200', '#ffaa00', '#ffb700',
  ],
};
