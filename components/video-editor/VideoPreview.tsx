'use client';

import { Player } from '@remotion/player';
import { LyricVideo, LyricVideoProps } from './remotion/LyricVideo';
import { LyricLine } from '@/types';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';

interface VideoPreviewProps {
  audioPath: string;
  imagePath: string;
  lyrics: LyricLine[];
}

export default function VideoPreview({ audioPath, imagePath, lyrics = [] }: VideoPreviewProps) {
  const settings = useRecoilValue(videoSettingsState);

  const processedLyrics = useMemo(() => {
    if (!lyrics?.length) return [];
    
    return lyrics.map(lyric => {
      const [minutes, seconds] = lyric.timestamp.split(':').map(Number);
      return {
        ...lyric,
        startTime: minutes * 60 + seconds,
      };
    });
  }, [lyrics]);

  if (!audioPath || !imagePath) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
        <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-500">
          Select audio and image to preview
        </div>
      </div>
    );
  }

  const inputProps: LyricVideoProps = {
    audioPath,
    imagePath,
    lyrics: processedLyrics,
    orientation: 'landscape' as const,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
      <div className="aspect-video">
        <Player
          component={LyricVideo}
          durationInFrames={settings.totalDuration * 30}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          controls
          style={{
            width: '100%',
            height: '100%',
          }}
          inputProps={inputProps}
        />
      </div>
    </div>
  );
} 