import React, { useState, useEffect, useRef } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { playSpinTick, playCheerSound, playDiceSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Wrench,
  PieChart,
  Star,
  Users,
  Dices,
  Flag,
  Play,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  Trophy,
  Volume2,
  Clock,
  Mic,
  MicOff,
  Pause,
  AlertTriangle,
  Trash2,
  Edit3,
  Copy,
  Check,
  CheckCircle2,
  Award,
  Shuffle,
  ListPlus,
  Palette,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Search,
  Code2,
} from 'lucide-react';
import { ClassStudent } from '../../types';

// Rich curated color palettes for high contrast, vibrant smartboard wheels
const WHEEL_PALETTES = {
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

export const TeacherToolsView: React.FC = () => {
  const {
    classStudents,
    addStudentToRoster,
    updateStudentInRoster,
    deleteStudentFromRoster,
    updateStudentStars,
    updateStudentPoints,
    setActiveTab,
  } = useEduPlay();

  const [activeTool, setActiveTool] = useState<
    'wheel' | 'stars' | 'grouper' | 'dice' | 'race' | 'noise' | 'timer'
  >('wheel');

  // 1. Name Wheel State
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [winnerStudent, setWinnerStudent] = useState<ClassStudent | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormAvatar, setStudentFormAvatar] = useState('🧑');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Wheel Customization & Enhanced Data Controls
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [shuffledOrder, setShuffledOrder] = useState<string[]>([]);
  const [textOrientation, setTextOrientation] = useState<'radial' | 'horizontal'>('radial');
  const [colorTheme, setColorTheme] = useState<keyof typeof WHEEL_PALETTES>('vibrant');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');

  // 2. Student Grouper State
  const [groupCount, setGroupCount] = useState<number>(3);
  const [generatedGroups, setGeneratedGroups] = useState<Array<{ name: string; members: string[] }>>(
    []
  );
  const [copiedGroupNotice, setCopiedGroupNotice] = useState(false);

  // 3. Virtual Dice State
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceResults, setDiceResults] = useState<number[]>([4, 6]);
  const [isRolling, setIsRolling] = useState(false);

  // 4. Behavior Race State
  const [racePositions, setRacePositions] = useState<Record<string, number>>({});

  // 5. Noise Monitor State
  const [isMicActive, setIsMicActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 - 100
  const [noiseThreshold, setNoiseThreshold] = useState(70);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // 6. Visual Countdown Timer State
  const [timerDuration, setTimerDuration] = useState(300); // 5 mins
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Initialize race positions from student roster
  useEffect(() => {
    if (classStudents.length > 0 && Object.keys(racePositions).length === 0) {
      const initial: Record<string, number> = {};
      classStudents.forEach((st, idx) => {
        initial[st.id] = (idx * 12) % 60;
      });
      setRacePositions(initial);
    }
  }, [classStudents]);

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
    const ids = classStudents.map((st) => st.id).sort(() => Math.random() - 0.5);
    setShuffledOrder(ids);
  };

  // Noise Meter Audio Listener
  const toggleMic = async () => {
    if (isMicActive) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (micAudioCtxRef.current) {
        micAudioCtxRef.current.close();
      }
      setIsMicActive(false);
      setVolumeLevel(0);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      micAudioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsMicActive(true);

      const updateVolume = () => {
        if (!micAudioCtxRef.current || micAudioCtxRef.current.state === 'closed') return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));

        setVolumeLevel(normalized);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      alert('Could not access microphone. Please check browser permissions.');
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playCheerSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining]);

  const resetStudentForm = () => {
    setStudentFormName('');
    setStudentFormAvatar('🧑');
    setEditingStudentId(null);
  };

  const startEditingStudent = (studentId: string) => {
    const student = classStudents.find((entry) => entry.id === studentId);
    if (!student) return;
    setEditingStudentId(student.id);
    setStudentFormName(student.name);
    setStudentFormAvatar(student.avatar);
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

  const handleBulkImport = () => {
    const names = bulkInputText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return;

    const emojiList = ['🧑', '👧', '👦', '🦁', '🚀', '⭐', '🎨', '🐯', '🐼', '🦊', '🦄', '🐳', '🍀', '💎', '🔥', '⚡', '🦉', '🐱', '🐶', '🦖'];
    names.forEach((name, idx) => {
      const avatar = emojiList[idx % emojiList.length];
      addStudentToRoster({ name, avatar });
    });

    setBulkInputText('');
    setIsBulkModalOpen(false);
  };

  // Helper for high contrast, collision-free slice coloring
  const getSliceColor = (index: number, total: number) => {
    const palette = WHEEL_PALETTES[colorTheme] || WHEEL_PALETTES.vibrant;
    if (total > 1 && index === total - 1 && index % palette.length === 0) {
      return palette[1 % palette.length];
    }
    return palette[index % palette.length];
  };

  // Name Wheel Spin Action with realistic deceleration physics and pointer alignment
  const spinNameWheel = () => {
    if (isSpinning || activeStudents.length === 0) return;

    setIsSpinning(true);
    setSelectedStudent(null);
    setShowWinnerModal(false);

    // Pick winner upfront
    const pickedIndex = Math.floor(Math.random() * activeStudents.length);
    const picked = activeStudents[pickedIndex];

    // Compute exact angle for pointer at 12 o'clock to land inside the picked slice
    const totalSlices = activeStudents.length;
    const sliceAngle = 360 / totalSlices;
    // Jitter within slice (+/- 35% of slice width)
    const jitter = (Math.random() - 0.5) * 0.7 * sliceAngle;
    const sliceCenterAngle = (pickedIndex + 0.5) * sliceAngle + jitter;

    const targetModulo = ((360 - sliceCenterAngle) % 360 + 360) % 360;
    const currentModulo = ((wheelRotation % 360) + 360) % 360;
    const extraDegrees = ((targetModulo - currentModulo) % 360 + 360) % 360;

    // 8 full 360-degree rotations (2880 deg) + slice landing alignment
    const fullSpins = 360 * 8;
    const newRotation = wheelRotation + fullSpins + extraDegrees;
    setWheelRotation(newRotation);

    // Realistic decelerating tick sound sequence timed over exactly 8 seconds (8000ms)
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

  // Student Grouper Action
  const generateRandomGroups = () => {
    if (classStudents.length === 0) return;
    const shuffled = [...classStudents].sort(() => Math.random() - 0.5);
    const groups: Array<{ name: string; members: string[] }> = Array.from(
      { length: groupCount },
      (_, i) => ({
        name: `Team ${String.fromCharCode(65 + i)}`,
        members: [],
      })
    );

    shuffled.forEach((student, idx) => {
      groups[idx % groupCount].members.push(`${student.avatar} ${student.name}`);
    });

    setGeneratedGroups(groups);
  };

  const copyGroupsToClipboard = () => {
    if (generatedGroups.length === 0) return;
    const text = generatedGroups
      .map((g) => `${g.name}:\n${g.members.map((m) => ` - ${m}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedGroupNotice(true);
    setTimeout(() => setCopiedGroupNotice(false), 2000);
  };

  // Roll Virtual Dice Action
  const rollVirtualDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();

    let count = 0;
    const interval = setInterval(() => {
      setDiceResults(Array.from({ length: diceCount }, () => Math.floor(1 + Math.random() * 6)));
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 90);
  };

  // Advance Behavior Race Car
  const advanceCar = (studentId: string) => {
    setRacePositions((prev) => {
      const current = prev[studentId] || 0;
      const updated = Math.min(100, current + 15);
      if (updated >= 100) {
        playCheerSound();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
      return { ...prev, [studentId]: updated };
    });
  };

  const resetRace = () => {
    const reset: Record<string, number> = {};
    classStudents.forEach((st) => {
      reset[st.id] = 0;
    });
    setRacePositions(reset);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredRoster = classStudents.filter((st) =>
    st.name.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-emerald-800/80 shadow-2xl text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-black uppercase tracking-widest">
              Smartboard Classroom Suite
            </span>
            <span className="text-xs font-bold text-slate-300">100% Free • No Ads</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <Wrench className="w-9 h-9 text-emerald-400" />
            <span>Interactive Teacher Tools</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Project live classroom utilities directly onto smartboards, TVs, or projectors — random student spinners, 3D dice rolls, behavior race tracks, noise meters, and group generators!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('coding-quiz')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black flex items-center gap-2 transition shadow-md shadow-indigo-900/30 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-yellow-300" /> Programming Test Quiz 🚀
          </button>
          <button
            onClick={() => playCheerSound()}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-2 transition cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Cheer Sound
          </button>
        </div>
      </div>

      {/* Tool Navigation Selector Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        {[
          { id: 'wheel', label: 'Random Name Picker', icon: PieChart },
          { id: 'stars', label: 'Star Chart & Behavior', icon: Star },
          { id: 'grouper', label: 'Student Grouper', icon: Users },
          { id: 'dice', label: 'Virtual 3D Dice', icon: Dices },
          { id: 'race', label: 'Behavior Race Track', icon: Flag },
          { id: 'noise', label: 'Noise Level Monitor', icon: Volume2 },
          { id: 'timer', label: 'Classroom Timer', icon: Clock },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all shadow-xs ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: ENHANCED NAME WHEEL */}
      {activeTool === 'wheel' && (
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
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition shadow-xs disabled:opacity-50"
                title="Shuffle slice positions on wheel"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={() => setTextOrientation(textOrientation === 'radial' ? 'horizontal' : 'radial')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition shadow-xs"
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
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition"
              >
                <ListPlus className="w-4 h-4" />
                <span>+ Paste List</span>
              </button>

              {excludedIds.length > 0 && (
                <button
                  onClick={resetExcludedStudents}
                  className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-300 transition"
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
            {/* Top Pointer Needle - Centered precisely */}
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
                {/* Symmetrical Triangle Pointer pointing straight down to center */}
                <polygon
                  points="12,25 30,76 48,25"
                  fill="url(#teacherPointerGold)"
                  stroke="#78350f"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Center Circular Housing */}
                <circle cx="30" cy="22" r="18" fill="url(#teacherPointerGold)" stroke="#78350f" strokeWidth="2.5" />
                <circle cx="30" cy="22" r="11" fill="url(#teacherPointerRuby)" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="27" cy="19" r="3.5" fill="#ffffff" fillOpacity="0.7" />
              </svg>
            </div>

            {/* Outer Decorative Casino Rim with Metallic Ring & Glowing LED Studs */}
            <div className="w-full h-full rounded-full border-[10px] sm:border-[16px] border-slate-900 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-center ring-4 ring-emerald-500/30">
              {/* Rotating Vector SVG Wheel */}
              <div
                className="w-full h-full rounded-full relative transition-transform duration-[8000ms] cubic-bezier(0.08, 0.8, 0.15, 1.0)"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <defs>
                    <radialGradient id="hubGloss" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
                    </radialGradient>
                    <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
                    </filter>
                  </defs>

                  {/* Wheel Slices */}
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

                      // Responsive font size calculation according to roster count
                      let fontSize = 17;
                      if (totalSlices <= 4) fontSize = 22;
                      else if (totalSlices <= 8) fontSize = 18;
                      else if (totalSlices <= 14) fontSize = 15;
                      else if (totalSlices <= 22) fontSize = 12.5;
                      else if (totalSlices <= 32) fontSize = 10.5;
                      else if (totalSlices <= 45) fontSize = 9;
                      else fontSize = 8;

                      // Display name with intelligent truncation for long names
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

                          {/* Slice Text Rendering */}
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

                  {/* Perimeter Golden Studs / LED Pegs */}
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

              {/* Center 3D Spin Push Hub */}
              <button
                onClick={spinNameWheel}
                disabled={isSpinning || activeStudents.length === 0}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-400 to-emerald-300 text-slate-950 font-black text-xs sm:text-base uppercase tracking-wider flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.6)] border-4 sm:border-8 border-slate-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-75 group"
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

          {/* Quick Winner Banner */}
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
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <Star className="w-4 h-4 fill-slate-950" />
                    <span>+1 Star Award</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleExcludeStudent(winnerStudent.id);
                      setShowWinnerModal(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-300 transition"
                  >
                    <EyeOff className="w-4 h-4 text-rose-500" />
                    <span>Exclude Next</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowWinnerModal(false);
                      setTimeout(() => spinNameWheel(), 150);
                    }}
                    className="sm:col-span-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Spin Again!</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}

          {/* Bulk Import Names Modal */}
          {isBulkModalOpen && (
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
                    onClick={() => setIsBulkModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  placeholder="Emma Watson&#10;Liam Johnson&#10;Sophia Miller&#10;Noah Davis&#10;Olivia Martinez"
                  className="w-full rounded-2xl border-2 border-slate-300 p-4 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsBulkModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkImport}
                    disabled={!bulkInputText.trim()}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition disabled:opacity-50"
                  >
                    Import All Names
                  </button>
                </div>
              </div>
            </div>
          )}

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
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
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
                className="self-end rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-sm font-black text-white shadow-lg transition"
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

            {/* Student Chips with Active/Excluded Toggles */}
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
                        className="text-slate-400 hover:text-emerald-600 transition"
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
                        className="p-1 text-slate-400 hover:text-emerald-600 transition-colors text-xs font-bold"
                        title="Edit student"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteStudentFromRoster(student.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
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
      )}

      {/* TOOL 2: STAR CHART */}
      {activeTool === 'stars' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Classroom Star Chart & Rewards</h2>
              <p className="text-sm text-slate-500 mt-1">
                Award stars and behavior points live during lessons to motivate participation and teamwork!
              </p>
            </div>
            <span className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 border border-amber-300 font-extrabold text-xs">
              ⭐ Total Class Stars: {classStudents.reduce((acc, s) => acc + s.stars, 0)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classStudents.map((student) => (
              <div
                key={student.id}
                className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50/80 flex flex-col justify-between shadow-sm hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{student.avatar}</span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{student.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-amber-600 font-black mt-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span>{student.stars} Stars</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modify Stars:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStudentStars(student.id, -1)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        updateStudentStars(student.id, 1);
                        playCheerSound();
                      }}
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 3: STUDENT GROUPER */}
      {activeTool === 'grouper' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Random Student Team Grouper</h2>
              <p className="text-sm text-slate-500 mt-1">
                Instantly break your class roster into balanced random teams for group projects or live competitions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Teams:</label>
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="px-4 py-2.5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 text-xs font-black"
              >
                <option value={2}>2 Teams</option>
                <option value={3}>3 Teams</option>
                <option value={4}>4 Teams</option>
                <option value={5}>5 Teams</option>
              </select>

              <button
                onClick={generateRandomGroups}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition"
              >
                Generate Teams
              </button>

              {generatedGroups.length > 0 && (
                <button
                  onClick={copyGroupsToClipboard}
                  className="px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  {copiedGroupNotice ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedGroupNotice ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <h3 className="font-black text-lg text-emerald-900 border-b border-slate-200 pb-3 flex items-center justify-between">
                  <span>{group.name}</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">{group.members.length} Members</span>
                </h3>

                <ul className="space-y-2">
                  {group.members.map((member, mIdx) => (
                    <li
                      key={mIdx}
                      className="text-sm font-bold text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2"
                    >
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 4: VIRTUAL DICE */}
      {activeTool === 'dice' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-12 shadow-xl text-center flex flex-col items-center space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Virtual 3D Classroom Dice</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Roll 1, 2, or 3 interactive dice for classroom math drills, turn-taking, or board game activities!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Dice:</span>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setDiceCount(num);
                  setDiceResults(Array.from({ length: num }, () => Math.floor(1 + Math.random() * 6)));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                  diceCount === num
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {num} {num === 1 ? 'Die' : 'Dice'}
              </button>
            ))}
          </div>

          {/* Dice Display Stage */}
          <div className="flex flex-wrap items-center justify-center gap-8 my-8">
            {diceResults.map((val, idx) => (
              <div
                key={idx}
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 text-slate-950 font-black text-5xl sm:text-6xl flex items-center justify-center shadow-2xl border-4 sm:border-8 border-slate-950 transition-all transform ${
                  isRolling ? 'animate-bounce scale-105' : 'hover:scale-105'
                }`}
              >
                {val}
              </div>
            ))}
          </div>

          <button
            onClick={rollVirtualDice}
            disabled={isRolling}
            className="px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:brightness-110 text-white font-black text-lg sm:text-xl shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all"
          >
            {isRolling ? 'Rolling Dice...' : '🎲 ROLL DICE NOW'}
          </button>
        </div>
      )}

      {/* TOOL 5: BEHAVIOR RACE */}
      {activeTool === 'race' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Behavior Race Track</h2>
              <p className="text-sm text-slate-500 mt-1">
                Project a live visual race track — advance students toward the finish line for great behavior and fast answers!
              </p>
            </div>

            <button
              onClick={resetRace}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 self-start sm:self-auto"
            >
              <RotateCcw className="w-4 h-4" /> Reset Track
            </button>
          </div>

          <div className="space-y-6 bg-slate-950 p-8 rounded-3xl border-2 border-slate-800 shadow-2xl">
            {classStudents.map((student) => {
              const pos = racePositions[student.id] || 0;
              return (
                <div key={student.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-200">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{student.avatar}</span>
                      <span>{student.name}</span>
                    </span>
                    <button
                      onClick={() => advanceCar(student.id)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
                    >
                      + Advance Car (+15%)
                    </button>
                  </div>

                  <div className="w-full h-12 bg-slate-900 rounded-2xl border-2 border-slate-800 relative overflow-hidden flex items-center">
                    <div className="absolute right-4 top-0 bottom-0 flex items-center text-xs font-black text-slate-600 uppercase tracking-widest z-0">
                      🏁 FINISH
                    </div>
                    <div
                      className="absolute top-1 bottom-1 text-3xl transition-all duration-500 z-10"
                      style={{ left: `${Math.min(92, pos)}%` }}
                    >
                      🏎️
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOOL 6: NOISE MONITOR */}
      {activeTool === 'noise' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-12 shadow-xl flex flex-col items-center text-center space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Classroom Quiet Meter</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Real-time microphone volume analyzer for smartboards — gently alerts the class when volume level exceeds target threshold!
            </p>
          </div>

          <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border-2 border-slate-800 p-8 sm:p-10 space-y-8 shadow-2xl">
            <div className="relative w-full h-16 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800">
              <div
                className={`h-full transition-all duration-100 ${
                  volumeLevel > noiseThreshold ? 'bg-rose-500 shadow-lg shadow-rose-500/50' : 'bg-emerald-500'
                }`}
                style={{ width: `${volumeLevel}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-amber-400 z-10 shadow-md"
                style={{ left: `${noiseThreshold}%` }}
                title="Threshold Limit"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300 font-extrabold">
              <span>Current Volume: {volumeLevel}%</span>
              <span>Max Quiet Limit: {noiseThreshold}%</span>
            </div>

            {volumeLevel > noiseThreshold && (
              <div className="p-5 bg-rose-500/20 border-2 border-rose-500/50 rounded-2xl text-rose-200 font-black text-lg flex items-center justify-center gap-3 animate-bounce shadow-xl">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                <span>⚠️ CLASSROOM NOISE LEVEL EXCEEDED!</span>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all ${
                  isMicActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isMicActive ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Noise Monitor</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Start Live Quiet Meter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: CLASSROOM TIMER */}
      {activeTool === 'timer' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-12 shadow-xl flex flex-col items-center text-center space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Visual Classroom Countdown</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Project a large visual countdown timer for test prep, group stations, and classroom clean-up time!
            </p>
          </div>

          <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border-2 border-slate-800 p-8 sm:p-12 text-center space-y-8 shadow-2xl">
            <div className="text-7xl sm:text-9xl font-black font-mono text-emerald-400 tracking-widest drop-shadow-2xl">
              {formatTime(timerRemaining)}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: '1 Min', secs: 60 },
                { label: '3 Mins', secs: 180 },
                { label: '5 Mins', secs: 300 },
                { label: '10 Mins', secs: 600 },
                { label: '15 Mins', secs: 900 },
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerDuration(p.secs);
                    setTimerRemaining(p.secs);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-extrabold text-slate-200 border border-slate-700 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-3 px-10 py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition"
              >
                {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                <span>{isTimerRunning ? 'Pause Timer' : 'Start Timer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerRemaining(timerDuration);
                }}
                className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
