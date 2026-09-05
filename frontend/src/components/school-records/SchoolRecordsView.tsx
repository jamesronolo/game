import React, { useState, useMemo } from "react";
import { useEduPlay } from "../../context/EduPlayContext";
import { StudentGrade } from "../../types";

// ---- Grade colour coding ----
const gradeColor = (v: string) => {
  const g = v.trim().toUpperCase();
  if (g.startsWith("A")) return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
  if (g.startsWith("B")) return { bg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-300" };
  if (g.startsWith("C")) return { bg: "bg-yellow-100",  text: "text-yellow-700",  border: "border-yellow-300" };
  if (g.startsWith("D")) return { bg: "bg-orange-100",  text: "text-orange-700",  border: "border-orange-300" };
  if (g === "F")          return { bg: "bg-red-100",     text: "text-red-700",     border: "border-red-300" };
  const n = parseFloat(g);
  if (!isNaN(n)) {
    if (n >= 90) return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" };
    if (n >= 80) return { bg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-300" };
    if (n >= 70) return { bg: "bg-yellow-100",  text: "text-yellow-700",  border: "border-yellow-300" };
    if (n >= 60) return { bg: "bg-orange-100",  text: "text-orange-700",  border: "border-orange-300" };
    return       { bg: "bg-red-100",     text: "text-red-700",     border: "border-red-300" };
  }
  return { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };
};

const SUBJECTS = [
  "Mathematics", "English", "Science", "Social Studies", "Filipino",
  "MAPEH", "TLE/ICT", "Values Education", "Programming", "Other",
];
const TERMS = [
  "1st Quarter",
  "2nd Quarter",
  "3rd Quarter",
  "4th Quarter",
];
const GRADE_VALUES = [
  "A+","A","A-","B+","B","B-","C+","C","C-","D","F",
  "98","95","92","90","88","85","82","80","78","75","70","65","60",
];
const AVATARS = ["🦁","🐼","🚀","🦄","🦖","🦊","🤖","🦉","🐬","⭐","🌟","🎯","🔥","💎"];

// ═══ Grade Modal ═══════════════════════════════════════════════
interface GradeFormData {
  studentId: string; studentName: string; subject: string;
  gradeValue: string; term: string; notes: string;
}
const emptyGradeForm = (): GradeFormData => ({
  studentId: "", studentName: "", subject: SUBJECTS[0],
  gradeValue: "A", term: TERMS[0], notes: "",
});

interface GradeModalProps {
  mode: "add" | "edit";
  initial: GradeFormData;
  studentList: { id: string; name: string }[];
  recordedBy: string;
  onSave: (data: GradeFormData) => void;
  onClose: () => void;
}
const GradeModal: React.FC<GradeModalProps> = ({ mode, initial, studentList, recordedBy, onSave, onClose }) => {
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
              {mode === "add" ? "➕ Add Grade Record" : "✏️ Edit Grade Record"}
            </h2>
            <p className="text-indigo-200 text-sm mt-0.5">Recorded by: {recordedBy}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-bold leading-none transition-colors">×</button>
        </div>
        {/* Scrollable body */}
        <div className="p-6 space-y-4 overflow-y-auto bg-white">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Student *</label>
            <select value={form.studentId} onChange={handleStudent}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">-- Select Student --</option>
              {studentList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subject *</label>
              <select value={form.subject} onChange={(e) => set("subject", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Grade *</label>
              <select value={form.gradeValue} onChange={(e) => set("gradeValue", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {GRADE_VALUES.map((g) => <option key={g} value={g}>{g}</option>)}
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
                  onClick={() => set("term", t)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                    ${form.term === t
                      ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Notes (optional)</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
              rows={3} placeholder="Any remarks or observations..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 pb-5 pt-3 flex gap-3 justify-end bg-white border-t border-slate-100 shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button disabled={!valid} onClick={() => onSave(form)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold
              shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            {mode === "add" ? "Add Record" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══ Add Student Modal ════════════════════════════════════════
interface AddStudentModalProps {
  onSave: (name: string, avatar: string) => void;
  onClose: () => void;
}
const AddStudentModal: React.FC<AddStudentModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const valid = name.trim().length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">🧑‍🎓 Add New Student</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-bold leading-none">×</button>
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
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${avatar === a
                      ? "bg-emerald-100 ring-2 ring-emerald-500 scale-110"
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-200"}`}
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
              <div className="font-bold text-slate-800 text-sm">{name || "Student Name"}</div>
              <div className="text-xs text-slate-400">New student • 0 stars • 0 points</div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button disabled={!valid} onClick={() => onSave(name.trim(), avatar)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold
              shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══ Stat Card ════════════════════════════════════════════════
const StatCard: React.FC<{ icon: string; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className={`rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm border ${color}`}>
    <span className="text-3xl">{icon}</span>
    <div>
      <div className="text-2xl font-extrabold leading-none">{value}</div>
      <div className="text-xs font-semibold text-slate-500 mt-1">{label}</div>
    </div>
  </div>
);

// ═══ Main View ════════════════════════════════════════════════
export const SchoolRecordsView: React.FC = () => {
  const { grades, addGrade, editGrade, removeGrade, classStudents, addStudentToRoster, currentUser } = useEduPlay();

  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<StudentGrade | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [termFilter, setTermFilter] = useState("All");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const studentList = useMemo(() => classStudents.map((s) => ({ id: s.id, name: s.name })), [classStudents]);

  const filteredStudents = useMemo(() =>
    studentList.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [studentList, search]
  );

  const visibleGrades = useMemo(() => {
    let g = selectedStudentId ? grades.filter((gr) => gr.studentId === selectedStudentId) : grades;
    if (subjectFilter !== "All") g = g.filter((gr) => gr.subject === subjectFilter);
    if (termFilter !== "All") g = g.filter((gr) => gr.term === termFilter);
    return g;
  }, [grades, selectedStudentId, subjectFilter, termFilter]);

  const totalStudentsWithRecords = useMemo(() => new Set(grades.map((g) => g.studentId)).size, [grades]);
  const avgGrade = useMemo(() => {
    const nums = grades.map((g) => parseFloat(g.gradeValue)).filter((n) => !isNaN(n));
    if (!nums.length) return "—";
    return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
  }, [grades]);

  const teacherName = currentUser?.name ?? "Teacher";

  // ── Grade actions ─────────────────────────────────────────
  const openAddGrade = () => { setEditingGrade(null); setShowGradeModal(true); };
  const openEditGrade = (gr: StudentGrade) => { setEditingGrade(gr); setShowGradeModal(true); };

  const handleGradeSave = async (form: GradeFormData) => {
    if (editingGrade) {
      await editGrade(editingGrade.id, { ...form, recordedBy: teacherName });
    } else {
      await addGrade({ ...form, recordedBy: teacherName });
    }
    setShowGradeModal(false);
    setEditingGrade(null);
  };

  const handleDelete = async (id: string) => {
    await removeGrade(id);
    setDeleteConfirmId(null);
  };

  // ── Student actions ───────────────────────────────────────
  const handleAddStudent = async (name: string, avatar: string) => {
    await addStudentToRoster({ name, avatar });
    setShowStudentModal(false);
  };

  const gradeModalInitial = editingGrade
    ? { studentId: editingGrade.studentId, studentName: editingGrade.studentName,
        subject: editingGrade.subject, gradeValue: editingGrade.gradeValue,
        term: editingGrade.term, notes: editingGrade.notes ?? "" }
    : selectedStudentId
      ? { ...emptyGradeForm(), studentId: selectedStudentId,
          studentName: studentList.find((s) => s.id === selectedStudentId)?.name ?? "" }
      : emptyGradeForm();

  // helper to build student-row classes without Tailwind conflicts
  const studentRowClass = (active: boolean) =>
    active
      ? "w-full text-left px-4 py-2.5 text-sm font-bold flex justify-between items-center bg-indigo-600 text-white"
      : "w-full text-left px-4 py-2.5 text-sm font-medium flex justify-between items-center text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors";

  const allRowClass = (active: boolean) =>
    active
      ? "w-full text-left px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white"
      : "w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-700 transition-colors";

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-5">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            🏫 School Records
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage student grade records and track academic progress.</p>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowStudentModal(true)}
            id="add-student-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600
              text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700
              transition-all active:scale-95 whitespace-nowrap"
          >
            🧑‍🎓 Add Student
          </button>
          <button
            onClick={openAddGrade}
            id="add-grade-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600
              text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700
              transition-all active:scale-95 whitespace-nowrap"
          >
            ➕ Add Grade
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon="👥" label="Total Students"      value={studentList.length}          color="bg-indigo-50 border-indigo-200 text-indigo-800" />
        <StatCard icon="📋" label="Grade Records"       value={grades.length}               color="bg-purple-50 border-purple-200 text-purple-800" />
        <StatCard icon="🎓" label="Students w/ Records" value={totalStudentsWithRecords}     color="bg-emerald-50 border-emerald-200 text-emerald-800" />
        <StatCard icon="📊" label="Avg Numeric Grade"   value={avgGrade}                    color="bg-amber-50 border-amber-200 text-amber-800" />
      </div>

      {/* ── Main Panel ─────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Sidebar */}
        <div className="w-full lg:w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Sidebar header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-700">🧑‍🎓 Students</h2>
                <button
                  onClick={() => setShowStudentModal(true)}
                  title="Add student"
                  className="w-6 h-6 rounded-full bg-emerald-500 text-white text-lg font-bold
                    flex items-center justify-center hover:bg-emerald-600 transition-colors leading-none"
                >
                  +
                </button>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            </div>

            {/* Student list */}
            <ul className="divide-y divide-slate-100 max-h-[28rem] overflow-y-auto">
              {/* All row */}
              <li>
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className={allRowClass(selectedStudentId === null)}
                >
                  All Students
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-auto
                    ${selectedStudentId === null ? "bg-white/25 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                    {grades.length}
                  </span>
                </button>
              </li>

              {filteredStudents.map((s) => {
                const count = grades.filter((g) => g.studentId === s.id).length;
                const active = selectedStudentId === s.id;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setSelectedStudentId(s.id)}
                      className={studentRowClass(active)}
                    >
                      <span className="truncate">{s.name}</span>
                      {count > 0 && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0
                          ${active ? "bg-white/25 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}

              {filteredStudents.length === 0 && (
                <li className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-400 font-medium">No students found</p>
                  <button
                    onClick={() => setShowStudentModal(true)}
                    className="mt-2 text-xs text-emerald-600 font-semibold hover:underline"
                  >
                    + Add a student
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Grade Records Table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Table header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200
              flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <h2 className="text-sm font-bold text-slate-700 flex-1 min-w-0">
                📝 Grade Records
                {selectedStudentId && (
                  <span className="ml-2 font-normal text-slate-500 truncate">
                    — {studentList.find((s) => s.id === selectedStudentId)?.name}
                  </span>
                )}
              </h2>
              <div className="flex gap-2 flex-wrap shrink-0">
                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
                  className="text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="All">All Subjects</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)}
                  className="text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="All">All Terms</option>
                  {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Empty state */}
            {visibleGrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <span className="text-5xl">📋</span>
                <p className="text-sm font-semibold">No grade records yet</p>
                <button
                  onClick={openAddGrade}
                  className="mt-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold
                    hover:bg-indigo-700 transition-colors shadow"
                >
                  ➕ Add First Record
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide">Student</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide">Subject</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-600 text-xs uppercase tracking-wide">Grade</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide">Term</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide hidden md:table-cell">Notes</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide hidden lg:table-cell">Recorded By</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleGrades.map((gr) => {
                      const gc = gradeColor(gr.gradeValue);
                      const date = gr.createdAt ? new Date(gr.createdAt).toLocaleDateString() : "—";
                      return (
                        <tr key={gr.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-4 py-3 font-semibold text-slate-800">{gr.studentName || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{gr.subject}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border
                              ${gc.bg} ${gc.text} ${gc.border}`}>
                              {gr.gradeValue}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">{gr.term}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs max-w-xs hidden md:table-cell">
                            <span className="line-clamp-2">{gr.notes || <span className="italic text-slate-300">—</span>}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{gr.recordedBy || "—"}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">{date}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => openEditGrade(gr)}
                                className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600
                                  hover:bg-blue-100 border border-blue-200 transition-colors"
                              >
                                Edit
                              </button>
                              {deleteConfirmId === gr.id ? (
                                <div className="flex gap-1 items-center">
                                  <button onClick={() => handleDelete(gr.id)}
                                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                                    Confirm
                                  </button>
                                  <button onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteConfirmId(gr.id)}
                                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-50 text-red-600
                                    hover:bg-red-100 border border-red-200 transition-colors">
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Grade Modal ────────────────────────────────────── */}
      {showGradeModal && (
        <GradeModal
          mode={editingGrade ? "edit" : "add"}
          initial={gradeModalInitial}
          studentList={studentList}
          recordedBy={teacherName}
          onSave={handleGradeSave}
          onClose={() => { setShowGradeModal(false); setEditingGrade(null); }}
        />
      )}

      {/* ── Add Student Modal ──────────────────────────────── */}
      {showStudentModal && (
        <AddStudentModal
          onSave={handleAddStudent}
          onClose={() => setShowStudentModal(false)}
        />
      )}
    </div>
  );
};
