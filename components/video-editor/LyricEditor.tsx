'use client';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LyricEditor() {
  const [settings, setSettings] = useRecoilState(videoSettingsState);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newLyricText, setNewLyricText] = useState("");

  const validateTimestamp = (timestamp: string): boolean => {
    const pattern = /^([0-9]+):([0-5][0-9])$/;
    return pattern.test(timestamp);
  };

  const timestampToSeconds = (timestamp: string): number => {
    const [minutes, seconds] = timestamp.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const secondsToTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const addLyricLine = () => {
    if (!validateTimestamp(newStartTime) || !validateTimestamp(newEndTime)) {
      alert("Please enter valid timestamps in format M:SS (e.g., 0:00, 1:30)");
      return;
    }

    const startTimeSeconds = timestampToSeconds(newStartTime);
    const endTimeSeconds = timestampToSeconds(newEndTime);

    if (startTimeSeconds >= endTimeSeconds) {
      alert("End time must be after start time");
      return;
    }

    if (newLyricText.trim()) {
      const newLyric = {
        startTime: startTimeSeconds,
        endTime: endTimeSeconds,
        text: newLyricText.trim(),
        zIndex: settings.lyricTimings.length
      };

      setSettings(prev => ({
        ...prev,
        lyricTimings: [...prev.lyricTimings, newLyric]
          .sort((a, b) => a.startTime - b.startTime)
      }));

      setNewStartTime("");
      setNewEndTime("");
      setNewLyricText("");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Lyrics Editor</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            placeholder="Start (0:00)"
            className="w-24 bg-gray-700 border-gray-600 text-white"
          />
          <Input
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            placeholder="End (0:00)"
            className="w-24 bg-gray-700 border-gray-600 text-white"
          />
          <Input
            value={newLyricText}
            onChange={(e) => setNewLyricText(e.target.value)}
            placeholder="Enter lyrics..."
            className="flex-1 bg-gray-700 border-gray-600 text-white"
          />
          <button
            onClick={addLyricLine}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Add
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {settings.lyricTimings.map((lyric, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center py-2 border-b border-gray-700 hover:bg-gray-700/50"
            >
              <span className="font-mono text-gray-200">
                {secondsToTimestamp(lyric.startTime)} - {secondsToTimestamp(lyric.endTime)}
              </span>
              <span className="flex-1 px-4 text-gray-200">{lyric.text}</span>
              <button
                onClick={() => {
                  setSettings(prev => ({
                    ...prev,
                    lyricTimings: prev.lyricTimings.filter((_, i) => i !== index)
                  }));
                }}
                className="text-red-400 hover:text-red-300 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 