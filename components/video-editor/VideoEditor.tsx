'use client';

import { LyricEditor } from './LyricEditor';
import MediaSelector from './MediaSelector';
import VideoPreview from './VideoPreview';
import { TimingControls } from './TimingControls';
import { RecoilRoot } from 'recoil';

export default function VideoEditor() {
  return (
    <RecoilRoot>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">AI Music Video Generator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              <MediaSelector />
              <TimingControls />
              <LyricEditor />
            </div>
            
            {/* Right Column - Preview */}
            <div className="sticky top-8">
              <VideoPreview />
            </div>
          </div>
        </div>
      </div>
    </RecoilRoot>
  );
} 