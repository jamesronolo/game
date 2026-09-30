import React, { useState } from 'react';
import {
  Shuffle,
  SlidersHorizontal,
  Palette,
  ListPlus,
  RefreshCw,
  Play,
  Search,
  EyeOff,
  CheckCircle2,
  Edit3,
  Trash2,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSpinTick, playCheerSound } from '../../../utils/soundEffects';
import { ClassStudent } from '../../../types';
import { WHEEL_PALETTES } from '../types';
import { BulkStudentModal } from '../components/BulkStudentModal';

interface WheelToolProps {
  classStudents: ClassStudent[];
  addStudentToRoster: (student: { name: string; avatar: string }) => Promise<void>;
  updateStudentInRoster: (studentId: string, updates: { name?: string; avatar?: string }) => Promise<void>;
  deleteStudentFromRoster: (studentId: string) => Promise<void>;
  updateStudentStars: (studentId: string, delta: number) => Promise<void>;
}

export const WheelTool: React.FC<WheelToolProps> = ({
  classStudents,
  addStudentToRoster,
  updateStudentInRoster,
  deleteStudentFromRoster,
  updateStudentStars,
}) => {
  // Wheel Animation & Winner State
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [winnerStudent, setWinnerStudent] = useState<ClassStudent | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Wheel Customization & Exclusions
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [shuffledOrder, setShuffledOrder] = useState<string[]>([]);
  const [textOrientation, setTextOrientation] = useState<'radial' | 'horizontal'>('radial');
  const [colorTheme, setColorTheme] = useState<keyof typeof WHEEL_PALETTES>('vibrant');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Roster Editor Form State
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormAvatar, setStudentFormAvatar] = useState('🧑');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [rosterSearch, setRosterSearch] = useState('');

  // Compute active students on the wheel with ordering
  const activeStudents: ClassStudent[] = React.useMemo(() => {
    let list = classStudents.filter((st) => !excludedIds.includes(st.id));
    if (shuffledOrder.length > 0) {
      const orderMap = new Map(shuffledOrder.map((id, idx) => [id, idx]));
      list = [...list].sort((a, b) => {
        const orderA = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
        const orderB = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
        return orderA - orderB;
      });
    }
    return list;
  }, [classStudents, excludedIds, shuffledOrder]);

  const toggleExcludeStudent = (studentId: string) => {
    setExcludedIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const resetExcludedStudents = () => {
    setExcludedIds([]);
  };

  const shuffleWheelOrder = () => {
    if (classStudents.length === 0) return;
    const shuffled = [...classStudents].map((s) => s.id).sort(() => Math.random() - 0.5);
    setShuffledOrder(shuffled);
  };

  const resetStudentForm = () => {
    setStudentFormName('');
    setStudentFormAvatar('🧑');
    setEditingStudentId(null);
  };

  const startEditingStudent = (id: string) => {
    const student = classStudents.find((s) => s.id === id);
    if (!student) return;
    setStudentFormName(student.name);
    setStudentFormAvatar(student.avatar);
    setEditingStudentId(id);
  };

  const saveStudentToRoster = () => {
    const trimmedName = studentFormName.trim();
    if (!trimmedName) return;

    if (editingStudentId) {
      updateStudentInRoster(editingStudentId, {
        name: trimmedName,
        avatar: studentFormAvatar.trim() || '🧑',
      });
    } else {
      addStudentToRoster({
        name: trimmedName,
        avatar: studentFormAvatar.trim() || '🧑',
      });
    }

    resetStudentForm();
  };

  const handleBulkImport = (names: string[]) => {
    const emojiList = ['🧑', '👧', '👦', '🦁', '🚀', '⭐', '🎨', '🐯', '🐼', '🦊', '🦄', '🐳', '🍀', '💎', '🔥', '⚡', '🦉', '🐱', '🐶', '🦖'];
    names.forEach((name, idx) => {
      const avatar = emojiList[idx % emojiList.length];
      addStudentToRoster({ name, avatar });
    });
  };

  const getSliceColor = (index: number, total: number) => {
    const palette = WHEEL_PALETTES[colorTheme] || WHEEL_PALETTES.vibrant;
    if (total > 1 && index === total - 1 && index % palette.length === 0) {
      return palette[1 % palette.length];
    }
    return palette[index % palette.length];
  };

  const spinNameWheel = () => {
    if (isSpinning || activeStudents.length === 0) return;

    setIsSpinning(true);
    setSelectedStudent(null);
    setShowWinnerModal(false);

    const pickedIndex = Math.floor(Math.random() * activeStudents.length);
    const picked = activeStudents[pickedIndex];

    const totalSlices = activeStudents.length;
    const sliceAngle = 360 / totalSlices;
    const jitter = (Math.random() - 0.5) * 0.7 * sliceAngle;
    const sliceCenterAngle = (pickedIndex + 0.5) * sliceAngle + jitter;

    const targetModulo = ((360 - sliceCenterAngle) % 360 + 360) % 360;
    const currentModulo = ((wheelRotation % 360) + 360) % 360;
    const extraDegrees = ((targetModulo - currentModulo) % 360 + 360) % 360;

    const fullSpins = 360 * 8;
    const newRotation = wheelRotation + fullSpins + extraDegrees;
    setWheelRotation(newRotation);

    const tickDelays = [
      70, 150, 230, 310, 390, 470, 550, 630, 710, 790, 880, 980, 1090, 1210, 1340,
      1480, 1630, 1800, 1980, 2180, 2400, 2640, 2900, 3180, 3480, 3810, 4170, 4560,
      4990, 5460, 5970, 6530, 7140, 7700
    ];
    tickDelays.forEach((delay) => {
      setTimeout(() => {
        playSpinTick();
      }, delay);
    });

    setTimeout(() => {
      setIsSpinning(false);
      setWinnerStudent(picked);
      setSelectedStudent(`${picked.avatar} ${picked.name}`);
      setShowWinnerModal(true);
      playCheerSound();
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 } });
    }, 8000);
  };

  const filteredRoster = classStudents.filter((st) =>
    st.name.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
      {/* Header & Controls Bar */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-2.5">
            <span>🎡 Random Name Picker Wheel</span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              {activeStudents.length} of {classStudents.length} Active
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Spin the wheel to call on students randomly. Supports unlimited names, custom layouts & rich palettes!
          </p>
        </div>

        {/* Quick Wheel Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <button
            onClick={shuffleWheelOrder}
            disabled={isSpinning || classStudents.length <= 1}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition shadow-xs disabled:opacity-50 cursor-pointer"
            title="Shuffle slice positions on wheel"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={() => setTextOrientation(textOrientation === 'radial' ? 'horizontal' : 'radial')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition shadow-xs cursor-pointer"
            title="Toggle Text Layout: Horizontal vs Radial Spoke"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Text: {textOrientation === 'radial' ? 'Spoke Ray' : 'Horizontal'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300">
            <Palette className="w-3.5 h-3.5 text-purple-600 ml-1.5" />
            <select
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-700 pr-1 py-1 focus:outline-none cursor-pointer"
            >
              <option value="vibrant">Vibrant Theme</option>
              <option value="candy">Candy Pop</option>
              <option value="neon">Cyber Neon</option>
              <option value="sunset">Sunset Glow</option>
            </select>
          </div>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <ListPlus className="w-4 h-4" />
            <span>+ Paste List</span>
          </button>

          {excludedIds.length > 0 && (
            <button
              onClick={resetExcludedStudents}
              className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-300 transition cursor-pointer"
              title="Include all excluded students back onto wheel"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Excluded ({excludedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Wheel Stage Container */}
      <div className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[530px] aspect-square my-2 flex items-center justify-center">
        {/* Top Pointer Needle */}
        <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.6)]">
          <svg
            viewBox="0 0 60 80"
            className={`w-12 sm:w-16 h-16 sm:h-20 transition-transform duration-200 ${
              isSpinning ? 'scale-105 animate-pulse' : ''
            }`}
          >
            <defs>
              <linearGradient id="teacherPointerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="teacherPointerRuby" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <polygon
              points="12,25 30,76 48,25"
              fill="url(#teacherPointerGold)"
              stroke="#78350f"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="30" cy="22" r="18" fill="url(#teacherPointerGold)" stroke="#78350f" strokeWidth="2.5" />
            <circle cx="30" cy="22" r="11" fill="url(#teacherPointerRuby)" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="27" cy="19" r="3.5" fill="#ffffff" fillOpacity="0.7" />
          </svg>
        </div>

        {/* Outer Rim */}
        <div className="w-full h-full rounded-full border-[10px] sm:border-[16px] border-slate-900 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-center ring-4 ring-emerald-500/30">
          <div
            className="w-full h-full rounded-full relative transition-transform duration-[8000ms] cubic-bezier(0.08, 0.8, 0.15, 1.0)"
            style={{ transform: `rotate(${wheelRotation}deg)` }}
          >
            <svg viewBox="0 0 500 500" className="w-full h-full">
              <defs>
                <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
                </filter>
              </defs>

              {activeStudents.length === 0 ? (
                <circle cx="250" cy="250" r="235" fill="#334155" />
              ) : activeStudents.length === 1 ? (
                <g>
                  <circle cx="250" cy="250" r="235" fill={getSliceColor(0, 1)} />
                  <text
                    x="250"
                    y="150"
                    fill="#ffffff"
                    fontSize="26"
                    fontWeight="900"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none font-black"
                    filter="url(#textGlow)"
                  >
                    {activeStudents[0].avatar} {activeStudents[0].name}
                  </text>
                </g>
              ) : (
                activeStudents.map((st, i) => {
                  const totalSlices = activeStudents.length;
                  const sliceAngle = 360 / totalSlices;
                  const startAngleRad = (i * sliceAngle - 90) * (Math.PI / 180);
                  const endAngleRad = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
                  const midAngle = i * sliceAngle + sliceAngle / 2;

                  const x1 = 250 + 235 * Math.cos(startAngleRad);
                  const y1 = 250 + 235 * Math.sin(startAngleRad);
                  const x2 = 250 + 235 * Math.cos(endAngleRad);
                  const y2 = 250 + 235 * Math.sin(endAngleRad);
                  const largeArc = sliceAngle > 180 ? 1 : 0;
                  const pathD = `M 250 250 L ${x1} ${y1} A 235 235 0 ${largeArc} 1 ${x2} ${y2} Z`;

                  const sliceColor = getSliceColor(i, totalSlices);

                  let fontSize = 17;
                  if (totalSlices <= 4) fontSize = 22;
                  else if (totalSlices <= 8) fontSize = 18;
                  else if (totalSlices <= 14) fontSize = 15;
                  else if (totalSlices <= 22) fontSize = 12.5;
                  else if (totalSlices <= 32) fontSize = 10.5;
                  else if (totalSlices <= 45) fontSize = 9;
                  else fontSize = 8;

                  const maxChars = totalSlices > 22 ? 12 : 18;
                  const baseName = totalSlices > 28 ? st.name.split(' ')[0] : st.name;
                  const displayName =
                    baseName.length > maxChars ? baseName.slice(0, maxChars - 1) + '…' : baseName;

                  return (
                    <g key={st.id}>
                      <path
                        d={pathD}
                        fill={sliceColor}
                        stroke="#0f172a"
                        strokeWidth={totalSlices > 30 ? '1' : '2'}
                      />

                      {textOrientation === 'radial' ? (
                        <g transform={`rotate(${midAngle - 90} 250 250)`}>
                          <text
                            x={250 + (totalSlices > 20 ? 125 : 138)}
                            y={252}
                            fill="#ffffff"
                            fontSize={fontSize}
                            fontWeight="900"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="select-none"
                            style={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.85))',
                              letterSpacing: totalSlices > 25 ? '-0.2px' : '0.4px',
                            }}
                          >
                            {totalSlices <= 24 && `${st.avatar} `}
                            {displayName}
                          </text>
                        </g>
                      ) : (
                        <g transform={`rotate(${midAngle - 90} 250 250)`}>
                          <g
                            transform={`translate(${250 + (totalSlices > 20 ? 130 : 142)}, 250) rotate(${-(midAngle - 90)})`}
                          >
                            <text
                              x={0}
                              y={0}
                              fill="#ffffff"
                              fontSize={Math.max(8, fontSize - 2)}
                              fontWeight="900"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="select-none"
                              style={{
                                fontFamily: 'Inter, system-ui, sans-serif',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.95))',
                              }}
                            >
                              {st.avatar} {displayName}
                            </text>
                          </g>
                        </g>
                      )}
                    </g>
                  );
                })
              )}

              {Array.from({ length: 24 }).map((_, idx) => {
                const pegAngle = (idx * (360 / 24) - 90) * (Math.PI / 180);
                const px = 250 + 242 * Math.cos(pegAngle);
                const py = 250 + 242 * Math.sin(pegAngle);
                return (
                  <g key={idx}>
                    <circle cx={px} cy={py} r="4.5" fill="#fde047" stroke="#713f12" strokeWidth="1.5" />
                    <circle cx={px - 1} cy={py - 1} r="1.5" fill="#ffffff" />
                  </g>
                );
              })}
            </svg>
          </div>

          <button
            onClick={spinNameWheel}
            disabled={isSpinning || activeStudents.length === 0}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-400 to-emerald-300 text-slate-950 font-black text-xs sm:text-base uppercase tracking-wider flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.6)] border-4 sm:border-8 border-slate-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-75 group cursor-pointer"
          >
            <div className="absolute inset-1 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Play
              className={`w-7 h-7 sm:w-10 sm:h-10 fill-slate-950 ml-0.5 transition-transform ${
                isSpinning ? 'animate-spin' : 'group-hover:scale-110'
              }`}
            />
            <span className="font-extrabold mt-0.5">{isSpinning ? 'SPINNING' : 'SPIN'}</span>
          </button>
        </div>
      </div>

      {selectedStudent && (
        <div className="w-full max-w-xl p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-2xl sm:text-3xl shadow-2xl border-4 border-emerald-300 flex items-center justify-center gap-3 animate-bounce">
          <span>🎉 Selected: {selectedStudent}!</span>
        </div>
      )}

      {/* Winner Celebration Modal Overlay */}
      {showWinnerModal && winnerStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-emerald-400 max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-400 flex items-center justify-center text-5xl sm:text-6xl shadow-xl border-4 border-white animate-bounce">
              {winnerStudent.avatar}
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                🎉 We Have a Winner!
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {winnerStudent.name}
              </h3>
              <p className="text-sm font-bold text-slate-500">
                ⭐ {winnerStudent.stars} Stars • 🏆 {winnerStudent.points} Points
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => {
                  updateStudentStars(winnerStudent.id, 1);
                  playCheerSound();
                  confetti({ particleCount: 80, spread: 60 });
                }}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Star className="w-4 h-4 fill-slate-950" />
                <span>+1 Star Award</span>
              </button>

              <button
                onClick={() => {
                  toggleExcludeStudent(winnerStudent.id);
                  setShowWinnerModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-300 transition cursor-pointer"
              >
                <EyeOff className="w-4 h-4 text-rose-500" />
                <span>Exclude Next</span>
              </button>

              <button
                onClick={() => {
                  setShowWinnerModal(false);
                  setTimeout(() => spinNameWheel(), 150);
                }}
                className="sm:col-span-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Spin Again!</span>
              </button>
            </div>

            <button
              onClick={() => setShowWinnerModal(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Names Modal */}
      <BulkStudentModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImport={handleBulkImport}
      />

      {/* Student Roster Manager */}
      <div className="w-full max-w-4xl rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Class Student Roster ({classStudents.length} Total • {activeStudents.length} on Wheel)
            </h3>
            <p className="text-xs text-slate-500">
              Add, edit, exclude absent students, or remove participants from the wheel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetStudentForm}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {editingStudentId ? 'Cancel Edit' : 'Clear Form'}
            </button>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr_auto]">
          <label className="text-left text-xs font-bold text-slate-800">
            <span className="mb-1.5 block">Student Full Name</span>
            <input
              value={studentFormName}
              onChange={(e) => setStudentFormName(e.target.value)}
              placeholder="e.g. Emma Watson"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold focus:outline-none focus:border-emerald-500"
            />
          </label>

          <label className="text-left text-xs font-bold text-slate-800">
            <span className="mb-1.5 block">Avatar Emoji</span>
            <input
              value={studentFormAvatar}
              onChange={(e) => setStudentFormAvatar(e.target.value)}
              placeholder="🧑"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-center focus:outline-none focus:border-emerald-500"
            />
          </label>

          <button
            onClick={saveStudentToRoster}
            className="self-end rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-sm font-black text-white shadow-lg transition cursor-pointer"
          >
            {editingStudentId ? 'Save Changes' : '+ Add Student'}
          </button>
        </div>

        {/* Roster Search & Filter */}
        {classStudents.length > 6 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={rosterSearch}
              onChange={(e) => setRosterSearch(e.target.value)}
              placeholder="Search students in roster..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Student Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
          {filteredRoster.map((student) => {
            const isExcluded = excludedIds.includes(student.id);
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 transition-all shadow-xs ${
                  isExcluded
                    ? 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold min-w-0">
                  <button
                    onClick={() => toggleExcludeStudent(student.id)}
                    className="text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                    title={isExcluded ? 'Include on wheel' : 'Exclude from wheel'}
                  >
                    {isExcluded ? (
                      <EyeOff className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </button>
                  <span className="text-lg shrink-0">{student.avatar}</span>
                  <span className="truncate">{student.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => startEditingStudent(student.id)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors text-xs font-bold cursor-pointer"
                    title="Edit student"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteStudentFromRoster(student.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove from roster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
