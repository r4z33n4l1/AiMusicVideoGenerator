'use client';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';
import { Input } from '@/components/ui/input';
import { LyricLine } from '@/types';

interface LyricEditorProps {
  lyrics: LyricLine[];
  onLyricsChange: (lyrics: LyricLine[]) => void;
}

interface LyricInput {
  startTime: string;
  endTime: string;
  text: string;
}

export function LyricEditor({ lyrics, onLyricsChange }: LyricEditorProps) {
  const [settings, setSettings] = useRecoilState(videoSettingsState);
  const [newLyric, setNewLyric] = useState<LyricInput>({
    startTime: '',
    endTime: '',
    text: ''
  });
  const [error, setError] = useState<string>('');

  // Helper function to validate and format time
  const validateTime = (time: string): boolean => {
    const pattern = /^([0-9]+):([0-5][0-9])$/;
    return pattern.test(time);
  };

  // Helper function to convert time to seconds
  const timeToSeconds = (time: string): number => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Helper function to format seconds to time string
  const secondsToTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateLyricTiming = (start: number, end: number): boolean => {
    if (start >= end) {
      setError('End time must be greater than start time');
      return false;
    }

    if (start < 0 || end > settings.totalDuration) {
      setError(`Time must be between 0:00 and ${secondsToTime(settings.totalDuration)}`);
      return false;
    }

    return true;
  };

  const addLyricLine = () => {
    setError('');

    if (!validateTime(newLyric.startTime) || !validateTime(newLyric.endTime)) {
      setError('Please enter valid times in format M:SS (e.g., 0:00, 1:30)');
      return;
    }

    const startSeconds = timeToSeconds(newLyric.startTime);
    const endSeconds = timeToSeconds(newLyric.endTime);

    if (!validateLyricTiming(startSeconds, endSeconds)) {
      return;
    }

    if (!newLyric.text.trim()) {
      setError('Please enter lyric text');
      return;
    }

    const newLyricItem = {
      timestamp: newLyric.startTime,
      text: newLyric.text.trim(),
      startTime: startSeconds,
      endTime: endSeconds,
      zIndex: lyrics.length, // For handling overlaps - newer lyrics go below older ones
    };

    const newLyrics = [...lyrics, newLyricItem].sort((a, b) => {
      // First sort by start time
      if (a.startTime !== b.startTime) {
        return a.startTime - b.startTime;
      }
      // If start times are equal, maintain original order (zIndex)
      return a.zIndex - b.zIndex;
    });

    onLyricsChange(newLyrics);
    
    // Update video settings
    setSettings(prev => ({
      ...prev,
      lyricTimings: newLyrics.map(lyric => ({
        startTime: lyric.startTime,
        endTime: lyric.endTime,
        text: lyric.text,
        zIndex: lyric.zIndex
      }))
    }));

    // Reset input fields
    setNewLyric({
      startTime: '',
      endTime: '',
      text: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Lyrics Editor</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3">
            <Input
              value={newLyric.startTime}
              onChange={(e) => setNewLyric(prev => ({ ...prev, startTime: e.target.value }))}
              placeholder="Start (0:00)"
              className="w-full"
            />
          </div>
          <div className="col-span-3">
            <Input
              value={newLyric.endTime}
              onChange={(e) => setNewLyric(prev => ({ ...prev, endTime: e.target.value }))}
              placeholder="End (0:00)"
              className="w-full"
            />
          </div>
          <div className="col-span-4">
            <Input
              value={newLyric.text}
              onChange={(e) => setNewLyric(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter lyrics..."
              className="w-full"
            />
          </div>
          <div className="col-span-2">
            <button
              onClick={addLyricLine}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="max-h-60 overflow-y-auto">
          {lyrics.map((lyric, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center py-2 border-b hover:bg-gray-50"
              style={{
                borderLeft: '4px solid',
                borderLeftColor: `hsl(${(lyric.zIndex * 60) % 360}, 70%, 50%)`,
                paddingLeft: '8px',
              }}
            >
              <div className="flex-1 grid grid-cols-12 gap-2">
                <span className="col-span-2 font-mono">{lyric.timestamp}</span>
                <span className="col-span-2 font-mono">{secondsToTime(lyric.endTime)}</span>
                <span className="col-span-6 px-2">{lyric.text}</span>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => onLyricsChange(lyrics.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 