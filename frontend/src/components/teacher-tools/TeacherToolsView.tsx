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

  // 3. Virtual Dice State
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceResults, setDiceResults] = useState<number[]>([4, 6]);
  const [isRolling, setIsRolling] = useState(false);

  // 4. Behavior Race State
  const [racePositions, setRacePositions] = useState<Record<string, number>>({
    s1: 20,
    s2: 45,
    s3: 10,
    s4: 60,
  });

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
      confetti({ particleCount: 100, spread: 80 });
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

  // Name Wheel Spin Action
  const spinNameWheel = () => {
    if (isSpinning || classStudents.length === 0) return;

    setIsSpinning(true);
    setSelectedStudent(null);

    let count = 0;
    const interval = setInterval(() => {
      playSpinTick();
      count++;
      if (count > 12) clearInterval(interval);
    }, 120);

    const randomAngle = 1440 + Math.floor(Math.random() * 360);
    setWheelRotation((prev) => prev + randomAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const picked = classStudents[Math.floor(Math.random() * classStudents.length)];
      setSelectedStudent(`${picked.avatar} ${picked.name}`);
      playCheerSound();
      confetti({ particleCount: 80, spread: 60 });
    }, 2000);
  };

  // Student Grouper Action
  const generateRandomGroups = () => {
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

  // Roll Virtual Dice Action
  const rollVirtualDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();

    let count = 0;
    const interval = setInterval(() => {
      setDiceResults(Array.from({ length: diceCount }, () => Math.floor(1 + Math.random() * 6)));
      count++;
      if (count > 8) {
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
        confetti({ particleCount: 100, spread: 70 });
      }
      return { ...prev, [studentId]: updated };
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-8 h-8 text-emerald-600" />
            <span>Free Classroom Teacher Utilities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Free standalone classroom tools — no account setup required for smartboards & group activities!
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300 self-start sm:self-auto">
          100% Free & No Ads
        </span>
      </div>

      {/* Tool Navigation Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        {[
          { id: 'wheel', label: 'Random Name Picker', icon: PieChart },
          { id: 'stars', label: 'Star Chart & Behavior', icon: Star },
          { id: 'grouper', label: 'Student Grouper', icon: Users },
          { id: 'dice', label: 'Virtual Dice Roll', icon: Dices },
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: NAME WHEEL */}
      {activeTool === 'wheel' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs flex flex-col items-center text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-1">Random Student Picker Wheel</h2>
          <p className="text-xs text-slate-500 mb-6">
            Spin the wheel to select a student for answering, reading, or class helper tasks!
          </p>

          {/* Wheel Display */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-emerald-500 drop-shadow-md" />

            <div className="w-full h-full rounded-full border-8 border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden flex items-center justify-center">
              <div
                className="w-full h-full rounded-full relative transition-transform duration-[2000ms] cubic-bezier(0.15, 0.85, 0.35, 1.0)"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                {classStudents.map((st, i) => {
                  const angle = (360 / classStudents.length) * i;
                  return (
                    <div
                      key={st.id}
                      className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center border-l border-slate-900/30"
                      style={{
                        backgroundColor: i % 2 === 0 ? '#10b981' : '#06b6d4',
                        transform: `rotate(${angle}deg)`,
                        clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                      }}
                    >
                      <span className="text-[10px] font-black text-white select-none transform rotate-45 translate-x-4 translate-y-4">
                        {st.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={spinNameWheel}
                disabled={isSpinning}
                className="absolute z-10 w-20 h-20 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center shadow-xl border-4 border-slate-900 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                <span>SPIN</span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-2xl mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">Manage Student Roster</h3>
                <p className="text-[11px] text-slate-500">
                  Add or update students that appear in this wheel.
                </p>
              </div>
              <button
                onClick={resetStudentForm}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700"
              >
                {editingStudentId ? 'Cancel Edit' : 'Clear Form'}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1.4fr_0.6fr_auto]">
              <label className="text-left text-[11px] font-semibold text-slate-700">
                <span className="mb-1 block">Student Name</span>
                <input
                  value={studentFormName}
                  onChange={(e) => setStudentFormName(e.target.value)}
                  placeholder="Type a student name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="text-left text-[11px] font-semibold text-slate-700">
                <span className="mb-1 block">Avatar</span>
                <input
                  value={studentFormAvatar}
                  onChange={(e) => setStudentFormAvatar(e.target.value)}
                  placeholder="🧑"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <button
                onClick={saveStudentToRoster}
                className="self-end rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white"
              >
                {editingStudentId ? 'Save Edit' : 'Add Student'}
              </button>
            </div>

            <div className="space-y-2">
              {classStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className="text-lg">{student.avatar}</span>
                    <span>{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditingStudent(student.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      Edit
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
              ))}
            </div>
          </div>

          {/* Selected Student Banner */}
          {selectedStudent && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xl animate-bounce">
              🎉 Picked Student: {selectedStudent}!
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: STAR CHART */}
      {activeTool === 'stars' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Classroom Star Chart</h2>
              <p className="text-xs text-slate-500">
                Award stars and points for good behavior, participation, and teamwork!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {classStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{student.avatar}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{student.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{student.stars} Stars</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold">Modify Stars:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateStudentStars(student.id, -1)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 text-slate-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        updateStudentStars(student.id, 1);
                        playCheerSound();
                      }}
                      className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Random Student Grouper</h2>
              <p className="text-xs text-slate-500">
                Split class roster into random teams for group projects and collaborative games.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">Number of Teams:</label>
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
              >
                <option value={2}>2 Teams</option>
                <option value={3}>3 Teams</option>
                <option value={4}>4 Teams</option>
              </select>

              <button
                onClick={generateRandomGroups}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Generate Teams
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generatedGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
              >
                <h3 className="font-extrabold text-sm text-emerald-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>{group.name}</span>
                  <span className="text-[10px] text-slate-500">{group.members.length} Members</span>
                </h3>

                <ul className="space-y-1.5">
                  {group.members.map((member, mIdx) => (
                    <li
                      key={mIdx}
                      className="text-xs font-semibold text-slate-800 bg-white p-2 rounded-lg border border-slate-200/60"
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center flex flex-col items-center">
          <h2 className="text-2xl font-black text-slate-900 mb-1">Virtual Classroom Dice</h2>
          <p className="text-xs text-slate-500 mb-6">
            Roll 1 to 3 dice for board games, math problems, or random group order!
          </p>

          <div className="flex items-center justify-center gap-6 my-6">
            {diceResults.map((val, idx) => (
              <div
                key={idx}
                className={`w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-4xl flex items-center justify-center shadow-xl border-4 border-emerald-200 ${
                  isRolling ? 'animate-bounce' : ''
                }`}
              >
                {val}
              </div>
            ))}
          </div>

          <button
            onClick={rollVirtualDice}
            disabled={isRolling}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all"
          >
            {isRolling ? 'Rolling Dice...' : 'ROLL DICE NOW'}
          </button>
        </div>
      )}

      {/* TOOL 5: BEHAVIOR RACE */}
      {activeTool === 'race' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Behavior Race Track</h2>
            <p className="text-xs text-slate-500">
              Project a live visual race track — advance students towards the finish line as rewards!
            </p>
          </div>

          <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            {classStudents.slice(0, 4).map((student) => {
              const pos = racePositions[student.id] || 10;
              return (
                <div key={student.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>
                      {student.avatar} {student.name}
                    </span>
                    <button
                      onClick={() => advanceCar(student.id)}
                      className="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black"
                    >
                      + Advance Car
                    </button>
                  </div>

                  <div className="w-full h-8 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center">
                    <div
                      className="absolute top-1 bottom-1 text-2xl transition-all duration-500"
                      style={{ left: `${pos}%` }}
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs flex flex-col items-center text-center space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Classroom Quiet Meter</h2>
            <p className="text-xs text-slate-500">
              Real-time noise analyzer for smartboards — gently alert the class when volume exceeds limits!
            </p>
          </div>

          <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="relative w-full h-12 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-100 ${
                  volumeLevel > noiseThreshold ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${volumeLevel}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10"
                style={{ left: `${noiseThreshold}%` }}
                title="Quiet Threshold"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Current Volume: {volumeLevel}%</span>
              <span>Max Threshold: {noiseThreshold}%</span>
            </div>

            {volumeLevel > noiseThreshold && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-black flex items-center justify-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>CLASSROOM NOISE LEVEL EXCEEDED!</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-4">
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
                  isMicActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isMicActive ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Stop Mic Monitor</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Start Quiet Meter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: CLASSROOM TIMER */}
      {activeTool === 'timer' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs flex flex-col items-center text-center space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Visual Classroom Countdown</h2>
            <p className="text-xs text-slate-500">
              Project a large visual countdown timer for group stations, tests, and clean-up time!
            </p>
          </div>

          <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-slate-800 p-8 text-center space-y-6">
            <div className="text-6xl sm:text-7xl font-black text-emerald-400 tracking-wider">
              {formatTime(timerRemaining)}
            </div>

            {/* Presets */}
            <div className="flex items-center justify-center gap-2">
              {[
                { label: '1 Min', secs: 60 },
                { label: '3 Mins', secs: 180 },
                { label: '5 Mins', secs: 300 },
                { label: '10 Mins', secs: 600 },
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerDuration(p.secs);
                    setTimerRemaining(p.secs);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerRemaining(timerDuration);
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
