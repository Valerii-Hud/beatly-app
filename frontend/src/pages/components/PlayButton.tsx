import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store/usePlayerStore';
import type { Song } from '@/types';
import { Pause, Play } from 'lucide-react';

const PlayButton = ({
  song,
  isRounded,
}: {
  song: Song | null;
  isRounded: boolean;
}) => {
  const { currentSong, setCurrentSong, togglePlay, isPlaying } =
    usePlayerStore();
  const isCurrentSong = currentSong?._id === song?._id;
  const btnClasses = 'size-5 text-black';
  const handlePlay = () => {
    if (!isCurrentSong) {
      setCurrentSong(song);
    } else {
      togglePlay();
    }
  };
  return (
    <Button
      onClick={handlePlay}
      size={'icon'}
      className={`
      absolute
      bottom-3
      right-2
      bg-green-500
      hover:bg-green-400
      hover:scale-105
      transition-all
      opacity-0
      translate-y-2
      group-hover:translate-y-0
      ${isRounded ? 'rounded-full' : null}
      ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
    `}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className={btnClasses} />
      ) : (
        <Play className={btnClasses} />
      )}
    </Button>
  );
};

export default PlayButton;
