'use client';

import { useRecoilValue } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';

export function SettingsDisplay() {
  const settings = useRecoilValue(videoSettingsState);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return `${minutes}:${remainingSeconds.padStart(4, '0')}`;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Current Settings</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Duration Settings */}
          <div className="col-span-2 bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-purple-400 font-medium mb-2">Duration Settings</h4>
            <ul className="space-y-2 text-gray-200">
              <li className="flex justify-between">
                <span>Type:</span>
                <span className="text-purple-300">{settings.durationType}</span>
              </li>
              <li className="flex justify-between">
                <span>Total Duration:</span>
                <span className="text-purple-300">{formatTime(settings.totalDuration)}</span>
              </li>
            </ul>
          </div>

          {/* Audio Settings */}
          <div className="col-span-2 bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-purple-400 font-medium mb-2">Audio Settings</h4>
            <ul className="space-y-2 text-gray-200">
              <li className="flex justify-between">
                <span>Original Length:</span>
                <span className="text-purple-300">{formatTime(settings.audioDuration)}</span>
              </li>
              <li className="flex justify-between">
                <span>Clip Range:</span>
                <span className="text-purple-300">
                  {formatTime(settings.audioStartTime)} - {formatTime(settings.audioEndTime)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Clip Duration:</span>
                <span className="text-purple-300">
                  {formatTime(settings.audioEndTime - settings.audioStartTime)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Loop Enabled:</span>
                <span className={settings.loopAudio ? "text-green-400" : "text-gray-400"}>
                  {settings.loopAudio ? "Yes" : "No"}
                </span>
              </li>
            </ul>
          </div>

          {/* Lyrics Stats */}
          <div className="col-span-2 bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-purple-400 font-medium mb-2">Lyrics Stats</h4>
            <ul className="space-y-2 text-gray-200">
              <li className="flex justify-between">
                <span>Total Lyrics:</span>
                <span className="text-purple-300">{settings.lyricTimings.length}</span>
              </li>
              <li className="flex justify-between">
                <span>Time Range:</span>
                <span className="text-purple-300">
                  {settings.lyricTimings.length > 0 ? (
                    `${formatTime(settings.lyricTimings[0].startTime)} - 
                     ${formatTime(settings.lyricTimings[settings.lyricTimings.length - 1].endTime)}`
                  ) : (
                    "No lyrics added"
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 