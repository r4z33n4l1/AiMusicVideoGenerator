import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { videoSettingsState, VideoTimingSettings } from '@/context/VideoSettingsContext';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TimingControls() {
  const [settings, setSettings] = useRecoilState(videoSettingsState);

  const updateTiming = (key: keyof VideoTimingSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Timing Controls</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Total Video Duration (seconds)</Label>
          <Input 
            type="number"
            value={settings.totalDuration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTiming('totalDuration', Number(e.target.value))}
            min={1}
            max={600}
          />
        </div>

        <div>
          <Label>Audio Clip Range</Label>
          <div className="mt-2">
            <Slider
              value={[settings.audioStartTime, settings.audioEndTime]}
              min={0}
              max={settings.audioDuration}
              step={0.1}
              onValueChange={(value: number[]) => {
                const [start, end] = value;
                setSettings(prev => ({
                  ...prev,
                  audioStartTime: start,
                  audioEndTime: end
                }));
              }}
            />
            <div className="flex justify-between mt-1">
              <span>{settings.audioStartTime.toFixed(1)}s</span>
              <span>{settings.audioEndTime.toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 