'use client';

import { useState } from 'react';
import { LyricLine } from '@/types/index';
import { LyricEditor } from './LyricEditor';
import MediaSelector from './MediaSelector';
import VideoPreview from './VideoPreview';
import { TimingControls } from './TimingControls';
import { RecoilRoot } from 'recoil';

export default function VideoEditor() {
  const [audioPath, setAudioPath] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);

  return (
    <RecoilRoot>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">AI Music Video Generator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              <MediaSelector 
                selectedAudio={audioPath}
                selectedImage={imagePath}
                onAudioSelect={setAudioPath}
                onImageSelect={setImagePath}
              />
              <TimingControls />
              <LyricEditor 
                onLyricsChange={setLyrics}
                lyrics={lyrics}
              />
            </div>
            
            {/* Right Column - Preview */}
            <div className="sticky top-8">
              <VideoPreview 
                audioPath={audioPath}
                imagePath={imagePath}
                lyrics={lyrics}
              />
            </div>
          </div>
        </div>
      </div>
    </RecoilRoot>
  );
} 