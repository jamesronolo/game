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

// ---- Grade colour coding ----
const gradeColor = (v: string) => {
  const g = v.trim().toUpperCase();
  if (g.startsWith('A')) return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
  if (g.startsWith('B')) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
  if (g.startsWith('C')) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
  if (g.startsWith('D')) return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
  if (g === 'F') return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
  const n = parseFloat(g);
  if (!isNaN(n)) {
    if (n >= 90) return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
    if (n >= 80) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
    if (n >= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    if (n >= 60) return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
  }
  return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
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
      ? 'w-full text-left px-4 py-2.5 text-sm font-bold flex justify-between items-center bg-indigo-600 text-white'
      : 'w-full text-left px-4 py-2.5 text-sm font-medium flex justify-between items-center text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer';

  const allRowClass = (active: boolean) =>
    active
      ? 'w-full text-left px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white'
      : 'w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer';

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            🏫 School Records
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage student grade records and track academic progress.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowStudentModal(true)}
            id="add-student-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            🧑‍🎓 Add Student
          </button>
          <button
            onClick={openAddGrade}
            id="add-grade-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            ➕ Add Grade
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon="👥" label="Total Students" value={studentList.length} color="bg-indigo-50 border-indigo-200 text-indigo-800" />
        <StatCard icon="📋" label="Grade Records" value={grades.length} color="bg-purple-50 border-purple-200 text-purple-800" />
        <StatCard icon="🎓" label="Students w/ Records" value={totalStudentsWithRecords} color="bg-emerald-50 border-emerald-200 text-emerald-800" />
        <StatCard icon="📊" label="Avg Numeric Grade" value={avgGrade} color="bg-amber-50 border-amber-200 text-amber-800" />
      </div>

      {/* Main Panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-700">🧑‍🎓 Students</h2>
                <button
                  onClick={() => setShowStudentModal(true)}
                  title="Add student"
                  className="w-6 h-6 rounded-full bg-emerald-500 text-white text-lg font-bold flex items-center justify-center hover:bg-emerald-600 transition-colors leading-none cursor-pointer"
                >
                  +
                </button>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            </div>

            <ul className="divide-y divide-slate-100 max-h-[28rem] overflow-y-auto">
              <li>
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className={allRowClass(selectedStudentId === null)}
                >
                  All Students
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ml-auto ${
                      selectedStudentId === null ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-600'
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
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ml-2 shrink-0 ${
                          active ? 'bg-white/25 text-white' : count ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
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
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-slate-500">Subject:</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option value="All">All Subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <span className="text-xs font-semibold text-slate-500 ml-2">Term:</span>
              <select
                value={termFilter}
                onChange={(e) => setTermFilter(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option value="All">All Terms</option>
                {TERMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-bold text-slate-500">
              {visibleGrades.length} record{visibleGrades.length !== 1 ? 's' : ''}
              {selectedStudentId && (
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="ml-2 text-indigo-600 hover:underline cursor-pointer"
                >
                  (Clear filter)
                </button>
              )}
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {visibleGrades.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <div className="text-5xl mb-3">📝</div>
                <h3 className="font-bold text-base text-slate-600">No records found</h3>
                <p className="text-xs text-slate-400 mt-1">Add grade records or adjust filters to view student records.</p>
                <button
                  onClick={openAddGrade}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition cursor-pointer"
                >
                  ➕ Add Grade Record
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3 text-center">Grade</th>
                      <th className="px-5 py-3">Term</th>
                      <th className="px-5 py-3">Notes</th>
                      <th className="px-5 py-3">Recorded By</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {visibleGrades.map((gr) => {
                      const c = gradeColor(gr.gradeValue);
                      const isDeleting = deleteConfirmId === gr.id;
                      return (
                        <tr key={gr.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-900">{gr.studentName}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-700">{gr.subject}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs border ${c.bg} ${c.text} ${c.border}`}
                            >
                              {gr.gradeValue}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">{gr.term}</td>
                          <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">{gr.notes || '—'}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-[11px]">{gr.recordedBy}</td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            {isDeleting ? (
                              <span className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleDelete(gr.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 text-[11px] hover:bg-slate-100 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => openEditGrade(gr)}
                                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(gr.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                  title="Delete"
                                >
                                  🗑️
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
