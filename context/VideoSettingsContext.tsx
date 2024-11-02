import { createContext, useContext, ReactNode } from 'react';
import { atom, useRecoilState } from 'recoil';

export interface VideoTimingSettings {
  totalDuration: number;
  audioStartTime: number;
  audioEndTime: number;
  audioDuration: number;
  lyricTimings: {
    startTime: number;
    endTime: number;
    text: string;
  }[];
}

export const videoSettingsState = atom<VideoTimingSettings>({
  key: 'videoSettingsState',
  default: {
    totalDuration: 60, // default 60 seconds
    audioStartTime: 0,
    audioEndTime: 60,
    audioDuration: 60,
    lyricTimings: [],
  },
}); 