import { AbsoluteFill, Audio, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Define the props interface
export interface LyricVideoProps {
  audioPath: string;
  imagePath: string;
  lyrics: {
    startTime: number;
    endTime: number;
    text: string;
    timestamp: string;
    zIndex?: number;
  }[];
  orientation: 'landscape' | 'portrait';
}

// Create the component without React.FC
export const LyricVideo: React.FC<LyricVideoProps> = ({
  audioPath,
  imagePath,
  lyrics,
  orientation,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInSeconds = frame / fps;

  const getCurrentLyrics = () => {
    return lyrics.filter(
      (lyric) => {
        const startTime = lyric.startTime || 0;
        const endTime = lyric.endTime || (startTime + 4);
        return timeInSeconds >= startTime && timeInSeconds < endTime;
      }
    ).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)); // Sort by zIndex for layering
  };

  const currentLyrics = getCurrentLyrics();

  // Animation helpers
  const getWordAnimation = (word: string, wordIndex: number, startTime: number, endTime: number) => {
    const delay = wordIndex * 0.2;
    const wordStart = startTime + delay;
    
    const progress = spring({
      frame: frame - wordStart * fps,
      fps,
      config: {
        damping: 8,
        stiffness: 200,
        mass: 0.5,
      },
    });

    return {
      opacity: progress,
      scale: interpolate(
        progress,
        [0, 0.5, 0.8, 1],
        [3, 0.8, 1.2, 1],
        { extrapolateRight: 'clamp' }
      ),
      z: interpolate(
        progress,
        [0, 1],
        [500, 0],
        { extrapolateRight: 'clamp' }
      ),
    };
  };

  return (
    <AbsoluteFill>
      <Audio src={audioPath} />
      <Img
        src={imagePath}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Container for all lyrics */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: currentLyrics.length > 1 ? 'center' : 'center',
          gap: '60px', // Space between lyrics
        }}
      >
        {currentLyrics.map((lyric, lyricIndex) => {
          // Calculate vertical position based on number of lyrics
          const totalLyrics = currentLyrics.length;
          const verticalOffset = totalLyrics > 1 
            ? (lyricIndex - (totalLyrics - 1) / 2) * 120 // 120px spacing between lines
            : 0;

          return (
            <div
              key={`${lyric.timestamp}-${lyricIndex}`}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `translateY(${verticalOffset}px)`,
                transition: 'transform 0.5s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '0 50px',
                }}
              >
                {lyric.text.split(' ').map((word, wordIndex) => {
                  const wordAnim = getWordAnimation(
                    word,
                    wordIndex,
                    lyric.startTime,
                    lyric.endTime
                  );

                  return (
                    <div
                      key={`${word}-${wordIndex}`}
                      style={{
                        display: 'inline-block',
                        opacity: wordAnim.opacity,
                        transform: `scale(${wordAnim.scale}) translateZ(${wordAnim.z}px)`,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          fontFamily: 'Arial',
                          fontSize: 60,
                          fontWeight: 'bold',
                          color: 'white',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        }}
                      >
                        {word}
                      </span>
                      &nbsp;
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}; 