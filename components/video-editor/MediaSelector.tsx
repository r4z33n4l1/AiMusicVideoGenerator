'use client';

interface MediaSelectorProps {
  selectedAudio: string;
  selectedImage: string;
  onAudioSelect: (path: string) => void;
  onImageSelect: (path: string) => void;
}

export default function MediaSelector({
  selectedAudio,
  selectedImage,
  onAudioSelect,
  onImageSelect,
}: MediaSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Audio Selection</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // TODO: Handle file upload to Supabase storage
              onAudioSelect(URL.createObjectURL(file));
            }
          }}
          className="w-full"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Background Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // TODO: Handle file upload to Supabase storage
              onImageSelect(URL.createObjectURL(file));
            }
          }}
          className="w-full"
        />
      </div>
    </div>
  );
} 