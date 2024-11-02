'use client';

import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getAudioDurationInSeconds } from '@remotion/media-utils';

export function TimingControls() {
  const [settings, setSettings] = useRecoilState(videoSettingsState);
  const [isLoopEnabled, setIsLoopEnabled] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    const loadAudioDuration = async () => {
      if (settings.audioPath) {
        try {
          const duration = await getAudioDurationInSeconds(settings.audioPath);
          setAudioDuration(duration);
          
          setSettings(prev => ({
            ...prev,
            audioDuration: duration,
            audioStartTime: prev.audioStartTime > duration ? 0 : prev.audioStartTime,
            audioEndTime: prev.audioEndTime === 0 || prev.audioEndTime > duration ? duration : prev.audioEndTime
          }));
        } catch (error) {
          console.error('Error getting audio duration:', error);
          setAudioDuration(0);
          setSettings(prev => ({
            ...prev,
            audioDuration: 0,
            audioStartTime: 0,
            audioEndTime: 0
          }));
        }
      }
    };

    loadAudioDuration();
  }, [settings.audioPath, setSettings]);

  const handleClipRangeChange = (values: number[]) => {
    if (values.length === 2) {
      const [start, end] = values;
      const safeStart = Math.min(start, audioDuration);
      const safeEnd = Math.min(end, audioDuration);
      
      setSettings(prev => ({
        ...prev,
        audioStartTime: safeStart,
        audioEndTime: safeEnd,
      }));
    }
  };

  const handleLoopToggle = (checked: boolean) => {
    setIsLoopEnabled(checked);
    setSettings(prev => ({
      ...prev,
      loopAudio: checked
    }));
  };

  if (!settings.audioPath) {
    return (
      <div className="space-y-6 p-6 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white">Audio Timing Controls</h3>
        <p className="text-gray-400">Please select an audio file first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white">Audio Timing Controls</h3>
      
      <div className="space-y-6">
        <div>
          <Label className="text-gray-200 mb-4 block">
            Audio Clip Range (Max: {audioDuration.toFixed(1)}s)
          </Label>
          <div className="mt-2">
            <Slider
              value={[settings.audioStartTime, settings.audioEndTime]}
              min={0}
              max={audioDuration}
              step={0.1}
              onValueChange={handleClipRangeChange}
              className="py-4"
              disabled={!audioDuration}
            />
            <div className="flex justify-between mt-1 text-sm text-gray-400">
              <span>{settings.audioStartTime.toFixed(1)}s</span>
              <span>{settings.audioEndTime.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
          <Label htmlFor="loop-audio" className="text-gray-200 cursor-pointer">
            Loop Audio Until Duration End
          </Label>
          <Switch
            id="loop-audio"
            checked={isLoopEnabled}
            onCheckedChange={handleLoopToggle}
            disabled={!audioDuration}
          />
        </div>

        {isLoopEnabled && (
          <div className="text-sm text-gray-300 bg-gray-700/50 p-4 rounded-lg border border-purple-500/30">
            Selected audio clip ({(settings.audioEndTime - settings.audioStartTime).toFixed(1)}s) 
            will loop for the entire video duration ({settings.totalDuration}s)
          </div>
        )}
      </div>
    </div>
  );
} 