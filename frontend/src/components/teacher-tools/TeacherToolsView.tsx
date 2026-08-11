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
} from 'lucide-react';

export const TeacherToolsView: React.FC = () => {
  const {
    classStudents,
    addStudentToRoster,
    updateStudentInRoster,
    deleteStudentFromRoster,
    updateStudentStars,
    updateStudentPoints,
  } = useEduPlay();

  const [activeTool, setActiveTool] = useState<
    'wheel' | 'stars' | 'grouper' | 'dice' | 'race' | 'noise' | 'timer'
  >('wheel');

  // 1. Name Wheel State
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormAvatar, setStudentFormAvatar] = useState('🧑');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

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

  // Name Wheel Spin Action (9-second dramatic spin with 4-second slow crawl finish)
  const spinNameWheel = () => {
    if (isSpinning || classStudents.length === 0) return;

    setIsSpinning(true);
    setSelectedStudent(null);

    // Realistic decelerating tick sounds over 9 seconds (fast initial spin, 4-second slow crawl at end)
    const tickDelays = [
      80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1060, 1170, 1290,
      1420, 1560, 1720, 1900, 2100, 2320, 2560, 2820, 3110, 3430, 3780, 4170, 4600,
      5080, 5600, 6180, 6820, 7520, 8250, 8750
    ];
    tickDelays.forEach((delay) => {
      setTimeout(() => {
        playSpinTick();
      }, delay);
    });

    // 9 full 360-degree spins + random slice landing offset
    const randomAngle = 3240 + Math.floor(Math.random() * 360);
    setWheelRotation((prev) => prev + randomAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const picked = classStudents[Math.floor(Math.random() * classStudents.length)];
      setSelectedStudent(`${picked.avatar} ${picked.name}`);
      playCheerSound();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 9000);
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
            onClick={() => playCheerSound()}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-2 transition"
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

      {/* TOOL 1: NAME WHEEL */}
      {activeTool === 'wheel' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl flex flex-col items-center text-center space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Random Student Picker Wheel</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Spin the wheel on your smartboard to randomly call on students for reading, answering questions, or special classroom jobs!
            </p>
          </div>

          {/* Wheel Stage Container */}
          <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] my-4 flex items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute -top-5 z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[38px] border-t-emerald-500 drop-shadow-xl" />

            {/* Outer Rim */}
            <div className="w-full h-full rounded-full border-8 sm:border-[12px] border-slate-900 bg-slate-950 shadow-2xl relative overflow-hidden flex items-center justify-center">
              <div
                className="w-full h-full rounded-full relative transition-transform duration-[9000ms] cubic-bezier(0.08, 0.8, 0.15, 1.0)"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                {classStudents.map((st, i) => {
                  const sliceAngle = 360 / classStudents.length;
                  const startAngle = sliceAngle * i;
                  const bisectorAngle = startAngle + sliceAngle / 2;
                  const bgColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6'];

                  return (
                    <React.Fragment key={st.id}>
                      {/* Slice Background Polygon */}
                      <div
                        className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left border-l border-slate-900/30"
                        style={{
                          backgroundColor: bgColors[i % bgColors.length],
                          transform: `rotate(${startAngle}deg)`,
                          clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                        }}
                      />
                      {/* Centered Radial Text & Emoji Label */}
                      <div
                        className="absolute top-1/2 left-1/2 w-1/2 h-0 origin-left flex items-center justify-center pl-10 sm:pl-16 z-10 pointer-events-none"
                        style={{
                          transform: `rotate(${bisectorAngle - 90}deg)`,
                        }}
                      >
                        <div className="flex items-center gap-1.5 font-black text-white text-xs sm:text-base drop-shadow-lg whitespace-nowrap">
                          <span className="text-sm sm:text-xl">{st.avatar}</span>
                          <span>{st.name.split(' ')[0]}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Center Spin Hub */}
              <button
                onClick={spinNameWheel}
                disabled={isSpinning || classStudents.length === 0}
                className="absolute z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-sm sm:text-lg uppercase tracking-wider flex flex-col items-center justify-center shadow-2xl border-4 sm:border-8 border-slate-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-0.5" />
                <span>SPIN</span>
              </button>
            </div>
          </div>

          {/* Picked Student Banner */}
          {selectedStudent && (
            <div className="w-full max-w-xl p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-2xl sm:text-3xl shadow-2xl animate-bounce border-4 border-emerald-300">
              🎉 Picked Student: {selectedStudent}!
            </div>
          )}

          {/* Student Roster Manager */}
          <div className="w-full max-w-3xl rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Manage Class Student Roster ({classStudents.length} Active)</h3>
                <p className="text-xs text-slate-500">
                  Add, edit, or remove students included in wheel spins and group activities.
                </p>
              </div>
              <button
                onClick={resetStudentForm}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                {editingStudentId ? 'Cancel Edit' : 'Clear Form'}
              </button>
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

            {/* Student Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {classStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <span className="text-xl">{student.avatar}</span>
                    <span>{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditingStudent(student.id)}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStudentFromRoster(student.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove from roster"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
