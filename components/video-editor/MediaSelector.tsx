'use client';

import { useEffect, useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { videoSettingsState } from '@/context/VideoSettingsContext';
import { Label } from '@/components/ui/label';
import { Play, Pause, Upload } from 'lucide-react';

export default function MediaSelector() {
  const [settings, setSettings] = useRecoilState(videoSettingsState);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAudioSelect = async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setSelectedAudio(file);
      
      // Update settings with the audio URL
      setSettings(prev => ({
        ...prev,
        audioPath: url,
      }));

      // Get audio duration
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setSettings(prev => ({
          ...prev,
          audioDuration: audio.duration,
          audioEndTime: audio.duration,
          audioStartTime: 0
        }));
      });
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const handleImageSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setSelectedImage(file);
    setSettings(prev => ({
      ...prev,
      imagePath: url
    }));
  };

  const toggleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [audioUrl, imageUrl]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Media Selection</h3>
      
      <div className="space-y-6">
        {/* Audio Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-gray-200">Audio File</Label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => e.target.files?.[0] && handleAudioSelect(e.target.files[0])}
                className="hidden"
              />
              <div className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300">
                <Upload size={16} />
                <span>Upload Audio</span>
              </div>
            </label>
          </div>

          {selectedAudio && (
            <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
              <div className="text-sm text-purple-400 truncate">
                {selectedAudio.name}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAudioPlay}
                  className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />
              </div>
            </div>
          )}
        </div>

        {/* Image Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-gray-200">Background Image</Label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                className="hidden"
              />
              <div className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300">
                <Upload size={16} />
                <span>Upload Image</span>
              </div>
            </label>
          </div>

          {selectedImage && (
            <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
              <div className="text-sm text-purple-400 truncate">
                {selectedImage.name}
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-600">
                <img 
                  src={imageUrl} 
                  alt="Selected background" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 