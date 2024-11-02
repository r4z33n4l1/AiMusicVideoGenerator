export interface LyricLine {
  timestamp: string;  // Format: "0:00"
  text: string;
  startTime?: number; // Computed time in seconds
  endTime?: number;   // Computed time in seconds
}

export interface VideoConfig {
  audioPath: string;
  imagePath: string;
  lyrics: LyricLine[];
  orientation: 'landscape' | 'portrait';
} 