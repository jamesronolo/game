import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';

export const NoiseMonitorTool: React.FC = () => {
  const [isMicActive, setIsMicActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 - 100
  const [noiseThreshold, setNoiseThreshold] = useState(70);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (micAudioCtxRef.current) {
        micAudioCtxRef.current.close();
      }
    };
  }, []);

  return (
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
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all cursor-pointer ${
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
  );
};
