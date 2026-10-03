import React, { useState, useMemo } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { StudentGrade } from '../../types';
import {
  GradeModal,
  GradeFormData,
  emptyGradeForm,
  SUBJECTS,
  TERMS,
} from './components/GradeModal';
import { AddStudentModal } from './components/AddStudentModal';
import { StatCard } from './components/GradeStatsCards';
import {
  School,
  UserPlus,
  Plus,
  Edit3,
  Trash2,
  Users,
  GraduationCap,
  Award,
  FileText,
  Search,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

// ---- Grade colour coding ----
const gradeColor = (v: string) => {
  const g = v.trim().toUpperCase();
  if (g.startsWith('A')) return { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700' };
  if (g.startsWith('B')) return { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' };
  if (g.startsWith('C')) return { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' };
  if (g.startsWith('D')) return { bg: 'bg-orange-50 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' };
  if (g === 'F') return { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-700' };
  const n = parseFloat(g);
  if (!isNaN(n)) {
    if (n >= 90) return { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700' };
    if (n >= 80) return { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' };
    if (n >= 70) return { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' };
    if (n >= 60) return { bg: 'bg-orange-50 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' };
    return { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-700' };
  }
  return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700' };
};

export const SchoolRecordsView: React.FC = () => {
  const { grades, addGrade, editGrade, removeGrade, classStudents, addStudentToRoster, currentUser } = useEduPlay();

  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<StudentGrade | null>(null);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [termFilter, setTermFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const studentList = useMemo(() => classStudents.map((s) => ({ id: s.id, name: s.name })), [classStudents]);

  const filteredStudents = useMemo(
    () => studentList.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [studentList, search]
  );

  const visibleGrades = useMemo(() => {
    let g = selectedStudentId ? grades.filter((gr) => gr.studentId === selectedStudentId) : grades;
    if (subjectFilter !== 'All') g = g.filter((gr) => gr.subject === subjectFilter);
    if (termFilter !== 'All') g = g.filter((gr) => gr.term === termFilter);
    return g;
  }, [grades, selectedStudentId, subjectFilter, termFilter]);

  const totalStudentsWithRecords = useMemo(() => new Set(grades.map((g) => g.studentId)).size, [grades]);
  const avgGrade = useMemo(() => {
    const nums = grades.map((g) => parseFloat(g.gradeValue)).filter((n) => !isNaN(n));
    if (!nums.length) return '—';
    return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
  }, [grades]);

  const teacherName = currentUser?.name ?? 'Teacher';

  const openAddGrade = () => {
    setEditingGrade(null);
    setShowGradeModal(true);
  };

  const openEditGrade = (gr: StudentGrade) => {
    setEditingGrade(gr);
    setShowGradeModal(true);
  };

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

  const handleAddStudent = async (name: string, avatar: string) => {
    await addStudentToRoster({ name, avatar });
    setShowStudentModal(false);
  };

  const gradeModalInitial = editingGrade
    ? {
        studentId: editingGrade.studentId,
        studentName: editingGrade.studentName,
        subject: editingGrade.subject,
        gradeValue: editingGrade.gradeValue,
        term: editingGrade.term,
        notes: editingGrade.notes ?? '',
      }
    : selectedStudentId
    ? {
        ...emptyGradeForm(),
        studentId: selectedStudentId,
        studentName: studentList.find((s) => s.id === selectedStudentId)?.name ?? '',
      }
    : emptyGradeForm();

  const studentRowClass = (active: boolean) =>
    active
      ? 'w-full text-left px-4 py-2.5 text-xs font-bold flex justify-between items-center bg-indigo-600 text-white'
      : 'w-full text-left px-4 py-2.5 text-xs font-semibold flex justify-between items-center text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors cursor-pointer';

  const allRowClass = (active: boolean) =>
    active
      ? 'w-full text-left px-4 py-2.5 text-xs font-bold bg-indigo-600 text-white'
      : 'w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors cursor-pointer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
            <School className="w-3.5 h-3.5" />
            <span>Academic Registrar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            School & Grade Records
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage student academic grade reports, terms, subjects, and cumulative classroom records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowStudentModal(true)}
            id="add-student-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Add Student</span>
          </button>
          <button
            onClick={openAddGrade}
            id="add-grade-btn"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Record Grade</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="👥" label="Total Students" value={studentList.length} color="bg-indigo-50/70 border-indigo-200/70 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800/60 dark:text-indigo-300" />
        <StatCard icon="📋" label="Grade Records" value={grades.length} color="bg-purple-50/70 border-purple-200/70 text-purple-800 dark:bg-purple-950/40 dark:border-purple-800/60 dark:text-purple-300" />
        <StatCard icon="🎓" label="Students w/ Records" value={totalStudentsWithRecords} color="bg-emerald-50/70 border-emerald-200/70 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300" />
        <StatCard icon="📊" label="Avg Numeric Grade" value={avgGrade} color="bg-amber-50/70 border-amber-200/70 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300" />
      </div>

      {/* Main Panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Student Roster</span>
                </h2>
                <button
                  onClick={() => setShowStudentModal(true)}
                  title="Add student"
                  className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter student..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[28rem] overflow-y-auto">
              <li>
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className={allRowClass(selectedStudentId === null)}
                >
                  <span>All Students</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ml-auto ${
                      selectedStudentId === null ? 'bg-white/25 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                    }`}
                  >
                    {grades.length}
                  </span>
                </button>
              </li>
              {filteredStudents.map((s) => {
                const count = grades.filter((g) => g.studentId === s.id).length;
                const active = selectedStudentId === s.id;
                return (
                  <li key={s.id}>
                    <button onClick={() => setSelectedStudentId(s.id)} className={studentRowClass(active)}>
                      <span className="truncate">{s.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ml-2 shrink-0 ${
                          active ? 'bg-white/25 text-white' : count ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2.5 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject:</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All Subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-2">Term:</span>
              <select
                value={termFilter}
                onChange={(e) => setTermFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All Terms</option>
                {TERMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {visibleGrades.length} record{visibleGrades.length !== 1 ? 's' : ''}
              {selectedStudentId && (
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  (Reset selection)
                </button>
              )}
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {visibleGrades.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-300">No grade records found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add grade records or adjust filters to view student records.</p>
                <button
                  onClick={openAddGrade}
                  className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Add Grade Record
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Student</th>
                      <th className="px-5 py-3.5">Subject</th>
                      <th className="px-5 py-3.5 text-center">Grade</th>
                      <th className="px-5 py-3.5">Term</th>
                      <th className="px-5 py-3.5">Notes</th>
                      <th className="px-5 py-3.5">Recorded By</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                    {visibleGrades.map((gr) => {
                      const c = gradeColor(gr.gradeValue);
                      const isDeleting = deleteConfirmId === gr.id;
                      return (
                        <tr key={gr.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{gr.studentName}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">{gr.subject}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs border ${c.bg} ${c.text} ${c.border}`}
                            >
                              {gr.gradeValue}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{gr.term}</td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">{gr.notes || '—'}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-[11px]">{gr.recordedBy}</td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            {isDeleting ? (
                              <span className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleDelete(gr.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => openEditGrade(gr)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(gr.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            )}
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

      {/* Grade Modal */}
      {showGradeModal && (
        <GradeModal
          mode={editingGrade ? 'edit' : 'add'}
          initial={gradeModalInitial}
          studentList={studentList}
          recordedBy={teacherName}
          onSave={handleGradeSave}
          onClose={() => {
            setShowGradeModal(false);
            setEditingGrade(null);
          }}
        />
      )}

      {/* Add Student Modal */}
      {showStudentModal && (
        <AddStudentModal
          onSave={handleAddStudent}
          onClose={() => setShowStudentModal(false)}
        />
      )}
    </div>
  );
};
