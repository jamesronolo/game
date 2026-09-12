import React, { useState } from 'react';

export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'Social Studies',
  'Filipino',
  'MAPEH',
  'TLE/ICT',
  'Values Education',
  'Programming',
  'Other',
];

export const TERMS = [
  '1st Quarter',
  '2nd Quarter',
  '3rd Quarter',
  '4th Quarter',
];

export const GRADE_VALUES = [
  'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F',
  '98', '95', '92', '90', '88', '85', '82', '80', '78', '75', '70', '65', '60',
];

export interface GradeFormData {
  studentId: string;
  studentName: string;
  subject: string;
  gradeValue: string;
  term: string;
  notes: string;
}

export const emptyGradeForm = (): GradeFormData => ({
  studentId: '',
  studentName: '',
  subject: SUBJECTS[0],
  gradeValue: 'A',
  term: TERMS[0],
  notes: '',
});

interface GradeModalProps {
  mode: 'add' | 'edit';
  initial: GradeFormData;
  studentList: { id: string; name: string }[];
  recordedBy: string;
  onSave: (data: GradeFormData) => void;
  onClose: () => void;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  mode,
  initial,
  studentList,
  recordedBy,
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState<GradeFormData>(initial);
  const set = (k: keyof GradeFormData, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const handleStudent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = studentList.find((st) => st.id === e.target.value);
    setForm((f) => ({ ...f, studentId: e.target.value, studentName: s?.name ?? "" }));
  };
  const valid = form.studentId && form.subject && form.gradeValue && form.term;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">
              {mode === 'add' ? '➕ Add Grade Record' : '✏️ Edit Grade Record'}
            </h2>
            <p className="text-indigo-200 text-sm mt-0.5">Recorded by: {recordedBy}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl font-bold leading-none transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-4 overflow-y-auto bg-white">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Student *</label>
            <select
              value={form.studentId}
              onChange={handleStudent}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Select Student --</option>
              {studentList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subject *</label>
              <select
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Grade *</label>
              <select
                value={form.gradeValue}
                onChange={(e) => set('gradeValue', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {GRADE_VALUES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Term *</label>
            <div className="grid grid-cols-2 gap-2">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('term', t)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                    form.term === t
                      ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              placeholder="Any remarks or observations..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 flex gap-3 justify-end bg-white border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onSave(form)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {mode === 'add' ? 'Add Record' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
