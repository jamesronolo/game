import React, { useState } from 'react';

export const AVATARS = ['🦁', '🐼', '🚀', '🦄', '🦖', '🦊', '🤖', '🦉', '🐬', '⭐', '🌟', '🎯', '🔥', '💎'];

interface AddStudentModalProps {
  onSave: (name: string, avatar: string) => void;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const valid = name.trim().length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">🧑‍🎓 Add New Student</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl font-bold leading-none cursor-pointer"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Juan dela Cruz"
              autoFocus
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          {/* Avatar picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Choose Avatar</label>
            <div className="grid grid-cols-7 gap-1.5">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    avatar === a
                      ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-110'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-3xl">{avatar}</span>
            <div>
              <div className="font-bold text-slate-800 text-sm">{name || 'Student Name'}</div>
              <div className="text-xs text-slate-400">New student • 0 stars • 0 points</div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onSave(name.trim(), avatar)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
};
