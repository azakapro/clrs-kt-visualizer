/**
 * PlaybackControls — Play, Pause, Step-Forward, Step-Back buttons.
 */

interface PlaybackControlsProps {
  isPlaying: boolean;
  canStepBack: boolean;
  canStepForward: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
}

export default function PlaybackControls({
  isPlaying,
  canStepBack,
  canStepForward,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
}: PlaybackControlsProps) {
  const btn =
    "rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onReset}
        className={`${btn} bg-gray-100 hover:bg-gray-200`}
      >
        ⏮ Reset
      </button>

      <button
        onClick={onStepBack}
        disabled={!canStepBack}
        className={`${btn} bg-gray-100 hover:bg-gray-200`}
      >
        ◀ Step Back
      </button>

      {isPlaying ? (
        <button
          onClick={onPause}
          className={`${btn} bg-yellow-100 hover:bg-yellow-200`}
        >
          ⏸ Pause
        </button>
      ) : (
        <button
          onClick={onPlay}
          disabled={!canStepForward}
          className={`${btn} bg-blue-100 hover:bg-blue-200`}
        >
          ▶ Play
        </button>
      )}

      <button
        onClick={onStepForward}
        disabled={!canStepForward}
        className={`${btn} bg-gray-100 hover:bg-gray-200`}
      >
        Step Forward ▶
      </button>
    </div>
  );
}
