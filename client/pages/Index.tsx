'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Trash2, BookOpen } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  duration: number; // in seconds
}

export default function Index() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('englishSessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      const total = parsed.reduce((sum: number, s: Session) => sum + s.duration, 0);
      setTotalMinutes(Math.floor(total / 60));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const sec = secs % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    return `${mins}:${sec.toString().padStart(2, '0')}`;
  };

  const saveSession = () => {
    if (seconds === 0) return;

    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      duration: seconds,
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem('englishSessions', JSON.stringify(updated));
    setTotalMinutes(totalMinutes + Math.floor(seconds / 60));
    setSeconds(0);
    setIsRunning(false);
  };

  const deleteSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      const updated = sessions.filter(s => s.id !== id);
      setSessions(updated);
      localStorage.setItem('englishSessions', JSON.stringify(updated));
      setTotalMinutes(totalMinutes - Math.floor(session.duration / 60));
    }
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              English Learning Timer
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Track your English language learning journey
          </p>
        </div>

        {/* Main Timer Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 mb-8 border border-purple-100">
          {/* Current Session Timer */}
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Current Session
            </p>
            <div className="inline-block bg-gradient-to-br from-purple-50 to-yellow-50 rounded-xl p-8 mb-6 border border-purple-200">
              <div className="text-6xl sm:text-7xl font-bold font-mono text-purple-600">
                {formatTime(seconds)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isRunning
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start
                  </>
                )}
              </button>
              <button
                onClick={resetTimer}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              <button
                onClick={saveSession}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-all"
              >
                Save Session
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Total Time Learned</p>
              <p className="text-3xl sm:text-4xl font-bold text-purple-600">
                {totalMinutes}
              </p>
              <p className="text-gray-500 text-xs mt-1">minutes</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Sessions Completed</p>
              <p className="text-3xl sm:text-4xl font-bold text-yellow-500">
                {sessions.length}
              </p>
              <p className="text-gray-500 text-xs mt-1">sessions</p>
            </div>
          </div>
        </div>

        {/* Sessions History */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-purple-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              Recent Sessions
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-yellow-50 p-4 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {Math.floor(session.duration / 60)} min {session.duration % 60} sec
                    </p>
                    <p className="text-sm text-gray-500">{session.date}</p>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <p className="text-gray-500">No sessions yet. Start learning and save your first session!</p>
          </div>
        )}
      </div>
    </div>
  );
}
