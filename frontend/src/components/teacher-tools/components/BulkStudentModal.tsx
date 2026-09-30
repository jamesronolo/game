import React, { useState } from 'react';
import { ListPlus, X } from 'lucide-react';

interface BulkStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (names: string[]) => void;
}

export const BulkStudentModal: React.FC<BulkStudentModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [bulkInputText, setBulkInputText] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    const names = bulkInputText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return;

    onImport(names);
    setBulkInputText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-2 border-slate-200 max-w-lg w-full p-6 sm:p-8 text-left space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ListPlus className="w-6 h-6 text-emerald-600" />
              <span>Bulk Add Students</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste a list of names separated by newlines or commas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <textarea
          rows={6}
          value={bulkInputText}
          onChange={(e) => setBulkInputText(e.target.value)}
          placeholder={'Emma Watson\nLiam Johnson\nSophia Miller\nNoah Davis\nOlivia Martinez'}
          className="w-full rounded-2xl border-2 border-slate-300 p-4 text-sm font-semibold focus:outline-none focus:border-emerald-500"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!bulkInputText.trim()}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            Import All Names
          </button>
        </div>
      </div>
    </div>
  );
};
