'use client';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DurationSelector() {
  const [settings, setSettings] = useRecoilState(videoSettingsState);
  const [durationType, setDurationType] = useState<'custom' | 'audio'>('audio');
  const [customDuration, setCustomDuration] = useState(settings.totalDuration.toString());

  const handleDurationTypeChange = (value: string) => {
    const type = value as 'custom' | 'audio';
    setDurationType(type);
    
    if (type === 'audio') {
      setSettings(prev => ({
        ...prev,
        totalDuration: prev.audioDuration
      }));
    }
  };

  const handleCustomDurationChange = (value: string) => {
    setCustomDuration(value);
    const duration = parseInt(value);
    if (!isNaN(duration) && duration > 0) {
      setSettings(prev => ({
        ...prev,
        totalDuration: duration
      }));
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4">
      <div className="flex items-center gap-4">
        <Label htmlFor="durationType" className="text-gray-200">Duration Type:</Label>
        <Select
          value={durationType}
          onValueChange={handleDurationTypeChange}
        >
          <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Select duration type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="audio" className="text-white hover:bg-gray-600">Audio Length</SelectItem>
            <SelectItem value="custom" className="text-white hover:bg-gray-600">Custom Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {durationType === 'custom' && (
        <div className="flex items-center gap-4">
          <Label htmlFor="customDuration" className="text-gray-200">Custom Duration (seconds):</Label>
          <Input
            id="customDuration"
            type="number"
            min="1"
            value={customDuration}
            onChange={(e) => handleCustomDurationChange(e.target.value)}
            className="w-[120px] bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      )}
    </div>
  );
} 