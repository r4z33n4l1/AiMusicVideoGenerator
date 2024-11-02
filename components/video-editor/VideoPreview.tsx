'use client';

import { Player } from '@remotion/player';
import { LyricVideo } from './remotion/LyricVideo';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';
import { DurationSelector } from './DurationSelector';
import { SettingsDisplay } from './SettingsDisplay';

export default function VideoPreview() {
  const settings = useRecoilValue(videoSettingsState);
  const FPS = 60
  const inputProps = {
    audioPath: settings.audioPath || '',
    imagePath: settings.imagePath || '',
    lyrics: settings.lyricTimings,
    orientation: 'landscape' as const,
    audioStartTime: settings.audioStartTime,
    audioEndTime: settings.audioEndTime,
    loopAudio: settings.loopAudio,
    totalDuration: settings.totalDuration
  };

  if (!settings.audioPath || !settings.imagePath) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Video Preview</h2>
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-gray-400">
          Please select audio and image files
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Video Preview</h2>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <Player
            component={LyricVideo}
            durationInFrames={Math.floor(settings.totalDuration * FPS)}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={FPS}
            controls
            style={{
              width: '100%',
              height: '100%',
            }}
            inputProps={inputProps}
          />
        </div>
      </div>
      <DurationSelector />
      <SettingsDisplay />
    </div>
  );
} 