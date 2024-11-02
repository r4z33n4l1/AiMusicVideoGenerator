import { AbsoluteFill, Audio, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Define the props interface
export interface LyricVideoProps {
  audioPath: string;
  imagePath: string;
  lyrics: {
    startTime: number;
    endTime: number;
    text: string;
    zIndex?: number;
  }[];
  orientation: 'landscape';
  audioStartTime: number;
  audioEndTime: number;
  loopAudio: boolean;
  totalDuration: number;
}

// Create the component without React.FC
export const LyricVideo: React.FC<LyricVideoProps> = ({
  audioPath,
  imagePath,
  lyrics,
  audioStartTime,
  audioEndTime,
  loopAudio,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInSeconds = frame / fps;

  // Get currently visible lyrics
  const visibleLyrics = lyrics
    .filter(lyric => timeInSeconds >= lyric.startTime && timeInSeconds < lyric.endTime)
    .sort((a, b) => a.startTime - b.startTime);

  const containerOffset = visibleLyrics.length > 1 
    ? -(((visibleLyrics.length - 1) * 80) / 2)
    : 0;

  // Audio timing calculations
  const audioStartFrame = Math.max(0, frame - (audioStartTime * fps));
  const audioEndFrame = frame + ((audioEndTime - audioStartTime) * fps);

  return (
    <AbsoluteFill>
      <Audio
        src={audioPath}
        startFrom={audioStartFrame}
        endAt={audioEndFrame}
        loop={loopAudio}
      />
      <Img
        src={imagePath}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${containerOffset}px)`,
        }}
      >
        {visibleLyrics.map((lyric, index) => {
          // Entry animation
          const entryProgress = spring({
            frame: frame - lyric.startTime * fps,
            fps,
            config: {
              damping: 12,
              stiffness: 200,
              mass: 0.8,
            },
          });

          // Exit animation - Fixed interpolation
          const timeUntilExit = lyric.endTime - timeInSeconds;
          const exitProgress = timeUntilExit < 0.5 
            ? interpolate(timeUntilExit, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' })
            : 1;

          // Word-by-word animation
          const words = lyric.text.split(' ');
          
          return (
            <div
              key={`${lyric.startTime}-${lyric.text}`}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: index < visibleLyrics.length - 1 ? '80px' : 0,
                opacity: Math.min(entryProgress, exitProgress),
                transform: `translateY(${index * 80}px)`, // Fixed spacing between lyrics
              }}
            >
              {words.map((word, wordIndex) => {
                const wordDelay = wordIndex * 0.1;
                const wordProgress = spring({
                  frame: frame - (lyric.startTime + wordDelay) * fps,
                  fps,
                  config: {
                    damping: 12,
                    stiffness: 200,
                    mass: 0.8,
                  },
                });

                return (
                  <span
                    key={wordIndex}
                    style={{
                      display: 'inline-block',
                      color: 'white',
                      fontSize: 60,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                      padding: '0 10px',
                      transform: `
                        scale(${interpolate(wordProgress, [0, 1], [0.5, 1])})
                        translateY(${interpolate(wordProgress, [0, 1], [50, 0])}px)
                      `,
                      opacity: wordProgress,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}; 