/**
 * PlaybackControls — Play, Pause, Step-Forward, Step-Back buttons.
 * Uses SVG icons for a polished media-player feel.
 */

interface PlaybackControlsProps {
  isPlaying: boolean;
  canStepBack: boolean;
  canStepForward: boolean;
  currentStep?: number;
  totalSteps?: number;
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
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Grouped icon toolbar */}
      <div className="flex items-center divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset"
          className="px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        {/* Step Back */}
        <button
          onClick={onStepBack}
          disabled={!canStepBack}
          title="Step Back"
          className="px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>

        {/* Play / Pause */}
        {isPlaying ? (
          <button
            onClick={onPause}
            title="Pause"
            className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={!canStepForward}
            title="Play"
            className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={!canStepForward}
          title="Step Forward"
          className="px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {/* Step counter badge */}
      {currentStep !== undefined && totalSteps !== undefined && (
        <span className="text-xs font-medium text-slate-500 tabular-nums bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {currentStep + 1} / {totalSteps}
        </span>
      )}
    </div>
  );
}

