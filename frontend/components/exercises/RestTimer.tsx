'use client';

import { useState, useEffect } from 'react';
import { Timer, ChevronDown, Play, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';

export default function RestTimer() {
  const params = useParams();
  const exerciseId = params?.exerciseId as string;

  const [targetSeconds, setTargetSeconds] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`rest-pref-${exerciseId}`);
      return saved ? parseInt(saved, 10) : 90;
    }
    return 90;
  });

  const [prevExerciseId, setPrevExerciseId] = useState(exerciseId);
  if (exerciseId !== prevExerciseId) {
    setPrevExerciseId(exerciseId);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`rest-pref-${exerciseId}`);
      const val = saved ? parseInt(saved, 10) : 90;
      setTargetSeconds(val);
    }
  }

  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'FINISHED'>('IDLE');
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'RUNNING') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('FINISHED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  const startTimer = () => {
    const startTime = timeLeft > 0 ? timeLeft : targetSeconds;
    setTimeLeft(startTime);
    setStatus('RUNNING');
    setShowPicker(false);
  };

  const handleStartFromPicker = () => {
    setTimeLeft(targetSeconds);
    setStatus('RUNNING');
    setShowPicker(false);
  };

  const pauseTimer = () => {
    setStatus('IDLE');
  };

  const resetToFull = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStatus('IDLE');
    setTimeLeft(0);
  };

  const updateTargetSeconds = (val: number) => {
    setTargetSeconds(val);
    localStorage.setItem(`rest-pref-${exerciseId}`, val.toString());
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group min-h-35 flex flex-col justify-center">
      <Timer
        className={cn(
          'absolute -right-4 -top-4 h-24 w-24 transition-colors duration-500',
          status === 'RUNNING' ? 'text-primary/10 animate-pulse' : 'text-zinc-800/30'
        )}
      />

      {status === 'FINISHED' && (
        <div
          onClick={() => resetToFull()}
          className="absolute inset-0 bg-primary z-20 flex flex-col items-center justify-center cursor-pointer animate-in fade-in zoom-in duration-200"
        >
          <p className="text-black font-black italic text-2xl uppercase tracking-tighter leading-none">
            Get back to work!
          </p>
          <p className="text-black/60 text-[10px] font-bold uppercase mt-2">Tap to Dismiss</p>
        </div>
      )}

      {showPicker && status === 'IDLE' ? (
        <div className="relative z-10 space-y-4 text-center">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Set Rest
            </p>
            <button onClick={() => setShowPicker(false)}>
              <X className="w-4 h-4 text-zinc-500 hover:text-white transition-colors" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="30"
              max="600"
              step="15"
              value={targetSeconds}
              onChange={(e) => updateTargetSeconds(parseInt(e.target.value, 10))}
              className="flex-1 accent-primary bg-zinc-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xl font-black text-white italic tabular-nums w-16 text-right">
              {formatTime(targetSeconds)}
            </span>
          </div>
          <Button
            onClick={handleStartFromPicker}
            className="w-full bg-white text-black hover:bg-primary h-8 font-black uppercase text-xs italic"
          >
            Start Rest
          </Button>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 w-full flex justify-between items-start">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
              {status === 'RUNNING' ? 'Resting...' : 'Rest Timer'}
            </p>
            {status === 'IDLE' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPicker(true);
                }}
                className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-zinc-600" />
              </button>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <p
              className={cn(
                'text-5xl font-black italic tabular-nums transition-colors',
                status === 'RUNNING' ? 'text-primary' : 'text-white'
              )}
            >
              {status === 'RUNNING'
                ? formatTime(timeLeft)
                : timeLeft > 0
                  ? formatTime(timeLeft)
                  : formatTime(targetSeconds)}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={status === 'RUNNING' ? pauseTimer : startTimer}
                className={cn(
                  'flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg',
                  'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
                )}
              >
                {status === 'RUNNING' ? (
                  <>Pause Timer</>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    {timeLeft > 0 ? 'Resume' : 'Start Rest'}
                  </>
                )}
              </button>

              {(status === 'RUNNING' || timeLeft > 0) && (
                <button
                  onClick={resetToFull}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-all active:rotate-180 duration-500"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 transition-colors disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
