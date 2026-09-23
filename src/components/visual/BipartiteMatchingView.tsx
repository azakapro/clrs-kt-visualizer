import { motion } from "framer-motion";
import type { GSInput, GSState } from "../../algorithms/kt/ch01_stable_matching";

interface BipartiteMatchingViewProps {
  input: GSInput;
  state: GSState;
}

export default function BipartiteMatchingView({
  input,
  state,
}: BipartiteMatchingViewProps) {
  const { men, women } = input;
  const { engagements, lastAction, freeMen } = state;

  return (
    <div className="relative mx-auto flex w-full max-w-4xl justify-between rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* SVG overlay for connecting lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {women.map((w, i) => {
          const mId = engagements[w.id];
          if (!mId) return null;
          const mIndex = men.findIndex((m) => m.id === mId);
          if (mIndex === -1) return null;

          // Simple static coordinates mapping for the lines based on 
          // hardcoded layout distances. We assume uniform spacing.
          const startY = 80 + mIndex * 100;
          const endY = 80 + i * 100;

          // These x-coordinates match the padding and widths below roughly
          const startX = 250; 
          const endX = 640;

          const isJustEngaged =
            lastAction?.type === "accept" &&
            lastAction.man === mId &&
            lastAction.woman === w.id;

          const isDumped =
            lastAction?.type === "dump" &&
            lastAction.oldMan === mId &&
            lastAction.woman === w.id;

          return (
            <motion.line
              key={`${mId}-${w.id}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: isDumped ? 0 : 1,
                opacity: isDumped ? 0 : 1,
              }}
              transition={{ duration: 0.5 }}
              stroke={isJustEngaged ? "#22c55e" : "#3b82f6"}
              strokeWidth={3}
              strokeDasharray={isJustEngaged ? "5,5" : "none"}
            />
          );
        })}
      </svg>

      {/* Men Column */}
      <div className="flex flex-col gap-6 relative z-10 w-1/3">
        <h3 className="text-center font-semibold text-gray-700">Men (Proposers)</h3>
        {men.map((m) => {
          const isProposing =
            (lastAction?.type === "propose" || lastAction?.type === "reject") &&
            lastAction.man === m.id;
          const isFree = freeMen.includes(m.id);

          return (
            <motion.div
              key={m.id}
              layout
              className={`flex h-20 items-center justify-between rounded-lg border-2 px-4 shadow-sm transition-colors ${
                isProposing
                  ? "border-yellow-400 bg-yellow-50"
                  : isFree
                    ? "border-gray-300 bg-gray-50"
                    : "border-blue-400 bg-blue-50"
              }`}
            >
              <div>
                <div className="font-bold">{m.name}</div>
                <div className="text-xs text-gray-500">
                  Prefs: {m.preferences.join(", ")}
                </div>
              </div>
              {isFree && <span className="text-xs font-semibold text-gray-400">Free</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Action Indicator (Center) */}
      <div className="flex w-1/4 flex-col items-center justify-center text-center z-10">
        {lastAction && lastAction.type !== "finish" && (
          <motion.div
            key={`${lastAction.type}-${lastAction.man}-${lastAction.woman}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {lastAction.type === "propose" && `${lastAction.man} proposes to ${lastAction.woman}`}
            {lastAction.type === "accept" && `${lastAction.woman} accepts ${lastAction.man}`}
            {lastAction.type === "reject" && `${lastAction.woman} rejects ${lastAction.man}`}
            {lastAction.type === "dump" && `${lastAction.woman} dumps ${lastAction.oldMan} for ${lastAction.man}`}
          </motion.div>
        )}
      </div>

      {/* Women Column */}
      <div className="flex flex-col gap-6 relative z-10 w-1/3">
        <h3 className="text-center font-semibold text-gray-700">Women (Reviewers)</h3>
        {women.map((w) => {
          const isReceiving =
            (lastAction?.type === "propose" || lastAction?.type === "reject" || lastAction?.type === "dump" || lastAction?.type === "accept") &&
            lastAction.woman === w.id;
          const currentPartner = engagements[w.id];

          return (
            <motion.div
              key={w.id}
              layout
              className={`flex h-20 items-center justify-between rounded-lg border-2 px-4 shadow-sm transition-colors ${
                isReceiving
                  ? "border-yellow-400 bg-yellow-50"
                  : currentPartner
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
              }`}
            >
              <div>
                <div className="font-bold">{w.name}</div>
                <div className="text-xs text-gray-500">
                  Prefs: {w.preferences.join(", ")}
                </div>
              </div>
              {currentPartner ? (
                <span className="text-xs font-semibold text-blue-600">
                  ❤ {currentPartner}
                </span>
              ) : (
                <span className="text-xs font-semibold text-gray-400">Free</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
