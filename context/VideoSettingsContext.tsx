import { createContext, useContext, ReactNode } from 'react';
import { atom, useRecoilState } from 'recoil';

export interface VideoTimingSettings {
  totalDuration: number;
  audioStartTime: number;
  audioEndTime: number;
  audioDuration: number;
  audioPath: string;
  imagePath: string;
  durationType: 'custom' | 'audio';
  loopAudio: boolean;
  lyricTimings: {
    startTime: number;
    endTime: number;
    text: string;
    zIndex?: number;
  }[];
}

// Test lyrics with overlapping timings
const testLyrics = [
  {
    startTime: 0,
    endTime: 4,
    text: "Welcome to the digital age",
    zIndex: 0
  },
  {
    startTime: 2, // Overlaps with first lyric
    endTime: 6,
    text: "Where dreams come alive",
    zIndex: 1
  },
  {
    startTime: 5,
    endTime: 9,
    text: "In pixels and waves of light",
    zIndex: 2
  },
  {
    startTime: 7, // Multiple overlaps
    endTime: 11,
    text: "Dancing through the night",
    zIndex: 3
  },
  {
    startTime: 8, // Triple overlap
    endTime: 12,
    text: "Colors blend and fade",
    zIndex: 4
  },
  {
    startTime: 11,
    endTime: 15,
    text: "Into a new day's dawn",
    zIndex: 5
  },
  {
    startTime: 13, // Final overlap
    endTime: 17,
    text: "Where imagination takes flight",
    zIndex: 6
  }
];

export const videoSettingsState = atom<VideoTimingSettings>({
  key: 'videoSettingsState',
  default: {
    totalDuration: 20, // Extended to accommodate all lyrics
    audioStartTime: 0,
    audioEndTime: 20,
    audioDuration: 20,
    audioPath: '',
    imagePath: '',
    durationType: 'audio',
    loopAudio: false,
    lyricTimings: testLyrics
  },
}); 